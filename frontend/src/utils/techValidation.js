/**
 * Utility functions for validating tech-related content
 */

// List of tech-related keywords
const techKeywords = [
  // Programming languages
  'javascript', 'python', 'java', 'c++', 'c#', 'ruby', 'php', 'swift', 'kotlin', 'go', 'rust', 'typescript',
  // Web technologies
  'html', 'css', 'react', 'angular', 'vue', 'node', 'express', 'django', 'flask', 'laravel', 'spring', 'asp.net',
  // Mobile development
  'android', 'ios', 'react native', 'flutter', 'xamarin', 'swift', 'mobile app',
  // Data & AI
  'machine learning', 'artificial intelligence', 'ai', 'ml', 'deep learning', 'data science', 'big data', 
  'neural network', 'algorithm', 'tensorflow', 'pytorch', 'pandas', 'computer vision',
  // Cloud & DevOps
  'aws', 'azure', 'gcp', 'cloud', 'devops', 'docker', 'kubernetes', 'ci/cd', 'jenkins', 'terraform',
  // Database
  'sql', 'nosql', 'mongodb', 'postgresql', 'mysql', 'database', 'redis', 'graphql', 'orm',
  // General tech
  'programming', 'code', 'coding', 'developer', 'software', 'web development', 'tech', 'technology', 
  'computer science', 'api', 'backend', 'frontend', 'fullstack', 'architecture', 'system design',
  'cybersecurity', 'ethical hacking', 'blockchain', 'cryptocurrency', 'web3', 'iot', 'embedded', 'microcontroller'
];

/**
 * Check if a search query is tech-related
 * @param {string} query - The search query to check
 * @returns {boolean} - True if the query is tech-related, false otherwise
 */
export const isTechRelated = (query) => {
  if (!query) return false;
  
  const normalizedQuery = query.toLowerCase();
  
  // Check if any tech keyword is in the query
  return techKeywords.some(keyword => 
    normalizedQuery.includes(keyword.toLowerCase())
  );
};

/**
 * Get tech-related search suggestions based on partial input
 * @param {string} input - Partial search input
 * @returns {string[]} - Array of tech-related search suggestions
 */
export const getTechSuggestions = (input) => {
  if (!input || input.length < 2) return [];
  
  const normalizedInput = input.toLowerCase();
  
  // Find keywords that start with or contain the input
  return techKeywords
    .filter(keyword => keyword.toLowerCase().includes(normalizedInput))
    .slice(0, 5) // Limit to 5 suggestions
    .map(keyword => {
      // Capitalize first letter of each word
      return keyword.split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    });
};

export default {
  isTechRelated,
  getTechSuggestions
};
