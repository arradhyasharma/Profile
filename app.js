
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
        practiceSession: null,
        practiceSettings: { chapterId: "all", difficulty: "all", count: 10 },
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
            question: "Find the VOLUME of a cube with side length 3 cm. Give your answer in cm³.",
            answer: "27",
            accepted: ["27cm³", "27cm^3", "27 cubic centimetres", "27 cubic centimeters"],
            hint: "Volume of a cube = side × side × side.",
            explanation: "V = 3 × 3 × 3 = 27 cm³. (Its total surface area would be 54 cm²; that is a different quantity.)"
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
        ,
        { chapterId: "orienting-yourself-coordinates", question: "What are the coordinates of the origin?", answer: "(0,0)", accepted: ["0,0"], hint: "The origin is where the x-axis and y-axis meet.", explanation: "The origin is (0, 0): both coordinates are zero." },
        { chapterId: "orienting-yourself-coordinates", question: "A point has x = -5 and y = 2. In which quadrant is it?", answer: "II", accepted: ["2", "second", "quadrant ii"], hint: "Negative x and positive y identify one quadrant.", explanation: "x is negative and y is positive, so the point lies in Quadrant II." },
        { chapterId: "introduction-to-linear-polynomials", question: "What is the coefficient of x in 7x - 4?", answer: "7", hint: "The coefficient is the number multiplying the variable.", explanation: "7x means 7 multiplied by x, so the coefficient is 7." },
        { chapterId: "introduction-to-linear-polynomials", question: "Evaluate 2x - 5 when x = 6.", answer: "7", hint: "Replace x with 6 before calculating.", explanation: "2(6) - 5 = 12 - 5 = 7." },
        { chapterId: "the-world-of-numbers", question: "Is 0.75 rational or irrational?", answer: "rational", hint: "Can it be written as a fraction of integers?", explanation: "0.75 = 75/100 = 3/4, so it is rational." },
        { chapterId: "the-world-of-numbers", question: "Find the value of 2³ × 2².", answer: "32", hint: "When multiplying powers with the same base, add exponents.", explanation: "2³ × 2² = 2⁵ = 32." },
        { chapterId: "exploring-algebraic-identities", question: "Complete: (a - b)² = ?", answer: "a² - 2ab + b²", accepted: ["a^2-2ab+b^2"], hint: "Expand (a - b)(a - b).", explanation: "(a - b)² = a² - ab - ab + b² = a² - 2ab + b²." },
        { chapterId: "exploring-algebraic-identities", question: "Evaluate  (x + 5)(x - 5) when x = 8.", answer: "39", hint: "Use (a + b)(a - b) = a² - b².", explanation: "(8 + 5)(8 - 5) = 13 × 3 = 39. Also 8² - 5² = 64 - 25 = 39." },
        { chapterId: "circles", question: "A circle has diameter 14 cm. Find its circumference using π = 22/7.", answer: "44", accepted: ["44cm"], hint: "Use C = πd.", explanation: "C = (22/7) × 14 = 44 cm." },
        { chapterId: "circles", question: "A sector is one-quarter of a circle. What is its central angle?", answer: "90", accepted: ["90°", "90 degrees"], hint: "A full circle is 360°.", explanation: "360° ÷ 4 = 90°." },
        { chapterId: "measuring-space-perimeter-and-area", question: "Find the area of a parallelogram with base 8 cm and height 5 cm.", answer: "40", accepted: ["40cm2", "40cm²"], hint: "Area = base × perpendicular height.", explanation: "A = 8 × 5 = 40 cm²." },
        { chapterId: "measuring-space-perimeter-and-area", question: "A trapezium has parallel sides 6 cm and 10 cm, and height 4 cm. Find its area.", answer: "32", hint: "Area = ½ × (sum of parallel sides) × height.", explanation: "A = ½ × (6 + 10) × 4 = ½ × 16 × 4 = 32 cm²." },
        { chapterId: "introduction-to-probability", question: "A fair die is rolled. What is the probability of getting an even number?", answer: "1/2", accepted: ["3/6", "0.5", "50%"], hint: "The even outcomes are 2, 4 and 6.", explanation: "There are 3 favourable outcomes out of 6, so P = 3/6 = 1/2." },
        { chapterId: "introduction-to-probability", question: "What is the probability of an impossible event?", answer: "0", accepted: ["zero"], hint: "An impossible event has no favourable outcomes.", explanation: "P(impossible event) = 0." },
        { chapterId: "sequences-and-progressions", question: "Find the 8th term of the AP 2, 5, 8, 11, …", answer: "23", hint: "First term is 2 and common difference is 3.", explanation: "a₈ = a + 7d = 2 + 7(3) = 23." },
        { chapterId: "sequences-and-progressions", question: "Find the common ratio of the GP 4, 12, 36, 108, …", answer: "3", hint: "Divide a term by the previous term.", explanation: "12 ÷ 4 = 3, so the common ratio is 3." },
        { chapterId: "propositions-and-converses", question: "Write the converse: If a number is divisible by 10, then it is divisible by 5.", answer: "If a number is divisible by 5, then it is divisible by 10.", accepted: ["if divisible by 5 then divisible by 10"], hint: "Swap the hypothesis and conclusion.", explanation: "The converse is formed by interchanging the condition and the result." },
        { chapterId: "propositions-and-converses", question: "True or false: The converse of a true statement is always true.", answer: "false", accepted: ["no"], hint: "Test the converse with a counterexample.", explanation: "False. A statement may be true while its converse is false." },
        { chapterId: "understanding-data", question: "Find the mode of 2, 4, 4, 5, 7, 4, 8.", answer: "4", hint: "Find the value that appears most often.", explanation: "4 occurs three times, more than any other value. Mode = 4." },
        { chapterId: "understanding-data", question: "Find the mean of 4, 6, 8 and 10.", answer: "7", hint: "Add all values and divide by 4.", explanation: "Mean = (4 + 6 + 8 + 10) ÷ 4 = 28 ÷ 4 = 7." },
        { chapterId: "world-of-algorithms", question: "Which property ensures an algorithm eventually stops?", answer: "finiteness", accepted: ["finite steps", "finite"], hint: "An algorithm cannot continue forever.", explanation: "Finiteness means an algorithm completes after a limited number of steps." },
        { chapterId: "world-of-algorithms", question: "In an algorithm, what is a sequence of clear instructions called?", answer: "steps", accepted: ["instructions"], hint: "An algorithm is made up of ordered actions.", explanation: "An algorithm is a finite sequence of well-defined steps." },
        { chapterId: "quadrilaterals", question: "Find the area of a rhombus with diagonals 10 cm and 8 cm.", answer: "40", hint: "Area = ½ × product of diagonals.", explanation: "A = ½ × 10 × 8 = 40 cm²." },
        { chapterId: "quadrilaterals", question: "Find the area of a trapezium with parallel sides 5 cm and 9 cm, height 3 cm.", answer: "21", hint: "Take half the sum of the parallel sides, then multiply by height.", explanation: "A = ½ × (5 + 9) × 3 = 21 cm²." },
        { chapterId: "two-variables-one-line", question: "Does (2, 3) satisfy 2x + y = 7? Answer yes or no.", answer: "yes", accepted: ["true"], hint: "Substitute x = 2 and y = 3.", explanation: "2(2) + 3 = 4 + 3 = 7, so yes." },
        { chapterId: "two-variables-one-line", question: "If x = 0 in x + 2y = 8, find y.", answer: "4", hint: "Substitute x = 0, then divide by 2.", explanation: "0 + 2y = 8, so y = 4." },
        { chapterId: "surface-area-and-volume", question: "Find the total surface area of a cube with side 3 cm.", answer: "54", accepted: ["54cm2", "54cm²"], hint: "A cube has 6 square faces.", explanation: "TSA = 6a² = 6 × 3² = 6 × 9 = 54 cm²." },
        { chapterId: "surface-area-and-volume", question: "Find the volume of a cuboid of length 5 cm, breadth 3 cm and height 2 cm.", answer: "30", accepted: ["30cm3", "30cm³"], hint: "Volume = length × breadth × height.", explanation: "V = 5 × 3 × 2 = 30 cm³." }
    ];


    // Additional curated question bank: 67 more questions (128 total).
    const additionalQuestionBank = [
    {
        "chapterId": "orienting-yourself-coordinates",
        "question": "What is the x-coordinate of the point (-7, 3)?",
        "answer": "-7",
        "hint": "The x-coordinate is written first.",
        "explanation": "In (-7, 3), x = -7 and y = 3."
    },
    {
        "chapterId": "orienting-yourself-coordinates",
        "question": "A point lies on the x-axis. What is its y-coordinate?",
        "answer": "0",
        "hint": "Every point on the x-axis has zero vertical coordinate.",
        "explanation": "The y-coordinate of every point on the x-axis is 0."
    },
    {
        "chapterId": "orienting-yourself-coordinates",
        "question": "In which quadrant does (-4, -9) lie?",
        "answer": "III",
        "hint": "Check the signs of both coordinates.",
        "explanation": "Negative x and negative y identify Quadrant III."
    },
    {
        "chapterId": "orienting-yourself-coordinates",
        "question": "What is the reflection of (5, -2) across the x-axis?",
        "answer": "(5,2)",
        "hint": "Reflection across x-axis changes the sign of y.",
        "explanation": "The x-coordinate stays 5 and y changes from -2 to 2."
    },
    {
        "chapterId": "orienting-yourself-coordinates",
        "question": "What is the reflection of (-3, 8) across the y-axis?",
        "answer": "(3,8)",
        "hint": "Reflection across y-axis changes the sign of x.",
        "explanation": "The x-coordinate changes to 3 while y remains 8."
    },
    {
        "chapterId": "introduction-to-linear-polynomials",
        "question": "How many terms are in the polynomial 6x - 11?",
        "answer": "2",
        "hint": "Terms are separated by plus or minus signs.",
        "explanation": "The terms are 6x and -11, so there are two terms."
    },
    {
        "chapterId": "introduction-to-linear-polynomials",
        "question": "What is the constant term in 9x + 13?",
        "answer": "13",
        "hint": "The constant term has no variable.",
        "explanation": "13 has no variable, so it is the constant term."
    },
    {
        "chapterId": "introduction-to-linear-polynomials",
        "question": "Evaluate 4x + 3 when x = -2.",
        "answer": "-5",
        "hint": "Substitute -2 wherever x appears.",
        "explanation": "4(-2) + 3 = -8 + 3 = -5."
    },
    {
        "chapterId": "introduction-to-linear-polynomials",
        "question": "Solve 3x + 8 = 23. Find x.",
        "answer": "5",
        "hint": "Subtract 8 from both sides, then divide by 3.",
        "explanation": "3x + 8 = 23; 3x = 15; x = 5."
    },
    {
        "chapterId": "introduction-to-linear-polynomials",
        "question": "What is the coefficient of x in -12x + 5?",
        "answer": "-12",
        "hint": "Include the sign with the coefficient.",
        "explanation": "The coefficient multiplying x is -12."
    },
    {
        "chapterId": "the-world-of-numbers",
        "question": "Is 0 a rational number?",
        "answer": "yes",
        "accepted": [
            "true"
        ],
        "hint": "Write 0 as a fraction with a non-zero denominator.",
        "explanation": "0 = 0/1, so it is rational."
    },
    {
        "chapterId": "the-world-of-numbers",
        "question": "Express 0.25 as a fraction in simplest form.",
        "answer": "1/4",
        "hint": "Write 0.25 as 25/100 and simplify.",
        "explanation": "25/100 = 1/4."
    },
    {
        "chapterId": "the-world-of-numbers",
        "question": "What is the smallest prime number?",
        "answer": "2",
        "hint": "A prime has exactly two positive factors.",
        "explanation": "2 has factors 1 and 2 and is the smallest prime."
    },
    {
        "chapterId": "the-world-of-numbers",
        "question": "Is 1 a prime number?",
        "answer": "no",
        "accepted": [
            "false"
        ],
        "hint": "A prime number has exactly two distinct positive factors.",
        "explanation": "1 has only one positive factor, so it is not prime."
    },
    {
        "chapterId": "the-world-of-numbers",
        "question": "Evaluate (-3)².",
        "answer": "9",
        "hint": "Square means multiply the number by itself.",
        "explanation": "(-3) × (-3) = 9."
    },
    {
        "chapterId": "exploring-algebraic-identities",
        "question": "Complete: (a - b)(a + b) = ?",
        "answer": "a² - b²",
        "accepted": [
            "a^2-b^2"
        ],
        "hint": "This is the difference of two squares identity.",
        "explanation": "(a-b)(a+b) = a² + ab - ab - b² = a² - b²."
    },
    {
        "chapterId": "exploring-algebraic-identities",
        "question": "Evaluate 51² using (a+b)².",
        "answer": "2601",
        "hint": "Write 51 as 50 + 1.",
        "explanation": "(50+1)² = 50² + 2×50×1 + 1² = 2500+100+1 = 2601."
    },
    {
        "chapterId": "exploring-algebraic-identities",
        "question": "Evaluate 98 × 102 using an identity.",
        "answer": "9996",
        "hint": "Write it as (100-2)(100+2).",
        "explanation": "(100-2)(100+2) = 100² - 2² = 10000 - 4 = 9996."
    },
    {
        "chapterId": "exploring-algebraic-identities",
        "question": "Expand (x + 3)².",
        "answer": "x² + 6x + 9",
        "accepted": [
            "x^2+6x+9"
        ],
        "hint": "Use (a+b)² = a² + 2ab + b².",
        "explanation": "x² + 2(x)(3) + 3² = x² + 6x + 9."
    },
    {
        "chapterId": "exploring-algebraic-identities",
        "question": "Expand (2p - 5)².",
        "answer": "4p² - 20p + 25",
        "accepted": [
            "4p^2-20p+25"
        ],
        "hint": "Use (a-b)² = a² - 2ab + b².",
        "explanation": "(2p)² - 2(2p)(5) + 5² = 4p² - 20p + 25."
    },
    {
        "chapterId": "circles",
        "question": "A circle has radius 5 cm. Find its diameter.",
        "answer": "10",
        "hint": "Diameter is twice the radius.",
        "explanation": "d = 2r = 2×5 = 10 cm."
    },
    {
        "chapterId": "circles",
        "question": "Find the circumference of a circle with diameter 14 cm. Use π = 22/7.",
        "answer": "44",
        "hint": "Use C = πd.",
        "explanation": "C = (22/7)×14 = 44 cm."
    },
    {
        "chapterId": "circles",
        "question": "Find the area of a circle with radius 7 cm. Use π = 22/7.",
        "answer": "154",
        "hint": "Use A = πr².",
        "explanation": "A = (22/7)×7×7 = 154 cm²."
    },
    {
        "chapterId": "circles",
        "question": "A sector is half a circle. Find its central angle.",
        "answer": "180",
        "hint": "A full turn is 360 degrees.",
        "explanation": "360° ÷ 2 = 180°."
    },
    {
        "chapterId": "circles",
        "question": "A circle has circumference 31.4 cm. Using π = 3.14, find its diameter.",
        "answer": "10",
        "hint": "Rearrange C = πd to d = C/π.",
        "explanation": "d = 31.4 ÷ 3.14 = 10 cm."
    },
    {
        "chapterId": "measuring-space-perimeter-and-area",
        "question": "Find the area of a triangle with base 9 cm and perpendicular height 8 cm.",
        "answer": "36",
        "hint": "Use half the product of base and height.",
        "explanation": "A = 1/2×9×8 = 36 cm²."
    },
    {
        "chapterId": "measuring-space-perimeter-and-area",
        "question": "Find the perimeter of a triangle with sides 6 cm, 7 cm and 9 cm.",
        "answer": "22",
        "hint": "Add all three side lengths.",
        "explanation": "P = 6+7+9 = 22 cm."
    },
    {
        "chapterId": "measuring-space-perimeter-and-area",
        "question": "Find the area of an equilateral triangle with side 2 cm. Give the exact answer.",
        "answer": "√3",
        "accepted": [
            "sqrt3"
        ],
        "hint": "Use A = (√3/4)a².",
        "explanation": "A = (√3/4)×2² = √3 cm²."
    },
    {
        "chapterId": "measuring-space-perimeter-and-area",
        "question": "The semi-perimeter of a triangle is 12 cm. What is its perimeter?",
        "answer": "24",
        "hint": "Perimeter is twice the semi-perimeter.",
        "explanation": "P = 2s = 2×12 = 24 cm."
    },
    {
        "chapterId": "measuring-space-perimeter-and-area",
        "question": "Using Heron’s formula, find the area of a triangle with sides 3 cm, 4 cm and 5 cm.",
        "answer": "6",
        "hint": "First calculate s = (3+4+5)/2.",
        "explanation": "s=6; area = √[6(3)(2)(1)] = √36 = 6 cm²."
    },
    {
        "chapterId": "introduction-to-probability",
        "question": "A fair die is rolled. What is the probability of getting a 6?",
        "answer": "1/6",
        "hint": "There is one favourable face out of six.",
        "explanation": "P(6) = 1/6."
    },
    {
        "chapterId": "introduction-to-probability",
        "question": "A bag has 3 red and 2 blue balls. What is P(blue) when one ball is chosen at random?",
        "answer": "2/5",
        "hint": "Favourable blue balls = 2; total balls = 5.",
        "explanation": "P(blue) = 2/5."
    },
    {
        "chapterId": "introduction-to-probability",
        "question": "What is the probability of a certain event?",
        "answer": "1",
        "hint": "A certain event always occurs.",
        "explanation": "P(certain event) = 1."
    },
    {
        "chapterId": "introduction-to-probability",
        "question": "A die is rolled. Find the probability of getting an odd number.",
        "answer": "1/2",
        "hint": "Odd faces are 1, 3 and 5.",
        "explanation": "There are 3 favourable outcomes out of 6: 3/6 = 1/2."
    },
    {
        "chapterId": "introduction-to-probability",
        "question": "A coin is tossed 80 times and heads appears 44 times. Find experimental P(heads).",
        "answer": "11/20",
        "hint": "Divide heads count by total tosses and simplify.",
        "explanation": "P(heads) = 44/80 = 11/20."
    },
    {
        "chapterId": "sequences-and-progressions",
        "question": "Find the common difference of the AP 20, 17, 14, 11, …",
        "answer": "-3",
        "hint": "Subtract a term from the next term.",
        "explanation": "17 - 20 = -3, so d = -3."
    },
    {
        "chapterId": "sequences-and-progressions",
        "question": "Find the 7th term of the AP 2, 5, 8, 11, …",
        "answer": "20",
        "hint": "Use aₙ = a + (n-1)d.",
        "explanation": "a=2, d=3; a₇ = 2 + 6×3 = 20."
    },
    {
        "chapterId": "sequences-and-progressions",
        "question": "Find the common ratio of the GP 81, 27, 9, 3, …",
        "answer": "1/3",
        "hint": "Divide a term by the preceding term.",
        "explanation": "r = 27/81 = 1/3."
    },
    {
        "chapterId": "sequences-and-progressions",
        "question": "Find the 4th term of the GP 2, 6, 18, …",
        "answer": "54",
        "hint": "Multiply each term by the common ratio 3.",
        "explanation": "2, 6, 18, 54; the fourth term is 54."
    },
    {
        "chapterId": "sequences-and-progressions",
        "question": "Is 5, 10, 20, 40, … an AP or a GP?",
        "answer": "GP",
        "hint": "Check whether differences or ratios stay constant.",
        "explanation": "The ratio is 2 each time, so it is a GP."
    },
    {
        "chapterId": "propositions-and-converses",
        "question": "True or false: The converse of a true statement must always be true.",
        "answer": "false",
        "accepted": [
            "no"
        ],
        "hint": "A true conditional can have a false converse.",
        "explanation": "Example: divisible by 4 implies even, but even does not imply divisible by 4."
    },
    {
        "chapterId": "propositions-and-converses",
        "question": "Write the converse: If a number is divisible by 8, then it is divisible by 4.",
        "answer": "If a number is divisible by 4, then it is divisible by 8.",
        "hint": "Interchange the hypothesis and conclusion.",
        "explanation": "The converse swaps the two parts: divisible by 4 → divisible by 8."
    },
    {
        "chapterId": "propositions-and-converses",
        "question": "Is “Please close the door” a proposition?",
        "answer": "no",
        "accepted": [
            "false"
        ],
        "hint": "A proposition must be a declarative statement with a truth value.",
        "explanation": "This is a command, so it is not true or false."
    },
    {
        "chapterId": "propositions-and-converses",
        "question": "True or false: If an integer is divisible by 10, it is divisible by 5.",
        "answer": "true",
        "accepted": [
            "yes"
        ],
        "hint": "Every multiple of 10 is also a multiple of 5.",
        "explanation": "10k = 5(2k), so the statement is true."
    },
    {
        "chapterId": "propositions-and-converses",
        "question": "Give a counterexample to “If a number is even, then it is divisible by 4.”",
        "answer": "2",
        "hint": "Choose an even integer that is not a multiple of 4.",
        "explanation": "2 is even but 2 is not divisible by 4."
    },
    {
        "chapterId": "understanding-data",
        "question": "Find the mean of 4, 8, 10 and 14.",
        "answer": "9",
        "hint": "Add the values and divide by 4.",
        "explanation": "Mean = (4+8+10+14)/4 = 36/4 = 9."
    },
    {
        "chapterId": "understanding-data",
        "question": "Find the median of 3, 9, 5, 1, 7.",
        "answer": "5",
        "hint": "Arrange the data in ascending order first.",
        "explanation": "1, 3, 5, 7, 9; the middle value is 5."
    },
    {
        "chapterId": "understanding-data",
        "question": "Find the mode of 2, 3, 3, 4, 5, 3, 6.",
        "answer": "3",
        "hint": "Find the value that occurs most often.",
        "explanation": "3 occurs three times, more than any other value."
    },
    {
        "chapterId": "understanding-data",
        "question": "Find the range of 4, 12, 7, 15, 9.",
        "answer": "11",
        "hint": "Subtract the smallest value from the largest.",
        "explanation": "Range = 15 - 4 = 11."
    },
    {
        "chapterId": "understanding-data",
        "question": "If the mean of 5 numbers is 8, what is their total?",
        "answer": "40",
        "hint": "Total = mean × number of observations.",
        "explanation": "Total = 8×5 = 40."
    },
    {
        "chapterId": "world-of-algorithms",
        "question": "Which algorithm property means that it must eventually stop?",
        "answer": "finiteness",
        "accepted": [
            "finite"
        ],
        "hint": "A valid algorithm cannot run forever.",
        "explanation": "Finiteness means it terminates after a limited number of steps."
    },
    {
        "chapterId": "world-of-algorithms",
        "question": "What is the first stage in a simple input-process-output algorithm?",
        "answer": "input",
        "hint": "Identify what data is supplied before processing.",
        "explanation": "The input stage receives the data used by the algorithm."
    },
    {
        "chapterId": "world-of-algorithms",
        "question": "An algorithm adds 7 and 12. What is its output?",
        "answer": "19",
        "hint": "Add the two input values.",
        "explanation": "7 + 12 = 19."
    },
    {
        "chapterId": "world-of-algorithms",
        "question": "True or false: An algorithm should have clear and unambiguous steps.",
        "answer": "true",
        "accepted": [
            "yes"
        ],
        "hint": "Each instruction should have a definite meaning.",
        "explanation": "True. Unambiguous steps can be followed consistently."
    },
    {
        "chapterId": "quadrilaterals",
        "question": "Find the perimeter of a rectangle of length 12 cm and breadth 5 cm.",
        "answer": "34",
        "hint": "Use P = 2(l+b).",
        "explanation": "P = 2(12+5) = 34 cm."
    },
    {
        "chapterId": "quadrilaterals",
        "question": "A rhombus has diagonals 12 cm and 10 cm. Find its area.",
        "answer": "60",
        "hint": "Area of a rhombus = half the product of its diagonals.",
        "explanation": "A = 1/2×12×10 = 60 cm²."
    },
    {
        "chapterId": "quadrilaterals",
        "question": "Find the area of a parallelogram with base 11 cm and height 4 cm.",
        "answer": "44",
        "hint": "Use base × perpendicular height.",
        "explanation": "A = 11×4 = 44 cm²."
    },
    {
        "chapterId": "quadrilaterals",
        "question": "A trapezium has parallel sides 7 cm and 13 cm and height 5 cm. Find its area.",
        "answer": "50",
        "hint": "Use half the sum of parallel sides times height.",
        "explanation": "A = 1/2(7+13)×5 = 50 cm²."
    },
    {
        "chapterId": "two-variables-one-line",
        "question": "Does (3, 2) satisfy x + 2y = 7?",
        "answer": "yes",
        "accepted": [
            "true"
        ],
        "hint": "Substitute x=3 and y=2.",
        "explanation": "3 + 2(2) = 7, so yes."
    },
    {
        "chapterId": "two-variables-one-line",
        "question": "If y = 3 in 2x + y = 11, find x.",
        "answer": "4",
        "hint": "Substitute y=3 and isolate x.",
        "explanation": "2x+3=11; 2x=8; x=4."
    },
    {
        "chapterId": "two-variables-one-line",
        "question": "Which point lies on y = x + 1: (2,3) or (2,4)?",
        "answer": "(2,3)",
        "accepted": [
            "2,3"
        ],
        "hint": "Substitute x=2 into the equation.",
        "explanation": "y = 2+1 = 3, so (2,3) lies on the line."
    },
    {
        "chapterId": "two-variables-one-line",
        "question": "How many ordered pairs satisfy a linear equation in two variables (in general over real numbers)?",
        "answer": "infinitely many",
        "accepted": [
            "infinite"
        ],
        "hint": "A straight line contains infinitely many points.",
        "explanation": "Each point on the line is a solution, so there are infinitely many real ordered-pair solutions."
    },
    {
        "chapterId": "surface-area-and-volume",
        "question": "Find the volume of a cube with side 4 cm.",
        "answer": "64",
        "hint": "Volume = side³.",
        "explanation": "V = 4×4×4 = 64 cm³."
    },
    {
        "chapterId": "surface-area-and-volume",
        "question": "Find the total surface area of a cube with side 5 cm.",
        "answer": "150",
        "hint": "A cube has six square faces.",
        "explanation": "TSA = 6×5² = 6×25 = 150 cm²."
    },
    {
        "chapterId": "surface-area-and-volume",
        "question": "Find the volume of a cuboid measuring 6 cm × 4 cm × 3 cm.",
        "answer": "72",
        "hint": "Multiply length, breadth and height.",
        "explanation": "V = 6×4×3 = 72 cm³."
    },
    {
        "chapterId": "surface-area-and-volume",
        "question": "Find the lateral surface area of a cube with side 3 cm.",
        "answer": "36",
        "hint": "A cube has four lateral square faces.",
        "explanation": "LSA = 4a² = 4×9 = 36 cm²."
    },
    {
        "chapterId": "surface-area-and-volume",
        "question": "A cuboid has volume 120 cm³, length 6 cm and breadth 5 cm. Find its height.",
        "answer": "4",
        "hint": "Height = volume ÷ (length × breadth).",
        "explanation": "h = 120/(6×5) = 120/30 = 4 cm."
    }
];
    questionBank.push.apply(questionBank, additionalQuestionBank);

    const mediumQuestionIds = new Set(["Find the value of 3x + 2 when x = 4.", "Find the mean of 5, 7 and 9.", "Find the area of a triangle with base 12 cm and height 5 cm.", "Find the median of 2, 8, 4, 6, 10.", "Find the common difference of 11, 15, 19, 23, …", "Find the 5th term of the GP 3, 6, 12, 24, …", "Find the circumference of a circle with radius 7 cm. Use π = 22/7.", "Find the area of an equilateral triangle with side 4 cm, to 2 decimal places."]);
    const hardQuestionIds = new Set(["Evaluate 99² using an identity.", "Find the area of a triangle with sides 5 cm, 6 cm and 7 cm using Heron's formula, to 2 decimal places.", "Find the 10th term of the AP 3, 7, 11, 15, …", "Find the 6th term of the GP 5, 10, 20, 40, …", "Solve 5x − 7 = 18. Find x."]);
    const additionalHardPattern = /Heron|counterexample|converse|using an identity|Evaluate 51²|Evaluate 98|Expand \(|How many ordered pairs|Find the 7th term|common ratio|digit sum|divisible by both|cuboid has volume/i;
    const additionalMediumPattern = /Find |Evaluate |Solve |Complete:|Does \(|Which point lies|Find the common difference|Find the median|Find the mean|Find the mode/i;
    questionBank.forEach(function (question, index) {
        question.id = question.id || "mathlab-q-" + String(index + 1).padStart(3, "0");
        if (!question.difficulty) {
            question.difficulty = hardQuestionIds.has(question.question) || additionalHardPattern.test(question.question)
                ? "hard"
                : mediumQuestionIds.has(question.question) || additionalMediumPattern.test(question.question)
                    ? "medium"
                    : "easy";
        }
    });
    // The same question is not selected again in a new random session until
    // the unseen pool for the selected syllabus/chapter has been used up.
    const RECENT_QUESTION_KEY = "mathlab_recent_question_ids_v2";
    function readRecentQuestionIds() {
        try { return JSON.parse(localStorage.getItem(RECENT_QUESTION_KEY) || "[]"); }
        catch (error) { return []; }
    }
    function selectFreshQuestions(eligible, count) {
        const recent = new Set(readRecentQuestionIds());
        let fresh = shuffleList(eligible.filter(q => !recent.has(q.id)));
        let selected = fresh.slice(0, Math.min(count, eligible.length));
        if (selected.length < Math.min(count, eligible.length)) {
            const selectedIds = new Set(selected.map(q => q.id));
            const refill = shuffleList(eligible.filter(q => !selectedIds.has(q.id)));
            selected = selected.concat(refill.slice(0, Math.min(count, eligible.length) - selected.length));
        }
        try {
            const history = readRecentQuestionIds().concat(selected.map(q => q.id));
            localStorage.setItem(RECENT_QUESTION_KEY, JSON.stringify(history.slice(-questionBank.length)));
        } catch (error) { /* Private browsing may block storage; session still works. */ }
        return selected;
    }


    // =====================================================
    // ANSWER CHECKING
    // =====================================================

    function normalizeAnswer(value) {
        return String(value)
            .toLowerCase()
            .trim()
            .replace(/\s+/g, "")
            .replace(/²/g, "^2")
            .replace(/³/g, "^3")
            .replace(/°/g, "degrees")
            .replace(/,/g, "")
            .replace(/centimetres?/g, "cm")
            .replace(/centimeters?/g, "cm")
            .replace(/cubiccm/g, "cm^3")
            .replace(/squarecm/g, "cm^2")
            .replace(/cm3/g, "cm^3")
            .replace(/cm2/g, "cm^2");
    }

    function isCorrectAnswer(userAnswer, question) {
        const user = normalizeAnswer(userAnswer);
        const accepted = [question.answer].concat(question.accepted || []);
        if (accepted.some(function (answer) { return normalizeAnswer(answer) === user; })) return true;

        // Accept a correct numeric value with its correct measurement unit,
        // while rejecting mismatched units (for example cm² for a volume).
        const expected = Number(String(question.answer).replace(/,/g, ""));
        if (!Number.isFinite(expected)) return false;
        const match = user.match(/^([+-]?(?:\d+(?:\.\d*)?|\.\d+))(.*)$/);
        if (!match || Number(match[1]) !== expected) return false;
        const suppliedUnit = match[2];
        if (!suppliedUnit) return true;
        const wording = String(question.question || "").toLowerCase();
        let expectedUnit = "";
        if (/\bvolume\b|cm\^3|cubic/.test(wording)) expectedUnit = "cm^3";
        else if (/\barea\b|cm\^2|square centimet/.test(wording)) expectedUnit = "cm^2";
        else if (/\b(perimeter|circumference|diameter|radius|height|length|breadth|side)\b|\bcm\b/.test(wording)) expectedUnit = "cm";
        return Boolean(expectedUnit && suppliedUnit === expectedUnit);
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

    function getSyllabusOptions(selected) {
        const chapters = curriculum && Array.isArray(curriculum.chapters) ? curriculum.chapters : [];
        return '<option value="all"' + (selected === "all" ? ' selected' : '') + '>Entire Class 9 syllabus</option>' +
            chapters.map(function (chapter) {
                return '<option value="' + escapeHTML(chapter.id) + '"' + (selected === chapter.id ? ' selected' : '') + '>' +
                    escapeHTML(chapter.number + ". " + chapter.name) + '</option>';
            }).join("");
    }

    function getFilteredQuestions(chapterId, difficulty) {
        const inSelectedSyllabus = questionBank.filter(function (question) {
            return chapterId === "all" || question.chapterId === chapterId;
        });
        const byDifficulty = inSelectedSyllabus.filter(function (question) {
            return difficulty === "all" || question.difficulty === difficulty;
        });
        // Never leave the learner with an empty set when a small chapter
        // has not yet been tagged at the chosen difficulty.
        return byDifficulty.length ? byDifficulty : inSelectedSyllabus;
    }

    function shuffleList(list) {
        const copy = list.slice();
        for (let i = copy.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [copy[i], copy[j]] = [copy[j], copy[i]];
        }
        return copy;
    }

    function startPracticeSession() {
        const chapterId = document.getElementById("practice-syllabus")?.value || "all";
        const difficulty = document.getElementById("practice-difficulty")?.value || "all";
        const count = Math.max(1, Math.min(100, Number(document.getElementById("practice-count")?.value) || 10));
        const eligible = getFilteredQuestions(chapterId, difficulty);
        if (!eligible.length) {
            state.practiceSession = null;
            renderPractice();
            return;
        }
        state.practiceSettings = { chapterId, difficulty, count };
        state.practiceSession = { questions: selectFreshQuestions(eligible, count), index: 0 };
        state.practiceQuestion = state.practiceSession.questions[0];
        state.practiceAnswered = false;
        state.practiceHintShown = false;
        state.lastPracticeAnswer = "";
        renderPractice();
    }

    function renderPractice() {
        const session = state.practiceSession;
        if (!session) {
            mainContent.innerHTML = `
                <div class="workspace-page">
                    ${pageHeader("PRACTICE WORKSPACE", "Practise the syllabus you choose.", "Choose a chapter or the full Class 9 syllabus, set a difficulty and work through a question set.")}
                    <section class="workspace-panel">
                        <h2>Set up your practice</h2>
                        <div class="challenge-settings">
                            <label>Choose syllabus / chapter<select id="practice-syllabus">${getSyllabusOptions("all")}</select></label>
                            <label>Difficulty<select id="practice-difficulty"><option value="all">All difficulties</option><option value="easy">Easy</option><option value="medium">Medium</option><option value="hard">Hard</option></select></label>
                            <label>Number of questions<select id="practice-count"><option value="5">5 questions</option><option value="10" selected>10 questions</option><option value="15">15 questions</option><option value="20">20 questions</option><option value="30">30 questions</option><option value="50">50 questions</option></select></label>
                        </div>
                        <p class="challenge-config-note">The question set is drawn from the 128-question code bank. MathLab avoids questions used in recent sessions and never repeats a question inside one set. If a selected chapter has fewer questions than requested, it uses all available questions without duplicates.</p>
                        <button type="button" data-action="start-practice">Start practice</button>
                        <p class="bank-count-note">Question bank: ${questionBank.length} questions across ${curriculum.chapters.length} syllabus chapters. MathLab prioritises questions not used in your recent sessions; repeats are possible only after the selected pool is exhausted.</p>
                    </section>
                </div>`;
            return;
        }

        if (session.index >= session.questions.length) {
            mainContent.innerHTML = `
                <div class="workspace-page">
                    ${pageHeader("PRACTICE COMPLETE", "Good work.", "You have reached the end of this practice set.")}
                    <section class="workspace-panel">
                        <h2>Set finished</h2>
                        <p>You attempted ${session.questions.length} questions.</p>
                        <button type="button" data-action="practice-again">Choose another practice set</button>
                    </section>
                </div>`;
            return;
        }

        const question = session.questions[session.index];
        let resultHTML = "";
        if (state.practiceAnswered) {
            const correct = isCorrectAnswer(state.lastPracticeAnswer || "", question);
            resultHTML = `
                <div class="practice-feedback">
                    <h3>${correct ? "Correct!" : "Not quite"}</h3>
                    <p>${correct ? "Your answer is correct." : "Correct answer: " + escapeHTML(question.answer)}</p>
                    <p>${escapeHTML(question.explanation)}</p>
                    <button type="button" data-action="next-practice">${session.index === session.questions.length - 1 ? "Finish practice set" : "Next question"}</button>
                </div>`;
        }

        mainContent.innerHTML = `
            <div class="workspace-page">
                ${pageHeader("PRACTICE WORKSPACE", "Build problem-solving skills.", "Question " + (session.index + 1) + " of " + session.questions.length + " · " + escapeHTML(getQuestionChapterName(question)))}
                <section class="workspace-panel">
                    <div class="challenge-status-row"><span>Question ${session.index + 1}/${session.questions.length}</span><span>${escapeHTML(question.difficulty.toUpperCase())}</span><span>${escapeHTML(getQuestionChapterName(question))}</span></div>
                    <h2>${escapeHTML(question.question)}</h2>
                    ${state.practiceHintShown && !state.practiceAnswered ? `<p class="practice-hint">${escapeHTML(question.hint)}</p>` : ""}
                    ${state.practiceAnswered ? resultHTML : `
                        <form id="practice-form"><label for="practice-answer">Your answer</label><input id="practice-answer" type="text" autocomplete="off" required><button type="submit">Check answer</button></form>
                        <button type="button" data-action="practice-hint">Show hint</button>`}
                    <p class="practice-set-footer">Filtered set · ${session.questions.length} questions selected from the question bank</p>
                </section>
            </div>`;
    }


    // =====================================================
    // CHALLENGE MODE
    // Five questions, five minutes, scored out of 50.
    // A hint reduces the available points for that question.
    // =====================================================

    function shuffleQuestions(count, difficulty, chapterId) {
        const eligible = getFilteredQuestions(chapterId || "all", difficulty || "all");
        return selectFreshQuestions(eligible, count);
    }

    function getMCQOptions(question) {
        if (Array.isArray(question.options) && question.options.length >= 2) return question.options.slice(0, 4);
        const correct = String(question.answer);
        const curated = {
            "II": ["I", "II", "III", "IV"],
            "rational": ["Rational", "Irrational", "Integer", "Whole number"],
            "true": ["True", "False", "Both", "Neither"],
            "false": ["True", "False", "Both", "Neither"],
            "yes": ["Yes", "No", "Cannot be determined", "None of these"],
            "finiteness": ["Finiteness", "Definiteness", "Input", "Output"],
            "steps": ["Steps", "Variables", "Data", "Result"],
            "1/2": ["1/2", "1/3", "1/4", "2/3"],
            "1/3": ["1/3", "1/2", "1/4", "2/3"],
            "(2,5)": ["(2, 5)", "(3, 4)", "(2, 4)", "(3, 5)"],
            "a² + 2ab + b²": ["a² + 2ab + b²", "a² - 2ab + b²", "a² + b²", "a² - b²"],
            "a² - 2ab + b²": ["a² + 2ab + b²", "a² - 2ab + b²", "a² - b²", "a² + b²"]
        };
        if (curated[correct]) return curated[correct].slice();
        const options = [correct];
        const numeric = Number(correct);
        if (Number.isFinite(numeric) && correct.trim() !== "") {
            [numeric + 1, numeric - 1, numeric + 2, numeric * 2, numeric / 2].forEach(function (value) {
                const candidate = String(Number.isInteger(value) ? value : Number(value.toFixed(2)));
                if (options.length < 4 && !options.includes(candidate)) options.push(candidate);
            });
        }
        const fallbacks = questionBank.map(q => String(q.answer)).filter(value => value !== correct);
        for (const candidate of fallbacks) {
            if (options.length >= 4) break;
            if (!options.includes(candidate)) options.push(candidate);
        }
        return options.slice(0, 4);
    }

    function submitChallengeAnswer(answer) {
        const session = state.challenge;
        if (!session || session.answered || session.finished) return;
        updateChallengeTimer();
        if (session.finished) return;
        const question = session.questions[session.index];
        const correct = isCorrectAnswer(answer, question);
        session.answered = true;
        session.answerCorrect = correct;
        session.userAnswer = answer;
        if (correct) {
            session.correct++;
            session.score += session.hintShown ? Math.ceil(session.pointsEach / 2) : session.pointsEach;
        }
        renderChallenge();
    }

    function startChallenge() {
        stopChallengeTimer();
        const minutes = Math.max(1, Math.min(60, Number(document.getElementById("challenge-minutes")?.value) || 5));
        const count = Math.max(1, Math.min(questionBank.length, Number(document.getElementById("challenge-count")?.value) || 5));
        const points = Math.max(1, Math.min(100, Number(document.getElementById("challenge-points")?.value) || 10));
        const difficulty = document.getElementById("challenge-difficulty")?.value || "all";
        const chapterId = document.getElementById("challenge-syllabus")?.value || "all";
        const answerMode = document.getElementById("challenge-mode")?.value || "written";
        state.challengeSettings = { minutes, count, difficulty, points, chapterId, answerMode };
        const questions = shuffleQuestions(count, difficulty, chapterId);
        if (!questions.length) {
            state.challenge = null;
            renderChallenge();
            return;
        }
        state.challenge = {
            questions, index: 0, score: 0, correct: 0, answered: false,
            answerCorrect: false, hintShown: false,
            remainingSeconds: minutes * 60, deadline: Date.now() + minutes * 60000,
            finished: false, timedOut: false, pointsEach: points,
            maxScore: questions.length * points,
            answerMode: answerMode,
            selectedOption: null,
            userAnswer: ""
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
                        "Choose the syllabus, MCQ or written answers, difficulty, time, question count and points."
                    )}

                    <section class="workspace-panel">

                        <h2>Configure your challenge</h2>
                        <div class="challenge-settings">
                            <label>Choose syllabus / chapter<select id="challenge-syllabus">${getSyllabusOptions("all")}</select></label>
                            <label>Answer mode<select id="challenge-mode"><option value="mcq" selected>Multiple choice (MCQ)</option><option value="written">Type your answer</option></select></label>
                            <label>Time limit<select id="challenge-minutes"><option value="1">1 minute</option><option value="3">3 minutes</option><option value="5" selected>5 minutes</option><option value="10">10 minutes</option><option value="15">15 minutes</option><option value="30">30 minutes</option><option value="45">45 minutes</option><option value="60">60 minutes</option></select></label>
                            <label>Number of questions<select id="challenge-count"><option>5</option><option selected>10</option><option>15</option><option>20</option><option>25</option><option>30</option><option>40</option><option>50</option></select></label>
                            <label>Difficulty<select id="challenge-difficulty"><option value="all">Mixed</option><option value="easy">Easy</option><option value="medium">Medium</option><option value="hard">Hard</option></select></label>
                            <label>Points per question<select id="challenge-points"><option>1</option><option>2</option><option>5</option><option selected>10</option><option>15</option><option>20</option><option>25</option><option>50</option></select></label>
                        </div>
                        <p class="challenge-config-note">Choose a single chapter or the entire Class 9 syllabus. The maximum score is calculated from your selected question count and points per question. MathLab avoids questions used in recent sessions and never repeats a question within one challenge. If a selected chapter has fewer questions than requested, it uses all available questions without duplicates.</p>
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
                                    : "You completed the selected question set."
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
                                    <h3>${session.answerCorrect ? "Correct!" : "Incorrect"}</h3>
                                    <p>${escapeHTML(question.explanation)}</p>
                                    <p>Your answer: <strong>${escapeHTML(session.userAnswer || "—")}</strong></p>
                                    <p>Correct answer: <strong>${escapeHTML(question.answer)}</strong></p>
                                    <button type="button" data-action="next-challenge">${questionNumber === session.questions.length ? "Finish challenge" : "Next question"}</button>
                                </div>`
                            : session.answerMode === "mcq"
                                ? `<div class="mcq-options"><p class="mcq-instruction">Choose one answer:</p>${getMCQOptions(question).map(function (option, index) {
                                    const selected = session.selectedOption === index;
                                    return `<button type="button" class="mcq-option${selected ? " is-selected" : ""}" data-action="select-challenge-option" data-option-index="${index}" aria-pressed="${selected}"><span class="mcq-letter">${String.fromCharCode(65 + index)}</span><span>${escapeHTML(option)}</span></button>`;
                                }).join("")}</div>
                                <button type="button" data-action="submit-challenge-mcq" ${session.selectedOption === null ? "disabled" : ""}>Submit selected answer</button>
                                <button type="button" class="secondary-button" data-action="challenge-hint">Use a hint</button>`
                                : `<form id="challenge-answer-form"><label for="challenge-answer">Your answer</label><input id="challenge-answer" type="text" autocomplete="off" required><button type="submit">Submit answer</button></form><button type="button" class="secondary-button" data-action="challenge-hint">Use a hint</button>`
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

        if (action === "start-practice") {
            startPracticeSession();
            return;
        }

        if (action === "practice-again") {
            state.practiceSession = null;
            state.practiceQuestion = null;
            state.practiceAnswered = false;
            renderPractice();
            return;
        }

        if (action === "start-challenge") {
            startChallenge();
            return;
        }

        if (action === "restart-challenge") {
            stopChallengeTimer();
            state.challenge = null;
            renderChallenge();
            return;
        }

        if (action === "select-challenge-option") {
            if (state.challenge && !state.challenge.answered) {
                state.challenge.selectedOption = Number(actionButton.dataset.optionIndex);
                renderChallenge();
            }
            return;
        }

        if (action === "submit-challenge-mcq") {
            const session = state.challenge;
            if (session && session.selectedOption !== null && !session.answered) {
                const question = session.questions[session.index];
                const options = getMCQOptions(question);
                submitChallengeAnswer(options[session.selectedOption]);
            }
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
                session.selectedOption = null;
                session.userAnswer = "";
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
            if (state.practiceSession) state.practiceSession.index++;
            state.practiceQuestion = state.practiceSession && state.practiceSession.questions[state.practiceSession.index];
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

            const answer = input.value.trim();
            if (!answer) return;
            submitChallengeAnswer(answer);
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
