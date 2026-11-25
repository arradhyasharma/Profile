"use strict";

window.MathLabBackup = (function () {
    const lessons = {
        "orienting-yourself-coordinates": {
            title: "Orienting Yourself: The Use of Coordinates",
            concept: "Coordinates describe the position of a point on a plane. An ordered pair (x, y) tells us how far to move horizontally and vertically from the origin (0, 0).",
            example: "For the point (3, 2), move 3 units right and 2 units up from the origin.",
            question: "In which quadrant does the point (-4, 3) lie?",
            answer: "Quadrant II. Its x-coordinate is negative and its y-coordinate is positive.",
            hint: "Check the signs of x and y."
        },
        "introduction-to-linear-polynomials": {
            title: "Introduction to Linear Polynomials",
            concept: "A linear polynomial in one variable has degree 1. Its general form is ax + b, where a is not zero.",
            example: "In 5x + 7, the coefficient of x is 5 and the constant term is 7.",
            question: "What is the degree of 8x - 3?",
            answer: "The degree is 1 because the highest power of x is 1.",
            hint: "Look at the highest exponent of the variable."
        },
        "the-world-of-numbers": {
            title: "The World of Numbers",
            concept: "Real numbers include rational and irrational numbers. Rational numbers can be written as p/q, where p and q are integers and q is not zero. Irrational numbers cannot be written in this form.",
            example: "3/4 and -2 are rational. √2 and π are irrational.",
            question: "Is √49 rational or irrational?",
            answer: "Rational, because √49 = 7, which is an integer.",
            hint: "First simplify the square root."
        },
        "exploring-algebraic-identities": {
            title: "Exploring Algebraic Identities",
            concept: "An algebraic identity is an equality that is true for every permitted value of its variables.",
            example: "(a + b)² = a² + 2ab + b². For a = 2 and b = 3, the result is 25 on both sides.",
            question: "Expand (x + 4)².",
            answer: "x² + 8x + 16.",
            hint: "Use (a + b)² = a² + 2ab + b²."
        },
        "circles": {
            title: "I'm Up and Down, and Round and Round: Circles",
            concept: "A circle is the set of all points in a plane at a fixed distance from a fixed point called the centre. The fixed distance is the radius.",
            example: "If the radius is 5 cm, the diameter is 10 cm because diameter = 2 × radius.",
            question: "A circle has diameter 14 cm. What is its radius?",
            answer: "7 cm. Radius = diameter ÷ 2.",
            hint: "The radius is half the diameter."
        },
        "measuring-space-perimeter-and-area": {
            title: "Measuring Space: Perimeter and Area",
            concept: "Perimeter measures the total distance around a 2D shape. Area measures the region covered by that shape.",
            example: "A rectangle of length 8 cm and breadth 3 cm has perimeter 2(8 + 3) = 22 cm and area 8 × 3 = 24 cm².",
            question: "Find the area of a square with side 6 cm.",
            answer: "36 cm², because area = side × side = 6 × 6.",
            hint: "For a square, area = side²."
        },
        "introduction-to-probability": {
            title: "The Mathematics of Maybe: Introduction to Probability",
            concept: "Probability measures how likely an event is. For equally likely outcomes, P(event) = favourable outcomes ÷ total possible outcomes.",
            example: "For a fair coin, the probability of heads is 1/2 because one of the two equally likely outcomes is heads.",
            question: "What is the probability of rolling a 4 on a fair six-sided die?",
            answer: "1/6. Only one outcome out of six is a 4.",
            hint: "Count the favourable outcomes and divide by all possible outcomes."
        },
        "sequences-and-progressions": {
            title: "Predicting What Comes Next: Sequences and Progressions",
            concept: "A sequence is an ordered list of numbers following a rule. In an arithmetic progression (AP), the difference between consecutive terms is constant.",
            example: "2, 5, 8, 11, ... is an AP with common difference 3.",
            question: "Find the next two terms: 4, 9, 14, 19, ...",
            answer: "24 and 29. Add 5 each time.",
            hint: "Find the difference between consecutive terms."
        },
        "propositions-and-converses": {
            title: "Propositions and their Converses",
            concept: "A proposition is a declarative statement that has a definite truth value: true or false. The converse of 'If P, then Q' is 'If Q, then P'.",
            example: "Statement: If a number is divisible by 4, it is even. Converse: If a number is even, it is divisible by 4. The converse is false; 6 is even but not divisible by 4.",
            question: "Is the converse of 'If a shape is a square, it has four sides' always true?",
            answer: "No. A rectangle also has four sides but is not necessarily a square.",
            hint: "Reverse the condition and conclusion, then test it."
        },
        "understanding-data": {
            title: "How Quantities Combine: Understanding Data",
            concept: "Data is a collection of information. Mean is the sum divided by the number of values; median is the middle value after arranging the data; mode is the most frequent value.",
            example: "For 2, 3, 3, 7, the mean is 15/4 = 3.75, the median is 3 and the mode is 3.",
            question: "Find the mean of 4, 6, 8 and 10.",
            answer: "7. The sum is 28 and there are 4 values, so 28 ÷ 4 = 7.",
            hint: "Add all values, then divide by how many values there are."
        },
        "world-of-algorithms": {
            title: "The World of Algorithms",
            concept: "An algorithm is a finite, ordered set of clear steps used to solve a problem or complete a task.",
            example: "To find the average of three numbers: add the numbers, then divide the sum by 3.",
            question: "What is the average of 6, 9 and 12?",
            answer: "9. (6 + 9 + 12) ÷ 3 = 27 ÷ 3 = 9.",
            hint: "Follow the steps: add first, divide second."
        },
        "quadrilaterals": {
            title: "Quadrilaterals",
            concept: "A quadrilateral is a polygon with four sides and four angles. The sum of its interior angles is 360°.",
            example: "A rectangle has four right angles, so 90° + 90° + 90° + 90° = 360°.",
            question: "Three angles of a quadrilateral are 80°, 90° and 100°. Find the fourth angle.",
            answer: "90°. The fourth angle is 360° - (80° + 90° + 100°).",
            hint: "The sum of all four interior angles is 360°."
        },
        "two-variables-one-line": {
            title: "Two Variables, One Line",
            concept: "A linear equation in two variables has the general form ax + by + c = 0, where a and b are not both zero. Its solutions are ordered pairs that satisfy the equation.",
            example: "For x + y = 5, the pairs (1, 4), (2, 3) and (5, 0) are solutions.",
            question: "Does (2, 3) satisfy 2x + y = 7?",
            answer: "Yes. Substituting gives 2(2) + 3 = 7.",
            hint: "Substitute x = 2 and y = 3 into the equation."
        },
        "surface-area-and-volume": {
            title: "Math of Space: Surface Area and Volume",
            concept: "Surface area measures the total area covering a 3D object. Volume measures the space occupied by it.",
            example: "A cube of side 3 cm has volume 3³ = 27 cm³.",
            question: "Find the volume of a cuboid with length 5 cm, breadth 3 cm and height 2 cm.",
            answer: "30 cm³. Volume = length × breadth × height = 5 × 3 × 2.",
            hint: "Multiply the three dimensions."
        }
    };

    function findLesson(question) {
        const text = String(question || "").toLowerCase();

        const matches = [
            ["orienting-yourself-coordinates", ["coordinate", "coordinates", "quadrant", "origin", "x-axis", "y-axis", "graph"]],
            ["introduction-to-linear-polynomials", ["polynomial", "linear polynomial", "coefficient", "degree of"]],
            ["the-world-of-numbers", ["rational", "irrational", "real number", "square root", "number system"]],
            ["exploring-algebraic-identities", ["identity", "identities", "expand", "factorise", "factorize", "(a+b)", "algebraic"]],
            ["circles", ["circle", "radius", "diameter", "circumference", "chord", "arc"]],
            ["measuring-space-perimeter-and-area", ["perimeter", "area", "rectangle", "square area", "surface of a 2d"]],
            ["introduction-to-probability", ["probability", "chance", "likely", "dice", "die", "coin"]],
            ["sequences-and-progressions", ["sequence", "progression", "arithmetic progression", "common difference", "ap", "next term"]],
            ["propositions-and-converses", ["proposition", "converse", "true or false statement"]],
            ["understanding-data", ["data", "mean", "median", "mode", "average", "statistics"]],
            ["world-of-algorithms", ["algorithm", "steps", "procedure", "flowchart"]],
            ["quadrilaterals", ["quadrilateral", "parallelogram", "rhombus", "trapezium", "interior angle"]],
            ["two-variables-one-line", ["two variables", "linear equation", "ordered pair", "simultaneous", "straight line equation"]],
            ["surface-area-and-volume", ["volume", "surface area", "cuboid", "cube", "cylinder", "3d"]]
        ];

        for (const item of matches) {
            if (item[1].some(function (keyword) {
                return text.includes(keyword);
            })) {
                return lessons[item[0]];
            }
        }

        return null;
    }

    function formatLesson(lesson) {
        return [
            "## " + lesson.title,
            "",
            "### Understand the idea",
            lesson.concept,
            "",
            "### Worked example",
            lesson.example,
            "",
            "### Try it yourself",
            lesson.question,
            "",
            "### Hint",
            lesson.hint,
            "",
            "### Answer",
            lesson.answer,
            "",
            "*This is MathLab's built-in offline learning material. It may not cover every detail of the topic; check your textbook for the complete lesson.*"
        ].join("\n");
    }

    return {
        findLesson: findLesson,
        formatLesson: formatLesson,
        getLesson: function (question) {
            const lesson = findLesson(question);
            return lesson ? formatLesson(lesson) : null;
        }
    };
})();
