import { OpenAI } from 'openai'
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export const generateText = async ({ prompt }) => {
  const FitScore = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo-16k',
    messages: [
      { role: "assistant", content: `Please generate a fit score between 0 and 100 for the following resume text, where the fit score is a measure of how good this resume: ${prompt.resume_text.slice(0,10000)} is matching this job description: ${prompt.job_description.slice(0,10000)} Only respond with the fit score: ` },
    ],
  })

  const Feedback = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo-16k',
    messages: [
      { role: "assistant", content: `Please generate an array of strings, with each one being one-sentence suggestions to improve the resume: ${prompt.resume_text.slice(0, 10000)} based on the following job description: ${prompt.job_description.slice(0, 10000)}. Prioritize missing components, like missing skills, above all else. Also, please classify each suggestion as either being related to skills or experience, and place that at the start. Limit yourself to 10 suggestions max. Respond only with a valid JSON array of strings, e.g., ["Category1 Improvement: Suggestion1", "Category2 Improvement: Suggestion2",].` },
    ],
  })

  const KeywordsMatched = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-16k",
    messages: [
      { role: "assistant", content: `Please generate an array of one-word matched keywords in JSON format based on the job description: ${prompt.job_description.slice(0, 10000)}. Respond only with a valid JSON array of one-word strings, e.g., ["Python", "AWS", "Azure"].` }
    ]
  })



  let feedbackArray: String[] = []
  try {
    feedbackArray = JSON.parse(Feedback?.choices[0].message?.content || '[]')
    if (!Array.isArray(feedbackArray)){
      return {
        error: "Unable to process request. Please try again later."
      }
    }
  } catch (error) {
    return {
      error: "Unable to process request. Please try again later."
    }
  }

  let keywordsMatchedArray: string[] = []
  try {
    keywordsMatchedArray = JSON.parse(KeywordsMatched?.choices[0].message?.content || '[]')
    if (!Array.isArray(keywordsMatchedArray)){
      return {
        error: "Unable to process request. Please try again later."
      }
    }
  } catch (error) {
    return {
      error: "Unable to process request. Please try again later."
    }
  }

  console.log(prompt)
  return {
      fit_score: parseInt(FitScore?.choices[0]?.message?.content),
      feedback: feedbackArray,
      keywords_matched: keywordsMatchedArray
  }
}
