export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import ProfileForm from "./ProfileForm";
import { getProfile } from "@/app/actions/profile";

export const metadata = { title: "Pwofil Mwen" };

export default async function ProfilePage() {
  const profile = await getProfile();
  if (!profile) redirect("/login");

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Pwofil Mwen</h1>
        <p className="text-slate-500 text-sm mt-1">Modifye enfòmasyon pèsonèl ou</p>
      </div>

      {/* Avatar */}
      <div className="card p-6 flex items-center gap-4">
        <div className="w-16 h-16 bg-gradient-to-br from-caribbean-400 to-caribbean-700 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shrink-0">
          {profile.full_name?.charAt(0)?.toUpperCase() || "?"}
        </div>
        <div>
          <p className="font-bold text-slate-900">{profile.full_name || "—"}</p>
          <p className="text-sm text-slate-500">{profile.email}</p>
          <span className={`inline-flex mt-1 text-xs px-2 py-0.5 rounded-full font-medium ${
            profile.is_verified ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"
          }`}>
            {profile.is_verified ? "Verifye" : "Pa verifye"} · {profile.role}
          </span>
        </div>
      </div>

      <ProfileForm
        defaultValues={{
          full_name: profile.full_name ?? "",
          phone: profile.phone ?? "",
          whatsapp: profile.whatsapp ?? "",
        }}
      />
    </div>
  );
}
