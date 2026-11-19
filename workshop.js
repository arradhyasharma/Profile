/* MathLab Workshop — integrated lessons and experiments */
(function () {
  "use strict";
  const esc = v => String(v).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const $ = (root, s) => root.querySelector(s);
  const num = (root, id, fallback=0) => { const el=$(root,`#${id}`); const n=el?Number(el.value):fallback; return Number.isFinite(n)?n:fallback; };
  const paths = [
    ["coordinates","Coordinate Geometry","Cartesian plane, axes, quadrants, plotting points, distance, midpoint, slope and y-intercept."],
    ["algebra","Algebra","Linear polynomials, solving and evaluating expressions, identities, and two variables in one line."],
    ["geometry","Geometry & Mensuration","Circles, quadrilaterals, triangles, perimeter, area, surface area and volume."],
    ["probability","Probability & Statistics","Theoretical and experimental probability, data, mean, median and mode."],
    ["patterns","Number & Patterns","Number systems, arithmetic progressions (AP) first, geometric progressions (GP), and sequence experiments."],
    ["reasoning","Reasoning & Algorithms","Propositions, converses, logical statements and step-by-step algorithms."]
  ];
  const logicStatements = [
    {
        "original": "If an integer is divisible by 4, then it is even.",
        "converse": "If an integer is even, then it is divisible by 4.",
        "originalTruth": "True",
        "converseTruth": "False",
        "reason": "6 is even but is not divisible by 4."
    },
    {
        "original": "If an integer is a multiple of 6, then it is a multiple of 3.",
        "converse": "If an integer is a multiple of 3, then it is a multiple of 6.",
        "originalTruth": "True",
        "converseTruth": "False",
        "reason": "9 is a multiple of 3 but not of 6."
    },
    {
        "original": "If an integer is a multiple of 10, then it is divisible by 5.",
        "converse": "If an integer is divisible by 5, then it is a multiple of 10.",
        "originalTruth": "True",
        "converseTruth": "False",
        "reason": "15 is divisible by 5 but is not a multiple of 10."
    },
    {
        "original": "If an integer is divisible by 8, then it is divisible by 4.",
        "converse": "If an integer is divisible by 4, then it is divisible by 8.",
        "originalTruth": "True",
        "converseTruth": "False",
        "reason": "4 is divisible by 4 but not by 8."
    },
    {
        "original": "If an integer is divisible by 9, then it is divisible by 3.",
        "converse": "If an integer is divisible by 3, then it is divisible by 9.",
        "originalTruth": "True",
        "converseTruth": "False",
        "reason": "3 is divisible by 3 but not by 9."
    },
    {
        "original": "If an integer is even, then it is divisible by 2.",
        "converse": "If an integer is divisible by 2, then it is even.",
        "originalTruth": "True",
        "converseTruth": "True",
        "reason": "The two statements describe the same property of integers."
    },
    {
        "original": "If an integer is odd, then it is not divisible by 2.",
        "converse": "If an integer is not divisible by 2, then it is odd.",
        "originalTruth": "True",
        "converseTruth": "True",
        "reason": "For integers, every number is either even or odd."
    },
    {
        "original": "If an integer is divisible by 6, then it is divisible by 2.",
        "converse": "If an integer is divisible by 2, then it is divisible by 6.",
        "originalTruth": "True",
        "converseTruth": "False",
        "reason": "2 is divisible by 2 but not by 6."
    },
    {
        "original": "If an integer is divisible by 15, then it is divisible by 5.",
        "converse": "If an integer is divisible by 5, then it is divisible by 15.",
        "originalTruth": "True",
        "converseTruth": "False",
        "reason": "5 is divisible by 5 but not by 15."
    },
    {
        "original": "If an integer is a multiple of 12, then it is a multiple of 3.",
        "converse": "If an integer is a multiple of 3, then it is a multiple of 12.",
        "originalTruth": "True",
        "converseTruth": "False",
        "reason": "3 is a multiple of 3 but not of 12."
    },
    {
        "original": "If a positive integer is divisible by 10, then its last digit is 0.",
        "converse": "If a positive integer ends in 0, then it is divisible by 10.",
        "originalTruth": "True",
        "converseTruth": "True",
        "reason": "In base ten, both statements express the divisibility rule for 10."
    },
    {
        "original": "If a positive integer is divisible by 5, then its last digit is 0 or 5.",
        "converse": "If a positive integer ends in 0 or 5, then it is divisible by 5.",
        "originalTruth": "True",
        "converseTruth": "True",
        "reason": "Both directions are the divisibility rule for 5."
    },
    {
        "original": "If a prime integer is greater than 2, then it is odd.",
        "converse": "If an integer greater than 2 is odd, then it is prime.",
        "originalTruth": "True",
        "converseTruth": "False",
        "reason": "9 is odd and greater than 2, but it is not prime."
    },
    {
        "original": "If an integer is the square of an integer, then it is non-negative.",
        "converse": "If an integer is non-negative, then it is the square of an integer.",
        "originalTruth": "True",
        "converseTruth": "False",
        "reason": "2 is non-negative but is not the square of an integer."
    },
    {
        "original": "If an integer is divisible by both 2 and 3, then it is divisible by 6.",
        "converse": "If an integer is divisible by 6, then it is divisible by both 2 and 3.",
        "originalTruth": "True",
        "converseTruth": "True",
        "reason": "Divisibility by 6 is equivalent to divisibility by both 2 and 3."
    },
    {
        "original": "If an integer is divisible by 4, then it is divisible by 8.",
        "converse": "If an integer is divisible by 8, then it is divisible by 4.",
        "originalTruth": "False",
        "converseTruth": "True",
        "reason": "4 is divisible by 4 but not by 8; every multiple of 8 is a multiple of 4."
    },
    {
        "original": "If a positive integer ends in 5, then it is divisible by 5.",
        "converse": "If a positive integer is divisible by 5, then it ends in 5.",
        "originalTruth": "True",
        "converseTruth": "False",
        "reason": "10 is divisible by 5 but ends in 0."
    },
    {
        "original": "If a positive integer has digit sum divisible by 3, then the integer is divisible by 3.",
        "converse": "If a positive integer is divisible by 3, then its digit sum is divisible by 3.",
        "originalTruth": "True",
        "converseTruth": "True",
        "reason": "The digit-sum test for divisibility by 3 works in both directions."
    },
    {
        "original": "If a shape is a square, then it has four sides.",
        "converse": "If a shape has four sides, then it is a square.",
        "originalTruth": "True",
        "converseTruth": "False",
        "reason": "A rectangle that is not a square is a quadrilateral with four sides."
    },
    {
        "original": "If a shape is a square, then it is a rectangle.",
        "converse": "If a shape is a rectangle, then it is a square.",
        "originalTruth": "True",
        "converseTruth": "False",
        "reason": "A non-square rectangle is a counterexample to the converse."
    },
    {
        "original": "If a shape is a square, then it is a rhombus.",
        "converse": "If a shape is a rhombus, then it is a square.",
        "originalTruth": "True",
        "converseTruth": "False",
        "reason": "A rhombus with angles that are not right angles is not a square."
    },
    {
        "original": "If a triangle is equilateral, then it is isosceles.",
        "converse": "If a triangle is isosceles, then it is equilateral.",
        "originalTruth": "True",
        "converseTruth": "False",
        "reason": "A triangle with side lengths 5, 5 and 6 is isosceles but not equilateral."
    },
    {
        "original": "If a triangle is equilateral, then each of its angles is 60°.",
        "converse": "If each angle of a triangle is 60°, then the triangle is equilateral.",
        "originalTruth": "True",
        "converseTruth": "True",
        "reason": "Equal angles in a triangle have equal opposite sides; the angle sum is 180°."
    },
    {
        "original": "If a rectangle is a quadrilateral, then its opposite sides are equal.",
        "converse": "If a quadrilateral has equal opposite sides, then it is a rectangle.",
        "originalTruth": "True",
        "converseTruth": "False",
        "reason": "A non-rectangular parallelogram has equal opposite sides."
    },
    {
        "original": "If a quadrilateral is a parallelogram, then both pairs of opposite sides are parallel.",
        "converse": "If both pairs of opposite sides of a quadrilateral are parallel, then it is a parallelogram.",
        "originalTruth": "True",
        "converseTruth": "True",
        "reason": "This is the defining parallel-side property of a parallelogram."
    },
    {
        "original": "If a quadrilateral is a rhombus, then all four sides are equal.",
        "converse": "If all four sides of a quadrilateral are equal, then it is a rhombus.",
        "originalTruth": "True",
        "converseTruth": "True",
        "reason": "A quadrilateral with four equal sides is a rhombus."
    },
    {
        "original": "If a quadrilateral is a square, then all four angles are right angles.",
        "converse": "If all four angles of a quadrilateral are right angles, then it is a square.",
        "originalTruth": "True",
        "converseTruth": "False",
        "reason": "A rectangle with unequal adjacent sides has four right angles but is not a square."
    },
    {
        "original": "If a triangle has two equal sides, then the angles opposite those sides are equal.",
        "converse": "If a triangle has two equal angles, then the sides opposite those angles are equal.",
        "originalTruth": "True",
        "converseTruth": "True",
        "reason": "The isosceles triangle theorem and its converse are both true."
    },
    {
        "original": "If a circle has radius 4 cm, then its diameter is 8 cm.",
        "converse": "If a circle has diameter 8 cm, then its radius is 4 cm.",
        "originalTruth": "True",
        "converseTruth": "True",
        "reason": "Diameter is twice the radius, so each statement follows from the other."
    },
    {
        "original": "If a shape is a quadrilateral, then it has four sides.",
        "converse": "If a polygon has four sides, then it is a quadrilateral.",
        "originalTruth": "True",
        "converseTruth": "True",
        "reason": "A quadrilateral is, by definition, a four-sided polygon."
    },
    {
        "original": "If a real number x equals 2, then x² equals 4.",
        "converse": "If a real number x² equals 4, then x equals 2.",
        "originalTruth": "True",
        "converseTruth": "False",
        "reason": "x = -2 also gives x² = 4."
    },
    {
        "original": "If a real number x is greater than 3, then it is greater than 1.",
        "converse": "If a real number x is greater than 1, then it is greater than 3.",
        "originalTruth": "True",
        "converseTruth": "False",
        "reason": "x = 2 is greater than 1 but not greater than 3."
    },
    {
        "original": "If a real number x equals 0, then x² equals 0.",
        "converse": "If a real number x² equals 0, then x equals 0.",
        "originalTruth": "True",
        "converseTruth": "True",
        "reason": "The only real number whose square is zero is zero."
    },
    {
        "original": "If a real number x is negative, then x² is positive.",
        "converse": "If a real number x² is positive, then x is negative.",
        "originalTruth": "True",
        "converseTruth": "False",
        "reason": "x = 2 has a positive square but is not negative."
    },
    {
        "original": "If an integer is even, then its square is even.",
        "converse": "If the square of an integer is even, then the integer is even.",
        "originalTruth": "True",
        "converseTruth": "True",
        "reason": "An odd integer has an odd square, so an even square must come from an even integer."
    },
    {
        "original": "If an integer is odd, then its square is odd.",
        "converse": "If the square of an integer is odd, then the integer is odd.",
        "originalTruth": "True",
        "converseTruth": "True",
        "reason": "An even integer has an even square; therefore an odd square comes from an odd integer."
    }
];
  let active = "coordinates", coinStats={heads:0,tails:0}, diceCounts=Array(6).fill(0);
  const boundRoots = new WeakSet();
  function header(k,t,d){return `<header class="lab-heading"><p class="eyebrow">${k}</p><h1>${t}</h1><p>${d}</p></header>`;}
  function panel(title,body,cls=""){return `<section class="lab-panel ${cls}"><h2>${title}</h2>${body}</section>`;}
  function note(title,body){return `<div class="learning-note"><strong>${title}</strong><p>${body}</p></div>`;}
  function step(title,body){return `<div class="worked-step"><b>${title}</b><p>${body}</p></div>`;}
  function pathNav(){return `<div class="path-grid">${paths.map(p=>`<button class="path-card ${active===p[0]?'selected':''}" data-path="${p[0]}"><span class="path-index">${String(paths.indexOf(p)+1).padStart(2,'0')}</span><strong>${p[1]}</strong><small>${p[2]}</small><span class="path-open">Open learning path →</span></button>`).join('')}</div>`;}
  function coordinate(){return `
    ${panel("1. Cartesian plane, graph, axes and quadrants",`
      <p>A <b>coordinate plane</b> is a flat surface formed by two perpendicular number lines. The horizontal line is the <b>x-axis</b>; the vertical line is the <b>y-axis</b>. They meet at the <b>origin</b>, (0, 0). A graph is a visual way to represent points or relationships.</p>
      <div class="concept-grid"><div><b>Ordered pair (x, y)</b><p>Move x units horizontally first, then y units vertically.</p></div><div><b>Quadrants</b><p>I: (+,+) · II: (−,+) · III: (−,−) · IV: (+,−). Points on an axis are not in a quadrant.</p></div></div>
      ${step("Example: locate (−3, 2)","Start at the origin. Move 3 units left because x = −3, then 2 units up because y = 2. The point is in Quadrant II.")}
      <p class="instruction">Experiment 1 — tap anywhere inside the graph to plot a point. The coordinates and its location will be identified.</p>
      <div class="plot-experiment"><svg id="click-plot" viewBox="0 0 360 360" role="img" aria-label="Interactive coordinate plane" tabindex="0"></svg><div class="plot-result" id="plot-result">Tap the graph to place a point.</div></div>
    `)}
    ${panel("2. Distance and midpoint between two points",`
      <p>For points A(x₁, y₁) and B(x₂, y₂), the <b>distance</b> is the length of the segment AB. The <b>midpoint</b> is the point exactly halfway between A and B.</p>
      <div class="formula-strip">Distance = √[(x₂ − x₁)² + (y₂ − y₁)²]</div><div class="formula-strip">Midpoint = ((x₁ + x₂)/2, (y₁ + y₂)/2)</div>
      ${step("Worked example: A(1, 2), B(5, 5)","Distance = √[(5−1)² + (5−2)²] = √(16+9) = √25 = 5 units. Midpoint = ((1+5)/2, (2+5)/2) = (3, 3.5).")}
      <p class="scope-note">Distance and midpoint are included here as useful coordinate-geometry extensions. Check your teacher's prescribed scope before treating them as assessed syllabus content.</p>
      <div class="experiment-controls"><label>A x <input id="ax" type="number" value="1"></label><label>A y <input id="ay" type="number" value="2"></label><label>B x <input id="bx" type="number" value="5"></label><label>B y <input id="by" type="number" value="5"></label><button data-action="distance-calc">Calculate distance & midpoint</button></div><div id="distance-result" class="answer-panel">Enter two points and calculate.</div>
    `)}
    ${panel("3. Slope and y-intercept",`
      <p>The <b>slope</b> measures how steep a straight line is. For two points it is the change in y divided by the change in x. In the form <b>y = mx + c</b>, m is the slope and c is the y-intercept (the y-value where the line crosses the y-axis).</p>
      ${step("Example: y = 2x + 4","The coefficient of x is 2, so slope m = 2. When x = 0, y = 4, so the y-intercept is 4 and the line crosses at (0, 4).")}
      <p class="scope-note">Slope and y-intercept are included as a connected extension to the coordinate pathway; check your teacher's prescribed scope before treating them as assessed Class 9 content.</p>
      <p class="instruction">Experiment 2 — enter a line in the form y = mx + c. Use the two number fields to set m and c; the graph, slope and intercept update together.</p>
      <div class="experiment-controls"><label class="equation-input-label">Enter equation <input id="line-equation" type="text" value="y = 2x + 4" spellcheck="false" placeholder="e.g. y = 2x + 4"></label><button data-action="draw-line">Plot equation</button></div><div class="line-result" id="line-result"></div><svg id="line-plot" class="line-plot" viewBox="0 0 360 300" role="img" aria-label="Graph of a straight line"></svg>
    `)}`;
  }
  const identities=[
    {left:"(a + b)²",right:"a² + 2ab + b²",vars:["a","b"],L:v=>(v.a+v.b)**2,R:v=>v.a**2+2*v.a*v.b+v.b**2,showL:(v,f)=>`(${v.a} + ${v.b})² = ${f((v.a+v.b)**2)}`,showR:(v,f)=>`${v.a}² + 2(${v.a})(${v.b}) + ${v.b}² = ${f(v.a**2+2*v.a*v.b+v.b**2)}`},
    {left:"(a − b)²",right:"a² − 2ab + b²",vars:["a","b"],L:v=>(v.a-v.b)**2,R:v=>v.a**2-2*v.a*v.b+v.b**2,showL:(v,f)=>`(${v.a} − ${v.b})² = ${f((v.a-v.b)**2)}`,showR:(v,f)=>`${v.a}² − 2(${v.a})(${v.b}) + ${v.b}² = ${f(v.a**2-2*v.a*v.b+v.b**2)}`},
    {left:"(a + b)(a − b)",right:"a² − b²",vars:["a","b"],L:v=>(v.a+v.b)*(v.a-v.b),R:v=>v.a**2-v.b**2,showL:(v,f)=>`(${v.a} + ${v.b})(${v.a} − ${v.b}) = ${f((v.a+v.b)*(v.a-v.b))}`,showR:(v,f)=>`${v.a}² − ${v.b}² = ${f(v.a**2-v.b**2)}`},
    {left:"(x + a)(x + b)",right:"x² + (a + b)x + ab",vars:["x","a","b"],L:v=>(v.x+v.a)*(v.x+v.b),R:v=>v.x**2+(v.a+v.b)*v.x+v.a*v.b,showL:(v,f)=>`(${v.x} + ${v.a})(${v.x} + ${v.b}) = ${f((v.x+v.a)*(v.x+v.b))}`,showR:(v,f)=>`${v.x}² + (${v.a} + ${v.b})(${v.x}) + (${v.a})(${v.b}) = ${f(v.x**2+(v.a+v.b)*v.x+v.a*v.b)}`},
    {left:"(ax + b)(cx + d)",right:"acx² + (ad + bc)x + bd",vars:["a","b","c","d","x"],L:v=>(v.a*v.x+v.b)*(v.c*v.x+v.d),R:v=>v.a*v.c*v.x**2+(v.a*v.d+v.b*v.c)*v.x+v.b*v.d,showL:(v,f)=>`((${v.a})(${v.x}) + ${v.b})((${v.c})(${v.x}) + ${v.d}) = ${f((v.a*v.x+v.b)*(v.c*v.x+v.d))}`,showR:(v,f)=>`(${v.a})(${v.c})(${v.x})² + ((${v.a})(${v.d}) + (${v.b})(${v.c}))(${v.x}) + (${v.b})(${v.d}) = ${f(v.a*v.c*v.x**2+(v.a*v.d+v.b*v.c)*v.x+v.b*v.d)}`},
    {left:"(a + b + c)²",right:"a² + b² + c² + 2ab + 2bc + 2ca",vars:["a","b","c"],L:v=>(v.a+v.b+v.c)**2,R:v=>v.a**2+v.b**2+v.c**2+2*v.a*v.b+2*v.b*v.c+2*v.c*v.a,showL:(v,f)=>`(${v.a} + ${v.b} + ${v.c})² = ${f((v.a+v.b+v.c)**2)}`,showR:(v,f)=>`${v.a}² + ${v.b}² + ${v.c}² + 2(${v.a})(${v.b}) + 2(${v.b})(${v.c}) + 2(${v.c})(${v.a}) = ${f(v.a**2+v.b**2+v.c**2+2*v.a*v.b+2*v.b*v.c+2*v.c*v.a)}`},
    {left:"(a + b)³",right:"a³ + 3a²b + 3ab² + b³",vars:["a","b"],L:v=>(v.a+v.b)**3,R:v=>v.a**3+3*v.a**2*v.b+3*v.a*v.b**2+v.b**3,showL:(v,f)=>`(${v.a} + ${v.b})³ = ${f((v.a+v.b)**3)}`,showR:(v,f)=>`${v.a}³ + 3(${v.a})²(${v.b}) + 3(${v.a})(${v.b})² + ${v.b}³ = ${f(v.a**3+3*v.a**2*v.b+3*v.a*v.b**2+v.b**3)}`},
    {left:"(a − b)³",right:"a³ − 3a²b + 3ab² − b³",vars:["a","b"],L:v=>(v.a-v.b)**3,R:v=>v.a**3-3*v.a**2*v.b+3*v.a*v.b**2-v.b**3,showL:(v,f)=>`(${v.a} − ${v.b})³ = ${f((v.a-v.b)**3)}`,showR:(v,f)=>`${v.a}³ − 3(${v.a})²(${v.b}) + 3(${v.a})(${v.b})² − ${v.b}³ = ${f(v.a**3-3*v.a**2*v.b+3*v.a*v.b**2-v.b**3)}`},
    {left:"a³ + b³",right:"(a + b)(a² − ab + b²)",vars:["a","b"],L:v=>v.a**3+v.b**3,R:v=>(v.a+v.b)*(v.a**2-v.a*v.b+v.b**2),showL:(v,f)=>`${v.a}³ + ${v.b}³ = ${f(v.a**3+v.b**3)}`,showR:(v,f)=>`(${v.a} + ${v.b})(${v.a}² − (${v.a})(${v.b}) + ${v.b}²) = ${f((v.a+v.b)*(v.a**2-v.a*v.b+v.b**2))}`},
    {left:"a³ − b³",right:"(a − b)(a² + ab + b²)",vars:["a","b"],L:v=>v.a**3-v.b**3,R:v=>(v.a-v.b)*(v.a**2+v.a*v.b+v.b**2),showL:(v,f)=>`${v.a}³ − ${v.b}³ = ${f(v.a**3-v.b**3)}`,showR:(v,f)=>`(${v.a} − ${v.b})(${v.a}² + (${v.a})(${v.b}) + ${v.b}²) = ${f((v.a-v.b)*(v.a**2+v.a*v.b+v.b**2))}`},
    {left:"a³ + b³ + c³ − 3abc",right:"(a + b + c)(a² + b² + c² − ab − bc − ca)",vars:["a","b","c"],L:v=>v.a**3+v.b**3+v.c**3-3*v.a*v.b*v.c,R:v=>(v.a+v.b+v.c)*(v.a**2+v.b**2+v.c**2-v.a*v.b-v.b*v.c-v.c*v.a),showL:(v,f)=>`${v.a}³ + ${v.b}³ + ${v.c}³ − 3(${v.a})(${v.b})(${v.c}) = ${f(v.a**3+v.b**3+v.c**3-3*v.a*v.b*v.c)}`,showR:(v,f)=>`(${v.a} + ${v.b} + ${v.c})(${v.a}² + ${v.b}² + ${v.c}² − (${v.a})(${v.b}) − (${v.b})(${v.c}) − (${v.c})(${v.a})) = ${f((v.a+v.b+v.c)*(v.a**2+v.b**2+v.c**2-v.a*v.b-v.b*v.c-v.c*v.a))}`}
  ];
  const identityDefaults={a:2,b:3,c:4,d:5,x:2};
  function updateIdentityInputs(root){
    const index=num(root,"identity-choice"),id=identities[index]||identities[0],box=$(root,"#identity-inputs");
    if(!box)return;
    box.innerHTML=id.vars.map(k=>`<label>${k} <input id="id-${k}" type="number" step="any" value="${identityDefaults[k]}"></label>`).join("");
    const formula=$(root,"#identity-formula");if(formula)formula.innerHTML=`<b>${id.left} = ${id.right}</b>`;
  }
  function algebra(){return `
    ${panel("1. Introduction to linear polynomials",`
      <p>A <b>polynomial</b> is an algebraic expression made from constants and variables with non-negative whole-number powers. A <b>linear polynomial in one variable</b> has degree 1 and can be written as <b>ax + b</b>, where a and b are constants and a ≠ 0.</p>
      <div class="concept-grid"><div><b>Variable</b><p>x is a symbol whose value may change.</p></div><div><b>Coefficient</b><p>In 5x + 3, the coefficient of x is 5.</p></div><div><b>Constant term</b><p>In 5x + 3, the constant term is 3.</p></div><div><b>Degree</b><p>The highest power of the variable; degree of 5x + 3 is 1.</p></div></div>
      ${step("Example: 7x − 4","It has one variable x, coefficient 7, constant term −4 and degree 1. It is a linear polynomial.")}
      <p><b>Important distinction:</b> a polynomial is an expression, not an equation. To find x, we need an equation such as 3x + 5 = 20 or 3x + 5 = 0.</p>
    `)}
    ${panel("Experiment 1 — find x by solving a linear equation",`<p>Solve the equation by keeping both sides balanced. Example: 3x + 5 = 20 → 3x = 20 − 5 = 15 → x = 15 ÷ 3 = 5.</p><div class="experiment-controls"><label>Coefficient a <input id="solve-a" type="number" value="3"></label><label>Constant b <input id="solve-b" type="number" value="5"></label><label>Right side c <input id="solve-c" type="number" value="20"></label><button data-action="solve-linear">Solve ax + b = c</button></div><div id="solve-result" class="answer-panel">Your step-by-step solution will appear here.</div>`)}
    ${panel("Experiment 2 — substitute a value of x and evaluate",`<p>Substitution means replacing the variable with the given number, then following the order of operations. Example: for 4x − 3 when x = 2 → 4(2) − 3 → 8 − 3 → 5.</p><div class="experiment-controls"><label>Coefficient a <input id="eval-a" type="number" value="4"></label><label>Constant b <input id="eval-b" type="number" value="-3"></label><label>Value of x <input id="eval-x" type="number" value="2"></label><button data-action="eval-linear">Evaluate ax + b</button></div><div id="eval-result" class="answer-panel">Your substitution steps will appear here.</div>`)}
    ${panel("2. Algebraic identities — learn and test",`<p>An identity is an equality that is true for every permitted value of its variables. Choose an identity and the experiment will ask for <b>only the variables used in that identity</b>—no unrelated c, d or x fields.</p><div class="identity-list">${identities.map((v,i)=>`<div><b>${i+1}. ${v.left}</b><span>= ${v.right}</span></div>`).join('')}</div><p class="instruction">Experiment — enter values for the selected identity. The solution substitutes those values into both sides, evaluates each side separately, and compares the results.</p><div class="experiment-controls identity-controls"><label>Choose identity <select id="identity-choice">${identities.map((v,i)=>`<option value="${i}">${v.left} = ${v.right}</option>`).join('')}</select></label></div><div id="identity-formula" class="formula-strip"></div><div id="identity-inputs" class="experiment-controls identity-controls"></div><button data-action="test-identity">Test identity</button><div id="identity-result" class="answer-panel">Choose an identity and enter its variables.</div>`)}
    ${panel("3. Two variables, one line",`<p>An equation in two variables can be written as <b>ax + by = c</b>. A solution is an ordered pair (x, y) that makes the equation true. Usually there are infinitely many solutions; when plotted, they lie on a straight line.</p>${step("Example: x + y = 5","(0,5), (1,4), (2,3), (3,2), (5,0) all satisfy the equation. Each pair is a solution on the same straight line.")}<p class="instruction">Experiment A — change the equation and show integer solutions with its graph.</p><div class="experiment-controls"><label>Coefficient of x <input id="two-a" type="number" value="1"></label><label>Coefficient of y <input id="two-b" type="number" value="1"></label><label>Constant c <input id="two-c" type="number" value="5"></label><button data-action="two-variable">Show solutions and graph</button></div><div id="two-result" class="answer-panel"></div><svg id="two-plot" class="line-plot" viewBox="0 0 360 300" role="img" aria-label="Graph of equation in two variables"></svg><hr><p><b>Experiment B — solve without drawing a graph</b></p><p>For a straight line in two variables, “roots” commonly means its axis intercepts: set <b>y = 0</b> to find the x-intercept, and set <b>x = 0</b> to find the y-intercept. This calculates them directly; it does not draw or display a graph.</p><div class="experiment-controls"><button data-action="two-roots">Find roots / axis intercepts (no graph)</button></div><div id="two-roots-result" class="answer-panel">Enter an equation above, then calculate its intercepts here.</div><p class="instruction">You can also find one variable when the other is known.</p><div class="experiment-controls"><label>Given x <input id="two-given-x" type="number" value="1"></label><button data-action="two-solve-y">Solve for y</button><label>Given y <input id="two-given-y" type="number" value="1"></label><button data-action="two-solve-x">Solve for x</button></div><div id="two-solve-result" class="answer-panel">Choose a value and solve.</div>`)}
  `;}
  function geometry(){return `
    ${panel("1. Circles: parts, circumference, area and sector",`<p>A circle is the set of points in a plane at a fixed distance from a centre. The <b>radius</b> joins centre to circumference; the <b>diameter</b> passes through the centre and equals twice the radius. Circumference is the distance around the circle.</p><div class="formula-strip">Diameter d = 2r</div><div class="formula-strip">Circumference C = 2πr = πd</div><div class="formula-strip">Area A = πr²</div><div class="formula-strip">Sector area = (θ / 360°) × πr²</div><div class="formula-strip">Arc length = (θ / 360°) × 2πr</div>${step("Example: r = 7 cm","d = 2 × 7 = 14 cm. C = 2 × 22/7 × 7 = 44 cm. A = 22/7 × 7² = 154 cm². For a 90° sector, area = 90/360 × 154 = 38.5 cm².")}<p class="scope-note">Sector area and arc length are useful extensions; check whether they are included in your current school assessment.</p><div class="experiment-controls"><label>Radius (cm) <input id="circle-r" type="number" min="0.1" value="7" step="0.5"></label><label>Sector angle (°) <input id="circle-angle" type="number" min="0" max="360" value="90"></label><button data-action="circle-calc">Calculate circle</button></div><div id="circle-result" class="answer-panel">Choose radius and angle.</div>`)}
    ${panel("2. Quadrilaterals: properties, area and perimeter",`<p>A quadrilateral is a polygon with four sides. Its interior angles add up to 360°. A rectangle has four right angles; a square has four equal sides and four right angles; a parallelogram has both pairs of opposite sides parallel; a rhombus has four equal sides; a trapezium has one pair of parallel sides. Choose a shape; the relevant dimensions are pre-filled so you only need to change values if you want.</p><div class="experiment-controls"><label>Shape <select id="quad-shape"><option value="rectangle">Rectangle</option><option value="square">Square</option><option value="parallelogram">Parallelogram</option><option value="rhombus">Rhombus</option><option value="trapezium">Trapezium</option></select></label><label id="q1-label">Length <input id="q1" type="number" value="8"></label><label id="q2-label">Breadth <input id="q2" type="number" value="5"></label><label id="q3-label">Side / height <input id="q3" type="number" value="4"></label><label id="q4-label">Side 4 <input id="q4" type="number" value="5"></label><label id="q5-label">Side 5 <input id="q5" type="number" value="5"></label><button data-action="quad-calc">Calculate area & perimeter</button></div><div id="quad-result" class="answer-panel">Choose a shape and calculate.</div><p class="scope-note">For a parallelogram, area needs perpendicular height; for a rhombus, area uses diagonals; for a trapezium, area uses parallel sides and perpendicular height. Perimeter always uses the actual side lengths.</p>`)}
    ${panel("3. Triangles: choose the area method",`<p>Triangle area depends on the information given. Select the method that matches your known measurements.</p><div class="experiment-controls"><label>Method <select id="tri-method"><option value="base">Base × perpendicular height</option><option value="equilateral">Equilateral triangle</option><option value="heron">Heron's formula (three sides)</option></select></label></div><div id="tri-inputs" class="experiment-controls"><label>Base (cm) <input id="tri-a" type="number" value="10"></label><label>Height (cm) <input id="tri-b" type="number" value="6"></label></div><button data-action="triangle-calc">Calculate triangle area</button><div id="tri-result" class="answer-panel">Choose a method and calculate.</div><div class="formula-strip">Base-height: A = ½ × b × h</div><div class="formula-strip">Equilateral: A = (√3 / 4) × a²</div><div class="formula-strip">Heron: A = √[s(s−a)(s−b)(s−c)], where s = (a+b+c)/2</div>`)}
    ${panel("4. Perimeter and area foundations",`<p>Perimeter is the total distance around a 2D shape. Area is the amount of surface covered. Keep units consistent: perimeter uses units such as cm; area uses square units such as cm².</p><div class="concept-grid"><div><b>Rectangle</b><p>P = 2(l+b), A = lb</p></div><div><b>Square</b><p>P = 4a, A = a²</p></div><div><b>Parallelogram</b><p>A = base × perpendicular height</p></div><div><b>Rhombus</b><p>A = ½ × d₁ × d₂</p></div><div><b>Trapezium</b><p>A = ½ × (sum of parallel sides) × height</p></div><div><b>Triangle</b><p>P = sum of three sides</p></div></div>`)}
    ${panel("5. Surface area and volume — formula concepts",`<p>This section covers the syllabus topic without adding a 3D-object builder. Surface area measures the total area covering the outside of a solid; volume measures the space it occupies.</p><div class="concept-grid"><div><b>Cube</b><p>Total surface area = 6a² · Volume = a³</p></div><div><b>Cuboid</b><p>Total surface area = 2(lb + bh + hl) · Volume = lbh</p></div><div><b>Cylinder</b><p>Curved surface area = 2πrh · Volume = πr²h</p></div></div><p class="scope-note">Use only the solid-shape formulas included in your prescribed textbook and teacher's list.</p>`)}
  `;}
  function probability(){return `
    ${panel("1. Probability: understand chance",`<p>Probability measures how likely an event is. It lies between 0 and 1: 0 means impossible and 1 means certain. An outcome is one possible result; an event is a collection of outcomes.</p><h3>Experimental probability</h3><p>Experimental probability is based on what actually happens in repeated trials: observed frequency of an event ÷ total number of trials. It may differ from theoretical probability, especially with few trials. As trials increase, the experimental result often gets closer to the theoretical value, but it is not guaranteed to match exactly.</p><h3>Theoretical probability</h3><p>When outcomes are equally likely, P(E) = number of favourable outcomes ÷ total number of possible outcomes. The sample space is the set of all possible outcomes. For a fair coin, P(heads) = 1/2. For a fair six-sided die, P(even) = 3/6 = 1/2.</p>${step("Example: a coin is tossed 20 times and heads appears 12 times","Experimental P(heads) = 12/20 = 0.6. The theoretical probability for a fair coin is 1/2 = 0.5. The results differ because real experiments vary.")}`)}
    ${panel("Experiment 1 — coin toss simulation",`<p>Run 10, 50 or 100 virtual tosses. The page records heads and tails and compares observed frequency with the theoretical probability 0.5.</p><div class="button-row"><button data-action="coin" data-trials="10">Toss 10 times</button><button data-action="coin" data-trials="50">Toss 50 times</button><button data-action="coin" data-trials="100">Toss 100 times</button><button data-action="coin-reset">Reset</button></div><div id="coin-result" class="answer-panel">No trials yet. Start an experiment.</div>`)}
    ${panel("Experiment 2 — dice probability",`<p>Roll a fair six-sided die repeatedly and compare how often each face appears. The theoretical probability of any one face is 1/6.</p><div class="button-row"><button data-action="dice" data-trials="30">Roll 30 times</button><button data-action="dice" data-trials="100">Roll 100 times</button><button data-action="dice-reset">Reset</button></div><div id="dice-result" class="answer-panel">No rolls yet.</div>`)}
    ${panel("2. Statistics: organise and describe data",`<p>Statistics is the process of collecting, organising, presenting and interpreting data. A data set is a collection of observations.</p><div class="concept-grid"><div><b>Mean</b><p>Sum of all observations ÷ number of observations. It uses every value and is affected by extreme values.</p></div><div><b>Median</b><p>Middle value after arranging data in ascending order. For an even count, average the two middle values.</p></div><div><b>Mode</b><p>Value that occurs most often. A data set may have one mode, more than one mode, or no mode.</p></div></div>${step("Example: 2, 3, 3, 5, 7","Mean = 20/5 = 4. Median = 3 (middle value). Mode = 3 (most frequent value).")}
      <p class="instruction">Experiment — enter a list of numbers separated by commas. The tool sorts the data and shows each calculation.</p><label class="wide-label">Data values <input id="stats-data" type="text" value="2, 3, 3, 5, 7" placeholder="e.g. 4, 6, 6, 8, 10"></label><button data-action="stats-calc">Calculate mean, median and mode</button><div id="stats-result" class="answer-panel">Enter data and calculate.</div>`)}
  `;}
  function patterns(){return `
    ${panel("1. Number system foundations",`<p>Numbers can be classified into sets. Natural numbers (1, 2, 3, …) are counting numbers. Whole numbers include 0. Integers include negative whole numbers, zero and positive whole numbers. Rational numbers can be written as p/q where p and q are integers and q ≠ 0; their decimal expansion terminates or repeats. A rational number can be represented on the number line by locating its value between integers. Between any two distinct rational numbers, there are infinitely many rational numbers (for example, their average is another rational number between them). Irrational numbers cannot be written as such a fraction; their decimal expansions are non-terminating and non-repeating. Real numbers include both rational and irrational numbers.</p><div class="concept-grid"><div><b>Natural numbers</b><p>1, 2, 3, 4, …</p></div><div><b>Whole numbers</b><p>0, 1, 2, 3, …</p></div><div><b>Integers</b><p>…, −3, −2, −1, 0, 1, 2, 3, …</p></div><div><b>Rational numbers</b><p>5/8, −3, 0.75, 0.333…</p></div><div><b>Irrational numbers</b><p>√2, √3, π</p></div><div><b>Real numbers</b><p>All rational and irrational numbers together.</p></div></div>${step("Example: classify 0.125","0.125 = 125/1000 = 1/8, so it is rational. Its decimal expansion terminates.")}${step("Example: classify √49 and √7","√49 = 7, so it is rational. √7 is not a perfect-square root and is irrational.")}${step("Rational numbers are dense","For two rational numbers p and q with p < q, their average (p+q)/2 is rational and lies between them. Repeating this idea gives infinitely many rational numbers between them.")}`)}
    ${panel("2. Arithmetic Progression (AP)",`<p>An arithmetic progression is a sequence in which the difference between consecutive terms is constant. This is called the <b>common difference d</b>. The first term is a. If d is positive the sequence increases; if d is negative it decreases; if d = 0 it is constant.</p><div class="formula-strip">a, a+d, a+2d, a+3d, …</div><div class="formula-strip">nth term: aₙ = a + (n−1)d</div><div class="formula-strip">Sum: Sₙ = n/2 [2a + (n−1)d]</div>${step("Example: 4, 7, 10, 13, …","a = 4 and d = 7−4 = 3. The 6th term is a₆ = 4 + (6−1)×3 = 4 + 15 = 19.")}${step("How to recognise an AP","Subtract each term from the next. If the differences are all equal, the sequence is an AP. For 4, 7, 10, 13, the differences are 3, 3, 3.")}`)}
    ${panel("3. Geometric Progression (GP)",`<p>A geometric progression is a sequence in which each term after the first is obtained by multiplying the previous term by a fixed number called the <b>common ratio r</b>. Find r by dividing a term by the term before it (when the divisor is non-zero).</p><div class="formula-strip">a, ar, ar², ar³, …</div><div class="formula-strip">nth term: aₙ = arⁿ⁻¹</div><div class="formula-strip">For r ≠ 1: Sₙ = a(rⁿ − 1)/(r − 1)</div>${step("Example: 2, 6, 18, 54, …","a = 2 and r = 6/2 = 3. The 5th term is a₅ = 2 × 3⁴ = 2 × 81 = 162.")}${step("How to recognise a GP","Divide each term by the previous term. If the ratios are all equal, the sequence is a GP. For 2, 6, 18, 54, each ratio is 3.")}`)}
    ${panel("4. Sequence experiments — AP and GP",`<p>Now test both rules by changing the first term, common difference or common ratio, and the number of terms.</p><h3>AP experiment</h3><div class="experiment-controls"><label>First term a <input id="ap-a" type="number" value="4"></label><label>Common difference d <input id="ap-d" type="number" value="3"></label><label>Number of terms n <input id="ap-n" type="number" min="1" max="30" value="6"></label><button data-action="ap-calc">Generate AP</button></div><div id="ap-result" class="answer-panel">Your AP terms and nth term appear here.</div><h3>GP experiment</h3><div class="experiment-controls"><label>First term a <input id="gp-a" type="number" value="2"></label><label>Common ratio r <input id="gp-r" type="number" value="3" step="0.5"></label><label>Number of terms n <input id="gp-n" type="number" min="1" max="30" value="5"></label><button data-action="gp-calc">Generate GP</button></div><div id="gp-result" class="answer-panel">Your GP terms and nth term appear here.</div>`)}
  `;}
  function reasoning(){return `
    ${panel("1. Propositions and their converses",`<p>A <b>proposition</b> is a declarative sentence that has exactly one truth value: true or false. Questions, commands, requests and open sentences containing an unspecified variable are not propositions because their truth cannot be decided as written.</p><p>A conditional proposition has the form <b>If P, then Q</b>. P is the hypothesis (condition) and Q is the conclusion. Its <b>converse</b> is formed by swapping them: <b>If Q, then P</b>. Swapping does not guarantee that the converse has the same truth value.</p><p><b>Counterexample:</b> one valid example that makes a universal statement false. To show a statement is false, one counterexample is enough. Always read the number domain carefully (integers, positive integers, real numbers, etc.).</p>${step("Worked example","Original: If an integer is divisible by 4, then it is even — TRUE. Converse: If an integer is even, then it is divisible by 4 — FALSE. Counterexample: 6 is even but is not divisible by 4.")}
      <h3>Explore 36 statement pairs</h3><p>Choose a statement. MathLab will show its converse, evaluate both truth values and explain why. This is a reference set for learning, not a claim that all 36 are from the prescribed textbook.</p><div class="experiment-controls"><label>Choose a statement<select id="logic-type">${logicStatements.map((item,i)=>`<option value="${i}">${String(i+1).padStart(2,'0')}. ${esc(item.original)}</option>`).join('')}</select></label><button data-action="logic-test">Show original and converse</button></div><div id="logic-result" class="answer-panel">Choose any of the 36 statements and select “Show original and converse”.</div>`)}
    ${panel("2. The World of Algorithms",`<p>An algorithm is a finite, ordered set of clear steps for solving a problem. A good algorithm has well-defined inputs, unambiguous steps, and an output. It should finish after a finite number of steps.</p>${step("Example: find the average of three numbers","1. Start. 2. Read a, b, c. 3. Calculate total = a+b+c. 4. Calculate average = total/3. 5. Display average. 6. Stop.")}
      <div class="experiment-controls"><label>First number <input id="alg-a" type="number" value="6"></label><label>Second number <input id="alg-b" type="number" value="9"></label><label>Third number <input id="alg-c" type="number" value="12"></label><button data-action="algorithm">Run average algorithm</button></div><div id="algorithm-result" class="answer-panel">Run the steps to see the output.</div>`)}
  `;}
  function drawGrid(svg, line){
    if(!svg)return; let s=''; for(let i=-5;i<=5;i++){let p=180+i*25;s+=`<line x1="${p}" y1="25" x2="${p}" y2="335" stroke="#e5e9e0"/><line x1="25" y1="${p}" x2="335" y2="${p}" stroke="#e5e9e0"/>`;} s+=`<line x1="180" y1="15" x2="180" y2="345" stroke="#53604c" stroke-width="2"/><line x1="15" y1="180" x2="345" y2="180" stroke="#53604c" stroke-width="2"/>`; if(line){let pts=[];for(let x=-6;x<=6;x+=.25){let y=line.m*x+line.c;if(y>=-6&&y<=6)pts.push(`${180+x*25},${180-y*25}`);}s+=`<polyline points="${pts.join(' ')}" fill="none" stroke="#729b28" stroke-width="3"/>`;s+=`<circle cx="180" cy="${180-line.c*25}" r="4" fill="#d97706"/>`;}svg.innerHTML=s;
  }
  function render(root){
    root.innerHTML=`<div class="workspace-page math-workshop">${header("MATH LABS · LEARN BY DOING","The Mathematics Workshop","Choose a pathway. Each one teaches the idea first, walks through a worked example, and then lets you experiment.")}${pathNav()}<div id="path-content"></div></div>`;
    renderPath(root);
  }
  function renderPath(root){const box=$(root,"#path-content"); const p=paths.find(x=>x[0]===active); box.innerHTML=`<div class="path-title"><div><p class="eyebrow">SELECTED LEARNING PATH</p><h2>${p[1]}</h2><p>${p[2]}</p></div><button class="secondary-button" data-action="all-paths">All pathways</button></div>`+(active==="coordinates"?coordinate():active==="algebra"?algebra():active==="geometry"?geometry():active==="probability"?probability():active==="patterns"?patterns():reasoning());
    if(active==="coordinates"){drawGrid($(root,"#click-plot"));drawGrid($(root,"#line-plot"),{m:2,c:4});$(root,"#line-result").innerHTML="Equation: y = 2x + 4 · slope = 2 · y-intercept = 4 at (0, 4).";}
    if(active==="geometry") updateQuadInputs(root);
    if(active==="algebra") updateIdentityInputs(root);
    if(active==="probability") updateCoin(root);
  }
  function updateQuadInputs(root){let shape=$(root,"#quad-shape")?.value;let config={rectangle:[["Length","Breadth","—","—","—"],[8,5,0,0,0]],square:[["Side","—","—","—","—"],[6,0,0,0,0]],parallelogram:[["Base","Perpendicular height","Side","—","—"],[8,5,6,0,0]],rhombus:[["Diagonal 1","Diagonal 2","Side","—","—"],[8,6,5,0,0]],trapezium:[["Parallel side a","Parallel side b","Height","Non-parallel side c","Non-parallel side d"],[8,4,5,5,5]]}[shape];config[0].forEach((label,i)=>{let lab=$(root,`#q${i+1}-label`);if(lab){lab.firstChild.textContent=label+" ";let input=lab.querySelector('input');if(input){input.disabled=label==="—";if(input.disabled)input.value="0";else input.value=config[1][i];}}});}
  function updateCoin(root){let el=$(root,"#coin-result");if(el)el.innerHTML=`Heads: ${coinStats.heads} · Tails: ${coinStats.tails} · Trials: ${coinStats.heads+coinStats.tails}<br>Experimental P(heads) = ${coinStats.heads+coinStats.tails?(coinStats.heads/(coinStats.heads+coinStats.tails)).toFixed(3):"—"} · Theoretical = 0.500`;
    let d=$(root,"#dice-result");if(d)d.innerHTML=diceCounts.map((n,i)=>`Face ${i+1}: ${n}`).join("<br>")+`<br>Total rolls: ${diceCounts.reduce((a,b)=>a+b,0)}`;}
  function answer(el,html){if(el)el.innerHTML=html;}
  function steps(lines){return lines.map((s,i)=>`<div class="worked-step"><b>Step ${i+1}</b><p>${s}</p></div>`).join("");}
  function bind(root){
    if (boundRoots.has(root)) return;
    boundRoots.add(root);
    root.addEventListener("click",e=>{
      const path=e.target.closest("[data-path]");if(path){active=path.dataset.path;renderPath(root);root.querySelectorAll('[data-path]').forEach(b=>b.classList.toggle('selected',b.dataset.path===active));return;}
      const btn=e.target.closest("[data-action]");if(!btn)return;const a=btn.dataset.action;
      if(a==="all-paths"){root.querySelector('.path-grid').scrollIntoView({behavior:'smooth'});return;}
      if(a==="distance-calc"){let x1=num(root,"ax"),y1=num(root,"ay"),x2=num(root,"bx"),y2=num(root,"by"),dx=x2-x1,dy=y2-y1,d=Math.sqrt(dx*dx+dy*dy);answer($(root,"#distance-result"),steps([`x₂ − x₁ = ${x2} − (${x1}) = ${dx}; y₂ − y₁ = ${y2} − (${y1}) = ${dy}.`,`Distance = √[(${dx})² + (${dy})²] = √${dx*dx+dy*dy} = ${d.toFixed(3)} units.`,`Midpoint = ((${x1}+${x2})/2, (${y1}+${y2})/2) = (${((x1+x2)/2)}, ${((y1+y2)/2)}).`]));}
      if(a==="draw-line"){let raw=$(root,"#line-equation").value.toLowerCase().replace(/\s+/g,"");let m=0,c=0,match;if((match=raw.match(/^y=([+-]?(?:\d*\.?\d+)?)x(?:([+-]\d*\.?\d+))?$/))){let coeff=match[1];m=coeff===""||coeff==="+"?1:coeff==="-"?-1:Number(coeff);c=match[2]?Number(match[2]):0;}else if((match=raw.match(/^y=([+-]?\d*\.?\d+)$/))){m=0;c=Number(match[1]);}else{answer($(root,"#line-result"),"Please use a straight-line equation in the form y = mx + c, for example y = 2x + 4.");return;}if(!Number.isFinite(m)||!Number.isFinite(c)){answer($(root,"#line-result"),"The equation contains an invalid number.");return;}drawGrid($(root,"#line-plot"),{m,c});answer($(root,"#line-result"),`Equation: ${raw.replace("="," = ")} · Slope m = ${m} · y-intercept c = ${c}, at (0, ${c}).`);}
      if(a==="solve-linear"){let aa=num(root,"solve-a"),b=num(root,"solve-b"),c=num(root,"solve-c");if(!aa){answer($(root,"#solve-result"),"Coefficient a cannot be zero for this linear equation.");return;}let x=(c-b)/aa;answer($(root,"#solve-result"),steps([`Start with ${aa}x ${b<0?'−':'+'} ${Math.abs(b)} = ${c}.`,`Subtract ${b} from both sides: ${aa}x = ${c-b}.`,`Divide both sides by ${aa}: x = ${x}.`,`Check: ${aa}(${x}) ${b<0?'−':'+'} ${Math.abs(b)} = ${aa*x+b} = ${c}.`]));}
      if(a==="eval-linear"){let aa=num(root,"eval-a"),b=num(root,"eval-b"),x=num(root,"eval-x"),v=aa*x+b;answer($(root,"#eval-result"),steps([`Expression: ${aa}x ${b<0?'−':'+'} ${Math.abs(b)}.`,`Substitute x = ${x}: ${aa}(${x}) ${b<0?'−':'+'} ${Math.abs(b)}.`,`Multiply: ${aa*x} ${b<0?'−':'+'} ${Math.abs(b)}.`,`Answer: ${v}.`]));}
      if(a==="test-identity"){
        let i=num(root,"identity-choice"),id=identities[i];if(!id)return;
        let vals={};id.vars.forEach(k=>{vals[k]=num(root,`id-${k}`);});
        const fmt=n=>Number.isInteger(n)?String(n):Number(n.toFixed(6)).toString();
        const lhs=id.L(vals),rhs=id.R(vals),sub=id.vars.map(k=>`${k} = ${vals[k]}`).join(", ");
        answer($(root,"#identity-result"),steps([`Selected identity: ${id.left} = ${id.right}.`,`Values entered: ${sub}.`,`Left-hand side: ${id.showL(vals,fmt)}.`,`Right-hand side: ${id.showR(vals,fmt)}.`,`Comparison: ${fmt(lhs)} ${Math.abs(lhs-rhs)<1e-9?"=" : "≠"} ${fmt(rhs)}. ${Math.abs(lhs-rhs)<1e-9?"Both sides match for these values.":"The values do not match—check the identity or the calculation."} A numerical test checks an example; the algebraic identity itself is established by expansion/factorisation.`]));
      }
      if(a==="two-variable"||a==="two-roots"||a==="two-solve-y"||a==="two-solve-x"){
        let aa=num(root,"two-a"),b=num(root,"two-b"),c=num(root,"two-c");
        if(!aa&&!b){answer($(root,a==="two-variable"?"#two-result":a==="two-roots"?"#two-roots-result":"#two-solve-result"),"At least one coefficient of x or y must be non-zero.");return;}
        if(a==="two-variable"){
          let rows=[];for(let x=-5;x<=5;x++){if(b!==0){let y=(c-aa*x)/b;if(Number.isInteger(y))rows.push(`(${x}, ${y})`);}else if(aa!==0&&Math.abs(x-c/aa)<1e-9)rows.push(`x = ${x}; any y`);}
          answer($(root,"#two-result"),`Equation: ${aa}x + ${b}y = ${c}<br>Integer solutions from x = −5 to 5: ${rows.join(", ")||"No integer y-values in this range."}`);
          let svg=$(root,"#two-plot");drawGrid(svg);if(b!==0){let pts=[];for(let x=-6;x<=6;x+=.25){let y=(c-aa*x)/b;if(y>=-6&&y<=6)pts.push(`${180+x*25},${180-y*25}`);}svg.innerHTML+=`<polyline points="${pts.join(' ')}" fill="none" stroke="#729b28" stroke-width="3"/>`;}
        } else if(a==="two-roots"){
          let xText=aa!==0?`Set y = 0: ${aa}x = ${c}, so x = ${c/aa}. X-intercept (root on x-axis) = (${c/aa}, 0).`:c===0?"Set y = 0: every point on the x-axis satisfies the equation, so there is no single x-intercept.":"Set y = 0: the equation becomes 0 = "+c+", so there is no x-intercept.";
          let yText=b!==0?`Set x = 0: ${b}y = ${c}, so y = ${c/b}. Y-intercept (root on y-axis) = (0, ${c/b}).`:c===0?"Set x = 0: every point on the y-axis satisfies the equation, so there is no single y-intercept.":"Set x = 0: the equation becomes 0 = "+c+", so there is no y-intercept.";
          answer($(root,"#two-roots-result"),steps([`Equation: ${aa}x + ${b}y = ${c}.`,`Find the x-intercept by putting y = 0. ${xText}`,`Find the y-intercept by putting x = 0. ${yText}`,"These intercepts are the line's axis roots. They were calculated directly; no graph was created or changed."]));
        } else if(a==="two-solve-y"){
          let x=num(root,"two-given-x");if(b===0){answer($(root,"#two-solve-result"),"The coefficient of y is zero, so this equation cannot determine y for the given x.");return;}let y=(c-aa*x)/b;answer($(root,"#two-solve-result"),steps([`Given x = ${x}.`,`Substitute into ${aa}x + ${b}y = ${c}: ${aa}(${x}) + ${b}y = ${c}.`,`Simplify: ${aa*x} + ${b}y = ${c}.`,`Isolate y: y = (${c} − ${aa*x}) ÷ ${b} = ${y}.`,`Solution: (${x}, ${y}).`]));
        } else {
          let y=num(root,"two-given-y");if(aa===0){answer($(root,"#two-solve-result"),"The coefficient of x is zero, so this equation cannot determine x for the given y.");return;}let x=(c-b*y)/aa;answer($(root,"#two-solve-result"),steps([`Given y = ${y}.`,`Substitute into ${aa}x + ${b}y = ${c}: ${aa}x + ${b}(${y}) = ${c}.`,`Simplify: ${aa}x + ${b*y} = ${c}.`,`Isolate x: x = (${c} − ${b*y}) ÷ ${aa} = ${x}.`,`Solution: (${x}, ${y}).`]));
        }
      }
      if(a==="circle-calc"){let r=num(root,"circle-r"),t=num(root,"circle-angle");if(r<=0||t<0||t>360){answer($(root,"#circle-result"),"Enter a positive radius and an angle between 0° and 360°.");return;}let c=2*Math.PI*r,ar=Math.PI*r*r,s=ar*t/360,arc=c*t/360;answer($(root,"#circle-result"),steps([`Diameter = 2r = 2 × ${r} = ${(2*r).toFixed(2)} cm.`,`Circumference = 2πr = ${c.toFixed(2)} cm.`,`Area = πr² = ${ar.toFixed(2)} cm².`,`Sector area = (${t}/360) × π × ${r}² = ${s.toFixed(2)} cm².`,`Arc length = (${t}/360) × 2π × ${r} = ${arc.toFixed(2)} cm.`]));}
      if(a==="quad-calc"){let sh=$(root,"#quad-shape").value,u=num(root,"q1"),v=num(root,"q2"),w=num(root,"q3"),q4=num(root,"q4"),q5=num(root,"q5"),area=0,per=0,detail="";if(sh==="rectangle"){area=u*v;per=2*(u+v);detail="Area = length × breadth; perimeter = 2(length + breadth).";}if(sh==="square"){area=u*u;per=4*u;detail="Area = side²; perimeter = 4 × side.";}if(sh==="parallelogram"){area=u*v;per=2*(u+w);detail="Area = base × perpendicular height; perimeter = 2(base + side).";}if(sh==="rhombus"){area=u*v/2;per=4*w;detail="Area = ½ × diagonal₁ × diagonal₂; perimeter = 4 × side.";}if(sh==="trapezium"){area=(u+v)*w/2;per=u+v+q4+q5;detail="Area = ½ × (sum of parallel sides) × perpendicular height; perimeter = sum of all four sides.";}if([u,v,w,q4,q5].some(n=>n<0)){answer($(root,"#quad-result"),"Dimensions cannot be negative.");return;}answer($(root,"#quad-result"),steps([`Selected shape: ${sh}. ${detail}`,`Substitute the dimensions: area = ${area.toFixed(2)} square units.`,`Perimeter = ${per.toFixed(2)} units.`]));}
      if(a==="triangle-calc"){let m=$(root,"#tri-method").value,x=num(root,"tri-a"),y=num(root,"tri-b"),z=num(root,"tri-c"),area=0,lines=[];if(m==="base"){if(x<=0||y<=0){answer($(root,"#tri-result"),"Base and perpendicular height must be positive.");return;}area=x*y/2;lines=[`A = ½ × base × height.`,`A = ½ × ${x} × ${y} = ${area.toFixed(2)} cm².`];}else if(m==="equilateral"){if(x<=0){answer($(root,"#tri-result"),"Side length must be positive.");return;}area=Math.sqrt(3)*x*x/4;lines=[`All three sides are equal: a = ${x} cm.`,`A = (√3/4) × a² = (√3/4) × ${x}² = ${area.toFixed(2)} cm².`];}else{let s=(x+y+z)/2,rad=s*(s-x)*(s-y)*(s-z);if(x<=0||y<=0||z<=0||x+y<=z||x+z<=y||y+z<=x||rad<=0){answer($(root,"#tri-result"),"These side lengths do not form a valid triangle. Check the triangle inequality.");return;}area=Math.sqrt(rad);lines=[`Semi-perimeter s = (${x}+${y}+${z})/2 = ${s}.`,`A = √[s(s−a)(s−b)(s−c)].`,`A = √[${s}(${s-x})(${s-y})(${s-z})] = ${area.toFixed(2)} cm².`];}answer($(root,"#tri-result"),steps(lines));}
      if(a==="coin"){let n=Number(btn.dataset.trials);for(let i=0;i<n;i++)Math.random()<.5?coinStats.heads++:coinStats.tails++;updateCoin(root);}
      if(a==="coin-reset"){coinStats={heads:0,tails:0};updateCoin(root);}
      if(a==="dice"){for(let i=0;i<Number(btn.dataset.trials);i++)diceCounts[Math.floor(Math.random()*6)]++;updateCoin(root);}
      if(a==="dice-reset"){diceCounts=Array(6).fill(0);updateCoin(root);}
      if(a==="stats-calc"){let raw=$(root,"#stats-data").value.split(/[ ,;]+/).filter(Boolean),arr=raw.map(Number);if(!arr.length||arr.some(n=>!Number.isFinite(n))){answer($(root,"#stats-result"),"Enter a valid comma-separated list of numbers.");return;}arr.sort((x,y)=>x-y);let sum=arr.reduce((s,n)=>s+n,0),mid=Math.floor(arr.length/2),med=arr.length%2?arr[mid]:(arr[mid-1]+arr[mid])/2,counts={};arr.forEach(n=>counts[n]=(counts[n]||0)+1);let max=Math.max(...Object.values(counts)),modes=Object.keys(counts).filter(k=>counts[k]===max);answer($(root,"#stats-result"),steps([`Arrange in ascending order: ${arr.join(", ")}.`,`Mean = sum ÷ count = ${sum} ÷ ${arr.length} = ${(sum/arr.length).toFixed(3)}.`,`Median = ${med} (middle value${arr.length%2?"":"s averaged"}).`,`Mode = ${max===1?"No mode":modes.join(", ")} (highest frequency = ${max}).`]));}
      if(a==="ap-calc"){let first=num(root,"ap-a"),d=num(root,"ap-d"),n=Math.max(1,Math.min(30,Math.floor(num(root,"ap-n",1)))),terms=Array.from({length:n},(_,i)=>first+i*d);answer($(root,"#ap-result"),steps([`First term a = ${first}; common difference d = ${d}.`,`Terms: ${terms.join(", ")}.`,`nth term aₙ = a + (n−1)d = ${first} + (${n}−1)(${d}) = ${terms[n-1]}.`,`Sum of ${n} terms = ${terms.reduce((s,v)=>s+v,0)}.`]));}
      if(a==="gp-calc"){let first=num(root,"gp-a"),r=num(root,"gp-r"),n=Math.max(1,Math.min(30,Math.floor(num(root,"gp-n",1)))),terms=Array.from({length:n},(_,i)=>first*Math.pow(r,i));answer($(root,"#gp-result"),steps([`First term a = ${first}; common ratio r = ${r}.`,`Terms: ${terms.map(v=>Number(v.toFixed(4))).join(", ")}.`,`nth term aₙ = arⁿ⁻¹ = ${first} × ${r}^${n-1} = ${terms[n-1]}.`,`Sum of ${n} terms = ${terms.reduce((s,v)=>s+v,0).toFixed(4)}.`]));}
      if(a==="logic-test"){let index=Number($(root,"#logic-type").value),item=logicStatements[index];if(!item)return;answer($(root,"#logic-result"),steps([`Original statement: ${item.original}`,`Original truth value: ${item.originalTruth}.`,`Converse (swap P and Q): ${item.converse}`,`Converse truth value: ${item.converseTruth}.`,`Reason / counterexample: ${item.reason}`]));}
      if(a==="algorithm"){let x=num(root,"alg-a"),y=num(root,"alg-b"),z=num(root,"alg-c"),sum=x+y+z;answer($(root,"#algorithm-result"),steps([`Input values: ${x}, ${y}, ${z}.`,`Add the values: ${x} + ${y} + ${z} = ${sum}.`,`Divide by 3: ${sum} ÷ 3 = ${(sum/3).toFixed(3)}.`,`Output: average = ${(sum/3).toFixed(3)}.`]));}
    });
    root.addEventListener("change",e=>{if(e.target.id==="quad-shape")updateQuadInputs(root);if(e.target.id==="identity-choice")updateIdentityInputs(root);if(e.target.id==="tri-method"){let m=e.target.value,box=$(root,"#tri-inputs");if(!box)return;box.innerHTML=m==="base"?`<label>Base (cm) <input id="tri-a" type="number" value="10"></label><label>Height (cm) <input id="tri-b" type="number" value="6"></label>`:m==="equilateral"?`<label>Side (cm) <input id="tri-a" type="number" value="6"></label>`:`<label>Side a <input id="tri-a" type="number" value="5"></label><label>Side b <input id="tri-b" type="number" value="6"></label><label>Side c <input id="tri-c" type="number" value="7"></label>`;}});
    root.addEventListener("click",e=>{if(e.target.id==="click-plot"||e.target.closest("#click-plot")){let svg=$(root,"#click-plot"),pt=svg.createSVGPoint();pt.x=e.clientX;pt.y=e.clientY;let p=pt.matrixTransform(svg.getScreenCTM().inverse()),x=Math.max(-6,Math.min(6,Math.round((p.x-180)/25))),y=Math.max(-6,Math.min(6,Math.round((180-p.y)/25)));drawGrid(svg);let px=180+x*25,py=180-y*25;svg.innerHTML+=`<circle cx="${px}" cy="${py}" r="6" fill="#729b28" stroke="white" stroke-width="2"/><text x="${px+8}" y="${py-8}" fill="#20231f" font-size="12">(${x}, ${y})</text>`;let q=x===0&&y===0?"origin":x===0?"on the y-axis":y===0?"on the x-axis":x>0&&y>0?"Quadrant I":x<0&&y>0?"Quadrant II":x<0&&y<0?"Quadrant III":"Quadrant IV";answer($(root,"#plot-result"),`Point: <b>(${x}, ${y})</b><br>Location: <b>${q}</b>. ${x===0||y===0?"A point on an axis is not inside a quadrant.":"The signs of x and y identify its quadrant."}`);}});
  }
  window.MathLabWorkshop={render:function(root){render(root);bind(root);}};
}());
