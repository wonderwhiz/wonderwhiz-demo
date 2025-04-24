
// Calculate similarity between two strings using normalized Levenshtein distance
export function similarity(s1: string, s2: string): number {
  // Handle empty strings
  if (s1.length === 0 && s2.length === 0) return 1.0;
  if (s1.length === 0 || s2.length === 0) return 0.0;
  
  // Normalize strings: lowercase and remove extra spaces
  s1 = s1.toLowerCase().trim().replace(/\s+/g, ' ');
  s2 = s2.toLowerCase().trim().replace(/\s+/g, ' ');
  
  // If strings are identical, return 1.0
  if (s1 === s2) return 1.0;
  
  // Get the longer and shorter strings
  const longer = s1.length > s2.length ? s1 : s2;
  const shorter = s1.length > s2.length ? s2 : s1;
  
  // Calculate similarity using Levenshtein distance, normalized by the longer string length
  return (longer.length - editDistance(longer, shorter)) / longer.length;
}

// Levenshtein distance calculation
function editDistance(s1: string, s2: string): number {
  // Create a matrix of (s1.length + 1) rows and (s2.length + 1) columns
  const costs = Array(s2.length + 1);
  for (let i = 0; i <= s1.length; i++) {
    let lastValue = i;
    for (let j = 0; j <= s2.length; j++) {
      if (i === 0) {
        costs[j] = j;
      } else if (j > 0) {
        let newValue = costs[j - 1];
        if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
          // Substitute cost is 1
          newValue = Math.min(
            Math.min(newValue, lastValue), // insertion or deletion
            costs[j]                       // substitution
          ) + 1;
        }
        costs[j - 1] = lastValue;
        lastValue = newValue;
      }
    }
    if (i > 0) costs[s2.length] = lastValue;
  }
  
  return costs[s2.length];
}

// New helper function to check content overlap on a semantic level (exact phrase matching)
export function hasSignificantOverlap(s1: string, s2: string): boolean {
  // Normalize strings
  s1 = s1.toLowerCase().trim();
  s2 = s2.toLowerCase().trim();
  
  // If either string is very short, basic similarity is enough
  if (s1.length < 15 || s2.length < 15) {
    return similarity(s1, s2) > 0.7;
  }
  
  // Break strings into phrases (3-4 words) and check if any significant phrases are reused
  const words1 = s1.split(/\s+/);
  const words2 = s2.split(/\s+/);
  
  // Create phrases from words1
  const phrases1: string[] = [];
  for (let i = 0; i < words1.length - 3; i++) {
    phrases1.push(words1.slice(i, i + 4).join(' '));
  }
  
  // Check if any phrases from words1 appear in s2
  for (const phrase of phrases1) {
    if (phrase.length > 12 && s2.includes(phrase)) { // Only check significant phrases
      return true;
    }
  }
  
  // Also check overall similarity
  return similarity(s1, s2) > 0.7;
}
