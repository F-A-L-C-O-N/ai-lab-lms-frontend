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
        YT_link: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
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
        YT_link: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
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
        YT_link: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
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
        YT_link: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
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
        YT_link: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
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
        YT_link: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
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
        YT_link: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
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
        YT_link: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
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
        YT_link: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
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

  'Python Programming': [
    {
      id: 1,
      title: 'Python Fundamentals',
      study: {
        heading: 'Python Fundamentals',
        content: 'Python is a high-level, interpreted programming language known for its readability and simplicity. It supports multiple programming paradigms, including object-oriented, imperative, and functional programming.',
        YT_link: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      },
      subtopics: [
        {
          id: '1.1',
          title: 'Introduction',
          heading: 'Introduction to Python',
          content: 'Python was created by Guido van Rossum and released in 1991. Its design philosophy emphasizes code readability, and its syntax allows programmers to express concepts in fewer lines of code than in languages like C++ or Java.',
          YT_link: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          code: `# Hello World in Python
print("Hello, World!")`
        },
        {
          id: '1.2',
          title: 'Variables',
          heading: 'Python Variables & Assignment',
          content: 'Variables are containers for storing data values. In Python, variables are created when you assign a value to them. You do not need to declare their type, and they can change type dynamically.',
          YT_link: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          code: `# Variable assignment examples
x = 5
y = "John"
print(x)
print(y)`,
          subsubtopics: [
            {
              id: '1.2.1',
              title: 'Declaration & Assignment',
              heading: 'Variable Declaration & Assignment',
              content: 'In Python, a variable is created the moment you first assign a value to it. There is no declaration keyword like var, let, or const.',
              YT_link: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
              code: `x = 5
y = "Hello"
print(x, y)`
            },
            {
              id: '1.2.2',
              title: 'Dynamic Typing',
              heading: 'Dynamic Typing in Python',
              content: 'Python is dynamically typed. This means you do not need to specify the type of a variable when you declare it, and variables can change type even after they have been set.',
              YT_link: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
              code: `x = 100      # x is an int
x = "changed"  # x is now a str
print(x)`
            },
            {
              id: '1.2.3',
              title: 'Naming Rules',
              heading: 'Python Variable Naming Rules',
              content: 'Variable names can be short (like x and y) or more descriptive (age, carname, total_volume). Rules for Python variables:\n- Must start with a letter or underscore\n- Cannot start with a number\n- Can only contain alpha-numeric characters and underscores (A-z, 0-9, and _)\n- Are case-sensitive',
              YT_link: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
              code: `# Valid names
my_name = "Alice"
_id = 99

# Invalid names (will raise SyntaxError)
# 2name = "Bob"
# my-id = 100`
            }
          ]
        },
        {
          id: '1.3',
          title: 'Operators',
          heading: 'Python Operators',
          content: 'Operators are used to perform operations on variables and values. Python divides operators into groups: Arithmetic (+, -, *, /), Assignment (=, +=, -=), Comparison (==, !=, >, <), and Logical (and, or, not).',
          YT_link: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          code: `# Operator examples
a = 10
b = 3
print(a + b)  # Arithmetic: 13
print(a > b)  # Comparison: True
print(a > 5 and b < 5)  # Logical: True`,
          subsubtopics: [
            {
              id: '1.3.1',
              title: 'Arithmetic Operators',
              heading: 'Arithmetic Operators',
              content: 'Arithmetic operators are used with numeric values to perform common mathematical operations (+, -, *, /, %, **, //).',
              YT_link: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
              code: `a = 10
b = 3
print(a / b)   # Division: 3.3333333333333335
print(a // b)  # Floor Division: 3
print(a % b)   # Modulus: 1
print(a ** b)  # Exponentiation: 1000`
            },
            {
              id: '1.3.2',
              title: 'Comparison Operators',
              heading: 'Comparison Operators',
              content: 'Comparison operators are used to compare two values, returning a Boolean value (True or False) based on the result.',
              YT_link: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
              code: `x = 5
y = 10
print(x == y)  # False
print(x != y)  # True
print(x < y)   # True`
            },
            {
              id: '1.3.3',
              title: 'Logical Operators',
              heading: 'Logical Operators',
              content: 'Logical operators are used to combine conditional statements (and, or, not).',
              YT_link: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
              code: `x = 5
print(x > 3 and x < 10)  # True
print(x > 10 or x < 4)   # False
print(not(x > 3 and x < 10))  # False`
            }
          ]
        },
        {
          id: '1.4',
          title: 'Keywords',
          heading: 'Python Keywords',
          content: 'Keywords are reserved words in Python that have special meanings and purposes. They cannot be used as variable names, function names, or any other identifiers.',
          YT_link: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          code: `# List of common keywords
is_active = True
if is_active:
    print("Keyword 'True' is used here")`
        },
        {
          id: '1.5',
          title: 'Datatypes',
          heading: 'Python Data Types',
          YT_link: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          code: `# Data type examples
name = "Alice"      # str
age = 25            # int
fruits = ["apple", "banana"]  # list
person = {"name": "Alice"}    # dict
print(type(name))
print(type(fruits))`,
          subsubtopics: [
            {
              id: '1.5.1',
              title: 'Numeric Types',
              heading: 'Python Numeric Types',
              content: 'There are three distinct numeric types in Python: int (integers), float (floating-point numbers), and complex (complex numbers). They are created when a value is assigned to a variable.',
              YT_link: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
              code: `x = 1    # int
y = 2.8  # float
z = 1j   # complex
print(type(x), type(y), type(z))`
            },
            {
              id: '1.5.2',
              title: 'Sequence Types',
              heading: 'Python Lists and Tuples',
              YT_link: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
              code: `my_list = ["apple", "banana", "cherry"]
my_tuple = ("apple", "banana", "cherry")
my_list[0] = "strawberry"  # Works!
# my_tuple[0] = "strawberry" # Raises TypeError!
print(my_list, my_tuple)`
            },
            {
              id: '1.5.3',
              title: 'Mapping Types',
              heading: 'Python Dictionaries',
              content: 'Dictionaries are used to store data values in key:value pairs. A dictionary is a collection which is ordered, changeable, and does not allow duplicates.',
              YT_link: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
              code: `thisdict = {
  "brand": "Ford",
  "model": "Mustang",
  "year": 1964
}
print(thisdict["brand"])
print(thisdict.get("model"))`
            }
          ]
        }
      ]
    }
  ]
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
  {
    id: 7,
    name: 'Python Programming',
    color: 'bg-yellow-100 dark:bg-yellow-950/40 text-yellow-600 dark:text-yellow-400',
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
