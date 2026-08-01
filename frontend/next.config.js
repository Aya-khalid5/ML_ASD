/** @type {import('next').NextConfig} */
const nextConfig = {
  // Standalone output produces a self-contained Node server (with the
  // minimal node_modules) that is ideal for a small Docker image.
  output: "standalone",
};

module.exports = nextConfig;

