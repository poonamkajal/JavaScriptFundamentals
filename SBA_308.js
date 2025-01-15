// The provided course information.
const CourseInfo = {
    id: 451,
    name: "Introduction to JavaScript"
};

// The provided assignment group.
const AssignmentGroup = {
    id: 12345,
    name: "Fundamentals of JavaScript",
    course_id: 451,
    group_weight: 25,
    assignments: [
        {
            id: 1,
            name: "Declare a Variable",
            due_at: "2023-01-25",
            points_possible: 50
        },
        {
            id: 2,
            name: "Write a Function",
            due_at: "2023-02-27",
            points_possible: 150
        },
        {
            id: 3,
            name: "Code the World",
            due_at: "3156-11-15",
            points_possible: 500
        }
    ]
};

// The provided learner submission data.
const LearnerSubmissions = [
    {
        learner_id: 125,
        assignment_id: 1,
        submission: {
            submitted_at: "2023-01-25",
            score: 47
        }
    },
    {
        learner_id: 125,
        assignment_id: 2,
        submission: {
            submitted_at: "2023-02-12",
            score: 150
        }
    },
    {
        learner_id: 125,
        assignment_id: 3,
        submission: {
            submitted_at: "2023-01-25",
            score: 400
        }
    },
    {
        learner_id: 132,
        assignment_id: 1,
        submission: {
            submitted_at: "2023-01-24",
            score: 39
        }
    },
    {
        learner_id: 132,
        assignment_id: 2,
        submission: {
            submitted_at: "2023-03-07",
            score: 140
        }
    }
];

// Check if the assignment group belongs to the course.
function getLearnerData(courseInfo, assignmentGroup, learnerSubmissions) {
    try {
      // Validate AssignmentGroup belongs to CourseInfo
      if (assignmentGroup.course_id !== courseInfo.id) {
        throw new Error("AssignmentGroup course_id does not match CourseInfo id.");
      }
  
      // Validate assignments
      const assignments = assignmentGroup.assignments.filter(assignment => {
        if (typeof assignment.points_possible !== "number" || assignment.points_possible <= 0) {
          throw new Error(`Invalid points_possible for assignment ID ${assignment.id}`);
        }
        return new Date(assignment.due_at) <= new Date();
      });
  
      const results = learnerSubmissions.map(submission => {
        let totalScore = 0;
        let totalMaxPoints = 0;
        const assignmentScores = {};
  
        assignments.forEach(assignment => {
          const learnerSubmission = submission.assignment_id === assignment.id ? submission : null;
  
          if (learnerSubmission) {
            const { score, submitted_at } = learnerSubmission.submission;
            const latePenalty = new Date(submitted_at) > new Date(assignment.due_at) ? 0.9 : 1;
  
            const adjustedScore = Math.max(score * latePenalty, 0);
            const percentage = (adjustedScore / assignment.points_possible) * 100;
  
            totalScore += adjustedScore;
            totalMaxPoints += assignment.points_possible;
            assignmentScores[assignment.id] = percentage;
          }
        });
  
        const avg = totalMaxPoints > 0 ? (totalScore / totalMaxPoints) * 100 : 0;
  
        return {
          id: submission.learner_id,
          avg,
          ...assignmentScores
        };
      });
  
      return results;
    } catch (error) {
      console.error("Error processing data:", error.message);
      return [];
    }
  }
    
  console.log(getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions));
  