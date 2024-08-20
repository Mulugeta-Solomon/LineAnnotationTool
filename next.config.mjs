/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "w7.pngwing.com",
        port: "",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "dododoyo.github.io",
        port: "",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "previews.123rf.com",
        port: "",
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;
