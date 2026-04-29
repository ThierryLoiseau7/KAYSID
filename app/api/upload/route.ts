import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { uploadToR2 } from "@/lib/r2";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non otorize" }, { status: 401 });

  const formData = await req.formData();
  const propertyId = formData.get("property_id") as string | null;
  const files = formData.getAll("files") as File[];

  if (!propertyId) {
    return NextResponse.json({ error: "property_id obligatwa" }, { status: 400 });
  }
  if (!files.length) {
    return NextResponse.json({ urls: [] });
  }

  // Verifye pwopriyete a pou mèt kay la
  const { data: property } = await supabase
    .from("properties")
    .select("id")
    .eq("id", propertyId)
    .eq("owner_id", user.id)
    .single();

  if (!property) {
    return NextResponse.json({ error: "Pwopriyete pa jwenn" }, { status: 404 });
  }

  const uploadedUrls: string[] = [];
  const errors: string[] = [];

  for (let i = 0; i < Math.min(files.length, 8); i++) {
    const file = files[i];

    if (!ALLOWED_TYPES.includes(file.type)) {
      errors.push(`${file.name}: tip fichye pa aksepte`);
      continue;
    }
    if (file.size > MAX_FILE_SIZE) {
      errors.push(`${file.name}: twò gwo (max 5 MB)`);
      continue;
    }

    const ext = file.type.split("/")[1].replace("jpeg", "jpg");
    const key = `properties/${propertyId}/${Date.now()}-${i}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    try {
      const url = await uploadToR2(key, buffer, file.type);
      uploadedUrls.push(url);
    } catch (err) {
      errors.push(`${file.name}: echèk upload`);
      console.error("R2 upload error:", err);
    }
  }

  if (uploadedUrls.length > 0) {
    const photosToInsert = uploadedUrls.map((url, idx) => ({
      property_id: propertyId,
      url,
      is_cover: idx === 0,
      display_order: idx,
    }));

    const { error: dbError } = await supabase
      .from("property_photos")
      .insert(photosToInsert);

    if (dbError) {
      console.error("DB insert error:", dbError.message);
      return NextResponse.json(
        { error: "Foto upload men pa anrejistre: " + dbError.message },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({
    urls: uploadedUrls,
    errors: errors.length > 0 ? errors : undefined,
  });
}
