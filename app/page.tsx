import { getRecentProperties } from "@/lib/supabase/queries";
import HomeClient from "@/components/home/HomeClient";

export default async function HomePage() {
  const recentProperties = await getRecentProperties(8);
  return <HomeClient recentProperties={recentProperties} />;
}
