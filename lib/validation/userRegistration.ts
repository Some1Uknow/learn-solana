import { z } from 'zod';

const nullishToOptionalString = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess((val) => (val === null ? undefined : val), schema.optional());

export const registerSchema = z.object({
  authType: z.enum(['social', 'external_wallet']).optional(),
  walletAddress: z.string().optional(),
  email: nullishToOptionalString(z.string().email()),
  name: nullishToOptionalString(z.string().min(1).max(255)),
  profileImage: nullishToOptionalString(z.string().url()),
  signature: nullishToOptionalString(z.string()),
});

export type RegisterBody = z.infer<typeof registerSchema>;
