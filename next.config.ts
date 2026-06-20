import type { NextConfig } from "next";

const repository = process.env.GITHUB_REPOSITORY;
const repoName =
  repository && repository.includes("/") ? repository.split("/")[1] : undefined;

const nextConfig: NextConfig = {
  output: "export",
  ...(repoName ? { basePath: `/${repoName}` } : {}),
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
