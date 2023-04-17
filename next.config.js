/** @type {import('next').NextConfig} */

module.exports = {

  reactStrictMode: true,
  experimental: {
    reactRoot: true
  },
  images:{
    loader: 'imgix',
    path: "http://localhost:3000",
    domains:["imagedelivery.net", "videodelivery.net"],
  }
}
