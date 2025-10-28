// app/signup/page.tsx

import SignUpForm from "@/components/auth/SignUpForm";
import { createServerSupabaseClient } from "@/lib/supabase/server"; // Use the server client
import Link from "next/link";
import { redirect } from "next/navigation"; // Use the server-side redirect

export default async function SignUpPage() {
  // 1. Create a server-side Supabase client
  const supabase = await createServerSupabaseClient();

  // 2. Check for an active user session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 3. If the user is already logged in, redirect them away
  if (user) {
    redirect("/dashboard");
  }

  // 4. If no user, render the sign-up page
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      {/* Gradient background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        <SignUpForm />

        <p className="text-center mt-6 text-zinc-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-blue-400 hover:text-blue-300 font-medium transition"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
