import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images:{
    remotePatterns: [
      {
        protocol: "https",
<<<<<<< HEAD
        hostname: "avatars.githubusercontent.com"
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com"
=======
        hostname: "wallpapers.com"
>>>>>>> prod
      }
    ]
  }
};

export default nextConfig;
