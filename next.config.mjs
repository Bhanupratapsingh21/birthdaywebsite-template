/** @type {import('next').NextConfig} */

const nextConfig = {
    pageExtensions: ["ts", "tsx",],
    eslint: {
        ignoreDuringBuilds: true, // Disable ESLint during builds
    },
    sassOptions: {
        compiler: "modern",
        silenceDeprecations: ["legacy-js-api"],
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "media.gettyimages.com",
            },
            {
                protocol: "https",
                hostname: "img.youtube.com"
            },
            {
                protocol: "https",
                hostname: "ui-avatars.com"
            },
            {
                protocol: "https",
                hostname: "res.cloudinary.com",
            },
            {
                protocol: "https",
                hostname: "images.unsplash.com",
            },
            {
                protocol: "https",
                hostname: "github.com",
            },
        ],
    },
    // Simple SVG configuration
    webpack(config) {
        config.module.rules.push({
            test: /\.svg$/,
            use: ['@svgr/webpack'],
        });
        return config;
    },
};

export default nextConfig;