import { createServerSupabaseClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  const next = searchParams.get("next") ?? "/dashboard";

  if (token_hash && type) {
    const supabase = await createServerSupabaseClient();

    const { error } = await supabase.auth.verifyOtp({
      type: type as any,
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

  // Missing token_hash or type
  return NextResponse.redirect(
    `${origin}/auth/error?message=${encodeURIComponent(
      "Missing confirmation parameters"
    )}`
  );
}
