import { useEffect, useRef, useState } from "react";
import { createClient } from "@sanity/client";
import { Sprout } from "lucide-react";
import { apiVersion, dataset, projectId } from "../lib/sanity-config";
import { createLoginUrl, readLoginCallback } from "../lib/catalog-auth.mjs";

const tokenKey = `litoral:sanity:${projectId}`;
const stateKey = `litoral:login:${projectId}`;
const publicClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
});

export default function CatalogSession({ children }) {
  const [session, setSession] = useState(null);
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const initialized = useRef(false);

  useEffect(() => {
    // Callback exchanges are one-time operations, including in React StrictMode.
    async function initialize() {
      try {
        let token = localStorage.getItem(tokenKey);
        const callbackHref = window.location.href;
        const cleanUrl = new URL(callbackHref);
        cleanUrl.hash = "";
        cleanUrl.searchParams.delete("loginState");
        // Remove the temporary credential from browser history before requests.
        window.history.replaceState(null, "", cleanUrl);
        const sid = readLoginCallback(
          callbackHref,
          sessionStorage.getItem(stateKey),
        );
        sessionStorage.removeItem(stateKey);
        if (sid) {
          const result = await publicClient.request({
            url: "/auth/fetch",
            query: { sid },
          });
          token = result.token;
          if (typeof token !== "string" || !token)
            throw new Error("Login incompleto.");
        }
        if (token) {
          const client = publicClient.withConfig({
            token,
            ignoreBrowserTokenWarning: true,
          });
          const user = await client.request({ url: "/users/me" });
          if (!user?.id)
            throw new Error("Sua sessão expirou. Entre novamente.");
          localStorage.setItem(tokenKey, token);
          setSession({ client, user });
        }
      } catch (cause) {
        try {
          localStorage.removeItem(tokenKey);
          sessionStorage.removeItem(stateKey);
        } catch {
          /* Storage may be disabled by the browser. */
        }
        setError(
          cause.statusCode === 401 || cause.statusCode === 403
            ? "Sua sessão expirou ou sua conta não tem acesso. Entre novamente."
            : "Não foi possível concluir o login. Tente entrar novamente.",
        );
      } finally {
        setLoading(false);
      }
    }
    if (!initialized.current) {
      initialized.current = true;
      initialize();
    }
    function onStorage(event) {
      if (event.key === tokenKey) window.location.reload();
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    if (loading || session) return;
    publicClient
      .request({ url: "/auth/providers" })
      .then((result) => setProviders(result.providers || []))
      .catch(() =>
        setError(
          "Não foi possível conectar ao Sanity. Recarregue para tentar novamente.",
        ),
      );
  }, [loading, session]);

  function login(provider) {
    try {
      const state = crypto.randomUUID();
      sessionStorage.setItem(stateKey, state);
      window.location.assign(
        createLoginUrl(provider.url, window.location.origin, projectId, state),
      );
    } catch {
      setError(
        "Não foi possível iniciar o login. Verifique se o navegador permite armazenamento local.",
      );
    }
  }

  async function logOut() {
    // Revoke this user's session before clearing it locally.
    await session.client
      .request({ method: "POST", url: "/auth/logout" })
      .catch((cause) => {
        if (cause.statusCode !== 401) throw cause;
      });
    localStorage.removeItem(tokenKey);
    setSession(null);
    setError("");
  }

  if (session) return children({ ...session, logOut });
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f1f1f1] px-6 py-12">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">
        <Sprout size={36} className="mb-5 text-green-800" />
        <h1 className="text-2xl font-bold text-green-950">Painel da Litoral</h1>
        <p className="mt-3 text-sm leading-relaxed text-gray-600">
          Entre com sua conta Sanity para gerenciar os produtos.
        </p>
        {error && (
          <p
            role="alert"
            className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-800"
          >
            {error}
          </p>
        )}
        {loading ? (
          <p role="status" className="mt-6 text-sm">
            Verificando sessão…
          </p>
        ) : (
          <div className="mt-6 space-y-3">
            {providers.map((provider) => (
              <button
                key={provider.name}
                type="button"
                onClick={() => login(provider)}
                className="w-full rounded-xl border border-green-900/20 px-4 py-3 text-sm font-semibold text-green-950 hover:bg-green-50"
              >
                Entrar com{" "}
                {provider.name === "sanity" ? "e-mail" : provider.title}
              </button>
            ))}
            {providers.length === 0 && (
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="text-sm text-green-900 underline"
              >
                Recarregar
              </button>
            )}
          </div>
        )}
        <a
          href="/#catalogo"
          className="mt-7 inline-block text-sm text-green-900 underline"
        >
          Voltar ao catálogo
        </a>
      </div>
    </main>
  );
}
