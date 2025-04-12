// Use server directive to ensure this is only run on the server.
'use server';

/**
 * @fileOverview Generates a personalized training plan for an employee based on their feedback and a new job description.
 *
 * - generateTrainingPlan - A function that handles the training plan generation process.
 * - GenerateTrainingPlanInput - The input type for the generateTrainingPlan function.
 * - GenerateTrainingPlanOutput - The return type for the generateTrainingPlan function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';
import {getTrainingContent} from '@/services/training-content';

const GenerateTrainingPlanInputSchema = z.object({
  employeeFeedback: z.string().describe('The employee feedback.'),
  newJobDescription: z.string().describe('The new job description.'),
});
export type GenerateTrainingPlanInput = z.infer<typeof GenerateTrainingPlanInputSchema>;

const GenerateTrainingPlanOutputSchema = z.object({
  trainingPlan: z.string().describe('The generated training plan.'),
});
export type GenerateTrainingPlanOutput = z.infer<typeof GenerateTrainingPlanOutputSchema>;

export async function generateTrainingPlan(input: GenerateTrainingPlanInput): Promise<GenerateTrainingPlanOutput> {
  return generateTrainingPlanFlow(input);
}

const trainingPlanPrompt = ai.definePrompt({
  name: 'trainingPlanPrompt',
  input: {
    schema: z.object({
      employeeFeedback: z.string().describe('The employee feedback.'),
      newJobDescription: z.string().describe('The new job description.'),
    }),
  },
  output: {
    schema: z.object({
      trainingPlan: z.string().describe('The generated training plan.'),
    }),
  },
  prompt: `You are an expert in creating personalized training plans for employees transitioning into new roles.

  Compare the employee's feedback with the requirements of the new job description and identify any skill gaps.
  Based on these gaps, create a comprehensive training plan that addresses the areas where the employee needs to develop new skills or improve existing ones.

  Employee Feedback: {{{employeeFeedback}}}
  New Job Description: {{{newJobDescription}}}

  Training Plan:
`,
});

const generateTrainingPlanFlow = ai.defineFlow<
  typeof GenerateTrainingPlanInputSchema,
  typeof GenerateTrainingPlanOutputSchema
>(
  {
    name: 'generateTrainingPlanFlow',
    inputSchema: GenerateTrainingPlanInputSchema,
    outputSchema: GenerateTrainingPlanOutputSchema,
  },
  async input => {
    const {output} = await trainingPlanPrompt(input);
    return output!;
  }
);
