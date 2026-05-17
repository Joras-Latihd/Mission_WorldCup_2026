export function renderErrorPage(): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Page not loaded</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      :root {
        --bg: #0b0f17;
        --card: rgba(255, 255, 255, 0.06);
        --border: rgba(255, 255, 255, 0.12);
        --text: #e5e7eb;
        --muted: #9ca3af;
        --accent: #4f46e5;
      }

      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        min-height: 100vh;
        display: grid;
        place-items: center;
        font-family: system-ui, -apple-system, sans-serif;
        background: radial-gradient(circle at top, #111827, var(--bg));
        color: var(--text);
        padding: 24px;
      }

      .card {
        width: 100%;
        max-width: 420px;
        text-align: center;
        padding: 32px 24px;
        background: var(--card);
        border: 1px solid var(--border);
        border-radius: 16px;
        backdrop-filter: blur(10px);
        box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
      }

      h1 {
        font-size: 18px;
        margin: 0 0 8px;
        font-weight: 700;
        letter-spacing: 0.2px;
      }

      p {
        margin: 0 0 20px;
        color: var(--muted);
        font-size: 14px;
        line-height: 1.5;
      }

      .actions {
        display: flex;
        gap: 10px;
        justify-content: center;
        flex-wrap: wrap;
      }

      button, a {
        padding: 10px 14px;
        border-radius: 10px;
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        text-decoration: none;
        transition: all 0.2s ease;
        border: 1px solid transparent;
      }

      .primary {
        background: var(--accent);
        color: white;
      }

      .primary:hover {
        opacity: 0.9;
        transform: translateY(-1px);
      }

      .secondary {
        background: transparent;
        color: var(--text);
        border-color: var(--border);
      }

      .secondary:hover {
        border-color: rgba(255,255,255,0.25);
        transform: translateY(-1px);
      }

      .icon {
        font-size: 28px;
        margin-bottom: 12px;
      }
    </style>
  </head>

  <body>
    <div class="card">
      <div class="icon">⚠️</div>

      <h1>Something went wrong</h1>

      <p>
        The page didn’t load correctly. You can try again or return to the home screen.
      </p>

      <div class="actions">
        <button class="primary" onclick="location.reload()">Retry</button>
        <a class="secondary" href="/">Go home</a>
      </div>
    </div>
  </body>
</html>`;
}