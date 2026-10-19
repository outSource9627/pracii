const INTENTS = new Set(["early-access", "partnership", "investing"]);
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Early-access / contact form.
 * Set EARLY_ACCESS_WEBHOOK_URL (e.g. a Google Apps Script, Zapier, Make or Slack
 * incoming webhook) to receive submissions; without it they are only logged.
 */
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const email = String(body.email ?? "").trim().slice(0, 200);
  const name = String(body.name ?? "").trim().slice(0, 120);
  const message = String(body.message ?? "").trim().slice(0, 2000);
  const intent = String(body.intent ?? "early-access");

  if (!EMAIL.test(email)) {
    return Response.json({ ok: false, error: "Please enter a valid email address." }, { status: 422 });
  }
  if (!INTENTS.has(intent)) {
    return Response.json({ ok: false, error: "Unknown request type." }, { status: 422 });
  }

  const entry = { intent, name, email, message, at: new Date().toISOString() };
  const hook = process.env.EARLY_ACCESS_WEBHOOK_URL;

  if (hook) {
    const res = await fetch(hook, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(entry),
    }).catch(() => null);
    if (!res || !res.ok) {
      return Response.json({ ok: false, error: "Something went wrong. Please try again." }, { status: 502 });
    }
  } else {
    console.info("[early-access]", entry);
  }

  return Response.json({ ok: true });
}
