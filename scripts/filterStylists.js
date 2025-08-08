import fs from 'fs';

// Load your cleaned stylist dataset (from merge step)
const stylists = JSON.parse(fs.readFileSync('output/stylists_merged.json', 'utf-8'));


/**
 * Purpose: Search your stylist data to find relevant matches.
 * Filter stylists based only on location (MVP version)
 * Example intent:
 * {
 *   location: "South London"
 * }
 */

//Creating stylist filter function 
function filterStylists(intent) {
    const query = intent.location?.toLowerCase();
      if (!query) {
    // If no location was extracted, return all stylists (or handle however you want)
    console.warn("No location provided in intent. Returning full list.");
   return [];
  }
    const results = stylists.filter(stylist => {
    const combinedText = `${stylist.location} ${stylist.caption} ${stylist.biography}`.toLowerCase();
    return combinedText.includes(query);
  });

  return results;
}

// 🧪 Test the function directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const testIntent = {
    location: 'South London'
  };

  const matched = filterStylists(testIntent);

  console.log(`✅ Found ${matched.length} stylists for location: "${testIntent.location}"`);
  console.log(matched.slice(0, 3)); // preview first 3 results
}

export default filterStylists;

// How It Works
// It combines all relevant fields (location, caption, biography) into one string

// Converts everything to lowercase for a case-insensitive match

// Looks for the intent.location as a substring — e.g. "south london" in "Based in South London"

// Returns all matches