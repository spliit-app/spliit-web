import { ZodIssueCode, z } from 'zod'

const envSchema = z
  .object({
    POSTGRES_URL_NON_POOLING: z.string().url(),
    POSTGRES_PRISMA_URL: z.string().url(),
    PLAUSIBLE_DOMAIN: z.string().optional(),
    FEEDBACK_EMAIL_FROM: z.string().email().optional(),
    FEEDBACK_EMAIL_TO: z.string().email().optional(),
    RESEND_API_KEY: z.string().optional(),
    STRIPE_DONATION_LINK: z.string().optional().default('https://example.com'),
    NEXT_PUBLIC_BASE_URL: z
      .string()
      .optional()
      .default(
        process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}`
          : 'http://localhost:3000',
      ),
    NEXT_PUBLIC_ENABLE_EXPENSE_DOCUMENTS: z.coerce.boolean().default(false),
    S3_UPLOAD_KEY: z.string().optional(),
    S3_UPLOAD_SECRET: z.string().optional(),
    S3_UPLOAD_BUCKET: z.string().optional(),
    S3_UPLOAD_REGION: z.string().optional(),
    NEXT_PUBLIC_ENABLE_RECEIPT_EXTRACT: z.coerce.boolean().default(false),
    OPENAI_API_KEY: z.string().optional(),
  })
  .superRefine((env, ctx) => {
    if (
      env.NEXT_PUBLIC_ENABLE_EXPENSE_DOCUMENTS &&
      (!env.S3_UPLOAD_BUCKET ||
        !env.S3_UPLOAD_KEY ||
        !env.S3_UPLOAD_REGION ||
        !env.S3_UPLOAD_SECRET)
    ) {
      ctx.addIssue({
        code: ZodIssueCode.custom,
        message:
          'If NEXT_PUBLIC_ENABLE_EXPENSE_DOCUMENTS is specified, then S3_* must be specified too',
      })
    }
    if (env.NEXT_PUBLIC_ENABLE_RECEIPT_EXTRACT && !env.OPENAI_API_KEY) {
      ctx.addIssue({
        code: ZodIssueCode.custom,
        message:
          'If NEXT_PUBLIC_ENABLE_RECEIPT_EXTRACT is specified, then OPENAI_API_KEY must be specified too',
      })
    }
  })

export const env = envSchema.parse(process.env)
