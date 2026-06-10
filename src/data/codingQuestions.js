/**
 * codingQuestions.js
 * Coding challenge data for course topics that include hands-on exercises.
 * Keyed by course name → step id → challenge object.
 */

// ─── Coding Challenges (keyed by course name → step id → challenge) ──────────

export const codingData = {
  'Machine Learning Foundations': {
    2: {
      description:
        'Write a Python function `minMaxNormalize(data)` that takes a list of numbers and returns a new list with values scaled to the range [0, 1] using Min-Max scaling. If all elements in the list are equal, return a list of zeros.',
      initialCode:
        'def minMaxNormalize(data):\n    # Write your code here\n    pass',
      testCases: [
        { input: [1, 2, 3, 4, 5], expected: [0, 0.25, 0.5, 0.75, 1] },
        { input: [10, 20, 30], expected: [0, 0.5, 1] },
        { input: [5, 5, 5], expected: [0, 0, 0] },
      ],
    },
  },

  'Deep Learning & Neural Nets': {
    2: {
      description:
        'Write a Python function `relu(x)` that computes the Rectified Linear Unit (ReLU) activation. If x is a number, return max(0, x). If x is a list of numbers, apply ReLU to each element and return a new list.',
      initialCode: 'def relu(x):\n    # Write your code here\n    pass',
      testCases: [
        { input: -5, expected: 0 },
        { input: 3, expected: 3 },
        { input: [-10, 0, 5], expected: [0, 0, 5] },
      ],
    },
  },

  'Natural Language Processing': {
    1: {
      description:
        'Write a Python function `tokenize(text)` that converts a string to lowercase, removes any punctuation characters (.,!?;:), and splits the text into a list of individual words (tokens). Filter out any empty tokens.',
      initialCode:
        'def tokenize(text):\n    # Write your code here\n    pass',
      testCases: [
        {
          input: 'Attention is all you need!',
          expected: ['attention', 'is', 'all', 'you', 'need'],
        },
        {
          input: 'Hello, World; NLP is fun.',
          expected: ['hello', 'world', 'nlp', 'is', 'fun'],
        },
      ],
    },
  },

  'Linear & Logistic Regression': {
    2: {
      description:
        'Write a Python function `sigmoid(z)` that calculates the Sigmoid activation. It maps any real-valued number to the range [0, 1] using the formula: 1 / (1 + e^-z). Return the result rounded to 4 decimal places.',
      initialCode:
        'def sigmoid(z):\n    # Write your code here\n    pass',
      testCases: [
        { input: 0, expected: 0.5 },
        { input: 2, expected: 0.8808 },
        { input: -2, expected: 0.1192 },
      ],
    },
  },

  'Decision Trees & Random Forests': {
    2: {
      description:
        'Write a Python function `calculateGini(counts)` that takes a list `[class1Count, class2Count]` representing class sample counts and returns the Gini Impurity of the node. Formula: 1 - (p1^2 + p2^2) where p1 and p2 are the proportions of class 1 and class 2. Return the result rounded to 4 decimal places.',
      initialCode:
        'def calculateGini(counts):\n    # Write your code here\n    pass',
      testCases: [
        { input: [5, 5], expected: 0.5 },
        { input: [10, 0], expected: 0 },
        { input: [3, 1], expected: 0.375 },
      ],
    },
  },

  'Support Vector Machines (SVM)': {
    2: {
      description:
        'Write a Python function `linearKernel(v1, v2)` that calculates the linear kernel (dot product) of two vectors of equal length. v1 and v2 are lists of numbers. (e.g. linearKernel([1, 2], [3, 4]) is 1*3 + 2*4 = 11)',
      initialCode:
        'def linearKernel(v1, v2):\n    # Write your code here\n    pass',
      testCases: [
        { input: [[1, 2], [3, 4]], expected: 11 },
        { input: [[0, 1, -1], [2, 3, 4]], expected: -1 },
      ],
    },
  },

  'K-Means Clustering': {
    2: {
      description:
        'Write a Python function `euclideanDistance(p1, p2)` that returns the Euclidean distance between two points in 2D space. p1 and p2 are lists of coordinate values `[x, y]`. Return the result rounded to 4 decimal places.',
      initialCode:
        'def euclideanDistance(p1, p2):\n    # Write your code here\n    pass',
      testCases: [
        { input: [[0, 0], [3, 4]], expected: 5 },
        { input: [[1, 1], [4, 5]], expected: 5 },
      ],
    },
  },
};

// ─── Accessor Functions ──────────────────────────────────────────────────────

/**
 * Get the coding challenge for a specific step within a course.
 * @param {string} courseName
 * @param {number} stepId
 * @returns {Object|null} Challenge object or null if none exists
 */
export function getCodingChallenge(courseName, stepId) {
  const courseChallenges = codingData[courseName];
  if (!courseChallenges) return null;
  return courseChallenges[stepId] || null;
}

/**
 * Get all coding challenges across all courses.
 * @returns {Object} Full codingData map
 */
export function getAllCodingChallenges() {
  return codingData;
}
