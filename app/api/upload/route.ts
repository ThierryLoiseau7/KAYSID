import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { createClient } from "@/lib/supabase/server";
import { uploadToR2 } from "@/lib/r2";
import { UuidSchema } from "@/lib/validators/schemas";
import { logger } from "@/lib/logger";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non otorize" }, { status: 401 });

  const formData = await req.formData();
  const propertyId = formData.get("property_id") as string | null;
  const files = formData.getAll("files") as File[];

  if (!UuidSchema.safeParse(propertyId).success) {
    return NextResponse.json({ error: "property_id envalid" }, { status: 400 });
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

  const uploadedUrls: { url: string; key: string }[] = [];
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
    const key = `properties/${propertyId}/${randomUUID()}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    try {
      const url = await uploadToR2(key, buffer, file.type);
      uploadedUrls.push({ url, key });
    } catch (err) {
      errors.push(`${file.name}: echèk upload`);
      logger.error("R2 upload error", { key, message: String(err) });
    }
  }

  if (uploadedUrls.length > 0) {
    const photosToInsert = uploadedUrls.map(({ url, key }, idx) => ({
      property_id: propertyId,
      url,
      r2_key:       key,
      is_cover:     idx === 0,
      display_order: idx,
    }));

    const { error: dbError } = await supabase
      .from("property_photos")
      .insert(photosToInsert);

    if (dbError) {
      logger.error("property_photos insert failed", { message: dbError.message });
      return NextResponse.json(
        { error: "Foto upload men pa anrejistre: " + dbError.message },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({
    urls:   uploadedUrls.map((u) => u.url),
    errors: errors.length > 0 ? errors : undefined,
  });
}
