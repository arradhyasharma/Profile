
"use strict";

document.addEventListener("DOMContentLoaded", function () {

    // =====================================================
    // MATHLAB V1 — APPLICATION CONTROLLER
    // Learn, Labs, Experiments, Practice, Challenges,
    // Formula Library and Progress
    // =====================================================

    const mainContent = document.getElementById("main-content");

    if (!mainContent) {
        console.error("MathLab: #main-content was not found.");
        return;
    }

    const STORAGE_KEY = "mathlab_dashboard_v2";
    const LEGACY_STORAGE_KEY = "mathlab_dashboard_v1";

    const curriculum = window.MATHLAB_CLASS9_CURRICULUM;

    const state = {
        activeTool: "labs",
        challengeSettings: { minutes: 5, count: 5, difficulty: "all", points: 10 },
        challenge: null,
        challengeTimer: null,
        practiceQuestion: null,
        practiceAnswered: false,
        practiceHintShown: false,
        coinResult: null
    };


    // =====================================================
    // HTML SAFETY
    // =====================================================

    function escapeHTML(value) {
        return String(value).replace(/[&<>"']/g, function (character) {
            return {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#039;"
            }[character];
        });
    }


    // =====================================================
    // DATE HELPERS
    // =====================================================

    function getTodayKey() {
        const now = new Date();

        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");

        return year + "-" + month + "-" + day;
    }

    function formatDate(dateString) {
        if (!dateString) return "Unknown date";

        const parts = dateString.split("-");

        if (parts.length !== 3) return dateString;

        const date = new Date(
            Number(parts[0]),
            Number(parts[1]) - 1,
            Number(parts[2])
        );

        return date.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });
    }


    // =====================================================
    // LOCAL STORAGE AND PROGRESS
    // =====================================================

    function createEmptyStats() {
        return {
            topicsOpened: [],
            lastTopic: "",
            challengesCompleted: 0,
            completedChallengeDates: [],
            activity: [],
            challengeHistory: [],
            practiceAnswered: 0,
            practiceCorrect: 0,
            labExperiments: 0
        };
    }

    function readStats() {
        try {
            let saved = localStorage.getItem(STORAGE_KEY);

            // Import progress from the previous app version.
            if (!saved) {
                saved = localStorage.getItem(LEGACY_STORAGE_KEY);
            }

            if (!saved) {
                return createEmptyStats();
            }

            const data = JSON.parse(saved);

            if (!data || typeof data !== "object") {
                return createEmptyStats();
            }

            return {
                topicsOpened: Array.isArray(data.topicsOpened)
                    ? data.topicsOpened
                    : [],

                lastTopic: typeof data.lastTopic === "string"
                    ? data.lastTopic
                    : "",

                challengesCompleted:
                    Number(data.challengesCompleted) || 0,

                completedChallengeDates:
                    Array.isArray(data.completedChallengeDates)
                        ? data.completedChallengeDates
                        : [],

                activity: Array.isArray(data.activity)
                    ? data.activity.slice(0, 20)
                    : [],

                challengeHistory:
                    Array.isArray(data.challengeHistory)
                        ? data.challengeHistory.slice(0, 20)
                        : [],

                practiceAnswered:
                    Number(data.practiceAnswered) || 0,

                practiceCorrect:
                    Number(data.practiceCorrect) || 0,

                labExperiments:
                    Number(data.labExperiments) || 0
            };

        } catch (error) {
            console.warn("MathLab could not read saved progress.", error);
            return createEmptyStats();
        }
    }

    const stats = readStats();

    function saveStats() {
        try {
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(stats)
            );

            return true;

        } catch (error) {
            console.warn("MathLab could not save progress.", error);
            return false;
        }
    }

    function recordActivity(title, description) {
        stats.activity.unshift({
            title: title,
            description: description,
            date: getTodayKey()
        });

        stats.activity = stats.activity.slice(0, 20);

        saveStats();
    }


    // =====================================================
    // CONNECT WITH THE EXISTING LEARN MODULE
    // =====================================================

    window.MathLabAppContext = {
        stats: stats,
        recordActivity: recordActivity
    };


    // =====================================================
    // QUESTION BANK
    // Starter practice questions, not an official
    // chapter-wise syllabus question bank.
    // =====================================================

    const questionBank = [

        {
            chapterId: "orienting-yourself-coordinates",
            question: "In which quadrant does the point (4, -3) lie?",
            answer: "IV",
            accepted: ["fourth", "quadrant IV"],
            hint: "The x-coordinate is positive and the y-coordinate is negative.",
            explanation: "Positive x and negative y coordinates place a point in Quadrant IV."
        },

        {
            chapterId: "introduction-to-linear-polynomials",
            question: "Find the value of 3x + 2 when x = 4.",
            answer: "14",
            hint: "Substitute 4 for x.",
            explanation: "3 × 4 + 2 = 12 + 2 = 14."
        },

        {
            chapterId: "the-world-of-numbers",
            question: "What is the square root of 81?",
            answer: "9",
            hint: "Which number multiplied by itself gives 81?",
            explanation: "9 × 9 = 81, so the square root is 9."
        },

        {
            chapterId: "exploring-algebraic-identities",
            question: "Complete the identity: (a + b)² = ?",
            answer: "a² + 2ab + b²",
            accepted: [
                "a^2+2ab+b^2",
                "a²+2ab+b²",
                "a2+2ab+b2"
            ],
            hint: "Multiply (a + b) by (a + b).",
            explanation: "(a + b)² = a² + 2ab + b²."
        },

        {
            chapterId: "circles",
            question: "A circle has a radius of 6 cm. What is its diameter in cm?",
            answer: "12",
            hint: "Diameter is twice the radius.",
            explanation: "Diameter = 2 × radius = 2 × 6 = 12 cm."
        },

        {
            chapterId: "measuring-space-perimeter-and-area",
            question: "A square has a side length of 7 cm. Find its perimeter in cm.",
            answer: "28",
            hint: "A square has four equal sides.",
            explanation: "Perimeter = 4 × side = 4 × 7 = 28 cm."
        },

        {
            chapterId: "introduction-to-probability",
            question: "A fair coin is tossed once. What is the probability of getting heads?",
            answer: "1/2",
            accepted: ["0.5", "50%", "1 / 2"],
            hint: "There are two equally likely outcomes.",
            explanation: "There is one favourable outcome out of two equally likely outcomes."
        },

        {
            chapterId: "sequences-and-progressions",
            question: "Find the next number: 4, 7, 10, 13, __.",
            answer: "16",
            hint: "Look at the difference between consecutive terms.",
            explanation: "Each term increases by 3, so the next term is 16."
        },

        {
            chapterId: "propositions-and-converses",
            question: "True or false: If a number is divisible by 4, it is even.",
            answer: "true",
            accepted: ["yes"],
            hint: "Every multiple of 4 is also a multiple of 2.",
            explanation: "The statement is true because every integer divisible by 4 is divisible by 2."
        },

        {
            chapterId: "understanding-data",
            question: "Find the mean of 5, 7 and 9.",
            answer: "7",
            hint: "Add the values and divide by the number of values.",
            explanation: "(5 + 7 + 9) ÷ 3 = 21 ÷ 3 = 7."
        },

        {
            chapterId: "quadrilaterals",
            question: "What is the sum of the interior angles of a quadrilateral?",
            answer: "360",
            accepted: ["360°", "360 degrees"],
            hint: "A quadrilateral can be divided into two triangles.",
            explanation: "The interior angle sum is 360°."
        },

        {
            chapterId: "two-variables-one-line",
            question: "If x + y = 10 and x = 4, find y.",
            answer: "6",
            hint: "Subtract 4 from both sides.",
            explanation: "4 + y = 10, so y = 6."
        },

        {
            chapterId: "surface-area-and-volume",
            question: "Find the volume of a cube with side length 3 cm.",
            answer: "27",
            hint: "Volume of a cube = side × side × side.",
            explanation: "3 × 3 × 3 = 27 cubic centimetres."
        },
        { chapterId: "circles", question: "Find the circumference of a circle with radius 7 cm. Use π = 22/7.", answer: "44", accepted: ["44 cm"], hint: "Use C = 2πr.", explanation: "C = 2 × 22/7 × 7 = 44 cm." },
        { chapterId: "circles", question: "A circle has diameter 18 cm. Find its radius.", answer: "9", accepted: ["9 cm"], hint: "Radius is half the diameter.", explanation: "r = d/2 = 18/2 = 9 cm." },
        { chapterId: "circles", question: "Find the area of a circle of radius 3 cm in terms of π.", answer: "9π", accepted: ["9pi"], hint: "Use A = πr².", explanation: "A = π × 3² = 9π cm²." },
        { chapterId: "quadrilaterals", question: "Find the area of a rectangle of length 9 cm and breadth 4 cm.", answer: "36", hint: "Area = length × breadth.", explanation: "A = 9 × 4 = 36 cm²." },
        { chapterId: "quadrilaterals", question: "A square has side 6 cm. Find its perimeter.", answer: "24", hint: "Perimeter = 4 × side.", explanation: "P = 4 × 6 = 24 cm." },
        { chapterId: "measuring-space-perimeter-and-area", question: "Find the area of a triangle with base 12 cm and height 5 cm.", answer: "30", hint: "Area = ½ × base × height.", explanation: "A = ½ × 12 × 5 = 30 cm²." },
        { chapterId: "measuring-space-perimeter-and-area", question: "Find the area of an equilateral triangle with side 4 cm, to 2 decimal places.", answer: "6.93", accepted: ["4sqrt3", "4√3"], hint: "Use A = √3a²/4.", explanation: "A = √3 × 16/4 = 4√3 ≈ 6.93 cm²." },
        { chapterId: "introduction-to-probability", question: "A fair die is rolled. What is the probability of getting a number greater than 4?", answer: "1/3", accepted: ["2/6"], hint: "Favourable outcomes are 5 and 6.", explanation: "There are 2 favourable outcomes out of 6: 2/6 = 1/3." },
        { chapterId: "understanding-data", question: "Find the median of 2, 8, 4, 6, 10.", answer: "6", hint: "Arrange the values first.", explanation: "Ordered data: 2, 4, 6, 8, 10. The middle value is 6." },
        { chapterId: "understanding-data", question: "Find the mode of 3, 5, 5, 7, 8.", answer: "5", hint: "Which value occurs most often?", explanation: "5 occurs twice; every other value occurs once. Mode = 5." },
        { chapterId: "sequences-and-progressions", question: "Find the common difference of 11, 15, 19, 23, …", answer: "4", hint: "Subtract a term from the next term.", explanation: "15 − 11 = 4, so the common difference is 4." },
        { chapterId: "sequences-and-progressions", question: "Find the 5th term of the GP 3, 6, 12, 24, …", answer: "48", hint: "Multiply each term by 2.", explanation: "The common ratio is 2. The fifth term is 24 × 2 = 48." },
        { chapterId: "two-variables-one-line", question: "Which ordered pair satisfies x + y = 7: (2, 5) or (3, 5)?", answer: "(2,5)", accepted: ["2,5"], hint: "Substitute each pair into the equation.", explanation: "2 + 5 = 7, whereas 3 + 5 = 8. So (2, 5) is a solution." },
        { chapterId: "the-world-of-numbers", question: "Is √49 rational or irrational? Answer rational or irrational.", answer: "rational", hint: "Evaluate the square root.", explanation: "√49 = 7 = 7/1, so it is rational." },
        { chapterId: "world-of-algorithms", question: "An algorithm must have a finite number of steps. True or false?", answer: "true", accepted: ["yes"], hint: "An algorithm must eventually stop.", explanation: "True. A valid algorithm terminates after a finite number of steps." },
        { chapterId: "introduction-to-linear-polynomials", question: "Solve 5x − 7 = 18. Find x.", answer: "5", hint: "Add 7 to both sides, then divide by 5.", explanation: "5x − 7 = 18 → 5x = 25 → x = 5." },
        { chapterId: "exploring-algebraic-identities", question: "Evaluate 99² using an identity.", answer: "9801", hint: "Use (100 − 1)².", explanation: "99² = (100−1)² = 10000 − 200 + 1 = 9801." },
        { chapterId: "measuring-space-perimeter-and-area", question: "Find the area of a triangle with sides 5 cm, 6 cm and 7 cm using Heron's formula, to 2 decimal places.", answer: "14.70", accepted: ["14.7"], hint: "First find the semi-perimeter s = (5+6+7)/2.", explanation: "s = 9. Area = √[9(9−5)(9−6)(9−7)] = √216 ≈ 14.70 cm²." },
        { chapterId: "sequences-and-progressions", question: "Find the 10th term of the AP 3, 7, 11, 15, …", answer: "39", hint: "Use aₙ = a + (n−1)d.", explanation: "a = 3, d = 4. a₁₀ = 3 + 9×4 = 39." },
        { chapterId: "sequences-and-progressions", question: "Find the 6th term of the GP 5, 10, 20, 40, …", answer: "160", hint: "Use aₙ = arⁿ⁻¹ with r = 2.", explanation: "a₆ = 5 × 2⁵ = 5 × 32 = 160." }
    ];

    const mediumQuestionIds = new Set(["Find the value of 3x + 2 when x = 4.", "Find the mean of 5, 7 and 9.", "Find the area of a triangle with base 12 cm and height 5 cm.", "Find the median of 2, 8, 4, 6, 10.", "Find the common difference of 11, 15, 19, 23, …", "Find the 5th term of the GP 3, 6, 12, 24, …", "Find the circumference of a circle with radius 7 cm. Use π = 22/7.", "Find the area of an equilateral triangle with side 4 cm, to 2 decimal places."]);
    const hardQuestionIds = new Set(["Evaluate 99² using an identity.", "Find the area of a triangle with sides 5 cm, 6 cm and 7 cm using Heron's formula, to 2 decimal places.", "Find the 10th term of the AP 3, 7, 11, 15, …", "Find the 6th term of the GP 5, 10, 20, 40, …", "Solve 5x − 7 = 18. Find x."]);
    questionBank.forEach(function (question) {
        question.difficulty = hardQuestionIds.has(question.question) ? "hard" : mediumQuestionIds.has(question.question) ? "medium" : "easy";
    });


    // =====================================================
    // ANSWER CHECKING
    // =====================================================

    function normalizeAnswer(value) {
        return String(value)
            .toLowerCase()
            .replace(/\s+/g, "")
            .replace(/²/g, "^2")
            .replace(/³/g, "^3")
            .replace(/°/g, "degrees")
            .replace(/,/g, "");
    }

    function isCorrectAnswer(userAnswer, question) {
        const user = normalizeAnswer(userAnswer);

        const accepted = [
            question.answer
        ].concat(question.accepted || []);

        return accepted.some(function (answer) {
            return normalizeAnswer(answer) === user;
        });
    }

    function getQuestionChapterName(question) {
        if (!curriculum || !Array.isArray(curriculum.chapters)) {
            return "Mathematics";
        }

        const chapter = curriculum.chapters.find(function (item) {
            return item.id === question.chapterId;
        });

        return chapter ? chapter.name : "Mathematics";
    }


    // =====================================================
    // WORKSPACE NAVIGATION
    // =====================================================

    const tools = [
        { id: "labs", label: "Math Labs" },
        { id: "practice", label: "Practice" },
        { id: "challenge", label: "Challenge Mode" },
        { id: "formulas", label: "Formula Library" }
    ];

    function createWorkspaceNavigation() {
        let navigation = document.getElementById("mathlab-workspace-nav");

        if (navigation) return navigation;

        navigation = document.createElement("nav");

        navigation.id = "mathlab-workspace-nav";
        navigation.className = "mathlab-workspace-nav";
        navigation.setAttribute("aria-label", "MathLab workspace navigation");

        navigation.innerHTML = tools.map(function (tool) {
            return `
                <button
                    type="button"
                    class="workspace-tool-button"
                    data-tool="${tool.id}"
                    aria-pressed="false">
                    ${escapeHTML(tool.label)}
                </button>
            `;
        }).join("");

        const appLayout = mainContent.closest(".app-layout");
        if (appLayout) {
            appLayout.insertAdjacentElement("beforebegin", navigation);
        } else {
            mainContent.insertAdjacentElement("beforebegin", navigation);
        }
        
        return navigation;
    }

    const workspaceNavigation = createWorkspaceNavigation();

    function updateToolNavigation() {
        workspaceNavigation
            .querySelectorAll("[data-tool]")
            .forEach(function (button) {

                const active = button.dataset.tool === state.activeTool;

                button.classList.toggle("active", active);
                button.setAttribute("aria-pressed", String(active));
            });
    }


    // =====================================================
    // SHARED PAGE LAYOUT
    // =====================================================

    function pageHeader(kicker, title, description) {
        return `
            <section class="workspace-page-header">
                <p class="eyebrow">${escapeHTML(kicker)}</p>
                <h1>${escapeHTML(title)}</h1>
                <p class="welcome-description">
                    ${escapeHTML(description)}
                </p>
            </section>
        `;
    }

    function renderError(message) {
        mainContent.innerHTML = `
            <section class="workspace-empty-state" role="alert">
                <h2>Something went wrong</h2>
                <p>${escapeHTML(message)}</p>
                <button type="button" data-action="return-learn">
                    Return to Learn
                </button>
            </section>
        `;
    }


    // =====================================================
    // LEARN
    // Existing learn.js remains responsible for chapters.
    // =====================================================

    // =====================================================
    // INTERACTIVE MATH LAB — COORDINATE EXPLORER
    // =====================================================

    function getCoordinateDescription(x, y) {
        if (x === 0 && y === 0) return "The origin";

        if (x === 0) return "On the y-axis";

        if (y === 0) return "On the x-axis";

        if (x > 0 && y > 0) return "Quadrant I";

        if (x < 0 && y > 0) return "Quadrant II";

        if (x < 0 && y < 0) return "Quadrant III";

        return "Quadrant IV";
    }

    function createCoordinateGrid(x, y) {
        let lines = "";

        for (let i = -5; i <= 5; i++) {
            const position = 150 + i * 24;

            lines += `
                <line x1="${position}" y1="30"
                    x2="${position}" y2="270"
                    stroke="#d5dce5" stroke-width="1"/>

                <line x1="30" y1="${position}"
                    x2="270" y2="${position}"
                    stroke="#d5dce5" stroke-width="1"/>
            `;
        }

        const pointX = 150 + x * 24;
        const pointY = 150 - y * 24;

        return `
            <svg viewBox="0 0 300 300"
                role="img"
                aria-label="Coordinate grid showing point ${x}, ${y}"
                class="coordinate-grid">

                ${lines}

                <line x1="150" y1="20" x2="150" y2="280"
                    stroke="#334155" stroke-width="2"/>

                <line x1="20" y1="150" x2="280" y2="150"
                    stroke="#334155" stroke-width="2"/>

                <path d="M 150 15 L 145 25 L 155 25 Z"
                    fill="#334155"/>

                <path d="M 285 150 L 275 145 L 275 155 Z"
                    fill="#334155"/>

                <circle cx="${pointX}" cy="${pointY}" r="7"
                    fill="#0891b2" stroke="#ffffff" stroke-width="2"/>

                <text x="${pointX + 10}" y="${pointY - 10}"
                    font-size="11" fill="#0f172a">
                    (${x}, ${y})
                </text>

                <text x="285" y="140" font-size="11">x</text>
                <text x="160" y="17" font-size="11">y</text>
            </svg>
        `;
    }

    function renderLabs() {
        if (!window.MathLabWorkshop || typeof window.MathLabWorkshop.render !== "function") {
            renderError("The Math Labs workshop module did not load. Check the script path in index.html.");
            return;
        }
        window.MathLabWorkshop.render(mainContent);
    }

    function updateCoordinateLab() {
        const xInput = document.getElementById("coordinate-x");
        const yInput = document.getElementById("coordinate-y");

        const visual = document.getElementById("coordinate-visual");
        const description = document.getElementById("coordinate-description");

        if (!xInput || !yInput || !visual || !description) return;

        const x = Number(xInput.value);
        const y = Number(yInput.value);

        if (
            xInput.value === "" ||
            yInput.value === "" ||
            !Number.isInteger(x) ||
            !Number.isInteger(y) ||
            x < -5 || x > 5 ||
            y < -5 || y > 5
        ) {
            visual.innerHTML = `
                <p role="status">
                    Enter valid whole-number coordinates to display the point.
                </p>
            `;
        
            description.textContent =
                "Enter whole numbers between -5 and 5.";
        
            return;
        }

        visual.innerHTML = createCoordinateGrid(x, y);

        description.textContent =
            "(" + x + ", " + y + ") — " +
            getCoordinateDescription(x, y);
    }


    // =====================================================
    // GUIDED EXPERIMENT — COIN TOSS
    // =====================================================

    // =====================================================
    // PRACTICE MODE
    // =====================================================

    function selectRandomQuestion() {
        const index = Math.floor(Math.random() * questionBank.length);

        return questionBank[index];
    }

    function renderPractice() {
        if (!state.practiceQuestion) {
            state.practiceQuestion = selectRandomQuestion();
        }

        const question = state.practiceQuestion;

        let resultHTML = "";

        if (state.practiceAnswered) {
            resultHTML = `
                <div class="practice-feedback">
                    <h3>Answer checked</h3>

                    <p>
                        ${isCorrectAnswer(
                            state.lastPracticeAnswer || "",
                            question
                        )
                            ? "Correct!"
                            : "Not quite. The correct answer is " +
                                escapeHTML(question.answer) + "."}
                    </p>

                    <p>${escapeHTML(question.explanation)}</p>

                    <button type="button"
                        data-action="next-practice">
                        Next question
                    </button>
                </div>
            `;
        }

        mainContent.innerHTML = `
            <div class="workspace-page">

                ${pageHeader(
                    "PRACTICE WORKSPACE",
                    "Build problem-solving skills.",
                    "Try a question, use a hint if needed, and understand the explanation."
                )}

                <section class="workspace-panel">

                    <p class="panel-kicker">
                        ${escapeHTML(getQuestionChapterName(question))}
                    </p>

                    <h2>${escapeHTML(question.question)}</h2>

                    ${
                        state.practiceHintShown && !state.practiceAnswered
                            ? `<p class="practice-hint">${escapeHTML(question.hint)}</p>`
                            : ""
                    }

                    ${
                        state.practiceAnswered
                            ? resultHTML
                            : `
                                <form id="practice-form">

                                    <label for="practice-answer">
                                        Your answer
                                    </label>

                                    <input
                                        id="practice-answer"
                                        type="text"
                                        autocomplete="off"
                                        required>

                                    <button type="submit">
                                        Check answer
                                    </button>

                                </form>

                                <button type="button"
                                    data-action="practice-hint">
                                    Show hint
                                </button>
                            `
                    }

                </section>

            </div>
        `;
    }


    // =====================================================
    // CHALLENGE MODE
    // Five questions, five minutes, scored out of 50.
    // A hint reduces the available points for that question.
    // =====================================================

    function shuffleQuestions(count, difficulty) {
        const eligible = difficulty === "all" ? questionBank : questionBank.filter(q => q.difficulty === difficulty);
        const copy = (eligible.length ? eligible : questionBank).slice();
        for (let i = copy.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [copy[i], copy[j]] = [copy[j], copy[i]];
        }
        return copy.slice(0, Math.min(count, copy.length));
    }

    function startChallenge() {
        stopChallengeTimer();
        const minutes = Math.max(1, Math.min(60, Number(document.getElementById("challenge-minutes")?.value) || 5));
        const count = Math.max(1, Math.min(questionBank.length, Number(document.getElementById("challenge-count")?.value) || 5));
        const points = Math.max(1, Math.min(100, Number(document.getElementById("challenge-points")?.value) || 10));
        const difficulty = document.getElementById("challenge-difficulty")?.value || "all";
        state.challengeSettings = { minutes, count, difficulty, points };
        const questions = shuffleQuestions(count, difficulty);
        state.challenge = {
            questions, index: 0, score: 0, correct: 0, answered: false,
            answerCorrect: false, hintShown: false,
            remainingSeconds: minutes * 60, deadline: Date.now() + minutes * 60000,
            finished: false, timedOut: false, pointsEach: points,
            maxScore: questions.length * points
        };
        recordActivity("Started Challenge Mode", `Started a ${questions.length}-question challenge.`);
        renderChallenge();
        startChallengeTimer();
    }

    function stopChallengeTimer() {
        if (state.challengeTimer) {
            clearInterval(state.challengeTimer);
            state.challengeTimer = null;
        }
    }

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remaining = seconds % 60;

        return String(minutes).padStart(2, "0") +
            ":" +
            String(remaining).padStart(2, "0");
    }

    function updateChallengeTimer() {
        const session = state.challenge;
    
        if (!session || session.finished) return;
    
        const remainingMilliseconds = session.deadline - Date.now();
    
        session.remainingSeconds = Math.max(
            0,
            Math.ceil(remainingMilliseconds / 1000)
        );
    
        const timer = document.getElementById("challenge-timer");
    
        if (timer) {
            timer.textContent = formatTime(session.remainingSeconds);
        }
    
        if (session.remainingSeconds <= 0) {
            session.timedOut = true;
            finishChallenge();
        }
    }
    
    function startChallengeTimer() {
        stopChallengeTimer();
    
        updateChallengeTimer();
    
        if (!state.challenge || state.challenge.finished) return;
    
        state.challengeTimer = setInterval(function () {
            updateChallengeTimer();
        }, 1000);
    }

    document.addEventListener("visibilitychange", function () {
        if (!document.hidden && state.challenge && !state.challenge.finished) {
            updateChallengeTimer();
        }
    });

    function finishChallenge() {
        const session = state.challenge;
    
        if (!session || session.finished) return;
    
        session.finished = true;
    
        stopChallengeTimer();
    
        const completed =
            session.index === session.questions.length - 1 &&
            session.answered;
    
        if (completed) {
            stats.challengesCompleted += 1;
    
            if (!stats.completedChallengeDates.includes(getTodayKey())) {
                stats.completedChallengeDates.push(getTodayKey());
            }
        }
    
        stats.challengeHistory.unshift({
            date: getTodayKey(),
            score: session.score,
            correct: session.correct,
            total: session.questions.length,
            maxScore: session.maxScore,
            timedOut: session.timedOut,
            completed: completed
        });
    
        stats.challengeHistory =
            stats.challengeHistory.slice(0, 20);
    
        recordActivity(
            completed ? "Completed Challenge Mode" : "Challenge attempt ended",
            "Scored " + session.score + " out of " + session.maxScore + "." +
            (completed ? "" : " The challenge was not fully completed.")
        );
    
        renderChallenge();
    }

    function renderChallenge() {
        const session = state.challenge;

        if (!session) {
            mainContent.innerHTML = `
                <div class="workspace-page">

                    ${pageHeader(
                        "TEST YOUR UNDERSTANDING",
                        "Challenge Mode.",
                        "Take a timed five-question challenge using a selection of starter mathematics questions."
                    )}

                    <section class="workspace-panel">

                        <h2>Configure your challenge</h2>
                        <div class="challenge-settings">
                            <label>Time limit <select id="challenge-minutes"><option value="1">1 minute</option><option value="3">3 minutes</option><option value="5" selected>5 minutes</option><option value="10">10 minutes</option><option value="15">15 minutes</option><option value="30">30 minutes</option></select></label>
                            <label>Number of questions <select id="challenge-count"><option>5</option><option>10</option><option>15</option><option>20</option><option>25</option></select></label>
                            <label>Difficulty <select id="challenge-difficulty"><option value="all">Mixed</option><option value="easy">Easy</option><option value="medium">Medium</option><option value="hard">Hard</option></select></label>
                            <label>Points per question <select id="challenge-points"><option>5</option><option selected>10</option><option>15</option><option>20</option><option>25</option><option>50</option></select></label>
                        </div>
                        <p class="challenge-config-note">Maximum score is calculated automatically. The selected difficulty filters the question bank; if fewer questions exist at that level than requested, the challenge uses all available questions at that level. A hint halves the points for that question.</p>
                        <button type="button" data-action="start-challenge">Start Challenge</button>

                    </section>

                    <section class="workspace-panel">
                        <h2>Previous attempts</h2>
                        ${renderChallengeHistory()}
                    </section>

                </div>
            `;

            return;
        }

        if (session.finished) {
            mainContent.innerHTML = `
                <div class="workspace-page">

                    ${pageHeader(
                        "CHALLENGE RESULTS",
                        session.timedOut ? "Time is up." : "Challenge completed.",
                        "Review your result and decide what to practise next."
                    )}

                    <section class="workspace-panel">

                        <h2>Your score</h2>

                        <p class="challenge-final-score">
                            ${session.score} / ${session.maxScore}
                        </p>

                        <p>
                            Correct answers:
                            ${session.correct} / ${session.questions.length}
                        </p>

                        <p>
                            ${
                                session.timedOut
                                    ? "The timer reached zero."
                                    : "You completed all five questions."
                            }
                        </p>

                        <button type="button"
                            data-action="restart-challenge">
                            Try another challenge
                        </button>

                    </section>

                    <section class="workspace-panel">
                        <h2>Previous attempts</h2>
                        ${renderChallengeHistory()}
                    </section>

                </div>
            `;

            return;
        }

        const question = session.questions[session.index];

        const questionNumber = session.index + 1;

        mainContent.innerHTML = `
            <div class="workspace-page">

                ${pageHeader(
                    "CHALLENGE MODE",
                    "Think carefully. Solve clearly.",
                    "Question " + questionNumber + " of " + session.questions.length
                )}

                <section class="workspace-panel">

                    <div class="challenge-status-row">

                        <span>
                            Question ${questionNumber}/${session.questions.length}
                        </span>

                        <strong id="challenge-timer">
                            ${formatTime(session.remainingSeconds)}
                        </strong>

                        <span>
                            Score: ${session.score}/${session.maxScore}
                        </span>

                    </div>

                    <p class="panel-kicker">
                        ${escapeHTML(getQuestionChapterName(question))}
                    </p>

                    <h2>${escapeHTML(question.question)}</h2>

                    ${
                        session.hintShown
                            ? `<p class="practice-hint">${escapeHTML(question.hint)}</p>`
                            : ""
                    }

                    ${
                        session.answered
                            ? `
                                <div class="challenge-feedback">

                                    <h3>
                                        ${session.answerCorrect ? "Correct!" : "Incorrect"}
                                    </h3>

                                    <p>${escapeHTML(question.explanation)}</p>

                                    <p>
                                        Correct answer:
                                        <strong>${escapeHTML(question.answer)}</strong>
                                    </p>

                                    <button type="button"
                                        data-action="next-challenge">
                                        ${
                                            questionNumber === session.questions.length
                                                ? "Finish challenge"
                                                : "Next question"
                                        }
                                    </button>

                                </div>
                            `
                            : `
                                <form id="challenge-answer-form">

                                    <label for="challenge-answer">
                                        Your answer
                                    </label>

                                    <input
                                        id="challenge-answer"
                                        type="text"
                                        autocomplete="off"
                                        required>

                                    <button type="submit">
                                        Submit answer
                                    </button>

                                </form>

                                <button type="button"
                                    data-action="challenge-hint">
                                    Use a hint
                                </button>
                            `
                    }

                </section>

            </div>
        `;
    }

    function renderChallengeHistory() {
        if (!stats.challengeHistory.length) {
            return "<p>No challenge attempts recorded yet.</p>";
        }

        return `
            <div class="challenge-history">
                ${stats.challengeHistory.map(function (item) {
                    return `
                        <div class="activity-item">
                            <div>
                                <strong>
                                    ${item.score}/${item.maxScore || item.total * 10} points
                                </strong>

                                <p>
                                    ${formatDate(item.date)}
                                    · ${item.correct}/${item.total} correct
                                </p>
                            </div>
                        </div>
                    `;
                }).join("")}
            </div>
        `;
    }


    // =====================================================
    // FORMULA LIBRARY
    // Starter reference list, not an exhaustive syllabus.
    // =====================================================

    const formulas = [

        {
            chapterId: "circles",
            name: "Diameter of a circle",
            formula: "d = 2r",
            description: "Diameter is twice the radius."
        },

        {
            chapterId: "circles",
            name: "Circumference of a circle",
            formula: "C = 2πr",
            description: "Circumference in terms of radius."
        },

        {
            chapterId: "measuring-space-perimeter-and-area",
            name: "Perimeter of a rectangle",
            formula: "P = 2(l + b)",
            description: "Twice the sum of length and breadth."
        },

        {
            chapterId: "measuring-space-perimeter-and-area",
            name: "Area of a rectangle",
            formula: "A = l × b",
            description: "Length multiplied by breadth."
        },

        {
            chapterId: "measuring-space-perimeter-and-area",
            name: "Area of a square",
            formula: "A = a²",
            description: "Side multiplied by itself."
        },

        {
            chapterId: "quadrilaterals",
            name: "Interior angle sum of a quadrilateral",
            formula: "360°",
            description: "The interior angles add up to 360 degrees."
        },

        {
            chapterId: "exploring-algebraic-identities",
            name: "Square of a sum",
            formula: "(a + b)² = a² + 2ab + b²",
            description: "A standard algebraic identity."
        },

        {
            chapterId: "exploring-algebraic-identities",
            name: "Square of a difference",
            formula: "(a - b)² = a² - 2ab + b²",
            description: "A standard algebraic identity."
        },

        {
            chapterId: "exploring-algebraic-identities",
            name: "Difference of two squares",
            formula: "a² - b² = (a - b)(a + b)",
            description: "Factorisation identity."
        },

        {
            chapterId: "surface-area-and-volume",
            name: "Volume of a cube",
            formula: "V = a³",
            description: "Side multiplied by itself three times."
        },

        {
            chapterId: "surface-area-and-volume",
            name: "Volume of a cuboid",
            formula: "V = l × b × h",
            description: "Length multiplied by breadth and height."
        },

        {
            chapterId: "introduction-to-probability",
            name: "Basic probability",
            formula: "P(E) = Favourable outcomes / Total equally likely outcomes",
            description: "For a finite set of equally likely outcomes."
        }

    ];

    function renderFormulaResults(searchTerm) {
        const term = String(searchTerm || "").toLowerCase();
    
        const filtered = formulas.filter(function (item) {
            return (
                item.name.toLowerCase().includes(term) ||
                item.formula.toLowerCase().includes(term) ||
                item.description.toLowerCase().includes(term) ||
                getQuestionChapterName({ chapterId: item.chapterId })
                    .toLowerCase()
                    .includes(term)
            );
        });
    
        if (!filtered.length) {
            return "<p>No matching formulas found.</p>";
        }
    
        return filtered.map(function (item) {
            return `
                <article class="formula-card">
    
                    <p class="panel-kicker">
                        ${escapeHTML(getQuestionChapterName({
                            chapterId: item.chapterId
                        }))}
                    </p>
    
                    <h3>${escapeHTML(item.name)}</h3>
    
                    <p class="formula-expression">
                        ${escapeHTML(item.formula)}
                    </p>
    
                    <p>${escapeHTML(item.description)}</p>
    
                </article>
            `;
        }).join("");
    }
    
    function renderFormulas(searchTerm) {
        mainContent.innerHTML = `
            <div class="workspace-page">
    
                ${pageHeader(
                    "MATHEMATICS REFERENCE",
                    "Formula Library.",
                    "Search a starter collection of mathematical formulas and their meanings."
                )}
    
                <section class="workspace-panel">
    
                    <label for="formula-search">
                        Search formulas
                    </label>
    
                    <input
                        id="formula-search"
                        type="search"
                        placeholder="Search by formula or chapter..."
                        value="${escapeHTML(searchTerm || "")}">
    
                    <div id="formula-results">
                        ${renderFormulaResults(searchTerm)}
                    </div>
    
                    <p class="learn-source-note">
                        This is a starter reference collection, not a complete
                        or official chapter-wise formula list.
                    </p>
    
                </section>
    
            </div>
        `;
    }


    // =====================================================
    // PROGRESS DASHBOARD
    // =====================================================

    // =====================================================
    // TOOL RENDERING
    // =====================================================

    function renderTool(toolName, updateHistory) {
        const validTool = tools.some(function (tool) {
            return tool.id === toolName;
        });
    
        if (!validTool) {
            toolName = "labs";
        }
    
        state.activeTool = toolName;
    
        updateToolNavigation();
    
        if (updateHistory !== false) {
            const nextHash = toolToHash[toolName];
    
            if (nextHash && location.hash !== nextHash) {
                history.pushState(
                    { mathlabTool: toolName },
                    "",
                    nextHash
                );
            }
        }
    
        try {
            switch (toolName) {
                case "labs":
                    renderLabs();
                    break;
                case "practice":
                    renderPractice();
                    break;
                case "challenge":
                    renderChallenge();
                    break;
                case "formulas":
                    renderFormulas("");
                    break;
                default:
                    state.activeTool = "labs";
                    updateToolNavigation();
                    renderLabs();
            }
    
        } catch (error) {
            console.error("MathLab rendering error:", error);
            renderError("This section could not be displayed. Please try again.");
        }
    
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    

}
    // =====================================================
    // CLICK EVENTS
    // =====================================================

    document.addEventListener("click", function (event) {
        const target = event.target;

        if (!target || typeof target.closest !== "function") {
            return;
        }

        // Internal workspace navigation.
        const toolButton = target.closest("[data-tool]");

        if (toolButton) {
            event.preventDefault();
            renderTool(toolButton.dataset.tool);
            return;
        }

        // Temporary compatibility with the previous index.html.
        const oldPageLink = target.closest("[data-page]");

        if (oldPageLink) {
            const page = oldPageLink.dataset.page;

            const mapping = {
                dashboard: "labs",
                learn: "labs",
                labs: "labs",
                practice: "practice",
                challenges: "challenge",
                formulas: "formulas",
                about: "labs"
            };

            if (mapping[page]) {
                event.preventDefault();
                renderTool(mapping[page]);
                return;
            }
        }

        const actionButton = target.closest("[data-action]");

        if (!actionButton) return;

        const action = actionButton.dataset.action;

        if (action === "return-learn") {
            renderTool("labs");
            return;
        }

        if (action === "start-challenge" ||
            action === "restart-challenge") {
            startChallenge();
            return;
        }

        if (action === "challenge-hint") {
            if (state.challenge && !state.challenge.answered) {
                state.challenge.hintShown = true;
                renderChallenge();
            }
            return;
        }

        if (action === "next-challenge") {
            const session = state.challenge;

            if (!session) return;

            if (session.index >= session.questions.length - 1) {
                finishChallenge();
            } else {
                session.index++;
                session.answered = false;
                session.answerCorrect = false;
                session.hintShown = false;
                renderChallenge();
            }

            return;
        }

        if (action === "practice-hint") {
            state.practiceHintShown = true;
            renderPractice();
            return;
        }

        if (action === "next-practice") {
            state.practiceQuestion = selectRandomQuestion();
            state.practiceAnswered = false;
            state.practiceHintShown = false;
            state.lastPracticeAnswer = "";
            renderPractice();
            return;
        }

    });


    // =====================================================
    // FORM SUBMISSION
    // =====================================================

    mainContent.addEventListener("submit", function (event) {
        const form = event.target;

        if (form.id === "challenge-answer-form") {
            event.preventDefault();

            const input = document.getElementById("challenge-answer");
            const session = state.challenge;
            
            if (!input || !session || session.answered || session.finished) return;
            
            // Check the deadline before accepting an answer.
            updateChallengeTimer();
            
            if (session.finished) return;

            const question = session.questions[session.index];
            const answer = input.value.trim();

            if (!answer) return;

            const correct = isCorrectAnswer(answer, question);

            session.answered = true;
            session.answerCorrect = correct;

            if (correct) {
                session.correct++;

                session.score += session.hintShown ? Math.ceil(session.pointsEach / 2) : session.pointsEach;
            }

            renderChallenge();
            return;
        }

        if (form.id === "practice-form") {
            event.preventDefault();

            const input = document.getElementById("practice-answer");

            if (!input || state.practiceAnswered) return;

            const answer = input.value.trim();

            if (!answer) return;

            const question = state.practiceQuestion;
            const correct = isCorrectAnswer(answer, question);

            state.practiceAnswered = true;
            state.lastPracticeAnswer = answer;

            stats.practiceAnswered++;

            if (correct) {
                stats.practiceCorrect++;
            }

            recordActivity(
                correct ? "Solved a practice question" : "Attempted a practice question",
                getQuestionChapterName(question)
            );

            renderPractice();
        }
    });


    // =====================================================
    // LIVE INPUT EVENTS
    // =====================================================

    mainContent.addEventListener("input", function (event) {
        const target = event.target;

        if (target.id === "formula-search") {
            const results = document.getElementById("formula-results");
            if (results) results.innerHTML = renderFormulaResults(target.value);
        }
    });


    // =====================================================
    // HASH / INITIAL NAVIGATION
    // =====================================================
    const hashToTool = {
        "#labs": "labs", "#learn": "labs", "#practice": "practice",
        "#challenges": "challenge", "#formulas": "formulas"
    };
    const toolToHash = { labs: "#labs", practice: "#practice", challenge: "#challenges", formulas: "#formulas" };
    function syncToolFromLocation() {
        const requested = hashToTool[location.hash] || "labs";
        if (requested !== state.activeTool) renderTool(requested, false);
    }
    window.addEventListener("popstate", syncToolFromLocation);
    window.addEventListener("hashchange", syncToolFromLocation);
    if (!hashToTool[location.hash]) history.replaceState(null, "", "#labs");
    renderTool(hashToTool[location.hash] || "labs", false);
    console.log("MathLab workshop initialized.");

});
