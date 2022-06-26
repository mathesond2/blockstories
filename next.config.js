/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

module.exports = {
  env: {
    COVALENT_API_KEY: process.env.COVALENT_API_KEY,
    NFT_STORAGE_API_KEY: process.env.NFT_STORAGE_API_KEY,
  },
};
