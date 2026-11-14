
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));
const backendUrl = process.env.BACKEND_URL?.replace(/\/+$/, "");

const nextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: projectRoot,

  async rewrites() {
    if (!backendUrl) return [];

    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
