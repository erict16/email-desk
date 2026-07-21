const isProd = process.env.NODE_ENV === "production";
const repo = "email-desk";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: { unoptimized: true },
  // GitHub Pages project site: https://erict16.github.io/email-desk/
  basePath: isProd ? `/${repo}` : "",
  assetPrefix: isProd ? `/${repo}/` : undefined,
  trailingSlash: true,
};

export default nextConfig;
