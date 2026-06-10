/**
 * topics.js
 * Study content for all course topics, plus UI card definitions
 * for the Learning Paths and Popular Tracks sections.
 */

// ─── Study Topics (keyed by course name → array of topic objects) ────────────

export const topicsData = {
  'Machine Learning Foundations': [
    {
      id: 1,
      title: 'Introduction to ML',
      study: {
        heading: 'What is Machine Learning?',
        content:
          'Machine learning is a subfield of AI that enables systems to learn from data patterns instead of following explicit, hard-coded rules. Algorithms are trained on input features to predict outputs or find structures in data.',
        highlights: [
          'Supervised: Labeled target outputs',
          'Unsupervised: Grouping unlabeled patterns',
          'Reinforcement: Trial-and-error rewards',
        ],
      },
    },
    {
      id: 2,
      title: 'Data Preprocessing',
      study: {
        heading: 'Feature Engineering & Preprocessing',
        content:
          'Data in the real world is messy. To train high-quality models, we must preprocess it. This involves normalizing values, handling missing fields, and converting strings into numbers.',
        code: `# Feature Scaling Example (Python)
import numpy as np
def min_max_normalize(data):
    return (data - np.min(data)) / (np.max(data) - np.min(data))`,
      },
    },
    {
      id: 3,
      title: 'Model Evaluation & Overfitting',
      study: {
        heading: 'Overfitting & Generalization',
        content:
          'In Machine Learning, we want our models to generalize well to new, unseen data. If a model fits the training data too closely, it might learn random noise instead of the general pattern.',
        highlights: [
          'Overfitting: High training accuracy, low validation accuracy',
          'Underfitting: Low training accuracy, low validation accuracy',
        ],
      },
    },
  ],

  'Deep Learning & Neural Nets': [
    {
      id: 1,
      title: 'The Artificial Perceptron',
      study: {
        heading: 'The Artificial Perceptron',
        content:
          'The perceptron is the basic building block of deep learning. It multiplies inputs by weights, sums them with a bias, and passes the result through an activation function.',
        highlights: [
          'Weighted Sum: z = w1*x1 + w2*x2 + ... + b',
          'Activation Function: y = f(z)',
        ],
      },
    },
    {
      id: 2,
      title: 'Activation Functions',
      study: {
        heading: 'Activation Functions',
        content:
          'Activation functions introduce non-linearity, allowing networks to learn non-linear boundaries. Common options include ReLU (returns max(0, x)), Sigmoid (squashes outputs to 0-1 range), and Tanh.',
        code: `# ReLU Activation Function
def relu(x):
    return np.maximum(0, x)`,
      },
    },
    {
      id: 3,
      title: 'Backpropagation & Loss',
      study: {
        heading: 'Backpropagation',
        content:
          'Backpropagation computes the gradient of the loss function with respect to each weight in the network, starting from the output layer and propagating backward using the chain rule.',
        highlights: [
          'Loss function calculates prediction error',
          'Chain rule enables gradient calculation across multiple layers',
        ],
      },
    },
  ],

  'Natural Language Processing': [
    {
      id: 1,
      title: 'Tokenization & Text Preprocessing',
      study: {
        heading: 'The Tokenization Pipeline',
        content:
          'Text data must be broken down before models can ingest it. Tokenization separates text into smaller units (tokens like words or subwords), which are then converted to numerical IDs.',
        code: `# Text tokenization example
text = "Attention is all you need"
tokens = text.lower().split()
# Result: ['attention', 'is', 'all', 'you', 'need']`,
      },
    },
    {
      id: 2,
      title: 'Self-Attention & Transformers',
      study: {
        heading: 'Self-Attention Mechanism',
        content:
          'Modern language models use the self-attention mechanism to weigh the importance of different words in a sentence relative to each other, maintaining contextual memory over long texts.',
        highlights: [
          'Queries (Q), Keys (K), Values (V) matrices',
          'Attention score calculated via dot-product scaling',
        ],
      },
    },
  ],

  'Linear & Logistic Regression': [
    {
      id: 1,
      title: 'Linear Regression & MSE',
      study: {
        heading: 'Linear Regression',
        content:
          'Linear Regression fits a straight line to data points. The formula represents a dependent variable as a combination of independent variables. We use Mean Squared Error (MSE) as a cost function to minimize errors.',
        highlights: [
          'Formula: Y = m * X + C',
          'Cost Function: 1/N * sum((Y_actual - Y_predicted)^2)',
        ],
      },
    },
    {
      id: 2,
      title: 'Logistic Regression & Sigmoid',
      study: {
        heading: 'Logistic Regression',
        content:
          'Logistic Regression is used for binary classification. It calculates class probabilities by feeding the linear combination of inputs into the Sigmoid curve.',
        code: `# Sigmoid / Logistic Function
import numpy as np
def sigmoid(z):
    return 1 / (1 + np.exp(-z))`,
      },
    },
  ],

  'Decision Trees & Random Forests': [
    {
      id: 1,
      title: 'Decision Tree Splitting',
      study: {
        heading: 'Decision Tree Splitting Criteria',
        content:
          'Decision trees partition features based on boundary splits that maximize Information Gain. We measure node impurity using formulas like Gini Impurity or Entropy.',
        highlights: [
          'Entropy measures uncertainty in the subset',
          'Gini Impurity checks class diversity in split samples',
        ],
      },
    },
    {
      id: 2,
      title: 'Random Forest Ensembles',
      study: {
        heading: 'Random Forest Ensembles',
        content:
          'A single decision tree overfits easily. Random Forests resolve this by training hundreds of individual trees on random bootstrapped subsets of the data and taking the majority vote.',
        code: `# Random Forest ensemble mock
predictions = [tree.predict(X_test) for tree in forest]
majority_vote = max(set(predictions), key=predictions.count)`,
      },
    },
  ],

  'Support Vector Machines (SVM)': [
    {
      id: 1,
      title: 'Margin Maximization',
      study: {
        heading: 'Maximum Margin Hyperplanes',
        content:
          "SVM attempts to draw a boundary (hyperplane) that is as far as possible from the nearest training points of each class. These nearest points are called 'support vectors'.",
        highlights: [
          'Margin: Distance between border and support vectors',
          'Hard Margin: Linear separation',
          'Soft Margin: Allows some misclassification',
        ],
      },
    },
    {
      id: 2,
      title: 'The Kernel Trick',
      study: {
        heading: 'The Kernel Trick',
        content:
          'When data is not linearly separable in its original space, SVM uses kernel functions to project features into a higher-dimensional space where a linear boundary can be drawn.',
        code: `# Radial Basis Function (RBF) Kernel mock
def rbf_kernel(x1, x2, gamma=0.1):
    return np.exp(-gamma * np.linalg.norm(x1 - x2)**2)`,
      },
    },
  ],

  'K-Means Clustering': [
    {
      id: 1,
      title: 'Centroid Partitioning',
      study: {
        heading: 'Centroid-Based Grouping',
        content:
          "K-Means groups data points into 'K' clusters. It initializes K random center points (centroids), assigns points to their nearest centroid, recalculates the centroid coordinates, and repeats until convergence.",
        highlights: [
          'Distance Metric: Usually Euclidean Distance',
          "Elbow Method: Tool to choose optimal 'K' cluster counts",
        ],
      },
    },
    {
      id: 2,
      title: 'K-Means Convergence',
      study: {
        heading: 'Convergence Logic',
        content:
          'The algorithm stops running when centroids no longer move significantly or when a max iteration count is reached.',
        code: `# Recalculate centroids formula
def update_centroids(points, labels, k):
    return np.array([points[labels == i].mean(axis=0) for i in range(k)])`,
      },
    },
  ],
};

// ─── Learning Paths card definitions (used by LearningPaths component) ───────

export const learningPaths = [
  {
    id: 1,
    name: 'Machine Learning Foundations',
    color:
      'bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400',
    progress: 0,
  },
  {
    id: 2,
    name: 'Deep Learning & Neural Nets',
    color:
      'bg-purple-100 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400',
    progress: 0,
  },
  {
    id: 3,
    name: 'Natural Language Processing',
    color:
      'bg-green-100 dark:bg-green-950/40 text-green-600 dark:text-green-400',
    progress: 0,
  },
  {
    id: 4,
    name: 'Computer Vision',
    color: 'bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400',
    progress: 0,
  },
  {
    id: 5,
    name: 'Reinforcement Learning',
    color:
      'bg-cyan-100 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400',
    progress: 0,
  },
  {
    id: 6,
    name: 'Generative AI & LLMs',
    color:
      'bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400',
    progress: 0,
  },
];

// ─── Popular Tracks card definitions (used by PopularTracks component) ───────

export const popularTracks = [
  {
    id: 1,
    title: 'Linear & Logistic Regression',
    description:
      'Learn parameter optimization, gradient descent, and cost function minimization.',
    time: '2 hours',
    lessons: 12,
    tag: 'Regression',
    color:
      'bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/50',
  },
  {
    id: 2,
    title: 'Decision Trees & Random Forests',
    description:
      'Master entropy, information gain, and ensemble bagging algorithms.',
    time: '4 hours',
    lessons: 20,
    tag: 'Trees/Forests',
    color:
      'bg-green-100 dark:bg-green-950/40 text-green-600 dark:text-green-400 border-green-200 dark:border-green-900/50',
  },
  {
    id: 3,
    title: 'Support Vector Machines (SVM)',
    description:
      'Understand margin maximization, support vectors, and kernel tricks.',
    time: '3 hours',
    lessons: 15,
    tag: 'Classification',
    color:
      'bg-purple-100 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-900/50',
  },
  {
    id: 4,
    title: 'K-Means Clustering',
    description:
      'Dive into unsupervised learning, distance metrics, and centroid optimization.',
    xp: 300,
    time: '3 hours',
    lessons: 14,
    tag: 'Clustering',
    color:
      'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900/50',
  },
];

// ─── Accessor Functions ──────────────────────────────────────────────────────

/**
 * Get topics for a specific course.
 * @param {string} courseName
 * @returns {Array} Array of topic objects (id, title, study)
 */
export function getTopics(courseName) {
  return topicsData[courseName] || [];
}

/**
 * Get all topics across all courses.
 * @returns {Object} Full topicsData map
 */
export function getAllTopics() {
  return topicsData;
}

/**
 * Get learning path card definitions.
 * @returns {Array}
 */
export function getLearningPaths() {
  return learningPaths;
}

/**
 * Get popular track card definitions.
 * @returns {Array}
 */
export function getPopularTracks() {
  return popularTracks;
}
