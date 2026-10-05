/** @type {import('next').NextConfig} */
module.exports = {
  async redirects() {
    return [
      { source: "/catalogo", destination: "/#catalogo", permanent: true },
    ];
  },
};
