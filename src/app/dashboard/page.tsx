import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl">
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-zinc-400 mb-8">Welcome back, {user.email}!</p>

          <div className="grid gap-4 md:grid-cols-3 mb-8">
            <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-6">
              <div className="text-zinc-400 text-sm mb-1">Account Status</div>
              <div className="text-white text-2xl font-bold">Active</div>
            </div>

            <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-6">
              <div className="text-zinc-400 text-sm mb-1">Member Since</div>
              <div className="text-white text-2xl font-bold">
                {new Date(user.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                })}
              </div>
            </div>

            <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-6">
              <div className="text-zinc-400 text-sm mb-1">Auth Provider</div>
              <div className="text-white text-2xl font-bold capitalize">
                {user.app_metadata.provider || "Email"}
              </div>
            </div>
          </div>

          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition duration-200 shadow-lg shadow-red-500/20"
            >
              Sign Out
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
