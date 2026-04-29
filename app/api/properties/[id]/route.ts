import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json(null, { status: 401 });

  const { data, error } = await supabase
    .from("properties")
    .select("*, location:locations(*)")
    .eq("id", id)
    .eq("owner_id", user.id)
    .single();

  if (error) return NextResponse.json(null, { status: 404 });
  return NextResponse.json(data);
}
