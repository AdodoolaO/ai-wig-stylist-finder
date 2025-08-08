const fs = require('fs');

// Load scraped posts from Phantombuster's Hashtag Search JSON output
const rawData = fs.readFileSync('data/hashtag_scraper.json');
const posts = JSON.parse(rawData);

// Define keywords that show it's a wig-related service
const keywords = ['wig', 'install', 'frontal', 'lace', 'closure', 'hd', 'hair'];

// Define a regex to match boroughs and areas in London (case-insensitive)
const londonLocationRegex = new RegExp(
  [
    'london',
    'croydon',
    'islington',
    'camden',
    'hackney',
    'tower hamlets',
    'redbridge',
    'barking',
    'ilford',
    'brixton',
    'streatham',
    'peckham',
    'tooting',
    'walthamstow',
    'newham',
    'lewisham',
    'southwark',
    'kensington',
    'chelsea',
    'westminster',
    'clapham',
    'wandsworth',
    'harrow',
    'greenwich',
    'ealing',
    'acton',
    'hounslow',
    'north london',
    'east london',
    'south london',
    'west london'
  ].join('|'),
  'i' // i = case-insensitive
);

// Flatten all topPosts into one array. Why? Because You're scraping hashtag data, and the real post content is nested inside
//That means you're not working with a flat array of posts, but instead a list of hashtag objects, each containing a topPosts array.
const allPosts = posts.flatMap(group => group.topPosts || []);

// Begin filtering posts
const relevantStylists = allPosts.filter(post => {
  const caption = post.caption?.toLowerCase() || '';
  const location = post.locationName?.toLowerCase() || '';
  const hashtags = post.hashtags?.map(tag => tag.toLowerCase()) || [];
  const username = post.ownerUsername;
  const fullName = post.ownerFullName || '';

  // ❌ Filter out non-UK "East London" (South Africa)
  const isSouthAfrica = location.includes("eastern cape");

  //✅ Check if caption contains wig/hair keywords
  const hasHairKeyword = keywords.some(k => caption.includes(k));

 // Match location:
  // - directly from locationName
  // - OR from hashtags if locationName is missing
 const isInLondon =
    londonLocationRegex.test(location) ||
    hashtags.some(tag => londonLocationRegex.test(tag)) ||
    londonLocationRegex.test(caption); // backup

  // ✅ Only include posts that pass all conditions
  return username && !isSouthAfrica && isInLondon && hasHairKeyword;
}).map(post => {
  return {
    username: post.ownerUsername,
    fullName: post.ownerFullName || '',
    caption: post.caption,
    location: post.locationName || '',
    postUrl: post.url
  };
});

// Extract unique usernames for Instagram Profile Scraper input
const usernames = [...new Set(relevantStylists.map(s => s.username))];

// Save the usernames to a file
fs.writeFileSync('filtered_usernames.json', JSON.stringify(usernames, null, 2));

// Save the full filtered stylist info for AI enrichment or future use
fs.writeFileSync('relevant_stylists_detailed.json', JSON.stringify(relevantStylists, null, 2));

console.log(`✅ Found ${usernames.length} relevant stylist usernames.`);
console.log('➡️  Saved to filtered_usernames.json and relevant_stylists_detailed.json');
