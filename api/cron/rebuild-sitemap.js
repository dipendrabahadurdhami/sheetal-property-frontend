export default async function handler(req, res) {
  const hookUrl = process.env.DEPLOY_HOOK_URL;
  if (!hookUrl) {
    return res.status(500).json({ ok: false, error: "DEPLOY_HOOK_URL not set" });
  }
  try {
    const response = await fetch(hookUrl, { method: "POST" });
    return res.status(response.ok ? 200 : 502).json({ ok: response.ok });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
}