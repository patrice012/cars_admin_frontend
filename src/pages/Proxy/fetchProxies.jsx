async function listProxies() {
  try {
    const url = new URL("https://proxy.webshare.io/api/v2/proxy/list/");
    url.searchParams.append("mode", "direct");
    url.searchParams.append("page", "1");
    url.searchParams.append("page_size", "25");

    const req = await fetch(url.href, {
      method: "GET",
      headers: {
        Authorization: "Token oqfmrmngtkl4lk7909727wgyng1pq8j32rndhkci",
      },
    });

    const res = await req.json();
    return res;
  } catch {
    (e) => console.log(e);
  }
}

export { listProxies };
