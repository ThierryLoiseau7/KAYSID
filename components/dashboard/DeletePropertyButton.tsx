"use client";

import { Trash2 } from "lucide-react";
import { deleteProperty } from "@/app/actions/properties";

export default function DeletePropertyButton({ id }: { id: string }) {
  async function handleDelete() {
    if (!confirm("Efase anons sa a definitif?")) return;
    await deleteProperty(id);
  }

  return (
    <button
      onClick={handleDelete}
      className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
      title="Efase"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
