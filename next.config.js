/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
    jsonModules: true,
  },

  // Required for GitHub Pages (static hosting)
  output: "export",

  // Next/Image optimization won't work on GitHub Pages (no server),
  // so we disable optimization.
  images: {
    unoptimized: true,
    domains: [
      "res.cloudinary.com",
      "firebasestorage.googleapis.com",
      "img.icons8.com",
      "raw.githubusercontent.com",
      "i.imgur.com",
      "img.freepik.com",
      "media.geeksforgeeks.org",
    ],
  },
};

module.exports = nextConfig;
