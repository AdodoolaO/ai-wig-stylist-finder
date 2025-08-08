import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


//Purpose: Understand what the user is asking for (like location or service type).


/**
 * Extract location from user input (returns a JSON object)
 */
async function extractIntent(userMessage) {
  console.log("🧠 User message:", userMessage);

  const systemPrompt = `
You are an AI assistant that extracts only the London location from user input about finding a wig stylist.

Only return valid JSON in this exact format:
{
  "location": "..." | null
}

Rules:
- Use the exact wording mentioned by the user (e.g. "East London", "Hackney")
- Do not make up or default to "South London"
- If no location is mentioned, return: { "location": null }
- Do NOT include any explanation text or comments — JSON only
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      temperature: 0,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage }
      ]
    });

    const raw = completion.choices[0].message.content;
    console.log("🧾 GPT raw response:", raw);

    const parsed = JSON.parse(raw);
    console.log("✅ Extracted intent:", parsed);
    return parsed;

  } catch (err) {
    console.error("❌ Error during GPT extraction:", err.message);
    return { location: null };
  }
}

// ✅ Run if this file is executed directly
const userInput = process.argv[2];
if (userInput) {
  extractIntent(userInput).then(result => {
    console.log("📦 Final result:", result);
  });
}

export default extractIntent;
