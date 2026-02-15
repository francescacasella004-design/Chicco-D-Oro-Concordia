import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  workboxOptions: {
    importScripts: ["/sw-push.js"],
    skipWaiting: true,
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
};

export default withPWA(nextConfig);
