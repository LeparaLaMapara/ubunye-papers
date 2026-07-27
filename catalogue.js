// Ubunye Papers — catalogue (shared by the list and the viewer).
// Demo content lives inline here. To use real papers, set type:'pdf' and
// point `file` at the PDF; the viewer will embed it and the app will cache it.
//
// Each entry: id, subject, tag, paper, year, sizeKB, hasMemo, questions[], memo[]

window.CATALOGUE = [
  {
    id: 'maths-p1-2024', subject: 'Mathematics', tag: 'MAT', paper: 'Paper 1',
    year: 2024, duration: '3 hours', marks: 150, sizeKB: 320, hasMemo: true,
    questions: [
      { n: '1.1', marks: 4, text: 'Solve for x: &nbsp;x&sup2; &minus; 5x + 6 = 0', parts: ['By factorisation.', 'State the values of x.'] },
      { n: '1.2', marks: 3, text: 'Solve for x: &nbsp;2x&sup2; &minus; 3x &minus; 7 = 0 (correct to two decimal places).' },
      { n: '2', marks: 5, text: 'The first three terms of an arithmetic sequence are 4 ; 7 ; 10 ; &hellip;', parts: ['Determine the nth term.', 'Which term equals 304?'] },
    ],
    memo: [
      { n: '1.1', text: '(x &minus; 2)(x &minus; 3) = 0 &nbsp;&rarr;&nbsp; x = 2 or x = 3 &nbsp;&#10003;&#10003;' },
      { n: '1.2', text: 'x = 2.77 or x = &minus;1.27 (quadratic formula) &nbsp;&#10003;&#10003;' },
      { n: '2', text: 'Tn = 3n + 1 ; &nbsp;3n + 1 = 304 &rarr; n = 101 &nbsp;&#10003;&#10003;' },
    ],
  },
  {
    id: 'maths-p2-2024', subject: 'Mathematics', tag: 'MAT', paper: 'Paper 2',
    year: 2024, duration: '3 hours', marks: 150, sizeKB: 410, hasMemo: true,
    questions: [
      { n: '1', marks: 5, text: 'The data set: 12 ; 15 ; 15 ; 18 ; 20 ; 24.', parts: ['Calculate the mean.', 'Determine the median.'] },
      { n: '2', marks: 6, text: 'In &#9651;ABC, A(1;2), B(5;2) and C(3;6).', parts: ['Calculate the length of AB.', 'Determine the gradient of AC.'] },
    ],
    memo: [
      { n: '1', text: 'Mean = 104/6 = 17.33 &#10003; ; Median = 16.5 &#10003;' },
      { n: '2', text: 'AB = 4 units &#10003; ; gradient AC = 2 &#10003;' },
    ],
  },
  {
    id: 'physci-p1-2024', subject: 'Physical Sciences', tag: 'PHY', paper: 'Paper 1',
    year: 2024, duration: '3 hours', marks: 150, sizeKB: 480, hasMemo: true,
    questions: [
      { n: '1', marks: 5, text: 'A 2 kg block is pulled along a rough surface by a 15 N force. Friction is 4 N.', parts: ['Draw a labelled free-body diagram.', 'Calculate the acceleration.'] },
      { n: '2', marks: 4, text: 'A ball is thrown vertically upward at 20 m&middot;s&#8315;&sup1;. Ignore air resistance.', parts: ['Calculate the maximum height.', 'Calculate the time to return to the hand.'] },
    ],
    memo: [
      { n: '1', text: 'Fnet = 15 &minus; 4 = 11 N ; a = 11/2 = 5.5 m&middot;s&#8315;&sup2; &#10003;' },
      { n: '2', text: 'h = v&sup2;/2g = 20.4 m &#10003; ; t = 2v/g = 4.08 s &#10003;' },
    ],
  },
  {
    id: 'physci-p2-2024', subject: 'Physical Sciences', tag: 'PHY', paper: 'Paper 2',
    year: 2024, duration: '3 hours', marks: 150, sizeKB: 450, hasMemo: false,
    questions: [
      { n: '1', marks: 4, text: 'Write the balanced equation for the complete combustion of ethane (C&#8322;H&#8326;).' },
      { n: '2', marks: 5, text: 'Define the term <i>rate of reaction</i> and list two factors that increase it.' },
    ],
  },
  {
    id: 'lifesci-p1-2024', subject: 'Life Sciences', tag: 'LIF', paper: 'Paper 1',
    year: 2024, duration: '2&frac12; hours', marks: 150, sizeKB: 300, hasMemo: true,
    questions: [
      { n: '1', marks: 4, text: 'Describe DNA replication and explain why it is called semi-conservative.' },
      { n: '2', marks: 5, text: 'Explain how the structure of the proximal tubule is suited to reabsorption.' },
    ],
    memo: [
      { n: '1', text: 'Strands separate; each acts as a template; each new molecule has one old + one new strand &#10003;' },
      { n: '2', text: 'Long, many mitochondria, microvilli increase surface area &#10003;' },
    ],
  },
  {
    id: 'accounting-2024', subject: 'Accounting', tag: 'ACC', paper: 'Paper 1',
    year: 2024, duration: '2 hours', marks: 150, sizeKB: 360, hasMemo: false,
    questions: [
      { n: '1', marks: 6, text: 'Prepare the Debtors&rsquo; Age Analysis note from the information provided.' },
      { n: '2', marks: 5, text: 'Explain two internal control measures for handling cash.' },
    ],
  },
  {
    id: 'english-p1-2024', subject: 'English HL', tag: 'ENG', paper: 'Paper 1',
    year: 2024, duration: '2 hours', marks: 70, sizeKB: 280, hasMemo: false,
    questions: [
      { n: 'A', marks: 30, text: 'Comprehension: read the passage and answer the questions that follow.' },
      { n: 'B', marks: 10, text: 'Summary: summarise the passage in 90&ndash;100 words.' },
    ],
  },
  {
    id: 'maths-p1-2023', subject: 'Mathematics', tag: 'MAT', paper: 'Paper 1',
    year: 2023, duration: '3 hours', marks: 150, sizeKB: 315, hasMemo: true,
    questions: [
      { n: '1.1', marks: 3, text: 'Solve for x: &nbsp;x(x &minus; 3) = 0' },
      { n: '2', marks: 5, text: 'Consider the geometric series 3 + 6 + 12 + &hellip;', parts: ['Determine the common ratio.', 'Calculate the sum of the first 8 terms.'] },
    ],
    memo: [
      { n: '1.1', text: 'x = 0 or x = 3 &#10003;' },
      { n: '2', text: 'r = 2 &#10003; ; S&#8328; = 3(2&#8312; &minus; 1)/(2 &minus; 1) = 765 &#10003;' },
    ],
  },
  {
    id: 'physci-p1-2023', subject: 'Physical Sciences', tag: 'PHY', paper: 'Paper 1',
    year: 2023, duration: '3 hours', marks: 150, sizeKB: 470, hasMemo: false,
    questions: [
      { n: '1', marks: 5, text: 'Two charges, +3 &micro;C and &minus;2 &micro;C, are 0.4 m apart in a vacuum.', parts: ['Calculate the magnitude of the electrostatic force.', 'State whether it is attractive or repulsive.'] },
      { n: '2', marks: 4, text: 'State Newton&rsquo;s second law of motion in words.' },
    ],
  },
  {
    id: 'lifesci-p1-2023', subject: 'Life Sciences', tag: 'LIF', paper: 'Paper 1',
    year: 2023, duration: '2&frac12; hours', marks: 150, sizeKB: 295, hasMemo: true,
    questions: [
      { n: '1', marks: 6, text: 'Explain how natural selection could lead to antibiotic resistance in bacteria.' },
      { n: '2', marks: 4, text: 'Name the process in the glomerulus and describe what it filters.' },
    ],
    memo: [
      { n: '1', text: 'Variation; resistant survive; reproduce; frequency of resistance gene increases &#10003;' },
      { n: '2', text: 'Ultrafiltration; filters water, salts, glucose, urea (not proteins/cells) &#10003;' },
    ],
  },
  {
    id: 'geography-p1-2023', subject: 'Geography', tag: 'GEO', paper: 'Paper 1',
    year: 2023, duration: '3 hours', marks: 225, sizeKB: 520, hasMemo: false,
    questions: [
      { n: '1', marks: 8, text: 'With the aid of a diagram, explain the formation of a mid-latitude cyclone.' },
      { n: '2', marks: 6, text: 'Discuss two impacts of urbanisation on rural areas.' },
    ],
  },
];
