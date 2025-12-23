/** @type {import('next').NextConfig} */
const repo = ""; // <-- leave "" if using <username>.github.io repo, otherwise set to your repo name

const nextConfig = {
  // If this template uses the /app directory, keep this:
  experimental: {
    appDir: true,
    jsonModules: true
  },

  images: {
    domains: [
      "res.cloudinary.com",
      "firebasestorage.googleapis.com",
      "img.icons8.com",
      "raw.githubusercontent.com",
      "i.imgur.com",
      "img.freepik.com",
      "media.geeksforgeeks.org"
    ]
  },

  // ✅ Required for GitHub Pages static hosting:
  output: "export",

  // ✅ Only needed if you're deploying to https://username.github.io/REPO
  ...(repo
    ? { basePath: `/${repo}`, assetPrefix: `/${repo}/` }
    : {})
};

module.exports = nextConfig;
