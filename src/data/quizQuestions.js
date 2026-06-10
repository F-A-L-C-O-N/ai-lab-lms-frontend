/**
 * quizQuestions.js
 * Quiz question data for all course topics.
 * Keyed by course name → step id → array of quiz question objects.
 */

// ─── Quiz Questions (keyed by course name → step id → questions) ─────────────

export const quizData = {
  'Machine Learning Foundations': {
    1: [
      {
        question: 'What is the primary goal of Supervised Learning?',
        options: [
          'To group unlabeled data points together',
          'To learn a mapping from inputs to outputs based on labeled training data',
          'To maximize rewards through trial-and-error interactions',
          'To reduce the dimensionality of the input features',
        ],
        answerIndex: 1,
        explanation:
          'Supervised Learning uses labeled input-output pairs to learn a function that maps new inputs to their corresponding outputs.',
      },
      {
        question:
          'Which of the following is a classic classification problem?',
        options: [
          'Predicting house prices based on square footage',
          'Predicting the temperature for tomorrow',
          'Predicting whether an email is spam or not spam',
          'Grouping customers by purchasing habits',
        ],
        answerIndex: 2,
        explanation:
          'Predicting spam vs. not spam is a binary classification problem. Predicting continuous values like prices or temperatures are regression tasks.',
      },
    ],
    2: [
      {
        question: 'What does min-max normalization do to a feature?',
        options: [
          'Rescales the values to have a mean of 0 and variance of 1',
          'Rescales the values to fit within a range of [0, 1]',
          'Replaces all negative values with zero',
          'Groups values into discrete bins',
        ],
        answerIndex: 1,
        explanation:
          'Min-Max normalization rescales the data features linearly to a standard range, typically between 0 and 1.',
      },
      {
        question:
          'Which of the following code snippets correctly implements Standardization (Z-score normalization) to scale data to have a mean of 0 and a standard deviation of 1?',
        options: [
          'scaled = (data - np.min(data)) / (np.max(data) - np.min(data))',
          'scaled = (data - np.mean(data)) / np.std(data)',
          'scaled = data / np.max(data)',
          'scaled = np.log1p(data)',
        ],
        answerIndex: 1,
        explanation:
          'Standardization (Z-score normalization) rescales data by subtracting the mean and dividing by the standard deviation: (x - mean) / std.',
      },
    ],
    3: [
      {
        question: "In Machine Learning, what is 'overfitting'?",
        options: [
          'When a model performs exceptionally well on both training and unseen testing data',
          'When a model performs poorly on training data but well on testing data',
          'When a model learns training data noise too well, resulting in poor generalization to new data',
          'When the dataset is too small to fit the model parameters',
        ],
        answerIndex: 2,
        explanation:
          'Overfitting occurs when a model fits the training data too closely, learning its random noise rather than the underlying pattern, leading to high validation error.',
      },
    ],
  },

  'Deep Learning & Neural Nets': {
    1: [
      {
        question:
          'What is the primary function of weights in a perceptron?',
        options: [
          'To normalize the input features',
          'To determine the strength of the input signal',
          'To add a constant offset to the weighted sum',
          'To compute the error of the output',
        ],
        answerIndex: 1,
        explanation:
          "Weights determine how much influence each input feature has on the perceptron's final sum.",
      },
    ],
    2: [
      {
        question:
          'Which activation function outputs values between 0 and 1?',
        options: [
          'ReLU (Rectified Linear Unit)',
          'Tanh (Hyperbolic Tangent)',
          'Sigmoid',
          'Leaky ReLU',
        ],
        answerIndex: 2,
        explanation:
          'The Sigmoid function maps any real value to the range [0, 1], which is very useful for estimating probabilities in binary classification.',
      },
    ],
    3: [
      {
        question:
          'What algorithm is used to calculate the gradient of the loss function in neural networks?',
        options: [
          'K-Means',
          'Backpropagation',
          'Gradient Boosting',
          'Principal Component Analysis',
        ],
        answerIndex: 1,
        explanation:
          'Backpropagation uses the chain rule of calculus to compute the gradient of the loss function with respect to all the weights in the network.',
      },
    ],
  },

  'Natural Language Processing': {
    1: [
      {
        question: 'What is tokenization in NLP?',
        options: [
          'Converting words into dense numerical vectors',
          'Removing grammar punctuation from sentences',
          'Splitting a text stream into individual words, phrases, or symbols',
          'Determining if a sentence is positive or negative',
        ],
        answerIndex: 2,
        explanation:
          'Tokenization is the first step in text preprocessing, where a string of text is broken down into smaller semantic units (tokens) such as words.',
      },
    ],
    2: [
      {
        question:
          'Which neural network architecture introduced the Self-Attention mechanism?',
        options: [
          'Convolutional Neural Networks (CNNs)',
          'Recurrent Neural Networks (RNNs)',
          'Transformers',
          'Autoencoders',
        ],
        answerIndex: 2,
        explanation:
          "Transformers, introduced in the paper 'Attention Is All You Need', rely entirely on Self-Attention to model relations between words regardless of distance.",
      },
    ],
  },

  'Linear & Logistic Regression': {
    1: [
      {
        question:
          'What optimization algorithm is commonly used to minimize the cost function in Linear Regression?',
        options: [
          'K-Nearest Neighbors',
          'Gradient Descent',
          'Random Forest',
          "Dijkstra's Algorithm",
        ],
        answerIndex: 1,
        explanation:
          'Gradient Descent is an iterative optimization algorithm used to find the minimum of the cost function by taking steps in the direction of steepest descent.',
      },
    ],
    2: [
      {
        question:
          'Which function maps linear predictions to a range between 0 and 1 in Logistic Regression?',
        options: [
          'Linear activation',
          'Sigmoid function',
          'Softmax function',
          'Step function',
        ],
        answerIndex: 1,
        explanation:
          'Logistic regression uses the Sigmoid function to squish linear output values into probabilities between 0 and 1.',
      },
    ],
  },

  'Decision Trees & Random Forests': {
    1: [
      {
        question:
          'Which metric is used to measure impurity in a node of a Decision Tree?',
        options: [
          'Mean Squared Error',
          'Cosine Similarity',
          'Gini Impurity (or Entropy)',
          'Euclidean Distance',
        ],
        answerIndex: 2,
        explanation:
          'Gini Impurity and Entropy are standard metrics used in decision trees to evaluate how mixed/unpure the labels are in a split node.',
      },
    ],
    2: [
      {
        question:
          "What does 'bagging' (Bootstrap Aggregating) in Random Forests mean?",
        options: [
          'Grouping test data before inference',
          'Training multiple decision trees on random subsets of the data with replacement',
          'Sequentially correction of tree errors',
          'Pruning leaf nodes to reduce size',
        ],
        answerIndex: 1,
        explanation:
          'Bagging trains independent trees on bootstrap samples of the training dataset to reduce variance and prevent overfitting.',
      },
    ],
  },

  'Support Vector Machines (SVM)': {
    1: [
      {
        question:
          'What is the primary objective of a Support Vector Machine?',
        options: [
          'To group cluster centroids',
          'To find the hyperplane that maximizes the margin between different classes',
          'To sequentially boost classification accuracy',
          'To compress data features',
        ],
        answerIndex: 1,
        explanation:
          'SVM maps data to high-dimensional space to find a decision boundary (hyperplane) that provides the widest margin between the classes.',
      },
    ],
    2: [
      {
        question: 'Why do we use the Kernel Trick in SVM?',
        options: [
          'To decrease feature dimensionality',
          'To find linear boundaries in a projected higher-dimensional space',
          'To run the clustering faster',
          'To perform bagging ensembles',
        ],
        answerIndex: 1,
        explanation:
          'The kernel trick maps non-linearly separable data into a higher-dimensional space where it can be linearly separated.',
      },
    ],
  },

  'K-Means Clustering': {
    1: [
      {
        question:
          'Is K-Means Clustering a supervised or unsupervised learning algorithm?',
        options: [
          'Supervised',
          'Unsupervised',
          'Semi-supervised',
          'Reinforcement Learning',
        ],
        answerIndex: 1,
        explanation:
          'K-Means does not require labeled target values; it groups data points solely based on feature similarities (unsupervised).',
      },
    ],
    2: [
      {
        question:
          'When does the K-Means algorithm reach convergence?',
        options: [
          'When labels are randomized',
          'When centroids no longer change their positions significantly',
          'When the elbow value reaches infinity',
          'When classification accuracy hits 100%',
        ],
        answerIndex: 1,
        explanation:
          'K-Means converges when updating centroids results in no change in data cluster assignments (centroids stop moving).',
      },
    ],
  },
};

// ─── Accessor Functions ──────────────────────────────────────────────────────

/**
 * Get quiz questions for a specific step within a course.
 * @param {string} courseName
 * @param {number} stepId
 * @returns {Array} Array of quiz question objects
 */
export function getQuizQuestions(courseName, stepId) {
  const courseQuizzes = quizData[courseName];
  if (!courseQuizzes) return [];
  return courseQuizzes[stepId] || [];
}

/**
 * Get all quiz data across all courses.
 * @returns {Object} Full quizData map
 */
export function getAllQuizQuestions() {
  return quizData;
}
