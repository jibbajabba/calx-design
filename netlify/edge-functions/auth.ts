import type { Context } from "@netlify/edge-functions";

const PASSWORD = Netlify.env.get("SITE_PASSWORD") ?? "";
const COOKIE = "calx_auth";

export default async function handler(req: Request, context: Context) {
  const url = new URL(req.url);

  // Let the login page and its POST through
  if (url.pathname === "/login") {
    if (req.method === "POST") {
      const form = await req.formData();
      if (form.get("password") === PASSWORD) {
        return new Response(null, {
          status: 302,
          headers: {
            Location: "/",
            "Set-Cookie": `${COOKIE}=1; Path=/; HttpOnly; SameSite=Lax`,
          },
        });
      }
      return new Response(loginPage("Wrong password."), {
        status: 401,
        headers: { "Content-Type": "text/html" },
      });
    }
    return new Response(loginPage(), {
      headers: { "Content-Type": "text/html" },
    });
  }

  // Check auth cookie
  const cookies = req.headers.get("cookie") ?? "";
  if (cookies.split(";").some((c) => c.trim() === `${COOKIE}=1`)) {
    return context.next();
  }

  return new Response(null, {
    status: 302,
    headers: { Location: "/login" },
  });
}

function loginPage(error?: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Calx — Access</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: system-ui, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100dvh;
      background: #0a0a0a;
      color: #fff;
    }
    form {
      display: flex;
      flex-direction: column;
      gap: 12px;
      width: 100%;
      max-width: 320px;
      padding: 0 24px;
    }
    h1 { font-size: 1.25rem; font-weight: 600; margin-bottom: 4px; }
    p.sub { font-size: 0.875rem; color: #888; }
    p.error { font-size: 0.875rem; color: #f87171; }
    input {
      width: 100%;
      padding: 10px 14px;
      background: #1a1a1a;
      border: 1px solid #333;
      border-radius: 8px;
      color: #fff;
      font-size: 1rem;
      outline: none;
    }
    input:focus { border-color: #555; }
    button {
      padding: 10px;
      background: #fff;
      color: #000;
      border: none;
      border-radius: 8px;
      font-size: 0.95rem;
      font-weight: 600;
      cursor: pointer;
    }
    button:hover { background: #e5e5e5; }
  </style>
</head>
<body>
  <form method="POST" action="/login">
    <h1>Calx</h1>
    <p class="sub">Enter the password to continue.</p>
    ${error ? `<p class="error">${error}</p>` : ""}
    <input type="password" name="password" placeholder="Password" autofocus autocomplete="current-password" />
    <button type="submit">Continue</button>
  </form>
</body>
</html>`;
}

export const config = { path: "/*" };
