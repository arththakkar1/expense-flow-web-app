import { createServerSupabaseClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";

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

  if (token_hash && isEmailOtpType(type)) {
    const supabase = await createServerSupabaseClient();

    const { error } = await supabase.auth.verifyOtp({
      type: type,
      token_hash,
    });

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    } else {
      return NextResponse.redirect(
        `${origin}/auth/error?message=${encodeURIComponent(error.message)}`
      );
    }
  }

  const errorMessage =
    token_hash && type
      ? "Invalid confirmation type"
      : "Missing confirmation parameters";

  return NextResponse.redirect(
    `${origin}/auth/error?message=${encodeURIComponent(errorMessage)}`
  );
}
