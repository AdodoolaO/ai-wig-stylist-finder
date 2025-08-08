const fs = require('fs');

// Load both JSON files
const postData = JSON.parse(fs.readFileSync('data/relevant_stylists_detailed.json'));
const profileData = JSON.parse(fs.readFileSync('data/stylists_with_urls.json'));

// Convert profile data into a map for quick lookup by username
const profileMap = {};
profileData.forEach(profile => {
  profileMap[profile.username.toLowerCase()] = profile;
});

// Merge post data with profile data by matching usernames
const merged = postData.map(post => {
  const username = post.username.toLowerCase();
  const profile = profileMap[username];

  return {
    ...post,
    profileUrl: profile ? profile.profileUrl : null,
    profilePicUrl: profile ? profile.profilePicUrl : null,
    followersCount: profile ? profile.followersCount : null,
    biography: profile ? profile.biography : null,
    postsCount: profile ? profile.postsCount : null,
    isBusinessAccount: profile ? profile.isBusinessAccount : null,
    private: profile ? profile.private : null
  };
});

// Save the merged dataset
fs.writeFileSync('stylists_merged.json', JSON.stringify(merged, null, 2));

console.log(`✅ Merged ${merged.length} stylist records.`);
console.log('➡️  Saved to output/stylists_merged.json');
