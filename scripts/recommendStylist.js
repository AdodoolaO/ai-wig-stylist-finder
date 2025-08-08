import dotenv from "dotenv";
dotenv.config(); // Load your .env file (OPENAI_API_KEY)

import OpenAI from "openai";
import extractIntent from "./extractIntent.js";
import filterStylists from "./filterStylists.js";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Create a human-friendly response using GPT
 */
async function generateReply(userInput, matchedStylists) {
  try {
    const stylistSummaries = matchedStylists.map((stylist, i) => {
      return `Stylist ${i + 1}:
- Name: ${stylist.fullName}
- Username: @${stylist.username}
- Location: ${stylist.location}
- Bio: ${stylist.biography || "N/A"}
- Instagram: ${stylist.profileUrl}
- Example Post: ${stylist.postUrl}`;
    }).join("\n\n");

    const userPrompt = matchedStylists.length > 0
      ? `A user is looking for a wig stylist. Here’s what they asked: "${userInput}"

Below is a list of stylists based on their request. Please recommend 1–3 of them in a warm, helpful, natural tone. Use their bios and location to guide your suggestion.`
        + "\n\n" + stylistSummaries
      : `A user asked: "${userInput}" but no matching stylists were found.
Respond in a polite, friendly way. Suggest they try a different London location or rephrase their request.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      temperature: 0.7,
      messages: [
        {
          role: "system",
          content: `You're a helpful assistant who recommends London-based wig stylists. Speak casually, like a trusted friend.`
        },
        {
          role: "user",
          content: userPrompt
        }
      ]
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error("❌ GPT error:", error.message);
    return "Sorry, I couldn’t generate a recommendation. Try again!";
  }
}

// 🏁 Run the agent with user input
const userInput = process.argv[2];

if (userInput) {
  console.log(`🧠 User input: ${userInput}`);

  const intent = await extractIntent(userInput);
  console.log("✅ Extracted intent:", intent);

  if (!intent?.location) {
    console.log("⚠️ No location found. Please include a specific area in your message.");
    process.exit(0);
  }

  const matches = filterStylists(intent);
  console.log(`✅ Found ${matches.length} stylist(s) for: "${intent.location}"`);
  console.log("📦 Matched usernames:", matches.map(s => s.username));

  const reply = await generateReply(userInput, matches);
  console.log("\n💬 GPT Recommendation:\n");
  console.log(reply);
}
