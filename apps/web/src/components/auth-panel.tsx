"use client";

import { useEffect, useState, type FormEvent } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

export default function AuthPanel() {
  const [email, setEmail] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    if (!supabase) return;
    let mounted = true;
    supabase.auth.getUser().then(({ data }) => {
      if (mounted) setUser(data.user);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, [supabase]);

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) return;
    setBusy(true);
    setMessage("");
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin + "/auth/callback" },
    });
    setMessage(error ? error.message : "Check your email for a secure sign-in link.");
    setBusy(false);
  }

  async function signOut() {
    if (!supabase) return;
    const { error } = await supabase.auth.signOut();
    setMessage(error ? error.message : "Signed out.");
  }

  return (
    <section className="panel authPanel" aria-labelledby="auth-heading">
      <span className="eyebrow">ACCOUNT / SUPABASE AUTH</span>
      <h2 id="auth-heading">Your workspace</h2>
      {!supabase ? (
        <p className="muted">Authentication is not configured. Add the Supabase URL and publishable key to the web environment.</p>
      ) : user ? (
        <div className="authRow">
          <p className="muted">Signed in as <strong>{user.email ?? user.id}</strong></p>
          <button className="secondary" onClick={signOut}>Sign out</button>
        </div>
      ) : (
        <form className="authForm" onSubmit={signIn}>
          <label className="fieldLabel" htmlFor="auth-email">Email address</label>
          <input id="auth-email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" />
          <button className="primary" type="submit" disabled={busy}>{busy ? "Sending…" : "Send secure sign-in link"}</button>
        </form>
      )}
      {message && <p className="muted" role="status">{message}</p>}
      <p className="muted authNote">User-owned data is protected by database row-level security. This panel does not store transcripts.</p>
    </section>
  );
}
