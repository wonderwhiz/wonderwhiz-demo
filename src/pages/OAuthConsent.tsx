import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// Minimal typed wrapper for the beta supabase.auth.oauth namespace.
type OAuthClient = { name?: string; client_id?: string; redirect_uri?: string };
type AuthDetails = {
  client?: OAuthClient;
  scope?: string;
  redirect_url?: string;
  redirect_to?: string;
};
const oauth = (supabase.auth as unknown as {
  oauth: {
    getAuthorizationDetails: (id: string) => Promise<{ data: AuthDetails | null; error: { message: string } | null }>;
    approveAuthorization: (id: string) => Promise<{ data: AuthDetails | null; error: { message: string } | null }>;
    denyAuthorization: (id: string) => Promise<{ data: AuthDetails | null; error: { message: string } | null }>;
  };
}).oauth;

export default function OAuthConsent() {
  const [params] = useSearchParams();
  const authorizationId = params.get("authorization_id") ?? "";
  const [details, setDetails] = useState<AuthDetails | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!authorizationId) {
        setError("Missing authorization_id");
        return;
      }
      const { data: sess } = await supabase.auth.getSession();
      if (!sess.session) {
        const next = window.location.pathname + window.location.search;
        window.location.href = "/login?next=" + encodeURIComponent(next);
        return;
      }
      setAccount(sess.session.user.email ?? sess.session.user.id);
      const { data, error } = await oauth.getAuthorizationDetails(authorizationId);
      if (!active) return;
      if (error) {
        setError(error.message);
        return;
      }
      const immediate = data?.redirect_url ?? data?.redirect_to;
      if (immediate && !data?.client) {
        window.location.href = immediate;
        return;
      }
      setDetails(data);
    })();
    return () => {
      active = false;
    };
  }, [authorizationId]);

  async function decide(approve: boolean) {
    setBusy(true);
    const { data, error } = approve
      ? await oauth.approveAuthorization(authorizationId)
      : await oauth.denyAuthorization(authorizationId);
    if (error) {
      setBusy(false);
      setError(error.message);
      return;
    }
    const target = data?.redirect_url ?? data?.redirect_to;
    if (!target) {
      setBusy(false);
      setError("No redirect returned by the authorization server.");
      return;
    }
    window.location.href = target;
  }

  return (
    <>
      <Helmet>
        <title>Connect to WonderWhiz</title>
      </Helmet>
      <main className="min-h-screen flex items-center justify-center p-6">
        <Card className="w-full max-w-md p-8 space-y-6 bg-white/95 text-slate-900">
          {error ? (
            <>
              <h1 className="text-xl font-bold">Couldn't load this request</h1>
              <p className="text-sm text-slate-600">{error}</p>
            </>
          ) : !details ? (
            <p>Loading…</p>
          ) : (
            <>
              <h1 className="text-2xl font-bold">
                Connect {details.client?.name ?? "an app"} to WonderWhiz
              </h1>
              <p className="text-sm text-slate-600">
                {details.client?.name ?? "This client"} will be able to call WonderWhiz's
                enabled tools while you are signed in as{" "}
                <span className="font-medium">{account}</span>.
              </p>
              <ul className="text-sm list-disc pl-5 space-y-1 text-slate-700">
                <li>Read your basic profile</li>
                {details.scope?.includes("email") && <li>Read your email address</li>}
                <li>Read your children's WonderWhiz learning topics and sections</li>
              </ul>
              <p className="text-xs text-slate-500">
                This does not bypass WonderWhiz permissions or backend policies.
              </p>
              <div className="flex gap-3 pt-2">
                <Button disabled={busy} onClick={() => decide(true)} className="flex-1">
                  Approve
                </Button>
                <Button disabled={busy} variant="outline" onClick={() => decide(false)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </>
          )}
        </Card>
      </main>
    </>
  );
}
