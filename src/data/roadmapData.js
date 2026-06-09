export const roadmapData = {
  'Machine Learning Foundations': [
    {
      id: 1,
      title: "Introduction to ML",
      study: {
        heading: "What is Machine Learning?",
        content: "Machine learning is a subfield of AI that enables systems to learn from data patterns instead of following explicit, hard-coded rules. Algorithms are trained on input features to predict outputs or find structures in data.",
        highlights: [
          "Supervised: Labeled target outputs",
          "Unsupervised: Grouping unlabeled patterns",
          "Reinforcement: Trial-and-error rewards"
        ]
      },
      quiz: [
        {
          question: "What is the primary goal of Supervised Learning?",
          options: [
            "To group unlabeled data points together",
            "To learn a mapping from inputs to outputs based on labeled training data",
            "To maximize rewards through trial-and-error interactions",
            "To reduce the dimensionality of the input features"
          ],
          answerIndex: 1,
          explanation: "Supervised Learning uses labeled input-output pairs to learn a function that maps new inputs to their corresponding outputs."
        },
        {
          question: "Which of the following is a classic classification problem?",
          options: [
            "Predicting house prices based on square footage",
            "Predicting the temperature for tomorrow",
            "Predicting whether an email is spam or not spam",
            "Grouping customers by purchasing habits"
          ],
          answerIndex: 2,
          explanation: "Predicting spam vs. not spam is a binary classification problem. Predicting continuous values like prices or temperatures are regression tasks."
        }
      ]
    },
    {
      id: 2,
      title: "Data Preprocessing",
      study: {
        heading: "Feature Engineering & Preprocessing",
        content: "Data in the real world is messy. To train high-quality models, we must preprocess it. This involves normalizing values, handling missing fields, and converting strings into numbers.",
        code: `# Feature Scaling Example (Python)
import numpy as np
def min_max_normalize(data):
    return (data - np.min(data)) / (np.max(data) - np.min(data))`
      },
      codingChallenge: {
        description: "Write a Python function `minMaxNormalize(data)` that takes a list of numbers and returns a new list with values scaled to the range [0, 1] using Min-Max scaling. If all elements in the list are equal, return a list of zeros.",
        initialCode: "def minMaxNormalize(data):\n    # Write your code here\n    pass",
        testCases: [
          { input: [1, 2, 3, 4, 5], expected: [0, 0.25, 0.5, 0.75, 1] },
          { input: [10, 20, 30], expected: [0, 0.5, 1] },
          { input: [5, 5, 5], expected: [0, 0, 0] }
        ]
      },
      quiz: [
        {
          question: "What does min-max normalization do to a feature?",
          options: [
            "Rescales the values to have a mean of 0 and variance of 1",
            "Rescales the values to fit within a range of [0, 1]",
            "Replaces all negative values with zero",
            "Groups values into discrete bins"
          ],
          answerIndex: 1,
          explanation: "Min-Max normalization rescales the data features linearly to a standard range, typically between 0 and 1."
        },
        {
          question: "Which of the following code snippets correctly implements Standardization (Z-score normalization) to scale data to have a mean of 0 and a standard deviation of 1?",
          options: [
            "scaled = (data - np.min(data)) / (np.max(data) - np.min(data))",
            "scaled = (data - np.mean(data)) / np.std(data)",
            "scaled = data / np.max(data)",
            "scaled = np.log1p(data)"
          ],
          answerIndex: 1,
          explanation: "Standardization (Z-score normalization) rescales data by subtracting the mean and dividing by the standard deviation: (x - mean) / std."
        }
      ]
    },
    {
      id: 3,
      title: "Model Evaluation & Overfitting",
      study: {
        heading: "Overfitting & Generalization",
        content: "In Machine Learning, we want our models to generalize well to new, unseen data. If a model fits the training data too closely, it might learn random noise instead of the general pattern.",
        highlights: [
          "Overfitting: High training accuracy, low validation accuracy",
          "Underfitting: Low training accuracy, low validation accuracy"
        ]
      },
      quiz: [
        {
          question: "In Machine Learning, what is 'overfitting'?",
          options: [
            "When a model performs exceptionally well on both training and unseen testing data",
            "When a model performs poorly on training data but well on testing data",
            "When a model learns training data noise too well, resulting in poor generalization to new data",
            "When the dataset is too small to fit the model parameters"
          ],
          answerIndex: 2,
          explanation: "Overfitting occurs when a model fits the training data too closely, learning its random noise rather than the underlying pattern, leading to high validation error."
        }
      ]
    }
  ],
  'Deep Learning & Neural Nets': [
    {
      id: 1,
      title: "The Artificial Perceptron",
      study: {
        heading: "The Artificial Perceptron",
        content: "The perceptron is the basic building block of deep learning. It multiplies inputs by weights, sums them with a bias, and passes the result through an activation function.",
        highlights: [
          "Weighted Sum: z = w1*x1 + w2*x2 + ... + b",
          "Activation Function: y = f(z)"
        ]
      },
      quiz: [
        {
          question: "What is the primary function of weights in a perceptron?",
          options: [
            "To normalize the input features",
            "To determine the strength of the input signal",
            "To add a constant offset to the weighted sum",
            "To compute the error of the output"
          ],
          answerIndex: 1,
          explanation: "Weights determine how much influence each input feature has on the perceptron's final sum."
        }
      ]
    },
    {
      id: 2,
      title: "Activation Functions",
      study: {
        heading: "Activation Functions",
        content: "Activation functions introduce non-linearity, allowing networks to learn non-linear boundaries. Common options include ReLU (returns max(0, x)), Sigmoid (squashes outputs to 0-1 range), and Tanh.",
        code: `# ReLU Activation Function
def relu(x):
    return np.maximum(0, x)`
      },
      codingChallenge: {
        description: "Write a Python function `relu(x)` that computes the Rectified Linear Unit (ReLU) activation. If x is a number, return max(0, x). If x is a list of numbers, apply ReLU to each element and return a new list.",
        initialCode: "def relu(x):\n    # Write your code here\n    pass",
        testCases: [
          { input: -5, expected: 0 },
          { input: 3, expected: 3 },
          { input: [-10, 0, 5], expected: [0, 0, 5] }
        ]
      },
      quiz: [
        {
          question: "Which activation function outputs values between 0 and 1?",
          options: [
            "ReLU (Rectified Linear Unit)",
            "Tanh (Hyperbolic Tangent)",
            "Sigmoid",
            "Leaky ReLU"
          ],
          answerIndex: 2,
          explanation: "The Sigmoid function maps any real value to the range [0, 1], which is very useful for estimating probabilities in binary classification."
        }
      ]
    },
    {
      id: 3,
      title: "Backpropagation & Loss",
      study: {
        heading: "Backpropagation",
        content: "Backpropagation computes the gradient of the loss function with respect to each weight in the network, starting from the output layer and propagating backward using the chain rule.",
        highlights: [
          "Loss function calculates prediction error",
          "Chain rule enables gradient calculation across multiple layers"
        ]
      },
      quiz: [
        {
          question: "What algorithm is used to calculate the gradient of the loss function in neural networks?",
          options: [
            "K-Means",
            "Backpropagation",
            "Gradient Boosting",
            "Principal Component Analysis"
          ],
          answerIndex: 1,
          explanation: "Backpropagation uses the chain rule of calculus to compute the gradient of the loss function with respect to all the weights in the network."
        }
      ]
    }
  ],
  'Natural Language Processing': [
    {
      id: 1,
      title: "Tokenization & Text Preprocessing",
      study: {
        heading: "The Tokenization Pipeline",
        content: "Text data must be broken down before models can ingest it. Tokenization separates text into smaller units (tokens like words or subwords), which are then converted to numerical IDs.",
        code: `# Text tokenization example
text = "Attention is all you need"
tokens = text.lower().split()
# Result: ['attention', 'is', 'all', 'you', 'need']`
      },
      codingChallenge: {
        description: "Write a Python function `tokenize(text)` that converts a string to lowercase, removes any punctuation characters (.,!?;:), and splits the text into a list of individual words (tokens). Filter out any empty tokens.",
        initialCode: "def tokenize(text):\n    # Write your code here\n    pass",
        testCases: [
          { input: "Attention is all you need!", expected: ["attention", "is", "all", "you", "need"] },
          { input: "Hello, World; NLP is fun.", expected: ["hello", "world", "nlp", "is", "fun"] }
        ]
      },
      quiz: [
        {
          question: "What is tokenization in NLP?",
          options: [
            "Converting words into dense numerical vectors",
            "Removing grammar punctuation from sentences",
            "Splitting a text stream into individual words, phrases, or symbols",
            "Determining if a sentence is positive or negative"
          ],
          answerIndex: 2,
          explanation: "Tokenization is the first step in text preprocessing, where a string of text is broken down into smaller semantic units (tokens) such as words."
        }
      ]
    },
    {
      id: 2,
      title: "Self-Attention & Transformers",
      study: {
        heading: "Self-Attention Mechanism",
        content: "Modern language models use the self-attention mechanism to weigh the importance of different words in a sentence relative to each other, maintaining contextual memory over long texts.",
        highlights: [
          "Queries (Q), Keys (K), Values (V) matrices",
          "Attention score calculated via dot-product scaling"
        ]
      },
      quiz: [
        {
          question: "Which neural network architecture introduced the Self-Attention mechanism?",
          options: [
            "Convolutional Neural Networks (CNNs)",
            "Recurrent Neural Networks (RNNs)",
            "Transformers",
            "Autoencoders"
          ],
          answerIndex: 2,
          explanation: "Transformers, introduced in the paper 'Attention Is All You Need', rely entirely on Self-Attention to model relations between words regardless of distance."
        }
      ]
    }
  ],
  'Linear & Logistic Regression': [
    {
      id: 1,
      title: "Linear Regression & MSE",
      study: {
        heading: "Linear Regression",
        content: "Linear Regression fits a straight line to data points. The formula represents a dependent variable as a combination of independent variables. We use Mean Squared Error (MSE) as a cost function to minimize errors.",
        highlights: [
          "Formula: Y = m * X + C",
          "Cost Function: 1/N * sum((Y_actual - Y_predicted)^2)"
        ]
      },
      quiz: [
        {
          question: "What optimization algorithm is commonly used to minimize the cost function in Linear Regression?",
          options: [
            "K-Nearest Neighbors",
            "Gradient Descent",
            "Random Forest",
            "Dijkstra's Algorithm"
          ],
          answerIndex: 1,
          explanation: "Gradient Descent is an iterative optimization algorithm used to find the minimum of the cost function by taking steps in the direction of steepest descent."
        }
      ]
    },
    {
      id: 2,
      title: "Logistic Regression & Sigmoid",
      study: {
        heading: "Logistic Regression",
        content: "Logistic Regression is used for binary classification. It calculates class probabilities by feeding the linear combination of inputs into the Sigmoid curve.",
        code: `# Sigmoid / Logistic Function
import numpy as np
def sigmoid(z):
    return 1 / (1 + np.exp(-z))`
      },
      codingChallenge: {
        description: "Write a Python function `sigmoid(z)` that calculates the Sigmoid activation. It maps any real-valued number to the range [0, 1] using the formula: 1 / (1 + e^-z). Return the result rounded to 4 decimal places.",
        initialCode: "def sigmoid(z):\n    # Write your code here\n    pass",
        testCases: [
          { input: 0, expected: 0.5 },
          { input: 2, expected: 0.8808 },
          { input: -2, expected: 0.1192 }
        ]
      },
      quiz: [
        {
          question: "Which function maps linear predictions to a range between 0 and 1 in Logistic Regression?",
          options: [
            "Linear activation",
            "Sigmoid function",
            "Softmax function",
            "Step function"
          ],
          answerIndex: 1,
          explanation: "Logistic regression uses the Sigmoid function to squish linear output values into probabilities between 0 and 1."
        }
      ]
    }
  ],
  'Decision Trees & Random Forests': [
    {
      id: 1,
      title: "Decision Tree Splitting",
      study: {
        heading: "Decision Tree Splitting Criteria",
        content: "Decision trees partition features based on boundary splits that maximize Information Gain. We measure node impurity using formulas like Gini Impurity or Entropy.",
        highlights: [
          "Entropy measures uncertainty in the subset",
          "Gini Impurity checks class diversity in split samples"
        ]
      },
      quiz: [
        {
          question: "Which metric is used to measure impurity in a node of a Decision Tree?",
          options: [
            "Mean Squared Error",
            "Cosine Similarity",
            "Gini Impurity (or Entropy)",
            "Euclidean Distance"
          ],
          answerIndex: 2,
          explanation: "Gini Impurity and Entropy are standard metrics used in decision trees to evaluate how mixed/unpure the labels are in a split node."
        }
      ]
    },
    {
      id: 2,
      title: "Random Forest Ensembles",
      study: {
        heading: "Random Forest Ensembles",
        content: "A single decision tree overfits easily. Random Forests resolve this by training hundreds of individual trees on random bootstrapped subsets of the data and taking the majority vote.",
        code: `# Random Forest ensemble mock
predictions = [tree.predict(X_test) for tree in forest]
majority_vote = max(set(predictions), key=predictions.count)`
      },
      codingChallenge: {
        description: "Write a Python function `calculateGini(counts)` that takes a list `[class1Count, class2Count]` representing class sample counts and returns the Gini Impurity of the node. Formula: 1 - (p1^2 + p2^2) where p1 and p2 are the proportions of class 1 and class 2. Return the result rounded to 4 decimal places.",
        initialCode: "def calculateGini(counts):\n    # Write your code here\n    pass",
        testCases: [
          { input: [5, 5], expected: 0.5 },
          { input: [10, 0], expected: 0 },
          { input: [3, 1], expected: 0.375 }
        ]
      },
      quiz: [
        {
          question: "What does 'bagging' (Bootstrap Aggregating) in Random Forests mean?",
          options: [
            "Grouping test data before inference",
            "Training multiple decision trees on random subsets of the data with replacement",
            "Sequentially correction of tree errors",
            "Pruning leaf nodes to reduce size"
          ],
          answerIndex: 1,
          explanation: "Bagging trains independent trees on bootstrap samples of the training dataset to reduce variance and prevent overfitting."
        }
      ]
    }
  ],
  'Support Vector Machines (SVM)': [
    {
      id: 1,
      title: "Margin Maximization",
      study: {
        heading: "Maximum Margin Hyperplanes",
        content: "SVM attempts to draw a boundary (hyperplane) that is as far as possible from the nearest training points of each class. These nearest points are called 'support vectors'.",
        highlights: [
          "Margin: Distance between border and support vectors",
          "Hard Margin: Linear separation",
          "Soft Margin: Allows some misclassification"
        ]
      },
      quiz: [
        {
          question: "What is the primary objective of a Support Vector Machine?",
          options: [
            "To group cluster centroids",
            "To find the hyperplane that maximizes the margin between different classes",
            "To sequentially boost classification accuracy",
            "To compress data features"
          ],
          answerIndex: 1,
          explanation: "SVM maps data to high-dimensional space to find a decision boundary (hyperplane) that provides the widest margin between the classes."
        }
      ]
    },
    {
      id: 2,
      title: "The Kernel Trick",
      study: {
        heading: "The Kernel Trick",
        content: "When data is not linearly separable in its original space, SVM uses kernel functions to project features into a higher-dimensional space where a linear boundary can be drawn.",
        code: `# Radial Basis Function (RBF) Kernel mock
def rbf_kernel(x1, x2, gamma=0.1):
    return np.exp(-gamma * np.linalg.norm(x1 - x2)**2)`
      },
      codingChallenge: {
        description: "Write a Python function `linearKernel(v1, v2)` that calculates the linear kernel (dot product) of two vectors of equal length. v1 and v2 are lists of numbers. (e.g. linearKernel([1, 2], [3, 4]) is 1*3 + 2*4 = 11)",
        initialCode: "def linearKernel(v1, v2):\n    # Write your code here\n    pass",
        testCases: [
          { input: [[1, 2], [3, 4]], expected: 11 },
          { input: [[0, 1, -1], [2, 3, 4]], expected: -1 }
        ]
      },
      quiz: [
        {
          question: "Why do we use the Kernel Trick in SVM?",
          options: [
            "To decrease feature dimensionality",
            "To find linear boundaries in a projected higher-dimensional space",
            "To run the clustering faster",
            "To perform bagging ensembles"
          ],
          answerIndex: 1,
          explanation: "The kernel trick maps non-linearly separable data into a higher-dimensional space where it can be linearly separated."
        }
      ]
    }
  ],
  'K-Means Clustering': [
    {
      id: 1,
      title: "Centroid Partitioning",
      study: {
        heading: "Centroid-Based Grouping",
        content: "K-Means groups data points into 'K' clusters. It initializes K random center points (centroids), assigns points to their nearest centroid, recalculates the centroid coordinates, and repeats until convergence.",
        highlights: [
          "Distance Metric: Usually Euclidean Distance",
          "Elbow Method: Tool to choose optimal 'K' cluster counts"
        ]
      },
      quiz: [
        {
          question: "Is K-Means Clustering a supervised or unsupervised learning algorithm?",
          options: [
            "Supervised",
            "Unsupervised",
            "Semi-supervised",
            "Reinforcement Learning"
          ],
          answerIndex: 1,
          explanation: "K-Means does not require labeled target values; it groups data points solely based on feature similarities (unsupervised)."
        }
      ]
    },
    {
      id: 2,
      title: "K-Means Convergence",
      study: {
        heading: "Convergence Logic",
        content: "The algorithm stops running when centroids no longer move significantly or when a max iteration count is reached.",
        code: `# Recalculate centroids formula
def update_centroids(points, labels, k):
    return np.array([points[labels == i].mean(axis=0) for i in range(k)])`
      },
      codingChallenge: {
        description: "Write a Python function `euclideanDistance(p1, p2)` that returns the Euclidean distance between two points in 2D space. p1 and p2 are lists of coordinate values `[x, y]`. Return the result rounded to 4 decimal places.",
        initialCode: "def euclideanDistance(p1, p2):\n    # Write your code here\n    pass",
        testCases: [
          { input: [[0, 0], [3, 4]], expected: 5 },
          { input: [[1, 1], [4, 5]], expected: 5 }
        ]
      },
      quiz: [
        {
          question: "When does the K-Means algorithm reach convergence?",
          options: [
            "When labels are randomized",
            "When centroids no longer change their positions significantly",
            "When the elbow value reaches infinity",
            "When classification accuracy hits 100%"
          ],
          answerIndex: 1,
          explanation: "K-Means converges when updating centroids results in no change in data cluster assignments (centroids stop moving)."
        }
      ]
    }
  ]
};
