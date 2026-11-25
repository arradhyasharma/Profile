# MathLab

**An interactive mathematics learning platform for Class 9 CBSE students.**

MathLab is a web-based educational project designed to make mathematics easier to understand through structured lessons, solved examples, practice questions, formulas, challenges, and an AI-powered tutor.

The goal is not just to help students find answers, but to help them understand the concepts behind those answers.

## Project Overview

MathLab brings multiple mathematics learning resources together in one platform:

- **Chapter-wise learning:** Structured content covering the Class 9 mathematics syllabus.
- **Concept explanations:** Clear explanations of mathematical ideas.
- **Solved examples:** Step-by-step examples demonstrating mathematical methods.
- **Practice questions:** Questions to strengthen understanding and problem-solving.
- **Formula library:** A collection of important mathematical formulas.
- **Practice challenges:** Activities designed to encourage logical thinking.
- **AI Tutor:** An AI-powered assistant that helps students understand mathematical concepts and questions.
- **Offline learning backup:** Built-in backup material for selected lessons when the online AI Tutor is unavailable.

## Curriculum

MathLab currently follows a 14-topic Class 9 mathematics curriculum:

1. Orienting Yourself: The Use of Coordinates
2. Introduction to Linear Polynomials
3. The World of Numbers
4. Exploring Algebraic Identities
5. I'm Up and Down, and Round and Round (Circles)
6. Measuring Space: Perimeter and Area
7. Understanding Probability
8. Sequences and Progressions
9. Propositions and Their Converses
10. Understanding Data
11. Algorithms
12. Exploring Quadrilaterals
13. Two Variables, One Line
14. Surface Area and Volume

## AI Integration and Usage

Artificial intelligence has been used in different parts of the MathLab project, both as a student learning tool and as a development assistant.

### 1. Google Gemini — AI Tutor

Google Gemini is integrated into MathLab to power the online AI Tutor.

The AI Tutor is designed to:

- Explain mathematical concepts.
- Help students understand questions.
- Provide learning guidance.
- Support step-by-step problem-solving.
- Respond to mathematics-related questions.

The AI Tutor communicates with Gemini through a backend API instead of exposing the Gemini API key in the public frontend.

### 2. AI-Assisted Development

Other AI tools have also been used as development assistants during the creation and improvement of MathLab.

They have supported tasks such as:

- Identifying and debugging programming errors.
- Reviewing HTML, CSS, and JavaScript.
- Suggesting improvements to website functionality.
- Helping develop and refine features.
- Improving documentation and project organization.
- Supporting troubleshooting and testing.

AI-generated suggestions were used as development assistance. Implementation decisions, code changes, and testing were handled during the development process.

**Note:** Gemini powers the AI Tutor. Other AI tools were used for development assistance; they are not necessarily integrated into the live website.

## Technology Stack

| Technology | Purpose |
|---|---|
| HTML | Website structure |
| CSS | Design and styling |
| JavaScript | Functionality and interactions |
| Google Gemini API | AI Tutor |
| Vercel | AI backend hosting |
| GitHub | Source-code management |
| GitHub Pages | Website hosting |

## Project Architecture

MathLab uses a separate frontend and backend approach.

- **Frontend:** The student-facing website.
- **Backend:** A Vercel API endpoint that communicates with Gemini.
- **Offline backup:** A separate JavaScript file containing selected lesson material.

The Gemini API key is stored securely in backend environment variables and should never be placed directly in frontend JavaScript.

## Offline Learning Backup

MathLab includes a basic offline learning backup for selected topics.

When the online AI Tutor cannot respond, students can access available backup learning material.

The backup currently contains:

- A concept explanation.
- An example.
- A practice question.
- Its answer.
- A hint.

The offline backup is a supporting feature, not a complete replacement for the AI Tutor.

## Deployment

The project uses:

- **GitHub Pages** for the frontend.
- **Vercel** for the AI Tutor backend.

**Live Website:**  
https://arradhyasharma.github.io/Profile/

## Project Goals

MathLab aims to:

1. Make mathematics easier to understand.
2. Encourage conceptual learning instead of memorization.
3. Improve independent problem-solving skills.
4. Make learning more interactive.
5. Use AI as a learning assistant rather than a substitute for understanding.
6. Provide students with accessible mathematics resources.

## Development Status

MathLab is an evolving educational project. Its features and learning content are continuously being improved through development, testing, and feedback.

Some features may have limitations, and the offline backup does not yet cover every possible student question.

## Acknowledgements

MathLab was developed with the assistance of AI tools, including:

- **Google Gemini:** Used to power the AI Tutor.
- **Other AI assistants:** Used for development support, debugging, troubleshooting, code improvement, and documentation.

---

**MathLab — Learn Mathematics. Understand Concepts. Think Beyond Answers.**
