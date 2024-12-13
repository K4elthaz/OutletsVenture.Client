/** @type {import('next').NextConfig} */
const nextConfig = {
  // Next.js image optimization config
  images: {
    remotePatterns: [
      {
        hostname: 'firebasestorage.googleapis.com',
      },
      {
        hostname: 'via.placeholder.com',
      }
    ],
  },

  
  // Custom Webpack configuration
  webpack: (config) => {
    config.module.rules.push({
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env'],
        },
      },
    });

    return config;
  },
};

module.exports = nextConfig;
