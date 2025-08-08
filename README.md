#AI Agent to find your next Hairstylist in London

This is a beginner-friendly AI agent that helps people find London-based wig stylists on Instagram based on their location (e.g., “East London”, “South London”).

What It Does (in simple terms)
You type something like:

“Looking for a stylist in South London who does glueless installs”

The AI:
1. Extracts the location from your message (e.g., “South London”)
2. Searches through a list of scraped stylists to find ones that match that area
3. Asks GPT to write a natural reply, suggesting 1–3 stylists with Instagram links
4. The idea is to make it feel like a friendly human recommendation, not just a database search.

#How to Run It
node scripts/recommendStylist.js "Looking for a stylist in East London"

#The Files & What they do
| `extractIntent.js`     | Uses GPT to figure out **which location** the user is asking about. Returns structured JSON like `{ location: "South London" }`.             |
| `filterStylists.js`    | Takes that location and searches your stylist dataset (`stylists_merged.json`) for relevant matches based on **location, caption, and bio**. |
| `recommendStylist.js`  | The “main script” that connects everything. It handles the full flow: user input → GPT intent → stylist filter → GPT response.               |
| `stylists_merged.json` | Your local “database” of stylists. This includes their bios, usernames, profile links, captions, and posts. All scraped beforehand.          |


#Tools Used
OpenAI GPT-4 API: for both extracting location and generating the final stylist recommendation.
dotenv: to securely load your API key.
Node.js (v18+): backend environment for running everything.
Aplify: To scrape stylist data from Instagram 

#How the Logic Works (Visually)
User input → extractIntent → filterStylists → generateReply → Output
GPT understands the user’s location

You find stylists in your data that mention that location
GPT writes a helpful, natural response using those stylists