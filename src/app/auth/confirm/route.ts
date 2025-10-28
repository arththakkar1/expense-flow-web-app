import { createServerSupabaseClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js"; // 1. Import the type

// 2. Create a type guard to validate the string
const isEmailOtpType = (type: string | null): type is EmailOtpType => {
  if (!type) return false;
  const validTypes: EmailOtpType[] = [
    "signup",
    "recovery",
    "invite",
    "email_change",
    "magiclink",
  ];
  return (validTypes as string[]).includes(type);
};

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  const next = searchParams.get("next") ?? "/dashboard";

  // 3. Use the type guard in your check
  if (token_hash && isEmailOtpType(type)) {
    const supabase = await createServerSupabaseClient();

    const { error } = await supabase.auth.verifyOtp({
      type: type,
      token_hash,
    });

    if (!error) {
      // Redirect to dashboard or specified page on success
      return NextResponse.redirect(`${origin}${next}`);
    } else {
      // Redirect to error page with error message
      return NextResponse.redirect(
        `${origin}/auth/error?message=${encodeURIComponent(error.message)}`
      );
    }
  }

  // Missing token_hash or type is invalid
  const errorMessage =
    token_hash && type
      ? "Invalid confirmation type"
      : "Missing confirmation parameters";

  return NextResponse.redirect(
    `${origin}/auth/error?message=${encodeURIComponent(errorMessage)}`
  );
}
