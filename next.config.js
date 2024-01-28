const remotePatterns = [{ hostname: 'avatars.githubusercontent.com' }]
if (process.env.S3_UPLOAD_BUCKET && process.env.S3_UPLOAD_REGION) {
  remotePatterns.push({
    hostname: `${process.env.S3_UPLOAD_BUCKET}.s3.${process.env.S3_UPLOAD_REGION}.amazonaws.com`,
  })
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { remotePatterns },
}

const { withPlausibleProxy } = require('next-plausible')
const { withAxiom } = require('next-axiom')
module.exports = withAxiom(withPlausibleProxy()(nextConfig))
