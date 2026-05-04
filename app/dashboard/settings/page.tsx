export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { getProfile } from "@/app/actions/profile";
import SettingsClient from "./SettingsClient";

export const metadata = { title: "Paramèt" };

export default async function SettingsPage() {
  const profile = await getProfile();
  if (!profile) redirect("/login");

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Paramèt</h1>
        <p className="text-slate-500 text-sm mt-1">Jere kont ou ak sekirite</p>
      </div>

      <SettingsClient
        currentRole={profile.role ?? "tenant"}
        email={profile.email ?? ""}
      />
    </div>
  );
}
