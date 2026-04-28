const proxyHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Cache-Control": "no-store",
};

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: proxyHeaders,
  });
}

export async function onRequestGet(context) {

  const url = new URL(context.request.url);
  const urlIdPart = url.searchParams.get("appids");
  const appIds = urlIdPart
    ? urlIdPart
      .split(",")
      .map((appId) => appId.trim())
      .filter((appId) => /^\d+$/.test(appId))
    : [];

  if (appIds.length === 0) {
    return Response.json(
      {error: "No appids provided"},
      {status: 400, headers: proxyHeaders},
    );
  }

  const targetUrl = new URL("https://store.steampowered.com/api/appdetails");
  targetUrl.searchParams.set("appids", appIds.join(","));
  targetUrl.searchParams.set("cc", "DE");
  targetUrl.searchParams.set("filters", "price_overview");

  console.log(`Requesting ${targetUrl.toString()}`);

  try {
    const response = await fetch(targetUrl.toString(), {
      headers: {
        Accept: "application/json, text/plain, */*",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      },
    });

    const body = await response.text();

    return new Response(body, {
      status: response.status,
      statusText: response.statusText,
      headers: {
        ...proxyHeaders,
        "Content-Type": response.headers.get("Content-Type") || "application/json; charset=utf-8",
      },
    });
  } catch {
    return Response.json(
      {error: "Steam proxy request failed"},
      {status: 502, headers: proxyHeaders},
    );
  }
}
