import { z } from "zod";

// Define file schema
const fileSchema = z.object({
  path: z.string(),
  content: z.string(),
  language: z.string().optional(),
  type: z.enum(["contract", "frontend", "file"]),
});

// Notification schema for updates during generation
export const notificationSchema = z.object({
  followUp: z.string().optional(),
  files: z.array(fileSchema).optional().refine(
    (files) => {
      // Skip validation if files aren't provided
      if (!files || files.length === 0) return true;
      
      // Check if we have at least one contract and one frontend file
      const hasContractFile = files.some(file => 
        file.type === 'contract' || 
        file.path.includes('programs/') || 
        file.path.includes('.rs') || 
        file.path.includes('Cargo.toml')
      );
      
      const hasFrontendFile = files.some(file => 
        file.type === 'frontend' || 
        file.path.includes('app/') || 
        file.path.includes('components/') || 
        file.path.includes('.ts') || 
        file.path.includes('.tsx') || 
        file.path.includes('.js') || 
        file.path.includes('.jsx')
      );
      
      return hasContractFile && hasFrontendFile;
    },
    {
      message: "Both contract and frontend files must be present",
    }
  ),
  activeFile: z.string().optional(),
  dappGenerated: z.boolean().optional(),
  codeChanged: z.boolean().optional(),
});

// Configuration schema for dApp creation
export const configSchema = z.object({
  contractType: z.string().optional(),
  contractName: z.string().optional(),
  frontendFramework: z.string().optional(),
  additionalFeatures: z.array(z.string()).optional(),
});

// Schema for messages between user and assistant
export const messageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string(),
});

// Main schema for building dApps
export const dappBuilderSchema = z.object({
  config: configSchema.optional(),
  messages: z.array(messageSchema).optional(),
  notification: notificationSchema.optional(),
});

export type DappBuilderSchema = z.infer<typeof dappBuilderSchema>;
export type FileSchema = z.infer<typeof fileSchema>;
export type NotificationSchema = z.infer<typeof notificationSchema>;
export type ConfigSchema = z.infer<typeof configSchema>;
export type MessageSchema = z.infer<typeof messageSchema>;