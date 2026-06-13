/**
 * roadmapData.js
 * Composition layer that assembles the full roadmap data structure
 * from the separated topics, quiz questions, and coding challenges.
 *
 * The exported `roadmapData` object maintains the exact same shape
 * as before so all downstream consumers (RoadmapPage, LearningPaths,
 * PopularTracks) continue to work without any changes.
 */

import { topicsData } from './topics';
import { quizData } from './quizQuestions';
import { codingData } from './codingQuestions';

/**
 * Build the roadmap data by merging topics, quizzes, and coding challenges
 * back into the unified structure that components expect:
 *
 * {
 *   'Course Name': [
 *     {
 *       id, title,
 *       study: { heading, content, highlights?, code? },
 *       quiz: [ { question, options, answerIndex, explanation } ],
 *       codingChallenge?: { description, initialCode, testCases }
 *     }
 *   ]
 * }
 */
function buildRoadmapData() {
  const result = {};

  for (const [courseName, topics] of Object.entries(topicsData)) {
    result[courseName] = topics.map((topic) => {
      const step = {
        id: topic.id,
        title: topic.title,
        study: { ...topic.study },
        subtopics: topic.subtopics
          ? topic.subtopics.map((st) => ({
              ...st,
              subsubtopics: st.subsubtopics ? st.subsubtopics.map((sst) => ({ ...sst })) : undefined,
            }))
          : undefined,
        quiz: [],
      };

      // Attach quiz questions if they exist for this step
      const courseQuizzes = quizData[courseName];
      if (courseQuizzes && courseQuizzes[topic.id]) {
        step.quiz = courseQuizzes[topic.id];
      }

      // Attach coding challenge if one exists for this step
      const courseChallenges = codingData[courseName];
      if (courseChallenges && courseChallenges[topic.id]) {
        step.codingChallenge = courseChallenges[topic.id];
      }

      return step;
    });
  }

  return result;
}

export const roadmapData = buildRoadmapData();
