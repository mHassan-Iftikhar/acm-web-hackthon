"use client";

import { AdminChatView } from "@/components/admin/admin-chat-view";

export default function AdminSupportPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Support Center</h1>
        <p className="text-slate-600 mt-1">
          Manage real-time inquiries and assist students with their
          registrations.
        </p>
      </div>

      <AdminChatView />
    </div>
  );
}
