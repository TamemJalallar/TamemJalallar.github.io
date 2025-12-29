/** @type {import('next').NextConfig} */
const isGithubPages = process.env.GITHUB_ACTIONS === "true";
const repo = "TamemJalallar.github.io"; // repo name

const nextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  basePath: isGithubPages ? `/${repo}` : "",
  assetPrefix: isGithubPages ? `/${repo}/` : "",
};

module.exports = nextConfig;