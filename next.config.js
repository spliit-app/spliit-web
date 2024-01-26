/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ hostname: 'avatars.githubusercontent.com' }],
  },
}

const { withPlausibleProxy } = require('next-plausible')
const { withAxiom } = require('next-axiom')
module.exports = withAxiom(withPlausibleProxy()(nextConfig))
