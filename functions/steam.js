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

  if (!urlIdPart) {
    return Response.json(
      {error: "No appids provided"},
      {status: 400, headers: proxyHeaders},
    );
  }

  const targetUrl = `https://store.steampowered.com/api/appdetails?appids=${urlIdPart}&cc=DE&filters=price_overview`;

  try {
    const response = await fetch(targetUrl, {
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
        "Content-Type": response.headers.get("Content-Type") ?? "application/json; charset=utf-8",
      },
    });
  } catch {
    return Response.json(
      {error: "Steam proxy request failed"},
      {status: 502, headers: proxyHeaders},
    );
  }
}
