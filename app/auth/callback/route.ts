import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const invite = requestUrl.searchParams.get("invite");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      return NextResponse.redirect(
        new URL(`/join?error=${encodeURIComponent(error.message)}`, requestUrl.origin),
      );
    }
  }

  return NextResponse.redirect(
    new URL(invite ? `/app?invite=${encodeURIComponent(invite)}` : "/app", requestUrl.origin),
  );
}
