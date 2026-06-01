import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password are required." }, { status: 400 });
    }

    if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
      return NextResponse.json(
        { error: "Username must be 3–20 characters: letters, numbers, underscores only." },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
    }

    const admin = createAdminClient();
    const email = `${username.toLowerCase()}@player.aegis`;

    // Check if username is already taken
    const { data: existing } = await admin
      .from("profiles")
      .select("id")
      .eq("username", username.toLowerCase())
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ error: "That operative callsign is already taken." }, { status: 409 });
    }

    // Create the auth user (bypasses email confirmation)
    const { data: authData, error: authError } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (authError) {
      if (authError.message.includes("already")) {
        return NextResponse.json({ error: "That callsign is already registered." }, { status: 409 });
      }
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    if (!authData.user) {
      return NextResponse.json({ error: "Failed to create account." }, { status: 500 });
    }

    // Create profile record
    const { error: profileError } = await admin.from("profiles").insert({
      id: authData.user.id,
      username: username.toLowerCase(),
      display_name: username,
      rank_tier: "Recruit",
      rank_xp: 0,
    });

    if (profileError) {
      // Roll back auth user if profile creation failed
      await admin.auth.admin.deleteUser(authData.user.id);
      return NextResponse.json({ error: "Failed to create operative profile." }, { status: 500 });
    }

    // Create default settings
    await admin.from("player_settings").insert({ user_id: authData.user.id });

    return NextResponse.json({ success: true, userId: authData.user.id });
  } catch (err) {
    console.error("Signup error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
