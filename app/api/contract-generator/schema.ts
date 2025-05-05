import { z } from "zod";

// define a schema for the notifications
export const contractSchema = z.object({
  notification: z.object({
    followUp: z
      .string()
      .describe(
        "Detailed follow-up message, includes - existing code, changes you are doing and then recommendations of next steps in detail. Friendly tone."
      ),
    codeChanged: z.boolean().describe("True if the code has changed else false"),
    code: z.string().describe("Code. Do not use emojis or links."),
  }),
});
