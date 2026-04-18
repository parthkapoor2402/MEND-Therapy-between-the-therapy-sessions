import { GoogleGenerativeAI } from '@google/generative-ai'

const apiKey = import.meta.env.VITE_GEMINI_API_KEY
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null
const model = genAI?.getGenerativeModel({ model: 'gemini-2.5-flash-lite' })

export async function generateBriefFromDebrief(debriefAnswers) {
  if (!model) return null

  const prompt = `
You are a compassionate therapy assistant. A user just completed a 5-question debrief after their therapy session.

Here are their answers:
1. Emotional moment: "${debriefAnswers.emotion || 'not provided'}"
2. Belief they noticed: "${debriefAnswers.belief || 'not provided'}"
3. Pattern they observed: "${debriefAnswers.pattern || 'not provided'}"
4. Commitment/homework: "${debriefAnswers.commitment || 'not provided'}"
5. Unfinished topic: "${debriefAnswers.openLoop || 'not provided'}"

Generate exactly 5 brief bullets for their pre-session brief. 
Rules:
- Use ONLY their own words — do not paraphrase or add clinical language
- Keep each detail field under 25 words
- Be warm and human — not robotic
- Never use bullet points or dashes in the detail text

Return a JSON array exactly like this with no extra text or markdown:
[
  {"id":1,"emoji":"💛","label":"You felt something shift","detail":"[use their exact words from answer 1]","type":"emotion"},
  {"id":2,"emoji":"💡","label":"You said something that surprised you:","detail":"[use their exact words from answer 2]","type":"belief"},
  {"id":3,"emoji":"🔁","label":"A pattern showed up again:","detail":"[use their exact words from answer 3]","type":"pattern"},
  {"id":4,"emoji":"✅","label":"You wanted to try:","detail":"[use their exact words from answer 4]","type":"commitment"},
  {"id":5,"emoji":"❓","label":"You didn't get to:","detail":"[use their exact words from answer 5]","type":"openLoop"}
]
`
  try {
    const result = await model.generateContent(prompt)
    let text = result.response.text().trim()
    // Strip markdown code blocks if Gemini wraps response
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    return JSON.parse(text)
  } catch (error) {
    console.error('Brief generation failed:', error)
    return null
  }
}

export async function generatePulsePatterns(allDebriefs) {
  if (!allDebriefs || allDebriefs.length === 0) return []

  if (!model) return null

  const debriefSummary = allDebriefs
    .slice(-4)
    .map(
      (d, i) =>
        `Session ${i + 1} (${new Date(d.date).toLocaleDateString('en-IN')}):
    Emotion: ${d.answers.emotion || 'not provided'}
    Belief: ${d.answers.belief || 'not provided'}
    Pattern: ${d.answers.pattern || 'not provided'}
    Commitment: ${d.answers.commitment || 'not provided'}`,
    )
    .join('\n\n')

  const prompt = `
You are a compassionate therapy assistant analyzing a user's therapy session debriefs over time.

Here are their recent debriefs:
${debriefSummary}

Identify up to 3 meaningful patterns. For each pattern choose exactly one type:
- "recurring": a theme, feeling, or phrase that appears across multiple sessions
- "shift": a notable emotional change or turning point
- "regression": a belief or pattern from an earlier session that has returned in different words

Rules:
- Use the user's own words wherever possible
- Be specific — reference actual things they said
- Be warm and non-clinical
- Only include a pattern if there is genuine evidence for it
- If only 1 debrief exists, return 1 pattern of type "recurring" only

Return ONLY a JSON array with no extra text or markdown:
[
  {
    "id": 1,
    "type": "recurring",
    "icon": "🔁",
    "title": "short title max 10 words using their words",
    "detail": "one warm sentence explaining this pattern, max 25 words",
    "contexts": ["context1", "context2", "context3"]
  }
]

For type "regression" also include these two extra fields:
  "quote1": "exact quote from earlier session",
  "quote2": "exact quote from recent session"

For type "shift" also include:
  "shiftDay": "a day name like Tuesday or a date"
`
  try {
    const result = await model.generateContent(prompt)
    let text = result.response.text().trim()
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    return JSON.parse(text)
  } catch (error) {
    console.error('Pulse generation failed:', error)
    return null
  }
}
