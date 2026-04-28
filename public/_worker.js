const proxyHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Cache-Control": "no-store",
  "X-BSTCGF-Proxy": "cloudflare-pages-worker",
};

function optionsResponse() {
  return new Response(null, {
    status: 204,
    headers: proxyHeaders,
  });
}

async function proxySteamCardExchange() {
  const targetUrl = "https://www.steamcardexchange.net/api/request.php?GetBadgePrices_Guest";
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
      "Content-Type": response.headers.get("Content-Type") || "application/json; charset=utf-8",
    },
  });
}

async function proxySteam(url) {
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
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return optionsResponse();
    }

    try {
      if (url.pathname === "/steamcardexchange") {
        return await proxySteamCardExchange();
      }

      if (url.pathname === "/steam") {
        return await proxySteam(url);
      }
    } catch {
      return Response.json(
        {error: "Proxy request failed"},
        {status: 502, headers: proxyHeaders},
      );
    }

    return env.ASSETS.fetch(request);
  },
};
