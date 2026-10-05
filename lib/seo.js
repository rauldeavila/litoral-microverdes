export const siteUrl = "https://litoralmicroverdes.com.br/";
export const siteName = "Litoral Microverdes";
export const homeTitle = "Litoral Microverdes | Porto Alegre e Litoral Norte";
export const homeDescription =
  "Microverdes frescos, de produção local e sem agrotóxicos. Entregas no Litoral Norte, Porto Alegre e região. Conheça o catálogo e peça pelo WhatsApp.";
export const socialImage = `${siteUrl}images/carousel/image-7.png`;
export const socialImageAlt =
  "Microverdes cultivados na fazenda urbana da Litoral";

export const homeStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}#organization`,
      name: siteName,
      url: siteUrl,
      description: homeDescription,
      logo: `${siteUrl}images/logo-transparent-small.png`,
      image: socialImage,
      sameAs: ["https://www.instagram.com/litoralmicroverdes/"],
      areaServed: [
        { "@type": "Place", name: "Litoral Norte, Rio Grande do Sul" },
        { "@type": "City", name: "Porto Alegre" },
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}#website`,
      name: siteName,
      url: siteUrl,
      inLanguage: "pt-BR",
      publisher: { "@id": `${siteUrl}#organization` },
    },
  ],
};
