import { getRecentProperties } from "@/lib/supabase/queries";
import HomeClient from "@/components/home/HomeClient";

export default async function HomePage() {
  let recentProperties = [];
  try {
    recentProperties = await getRecentProperties(8);
  } catch {
    // Supabase pa konfigure — montre paj vid
  }
  return <HomeClient recentProperties={recentProperties} />;
}
