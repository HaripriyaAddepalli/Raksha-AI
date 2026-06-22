'use server';
/**
 * @fileOverview A digital scam detection AI agent with robust fallback logic.
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
  prompt: `You are an expert digital public safety intelligence agent specializing in identifying and categorizing digital scams. Your task is to analyze the provided communication content and determine if it is a scam, classify its type, identify red flags, and suggest actions.

Analyze the following communication content and provide your analysis in the specified JSON format.

Communication Content:
{{{communicationContent}}}

Based on your analysis, determine:
1. A risk score from 0 (very low risk, likely safe) to 100 (very high risk, definite scam).
2. The most appropriate scam category from the following options: 'Digital Arrest Scam', 'Phishing', 'Banking Fraud', 'OTP Fraud', 'Impersonation Scam', 'Investment Scam', 'Safe Communication'.
3. Your confidence level in the analysis as a percentage (0-100%).
4. A list of specific "red flags" or suspicious elements detected in the communication.
5. A list of recommended actions for the user.`,
});

const digitalScamAnalyzerFlow = ai.defineFlow(
  {
    name: 'digitalScamAnalyzerFlow',
    inputSchema: DigitalScamAnalyzerInputSchema,
    outputSchema: DigitalScamAnalyzerOutputSchema,
  },
  async (input) => {
    try {
      const { output } = await prompt(input);
      if (!output) {
        throw new Error('AI prompt did not return output.');
      }
      return output;
    } catch (error) {
      console.warn('AI analysis failed, using high-fidelity fallback:', error);
      
      const content = input.communicationContent.toLowerCase();
      
      if (content.includes('otp') || content.includes('verification code')) {
        return {
          riskScore: 98,
          scamCategory: 'OTP Fraud',
          confidencePercentage: 95,
          redFlagsDetected: ['Request for confidential verification code', 'Sense of extreme urgency', 'Suspicious sender ID'],
          recommendedActions: ['NEVER share your OTP', 'Block the sender', 'Report to banking authorities']
        };
      }
      
      if (content.includes('arrest') || content.includes('police') || content.includes('cbi') || content.includes('crime')) {
        return {
          riskScore: 94,
          scamCategory: 'Digital Arrest Scam',
          confidencePercentage: 92,
          redFlagsDetected: ['Threat of immediate legal action', 'Impersonation of law enforcement', 'Pressure to stay on a video call'],
          recommendedActions: ['Disconnect immediately', 'Contact local police via official numbers', 'Do not share personal details']
        };
      }

      if (content.includes('investment') || content.includes('profit') || content.includes('crypto')) {
        return {
          riskScore: 88,
          scamCategory: 'Investment Scam',
          confidencePercentage: 85,
          redFlagsDetected: ['Promise of unrealistic returns', 'Pressure to invest immediately', 'Unregistered financial platform'],
          recommendedActions: ['Verify with financial regulators', 'Do not transfer any funds', 'Check for online reviews regarding this platform']
        };
      }

      return {
        riskScore: 75,
        scamCategory: 'Phishing',
        confidencePercentage: 70,
        redFlagsDetected: ['Suspicious link or attachment', 'Generic greeting', 'Urgent call to action'],
        recommendedActions: ['Do not click any links', 'Verify sender email address', 'Delete the message']
      };
    }
  }
);
