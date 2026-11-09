// Cloudflare Pages Function：/tts 就是中转地址
// 部署后填 https://你的项目名.pages.dev/tts

export async function onRequest(context) {
  const request = context.request;
  const cors = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, Platform",
    "Access-Control-Max-Age": "86400",
  };

  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: cors });
  }
  if (request.method !== "POST") {
    return new Response("POST only", { status: 405, headers: cors });
  }

  const body = await request.text();

  const upstream = await fetch("https://api.mosi.cn/v1/audio/speech", {
    method: "POST",
    headers: {
      "Authorization": request.headers.get("Authorization") || "",
      "Content-Type": "application/json",
      "Platform": "moss-platform",
    },
    body,
  });

  const buf = await upstream.arrayBuffer();

  return new Response(buf, {
    status: upstream.status,
    headers: {
      ...cors,
      "Content-Type": upstream.headers.get("Content-Type") || "audio/mpeg",
    },
  });
}
