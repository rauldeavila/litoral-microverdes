// Same project-scoped login flow used by Sanity Studio. A one-time state value
// binds the callback to the browser tab that initiated sign-in.
export function createLoginUrl(provider, origin, projectId, state) {
  const url = new URL(provider);
  if (
    url.origin !== "https://api.sanity.io" ||
    !url.pathname.startsWith("/v1/auth/login/")
  )
    throw new Error("Provedor de login inválido.");
  const callback = new URL("/admin", origin);
  callback.searchParams.set("loginState", state);
  url.searchParams.set("origin", callback.toString());
  url.searchParams.set("projectId", projectId);
  // Return the temporary session in the fragment, never in server access logs.
  url.searchParams.set("withSid", "true");
  return url.toString();
}

export function readLoginCallback(href, expectedState) {
  const url = new URL(href);
  const sid = new URLSearchParams(url.hash.slice(1)).get("sid");
  if (!sid) return null;
  if (!expectedState || url.searchParams.get("loginState") !== expectedState)
    throw new Error("Esta tentativa de login expirou. Entre novamente.");
  return sid;
}
