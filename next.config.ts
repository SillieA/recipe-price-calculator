import type { NextConfig } from "next";

const repositoryMatch = process.env.GITHUB_REPOSITORY?.trim().match(
  /^[^/]+\/([^/]+)$/
);
const repoName = repositoryMatch?.[1];

const nextConfig: NextConfig = {
  output: "export",
  ...(repoName ? { basePath: `/${repoName}` } : {}),
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
