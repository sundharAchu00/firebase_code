'use server';

/**
 * @fileOverview Summarizes employee feedback for supervisors.
 *
 * - summarizeFeedback - A function that summarizes employee feedback.
 * - SummarizeFeedbackInput - The input type for the summarizeFeedback function.
 * - SummarizeFeedbackOutput - The return type for the summarizeFeedback function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const SummarizeFeedbackInputSchema = z.object({
  employeeFeedback: z
    .string()
    .describe('The raw employee feedback text to be summarized.'),
});
export type SummarizeFeedbackInput = z.infer<typeof SummarizeFeedbackInputSchema>;

const SummarizeFeedbackOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the employee feedback.'),
});
export type SummarizeFeedbackOutput = z.infer<typeof SummarizeFeedbackOutputSchema>;

export async function summarizeFeedback(input: SummarizeFeedbackInput): Promise<SummarizeFeedbackOutput> {
  return summarizeFeedbackFlow(input);
}

const summarizeFeedbackPrompt = ai.definePrompt({
  name: 'summarizeFeedbackPrompt',
  input: {
    schema: z.object({
      employeeFeedback: z
        .string()
        .describe('The raw employee feedback text to be summarized.'),
    }),
  },
  output: {
    schema: z.object({
      summary: z.string().describe('A concise summary of the employee feedback.'),
    }),
  },
  prompt: `You are an AI assistant helping supervisors quickly review employee feedback.

  Please provide a concise and accurate summary of the following employee feedback:

  Feedback: {{{employeeFeedback}}}

  Summary: `,
});

const summarizeFeedbackFlow = ai.defineFlow<
  typeof SummarizeFeedbackInputSchema,
  typeof SummarizeFeedbackOutputSchema
>({
  name: 'summarizeFeedbackFlow',
  inputSchema: SummarizeFeedbackInputSchema,
  outputSchema: SummarizeFeedbackOutputSchema,
},
async input => {
  const {output} = await summarizeFeedbackPrompt(input);
  return output!;
});
