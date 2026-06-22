'use server';
/**
 * @fileOverview A Genkit flow for generating an investigation summary based on analysis results from
 *               scam detection or counterfeit currency analysis.
 *
 * - investigationSummaryGenerator - A function that generates an investigation summary.
 * - InvestigationSummaryGeneratorInput - The input type for the investigationSummaryGenerator function.
 * - InvestigationSummaryGeneratorOutput - The return type for the investigationSummaryGenerator function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const InvestigationSummaryGeneratorInputSchema = z.object({
  analysisType: z
    .enum(['scam-message', 'counterfeit-currency'])
    .describe('The type of analysis performed (e.g., "scam-message", "counterfeit-currency").'),
  analysisDetails: z
    .string()
    .describe(
      'A JSON string of the detailed analysis result. This could be from scam detection or counterfeit currency analysis.'
    ),
  originalInput: z
    .string()
    .describe('The original input that was analyzed (e.g., SMS message, description of currency image).'),
});
export type InvestigationSummaryGeneratorInput = z.infer<typeof InvestigationSummaryGeneratorInputSchema>;

const InvestigationSummaryGeneratorOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the findings from the analysis.'),
  keyInsights: z.array(z.string()).describe('Key insights derived from the analysis, presented as a list.'),
  investigativeLeads: z.array(z.string()).describe('Potential investigative leads for further action, presented as a list.'),
});
export type InvestigationSummaryGeneratorOutput = z.infer<typeof InvestigationSummaryGeneratorOutputSchema>;

export async function investigationSummaryGenerator(
  input: InvestigationSummaryGeneratorInput
): Promise<InvestigationSummaryGeneratorOutput> {
  return investigationSummaryGeneratorFlow(input);
}

const investigationSummaryPrompt = ai.definePrompt({
  name: 'investigationSummaryPrompt',
  input: { schema: InvestigationSummaryGeneratorInputSchema },
  output: { schema: InvestigationSummaryGeneratorOutputSchema },
  prompt: `You are an expert public safety intelligence analyst. Your task is to generate a concise summary of findings, key insights, and potential investigative leads based on the provided analysis.

---
Analysis Type: {{{analysisType}}}
Original Input: {{{originalInput}}}
Analysis Details (JSON string):

    {{{analysisDetails}}}

---

Based on the information above, provide:
1. A concise summary of the findings.
2. Key insights derived from the analysis.
3. Potential investigative leads for further action.

Ensure the output is in a JSON format matching the following schema:
{{json_schema_output}}`,
});

const investigationSummaryGeneratorFlow = ai.defineFlow(
  {
    name: 'investigationSummaryGeneratorFlow',
    inputSchema: InvestigationSummaryGeneratorInputSchema,
    outputSchema: InvestigationSummaryGeneratorOutputSchema,
  },
  async (input) => {
    const { output } = await investigationSummaryPrompt(input);
    return output!;
  }
);
