// Tokenize a string into an array of lowercase words, removing punctuation
export function tokenize(text) {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter((word) => word.length > 1); // remove single characters
}

// Extract bigrams from a string array of words
export function getBigrams(words) {
  const bigrams = new Set();
  for (let i = 0; i < words.length - 1; i++) {
    bigrams.add(`${words[i]} ${words[i + 1]}`);
  }
  return bigrams;
}

// Calculate similarity between two strings using keyword overlap and bigram overlap
export function calculateSimilarity(query, targetText) {
  if (!query || !targetText) return 0;

  const queryWords = tokenize(query);
  const targetWords = tokenize(targetText);

  if (queryWords.length === 0 || targetWords.length === 0) return 0;

  // Word overlap score
  const queryWordSet = new Set(queryWords);
  const targetWordSet = new Set(targetWords);

  let wordIntersection = 0;
  for (const word of queryWordSet) {
    if (targetWordSet.has(word)) wordIntersection++;
    else {
      // Fuzzy match for partial word overlaps (e.g. "kumkumadi" vs "kumkum")
      for (const tWord of targetWordSet) {
        if (tWord.includes(word) || word.includes(tWord)) {
          // Only count if it's a significant substring (length > 3)
          if (word.length > 3 || tWord.length > 3) {
            wordIntersection += 0.5;
            break;
          }
        }
      }
    }
  }

  // Divide by query length instead of union to not penalize long documents
  const wordScore = queryWordSet.size > 0 ? wordIntersection / queryWordSet.size : 0;

  // Bigram overlap score
  const queryBigrams = getBigrams(queryWords);
  const targetBigrams = getBigrams(targetWords);

  let bigramIntersection = 0;
  for (const bg of queryBigrams) {
    if (targetBigrams.has(bg)) bigramIntersection++;
  }

  const bigramScore = queryBigrams.size > 0 ? bigramIntersection / queryBigrams.size : 0;

  // Weight words higher than bigrams since queries might be short
  return (wordScore * 0.7) + (bigramScore * 0.3);
}

// Score a document against a query, considering different weights for different fields
export function scoreDocument(query, doc, fieldWeights) {
  let totalScore = 0;
  for (const [field, weight] of Object.entries(fieldWeights)) {
    const text = doc[field];
    if (text) {
      // Stringify in case it's not a string
      const similarity = calculateSimilarity(query, String(text));
      totalScore += similarity * weight;
    }
  }
  return totalScore;
}
