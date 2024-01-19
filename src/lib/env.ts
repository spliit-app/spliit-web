import { z } from 'zod'

const envSchema = z.object({
  POSTGRES_URL_NON_POOLING: z.string().url(),
  POSTGRES_PRISMA_URL: z.string().url(),
  PLAUSIBLE_DOMAIN: z.string().optional(),
  FEEDBACK_EMAIL_FROM: z.string().email().optional(),
  FEEDBACK_EMAIL_TO: z.string().email().optional(),
  RESEND_API_KEY: z.string().optional(),
  STRIPE_DONATION_LINK: z.string().optional().default('https://example.com'),
})

export const env = envSchema.parse(process.env)
