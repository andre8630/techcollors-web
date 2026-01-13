/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  experimental: {
    outputFileTracingIncludes: {
      // caminho da API em "pages"
      "/api/v1/migrations": ["./src/infra/migrations/**/*"],
    },
  },
  reactCompiler: true,
};

export default nextConfig;
