
(function () {
    "use strict";

    // MathLab Class IX Mathematics Curriculum
    // Chapter titles and order are based on the syllabus
    // supplied by the project owner.

    window.MATHLAB_CLASS9_CURRICULUM = {

        title: "Class IX Mathematics",
        academicYear: "2026-27",

        // Subject-based navigation.
        // These categories organise the chapters for browsing.
        subjectAreas: [

            {
                id: "number-system",
                name: "Number System",
                description: "Explore numbers and their properties.",
                curriculumGroup: "core",
                chapterIds: [
                    "the-world-of-numbers"
                ]
            },

            {
                id: "algebra",
                name: "Algebra",
                description: "Explore polynomials, identities, sequences and variables.",
                curriculumGroup: "core",
                chapterIds: [
                    "introduction-to-linear-polynomials",
                    "exploring-algebraic-identities",
                    "sequences-and-progressions",
                    "two-variables-one-line"
                ]
            },

            {
                id: "coordinate-geometry",
                name: "Coordinate Geometry",
                description: "Understand positions and coordinates.",
                curriculumGroup: "core",
                chapterIds: [
                    "orienting-yourself-coordinates"
                ]
            },

            {
                id: "geometry",
                name: "Geometry",
                description: "Explore shapes and their mathematical properties.",
                curriculumGroup: "core",
                chapterIds: [
                    "circles",
                    "propositions-and-converses",
                    "quadrilaterals"
                ]
            },

            {
                id: "mensuration",
                name: "Mensuration",
                description: "Explore perimeter, area, surface area and volume.",
                curriculumGroup: "core",
                chapterIds: [
                    "measuring-space-perimeter-and-area",
                    "surface-area-and-volume"
                ]
            },

            {
                id: "statistics-probability",
                name: "Statistics and Probability",
                description: "Understand data and the mathematics of chance.",
                curriculumGroup: "core",
                chapterIds: [
                    "introduction-to-probability",
                    "understanding-data"
                ]
            },

            {
                id: "algorithms",
                name: "Algorithms",
                description: "Explore step-by-step methods and computational thinking.",
                curriculumGroup: "additional",
                chapterIds: [
                    "world-of-algorithms"
                ]
            }

        ],

        // Original syllabus chapter order.
        chapters: [

            {
                id: "orienting-yourself-coordinates",
                number: "01",
                name: "Orienting Yourself: The Use of Coordinates",
                subjectId: "coordinate-geometry"
            },

            {
                id: "introduction-to-linear-polynomials",
                number: "02",
                name: "Introduction to Linear Polynomials",
                subjectId: "algebra"
            },

            {
                id: "the-world-of-numbers",
                number: "03",
                name: "The World of Numbers",
                subjectId: "number-system"
            },

            {
                id: "exploring-algebraic-identities",
                number: "04",
                name: "Exploring Algebraic Identities",
                subjectId: "algebra"
            },

            {
                id: "circles",
                number: "05",
                name: "I'm Up and Down, and Round and Round (Circles)",
                subjectId: "geometry"
            },

            {
                id: "measuring-space-perimeter-and-area",
                number: "06",
                name: "Measuring Space: Perimeter and Area",
                subjectId: "mensuration"
            },

            {
                id: "introduction-to-probability",
                number: "07",
                name: "The Mathematics of Maybe: Introduction to Probability",
                subjectId: "statistics-probability"
            },

            {
                id: "sequences-and-progressions",
                number: "08",
                name: "Predicting What Comes Next: Exploring Sequences and Progressions",
                subjectId: "algebra"
            },

            {
                id: "propositions-and-converses",
                number: "09",
                name: "Propositions and their Converses",
                subjectId: "geometry",
                additionalTags: [
                    "Mathematical Reasoning"
                ]
            },

            {
                id: "understanding-data",
                number: "10",
                name: "How Quantities Combine: Understanding Data",
                subjectId: "statistics-probability"
            },

            {
                id: "world-of-algorithms",
                number: "11",
                name: "The World of Algorithms",
                subjectId: "algorithms"
            },

            {
                id: "quadrilaterals",
                number: "12",
                name: "Quadrilaterals",
                subjectId: "geometry"
            },

            {
                id: "two-variables-one-line",
                number: "13",
                name: "Two Variables, One Line",
                subjectId: "algebra"
            },

            {
                id: "surface-area-and-volume",
                number: "14",
                name: "Math of Space: Surface Area and Volume",
                subjectId: "mensuration"
            }

        ]

    };

}());
