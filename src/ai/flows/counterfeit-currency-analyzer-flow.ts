'use server';
/**
 * @fileOverview An AI agent for analyzing currency images to detect counterfeits.
 *
 * - analyzeCurrency - A function that handles the counterfeit currency analysis process.
 * - CounterfeitCurrencyAnalyzerInput - The input type for the analyzeCurrency function.
 * - CounterfeitCurrencyAnalyzerOutput - The return type for the analyzeCurrency function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const CounterfeitCurrencyAnalyzerInputSchema = z.object({
  currencyImageDataUri: z
    .string()
    .describe(
      "A high-resolution image of the currency, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'"
    ),
});
export type CounterfeitCurrencyAnalyzerInput = z.infer<
  typeof CounterfeitCurrencyAnalyzerInputSchema
>;

const CounterfeitCurrencyAnalyzerOutputSchema = z.object({
  authenticityScore: z
    .number()
    .min(0)
    .max(100)
    .describe('A score from 0 (highly counterfeit) to 100 (authentic) indicating the likelihood of authenticity.'),
  suspiciousRegions: z
    .array(z.string())
    .describe(
      'A list of descriptions of regions in the image that appear suspicious or inconsistent with authentic currency.'
    ),
  securityFeatureCheck: z
    .array(z.string())
    .describe(
      'A list of detected security features and their status (e.g., "Watermark present and correct", "Security thread missing", "Color-shifting ink appears genuine").'
    ),
  riskClassification: z
    .enum(['Low', 'Medium', 'High', 'Critical'])
    .describe('Overall risk classification of the currency being counterfeit.'),
});
export type CounterfeitCurrencyAnalyzerOutput = z.infer<
  typeof CounterfeitCurrencyAnalyzerOutputSchema
>;

export async function analyzeCurrency(
  input: CounterfeitCurrencyAnalyzerInput
): Promise<CounterfeitCurrencyAnalyzerOutput> {
  return counterfeitCurrencyAnalyzerFlow(input);
}

const currencyAnalyzerPrompt = ai.definePrompt({
  name: 'currencyAnalyzerPrompt',
  input: { schema: CounterfeitCurrencyAnalyzerInputSchema },
  output: { schema: CounterfeitCurrencyAnalyzerOutputSchema },
  prompt: `You are an expert currency analyst with extensive knowledge of global currency security features and common counterfeiting techniques. Your task is to analyze the provided image of currency and determine its authenticity.

Carefully examine the image for all known security features (e.g., watermarks, security threads, color-shifting ink, microprinting, holograms, raised printing, and unique serial numbers). Identify any irregularities, inconsistencies, or signs of counterfeiting.

Based on your analysis, provide a comprehensive report in JSON format with the following fields:
- 'authenticityScore': A numerical score from 0 to 100, where 0 is definitely counterfeit and 100 is definitely authentic. Assign a score based on the overall assessment.
- 'suspiciousRegions': An array of strings, each describing a specific region or element in the image that appears suspicious or deviates from genuine currency. Be as specific as possible (e.g., "Fuzzy microprinting on the portrait's collar", "Inconsistent color-shifting ink in the numeral"). If no suspicious regions are found, return an empty array.
- 'securityFeatureCheck': An array of strings, each detailing the status of a specific security feature. State whether the feature is present and appears authentic, or if it's missing/fake (e.g., "Watermark: Present and correct portrait", "Security Thread: Appears embedded, genuine", "Color-shifting Ink: Inconsistent and appears printed on").
- 'riskClassification': An overall classification of the currency's authenticity. Choose one from 'Low' (likely authentic), 'Medium' (some suspicious elements, but not conclusive), 'High' (strong indicators of counterfeiting), or 'Critical' (clearly counterfeit).

Image for analysis: {{media url=currencyImageDataUri}}`,
});

const counterfeitCurrencyAnalyzerFlow = ai.defineFlow(
  {
    name: 'counterfeitCurrencyAnalyzerFlow',
    inputSchema: CounterfeitCurrencyAnalyzerInputSchema,
    outputSchema: CounterfeitCurrencyAnalyzerOutputSchema,
  },
  async (input) => {
    const { output } = await currencyAnalyzerPrompt(input, { model: 'gemini-1.5-flash-latest' });
    if (!output) {
      throw new Error('AI did not return a valid analysis output.');
    }
    return output;
  }
);
