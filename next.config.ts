import type { NextConfig } from "next";

const repository = process.env.GITHUB_REPOSITORY?.trim().replace(/\/+$/, "");
const repositoryParts = repository?.split("/");
const repoName =
  repositoryParts?.length === 2 && repositoryParts[0] && repositoryParts[1]
    ? repositoryParts[1]
    : undefined;

const nextConfig: NextConfig = {
  output: "export",
  ...(repoName ? { basePath: `/${repoName}` } : {}),
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
