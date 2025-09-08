export interface Question {
  question: string;
  answers: string[];
  correct: number;
}

export const SOLANA_QUESTIONS: Question[] = [
  {
    question: "What is Solana's native cryptocurrency called?",
    answers: ["ETH", "SOL", "BTC", "ADA"],
    correct: 1,
  },
  {
    question: "What makes Solana fast?",
    answers: ["Proof of Work", "Proof of History", "Mining", "Staking only"],
    correct: 1,
  },
  {
    question: "Solana can process how many transactions per second?",
    answers: ["15 TPS", "100 TPS", "65,000+ TPS", "1,000 TPS"],
    correct: 2,
  },
  {
    question:
      "What programming language is commonly used for Solana smart contracts?",
    answers: ["JavaScript", "Python", "Rust", "Java"],
    correct: 2,
  },
  {
    question: "What is an SPL token on Solana?",
    answers: ["A bug", "Solana's token standard", "A wallet", "A validator"],
    correct: 1,
  },
];