import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../services/api";

const defaultForm = {
  skills: "JavaScript, communication, Excel",
  interests: "building apps, data, design",
  education: "undergraduate CS student",
};

function fallbackRecommendations(profile) {
  const skillList = profile.skills.split(",").map((item) => item.trim()).filter(Boolean);
  const interestList = profile.interests.split(",").map((item) => item.trim()).filter(Boolean);
  const hasData = skillList.some((skill) => /data|sql|python|analysis/i.test(skill)) || interestList.some((interest) => /data|analysis/i.test(interest));
  const hasDesign = skillList.some((skill) => /design|ui|ux|figma/i.test(skill)) || interestList.some((interest) => /design|creative|ui/i.test(interest));

  const paths = [
    {
      careerTitle: hasData ? "Data Analyst" : hasDesign ? "UX/UI Designer" : "Software Developer",
      matchScore: 92,
      reason: "Your profile matches a role that needs practical problem solving, communication, and learning agility.",
      requiredSkills: ["Technical fundamentals", "Communication", "Research", "Teamwork"],
      industryOutlook: "High demand across startups, tech companies, and service sectors.",
    },
    {
      careerTitle: hasData ? "Business Analyst" : hasDesign ? "Product Designer" : "Full-Stack Developer",
      matchScore: 88,
      reason: "This path fits your interests and current knowledge while leaving room for growth and specialization.",
      requiredSkills: ["Analysis", "Project planning", "Problem solving", "Presentation"],
      industryOutlook: "Strong long-term growth with solid entry opportunities.",
    },
    {
      careerTitle: hasData ? "Product Analyst" : hasDesign ? "Graphic Designer" : "Frontend Developer",
      matchScore: 84,
      reason: "This role balances creativity, technology, and continuous learning, which matches your profile well.",
      requiredSkills: ["Design thinking", "User experience", "Adaptability", "Learning mindset"],
      industryOutlook: "Consistently relevant in digital products and modern business teams.",
    },
  ];

  return { recommendations: paths };
}

function buildRoadmapForCareer(careerTitle) {
  const baseRoadmap = {
    "Software Developer": {
      estimatedDurationMonths: 6,
      milestones: [
        {
          stage: "Foundation",
          skillsToLearn: ["HTML/CSS", "JavaScript basics", "Git and version control"],
          recommendedCourses: ["FreeCodeCamp JavaScript", "CS50", "GitHub Guides"],
          certifications: [
            { title: "JavaScript Algorithms and Data Structures", url: "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/" },
            { title: "Meta Front-End Developer", url: "https://www.coursera.org/professional-certificates/meta-front-end-developer" },
          ],
          quiz: [
            { question: "What is the output of 2 + '2' in JavaScript?", options: ["4", "22", "NaN", "undefined"], answer: 1 },
            { question: "Which tag is used to define a clickable link in HTML?", options: ["<link>", "<a>", "<href>", "<button>"], answer: 1 },
            { question: "Which command initializes a Git repository?", options: ["git init", "git clone", "git add", "git start"], answer: 0 },
          ],
        },
        {
          stage: "Intermediate",
          skillsToLearn: ["React", "API integration", "State management"],
          recommendedCourses: ["React Tutorial", "Node.js Crash Course", "REST API Design"],
          certifications: [
            { title: "React Certification", url: "https://www.coursera.org/specializations/react-development" },
            { title: "Node.js for Beginners", url: "https://www.udemy.com/course/nodejs-the-complete-guide/" },
          ],
          quiz: [
            { question: "What hook is used to manage component state in React?", options: ["useMemo", "useState", "useEffect", "useRef"], answer: 1 },
            { question: "Which HTTP method is commonly used to send form data to create a resource?", options: ["GET", "POST", "DELETE", "PATCH"], answer: 1 },
            { question: "Which tool is commonly used to manage project dependencies?", options: ["npm", "git", "css", "html"], answer: 0 },
          ],
        },
        {
          stage: "Advanced",
          skillsToLearn: ["System design", "Testing", "Deployment and CI/CD"],
          recommendedCourses: ["System Design Primer", "CI/CD Basics", "Testing Strategies"],
          certifications: [
            { title: "AWS Cloud Practitioner", url: "https://aws.amazon.com/certification/certified-cloud-practitioner/" },
            { title: "Google Professional Cloud Architect", url: "https://cloud.google.com/learn/certification" },
          ],
          quiz: [
            { question: "Why do we use CI/CD pipelines?", options: ["To remove code", "To automate testing and deployment", "To create HTML", "To write CSS"], answer: 1 },
            { question: "Which is a typical API testing tool?", options: ["Postman", "Excel", "Paint", "Notepad"], answer: 0 },
            { question: "What does scalability mean for software?", options: ["It looks better", "It handles growth in users and work", "It needs no code", "It is only for design"], answer: 1 },
          ],
        },
      ],
    },
    "Data Analyst": {
      estimatedDurationMonths: 5,
      milestones: [
        {
          stage: "Foundation",
          skillsToLearn: ["Excel", "Statistics", "SQL basics"],
          recommendedCourses: ["Excel for Data Analysis", "SQL for Data Analytics"],
          certifications: [
            { title: "Google Data Analytics", url: "https://www.coursera.org/professional-certificates/google-data-analytics" },
            { title: "SQL Certification", url: "https://www.sqlcourse.com/" },
          ],
          quiz: [
            { question: "Which function is commonly used to calculate the average in Excel?", options: ["SUM", "AVERAGE", "COUNT", "MIN"], answer: 1 },
            { question: "Which SQL keyword is used to filter rows?", options: ["WHERE", "SELECT", "FROM", "JOIN"], answer: 0 },
            { question: "What does SQL stand for?", options: ["Structured Query Language", "Simple Query Logic", "System Query List", "Standard Query Language"], answer: 0 },
          ],
        },
        {
          stage: "Intermediate",
          skillsToLearn: ["Power BI", "Data cleaning", "Dashboard design"],
          recommendedCourses: ["Power BI Training", "Data Visualization Essentials"],
          certifications: [
            { title: "Microsoft PL-300", url: "https://learn.microsoft.com/en-us/certifications/exams/pl-300" },
            { title: "Tableau Certification", url: "https://www.tableau.com/learn/certification" },
          ],
          quiz: [
            { question: "What is the purpose of a dashboard?", options: ["To clean code", "To present data clearly", "To write SQL", "To create websites"], answer: 1 },
            { question: "Which chart is useful for showing trends over time?", options: ["Bar chart", "Line chart", "Pie chart", "Scatter plot"], answer: 1 },
            { question: "What is a primary purpose of data cleaning?", options: ["Remove errors and inconsistencies", "Hide data", "Delete files", "Design pages"], answer: 0 },
          ],
        },
      ],
    },
    "UX/UI Designer": {
      estimatedDurationMonths: 4,
      milestones: [
        {
          stage: "Foundation",
          skillsToLearn: ["UI basics", "Color theory", "Figma"],
          recommendedCourses: ["Figma Essentials", "Design Fundamentals"],
          certifications: [
            { title: "Google UX Design", url: "https://www.coursera.org/professional-certificates/google-ux-design" },
            { title: "Adobe Design Fundamentals", url: "https://www.adobe.com/creativecloud.html" },
          ],
          quiz: [
            { question: "What does UX stand for?", options: ["User Experience", "User Example", "Universal Exchange", "User Extension"], answer: 0 },
            { question: "Which tool is popular for interface design?", options: ["Figma", "Excel", "SQL", "Git"], answer: 0 },
            { question: "What is the goal of a good design?", options: ["Make it colorful only", "Solve user problems clearly", "Use more text", "Ignore usability"], answer: 1 },
          ],
        },
        {
          stage: "Intermediate",
          skillsToLearn: ["Wireframing", "User testing", "Prototyping"],
          recommendedCourses: ["Prototyping Bootcamp", "User Research Basics"],
          certifications: [
            { title: "UX Research Certification", url: "https://www.coursera.org/learn/ux-research" },
            { title: "Interaction Design Foundation", url: "https://www.interaction-design.org/" },
          ],
          quiz: [
            { question: "What is a wireframe?", options: ["A finished product", "A basic layout plan", "A database", "A code file"], answer: 1 },
            { question: "Why do designers run user tests?", options: ["To improve usability", "To change the color palette", "To write code", "To delete files"], answer: 0 },
            { question: "What is a prototype used for?", options: ["Checking interactions before final build", "To handle servers", "To write SQL", "To track attendance"], answer: 0 },
          ],
        },
      ],
    },
  };

  return baseRoadmap[careerTitle] || {
    estimatedDurationMonths: 4,
    milestones: [
      {
        stage: "Foundation",
        skillsToLearn: ["Research", "Core concepts", "Basic project practice"],
        recommendedCourses: ["Career Foundations", "Beginner Learning Path"],
        certifications: [{ title: "Starter Certificate", url: "https://www.coursera.org/" }],
        quiz: [
          { question: "What is the first step in learning a new skill?", options: ["Skip theory", "Understand the basics", "Start coding immediately", "Ignore examples"], answer: 1 },
          { question: "Why is practice important?", options: ["It improves retention", "It creates confusion", "It is optional", "It reduces learning"], answer: 0 },
        ],
      },
    ],
  };
}

export default function Home() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [roadmap, setRoadmap] = useState(null);
  const [progress, setProgress] = useState({});
  const [quizState, setQuizState] = useState(null);
  const [message, setMessage] = useState("");

  const formIsValid = useMemo(() => {
    return Boolean(form.skills.trim() && form.interests.trim() && form.education.trim());
  }, [form]);

  const updateField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const submitProfile = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (!formIsValid) {
      setMessage("Please fill in skills, interests, and education.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const payload = {
        education: form.education,
        skills: form.skills.split(",").map((item) => item.trim()).filter(Boolean),
        interests: form.interests.split(",").map((item) => item.trim()).filter(Boolean),
        strengths: ["Communication", "Problem solving"],
        goals: "Build a strong and practical career path.",
      };

      const data = await apiFetch("/career/recommendations", {
        method: "POST",
        body: JSON.stringify(payload),
      }).catch(() => fallbackRecommendations({ ...payload, skills: payload.skills.join(", "), interests: payload.interests.join(", ") }));

      setResults(data.recommendations || []);
      if (data.recommendations?.[0]) {
        setSelectedCareer(data.recommendations[0]);
        setRoadmap(buildRoadmapForCareer(data.recommendations[0].careerTitle));
      }
    } catch (error) {
      const fallback = fallbackRecommendations({ skills: form.skills, interests: form.interests, education: form.education });
      setResults(fallback.recommendations || []);
      setSelectedCareer(fallback.recommendations?.[0] || null);
      setRoadmap(fallback.recommendations?.[0] ? buildRoadmapForCareer(fallback.recommendations[0].careerTitle) : null);
    } finally {
      setLoading(false);
    }
  };

  const showCareerRoadmap = (career) => {
    setSelectedCareer(career);
    setRoadmap(buildRoadmapForCareer(career.careerTitle));
  };

  const startQuiz = (milestoneIndex) => {
    if (!roadmap?.milestones?.[milestoneIndex]) return;
    setQuizState({ milestoneIndex, answers: {}, currentQuestion: 0 });
  };

  const answerQuestion = (questionIndex, selectedIndex) => {
    setQuizState((current) => {
      if (!current) return current;
      const updatedAnswers = { ...current.answers, [questionIndex]: selectedIndex };
      return { ...current, answers: updatedAnswers };
    });
  };

  const submitQuiz = () => {
    if (!roadmap || quizState === null) return;
    const milestone = roadmap.milestones[quizState.milestoneIndex];
    const questions = milestone.quiz || [];
    let correct = 0;

    questions.forEach((question, index) => {
      if (quizState.answers[index] === question.answer) {
        correct += 1;
      }
    });

    const percentage = questions.length ? (correct / questions.length) * 100 : 0;
    const passed = percentage >= 70;

    setProgress((current) => ({
      ...current,
      [quizState.milestoneIndex]: passed,
    }));

    setMessage(
      passed
        ? `Great job! You passed the ${milestone.stage} knowledge check and can move to the next step.`
        : `You need a better score to unlock the next step. Try again after revision.`
    );

    setQuizState(null);
  };

  return (
    <section className="home-hero">
      <div className="hero-visual">
        <div className="hero-card old-hero-card">
          <p className="eyebrow small-eyebrow">AI Career Mentor · TCC 2026</p>
          <h1>Plot your career route, one verified station at a time.</h1>
          <p className="subcopy">
            Real recommendations, real course links, and practical progress — all built for students and job seekers.
          </p>

          {!isAuthenticated ? (
            <div className="auth-gate-box">
              <p>Please log in first to view and evaluate career paths.</p>
              <button className="primary-btn" onClick={() => navigate("/login")}>Go to login</button>
            </div>
          ) : (
            <>
              <div className="profile-form">
                <div className="field-group">
                  <label>Skills</label>
                  <input type="text" value={form.skills} onChange={updateField("skills")} placeholder="JavaScript, communication, Excel" />
                </div>
                <div className="field-group">
                  <label>Interests</label>
                  <input type="text" value={form.interests} onChange={updateField("interests")} placeholder="building apps, data, design" />
                </div>
                <div className="field-group">
                  <label>Education</label>
                  <input type="text" value={form.education} onChange={updateField("education")} placeholder="undergraduate CS student" />
                </div>
                <button className="primary-btn" onClick={submitProfile} disabled={loading}>
                  {loading ? "Checking profile..." : "Get recommendations"}
                </button>
              </div>

              {message && <p className="status-message">{message}</p>}
            </>
          )}
        </div>
      </div>

      {!isAuthenticated ? null : (
        <div className="results-layout">
          <div className="results-panel">
            <h2>Your career matches</h2>
            {results.length === 0 ? (
              <p className="muted-text">Fill your profile and generate recommendations to see scored career paths.</p>
            ) : (
              results.map((career) => (
                <button key={career.careerTitle} className={`career-card ${selectedCareer?.careerTitle === career.careerTitle ? "selected" : ""}`} onClick={() => showCareerRoadmap(career)}>
                  <div className="career-header">
                    <h3>{career.careerTitle}</h3>
                    <span>{career.matchScore}%</span>
                  </div>
                  <p>{career.reason}</p>
                  <small>Required skills: {(career.requiredSkills || []).join(", ")}</small>
                </button>
              ))
            )}
          </div>

          {selectedCareer && roadmap && (
            <div className="roadmap-panel">
              <h2>{selectedCareer.careerTitle}</h2>
              <p className="score-line">Match score: {selectedCareer.matchScore}%</p>

              <div className="certificate-box">
                <h3>Recommended certificates</h3>
                <ul>
                  {(roadmap.milestones || []).flatMap((item) => item.certifications || []).map((cert) => (
                    <li key={cert.title}>
                      <a href={cert.url} target="_blank" rel="noreferrer">{cert.title}</a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="steps-list">
                {(roadmap.milestones || []).map((step, index) => {
                  const completed = Boolean(progress[index]);
                  const isLocked = index > 0 && !progress[index - 1];

                  return (
                    <div key={step.stage} className={`step-item ${completed ? "done" : ""} ${isLocked ? "locked" : ""}`}>
                      <label className="step-toggle">
                        <input
                          type="checkbox"
                          checked={completed}
                          onChange={() => {
                            if (!completed && !isLocked) startQuiz(index);
                          }}
                          disabled={isLocked}
                        />
                        <span>
                          <strong>{step.stage}</strong>
                          <em>{step.skillsToLearn.join(", ")}</em>
                        </span>
                      </label>

                      <div className="step-meta">
                        <p>Courses: {step.recommendedCourses.join(", ")}</p>
                        <button className="small-btn" onClick={() => startQuiz(index)} disabled={isLocked}>
                          {completed ? "Retake knowledge test" : "Take knowledge test"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {quizState !== null && roadmap && (
        <div className="quiz-modal">
          <div className="quiz-box">
            <h3>{roadmap.milestones[quizState.milestoneIndex].stage} knowledge test</h3>
            <div className="question-block">
              {roadmap.milestones[quizState.milestoneIndex].quiz.map((question, questionIndex) => (
                <div key={`${question.question}-${questionIndex}`} className="question-item">
                  <p>{questionIndex + 1}. {question.question}</p>
                  <div className="options-list">
                    {question.options.map((option, optionIndex) => (
                      <label key={option} className="option-row">
                        <input
                          type="radio"
                          name={`question-${questionIndex}`}
                          checked={quizState.answers[questionIndex] === optionIndex}
                          onChange={() => answerQuestion(questionIndex, optionIndex)}
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="quiz-actions">
              <button className="secondary-btn" onClick={() => setQuizState(null)}>Cancel</button>
              <button className="primary-btn" onClick={submitQuiz}>Submit test</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
