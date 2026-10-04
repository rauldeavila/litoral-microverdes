import dynamic from "next/dynamic";
import Head from "next/head";
import Link from "next/link";
import { isSanityConfigured } from "../../lib/sanity-config";

const CatalogDashboard = dynamic(
  () => import("../../components/CatalogDashboard"),
  {
    ssr: false,
    loading: () => <p style={{ padding: 32 }}>Carregando painel…</p>,
  },
);

export default function Admin() {
  return (
    <>
      <Head>
        <title>Painel | Litoral Microverdes</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      {isSanityConfigured ? (
        <div
          style={{
            position: "fixed",
            inset: 0,
            height: "100dvh",
            overflow: "auto",
            overscrollBehavior: "none",
          }}
        >
          <CatalogDashboard />
        </div>
      ) : (
        <main className="flex min-h-screen items-center justify-center bg-[#f1f1f1] px-6">
          <div className="max-w-lg rounded-2xl bg-white p-8 shadow-sm">
            <h1 className="text-2xl font-bold text-green-900">
              Painel do catálogo
            </h1>
            <p className="mt-4 text-gray-600">
              A conexão com o Sanity ainda está sendo preparada. Assim que
              estiver pronta, você poderá entrar e gerenciar os produtos aqui.
            </p>
            <Link
              className="mt-6 inline-block font-semibold text-green-900 underline"
              href="/"
            >
              Voltar ao site
            </Link>
          </div>
        </main>
      )}
    </>
  );
}
