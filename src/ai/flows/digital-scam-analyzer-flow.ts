'use server';
/**
 * @fileOverview A digital scam detection AI agent.
 *
 * - analyzeDigitalScam - A function that handles the digital scam analysis process.
 * - DigitalScamAnalyzerInput - The input type for the analyzeDigitalScam function.
 * - DigitalScamAnalyzerOutput - The return type for the analyzeDigitalScam function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const DigitalScamAnalyzerInputSchema = z.object({
  communicationContent: z.string().describe('The content of the suspicious communication (SMS, WhatsApp message, email, or call transcript).'),
});
export type DigitalScamAnalyzerInput = z.infer<typeof DigitalScamAnalyzerInputSchema>;

const DigitalScamCategorySchema = z.enum([
  'Digital Arrest Scam',
  'Phishing',
  'Banking Fraud',
  'OTP Fraud',
  'Impersonation Scam',
  'Investment Scam',
  'Safe Communication',
]);

const DigitalScamAnalyzerOutputSchema = z.object({
  riskScore: z.number().min(0).max(100).describe('An overall risk score from 0 (no risk) to 100 (very high risk) indicating the likelihood of the communication being a scam.'),
  scamCategory: DigitalScamCategorySchema.describe('The categorized type of scam detected in the communication.'),
  confidencePercentage: z.number().min(0).max(100).describe("The AI's confidence level (0-100%) in its analysis."),
  redFlagsDetected: z.array(z.string()).describe('A list of specific phrases, requests, or elements in the communication that indicate it might be a scam.'),
  recommendedActions: z.array(z.string()).describe('A list of recommended actions for the user based on the analysis.'),
});
export type DigitalScamAnalyzerOutput = z.infer<typeof DigitalScamAnalyzerOutputSchema>;

export async function analyzeDigitalScam(input: DigitalScamAnalyzerInput): Promise<DigitalScamAnalyzerOutput> {
  return digitalScamAnalyzerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'digitalScamAnalyzerPrompt',
  input: { schema: DigitalScamAnalyzerInputSchema },
  output: { schema: DigitalScamAnalyzerOutputSchema },
  prompt: `You are an expert digital public safety intelligence agent specializing in identifying and categorizing digital scams. Your task is to analyze the provided communication content and determine if it is a scam, classify its type, identify red flags, and suggest actions.\n\nAnalyze the following communication content and provide your analysis in the specified JSON format.\n\nCommunication Content:\n{{{communicationContent}}}\n\nBased on your analysis, determine:\n1.\tA risk score from 0 (very low risk, likely safe) to 100 (very high risk, definite scam).\n2.\tThe most appropriate scam category from the following options: 'Digital Arrest Scam', 'Phishing', 'Banking Fraud', 'OTP Fraud', 'Impersonation Scam', 'Investment Scam', 'Safe Communication'.\n3.\tYour confidence level in the analysis as a percentage (0-100%).\n4.\tA list of specific "red flags" or suspicious elements detected in the communication.\n5.\tA list of recommended actions for the user.\n`,
});

const digitalScamAnalyzerFlow = ai.defineFlow(
  {
    name: 'digitalScamAnalyzerFlow',
    inputSchema: DigitalScamAnalyzerInputSchema,
    outputSchema: DigitalScamAnalyzerOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('AI prompt did not return output.');
    }
    return output;
  }
);
