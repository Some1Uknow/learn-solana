export const mockProgressData: Record<string, number> = {
  "part-0": 100, // Completed
  "part-1": 75, // 3/4 complete
  "part-2": 50, // Half complete
  "part-3": 25, // Just started
  "part-4": 0, // Not started
  "part-5": 0, // Not started
  "part-6": 0, // Not started
  "part-7": 0, // Not started
  "part-8": 0, // Not started
};

export const mockTopicCompletionData: Record<string, Record<string, boolean>> = {
  "part-0": {
    "why-solana": true,
    "tooling-localnet": true,
    "local-workflow": true,
    "exercise-0-1": true,
    "project-0": true,
  },
  "part-1": {
    "ownership": true,
    "borrowing": true,
    "structs-enums": true,
    "error-handling": false,
  },
  "part-2": {
    "accounts": true,
    "programs": true,
    "transactions": false,
    "pdas": false,
  },
  "part-3": {
    "anchor-intro": true,
    "anchor-programs": false,
    "anchor-accounts": false,
  },
};

// Mock progress data - in a real app, this would come from user progress tracking
export const getModuleProgress = (moduleId: string): number => {
  return mockProgressData[moduleId] || 0;
};

// Mock topic completion data
export const getTopicCompletion = (moduleId: string, topicId: string): boolean => {
  return mockTopicCompletionData[moduleId]?.[topicId] || false;
};
