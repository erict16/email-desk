const isProd = process.env.NODE_ENV === "production";
const repo = "email-desk";
const basePath = isProd ? `/${repo}` : "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: { unoptimized: true },
  // GitHub Pages project site: https://erict16.github.io/email-desk/
  basePath,
  assetPrefix: isProd ? `${basePath}/` : undefined,
  trailingSlash: true,
  env: {
    // available to client + server so <img src> hits /email-desk/logo.png
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
