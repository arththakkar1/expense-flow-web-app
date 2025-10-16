import SignInForm from "@/components/auth/SignInForm";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      {/* Gradient background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        <SignInForm />

        <p className="text-center mt-6 text-zinc-400">
          Don't have an account?{" "}
          <Link
            href="/signup"
            className="text-blue-400 hover:text-blue-300 font-medium transition"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
