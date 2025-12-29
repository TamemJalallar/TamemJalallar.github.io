/** @type {import('next').NextConfig} */
const nextConfig = {
  // GitHub Pages static export
  output: "export",
  trailingSlash: true,

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
      "images.unsplash.com",
    ],
  },

  // Only needed if your Next version complains about app/ being experimental
  experimental: {
    appDir: true,
  },
};

module.exports = nextConfig;
