import { z } from 'zod';

export const registerSchema = z.object({
  authType: z.enum(['social', 'external_wallet']).optional(),
  walletAddress: z.string().optional(),
  email: z.string().email().optional(),
  name: z.string().min(1).max(255).optional(),
  profileImage: z.string().url().optional(),
  signature: z.string().optional(),
});

export type RegisterBody = z.infer<typeof registerSchema>;
