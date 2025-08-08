const fs = require('fs');

// Load your existing stylist data
const stylists = JSON.parse(fs.readFileSync('data/Insta_stylist_profiles.json'));

// Add a new field: profileUrl
const updatedStylists = stylists.map(stylist => {
  return {
    ...stylist,
    profileUrl: `https://instagram.com/${stylist.username}`
  };
});

// Save the updated file
fs.writeFileSync('stylists_with_urls.json', JSON.stringify(updatedStylists, null, 2));

console.log(`✅ Added profile URLs to ${updatedStylists.length} stylist records.`);
console.log('➡️  Saved to stylists_with_urls.json');
