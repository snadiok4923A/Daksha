// Hand-written 4-week plan shapes for roles where we want a specific flow.
// Roles without an entry use the auto-generated plan (engine/roadmap.js), built from their skill gaps.
//
// `gap` picks the n-th highest-priority gap (0 = biggest) so task text can name real skills.
// Pure module (no React / browser APIs).

const task = (title, kind = 'learn', minutes = 60) => ({ title, kind, minutes })

export const ROADMAP_OVERRIDES = {
  'frontend-developer': [
    {
      title: 'TypeScript fundamentals',
      summary: 'Move from “it compiles” to confident, typed components.',
      skills: ['typescript'],
      tasks: [task('Work through the TypeScript handbook: types, interfaces, generics', 'learn', 120), task('Type the props, state and API responses in one existing project', 'build', 120), task('Replace every `any` with a real type and enable `strict` mode', 'practice', 90), task('Write a short note on the three bugs typing caught for you', 'review', 30)],
      outcome: 'A typed project on your profile.',
    },
    {
      title: 'Advanced React patterns',
      summary: 'Composition, performance and state that scales past a few screens.',
      skills: ['react', 'state-management'],
      tasks: [task('Study compound components, render props and custom hooks', 'learn', 90), task('Refactor one screen into composable components with a custom hook', 'build', 120), task('Profile re-renders and fix two with memoization or state colocation', 'practice', 90), task('Add suspense / lazy loading to one heavy route', 'build', 60)],
      outcome: 'Cleaner, faster components you can explain.',
    },
    {
      title: 'Testing + API architecture',
      summary: 'Make your code safe to change and your data layer predictable.',
      skills: ['testing', 'rest-apis'],
      tasks: [task('Set up Vitest and Testing Library in a project', 'learn', 60), task('Write tests for three components, including loading and error states', 'build', 150), task('Centralize API calls in a client layer with typed responses and retries', 'build', 120), task('Add one end-to-end test for your most important flow', 'practice', 90)],
      outcome: 'Tested code and a clean data layer.',
    },
    {
      title: 'Build a production-ready project',
      summary: 'Bring it together in one project worth leading your portfolio with.',
      skills: ['nextjs', 'ci-cd', 'docker'],
      tasks: [task('Scope a small but real product and write its README first', 'review', 60), task('Build it with Next.js, TypeScript and tests from day one', 'build', 300), task('Add CI that runs lint, tests and a build on every push', 'build', 90), task('Deploy it, add a live link and a short case-study write-up', 'review', 90), task('Update your resume and portfolio with the new project', 'review', 45)],
      outcome: 'A deployed, tested flagship project.',
    },
  ],

  'backend-developer': [
    {
      title: 'API design and authentication',
      summary: 'Design interfaces other developers enjoy using, and secure them.',
      skills: ['rest-apis', 'authentication'],
      tasks: [task('Read the API design guidelines for resources, errors and pagination', 'learn', 90), task('Design an OpenAPI spec for a small service before writing code', 'build', 90), task('Implement JWT or session auth with refresh and role checks', 'build', 150), task('Write a threat checklist for your API and fix two findings', 'practice', 60)],
      outcome: 'A documented, authenticated API.',
    },
    {
      title: 'Databases and performance',
      summary: 'Model data well and make queries fast.',
      skills: ['databases', 'caching'],
      tasks: [task('Model a real domain with relations and write the migrations', 'build', 120), task('Use EXPLAIN to find and fix two slow queries with indexes', 'practice', 90), task('Add a caching layer and measure the before / after', 'build', 90), task('Write up what you learned about trade-offs', 'review', 30)],
      outcome: 'A performance write-up backed by numbers.',
    },
    {
      title: 'Testing and system design',
      summary: 'Gain confidence to change things, and learn to reason about scale.',
      skills: ['testing', 'system-design'],
      tasks: [task('Add unit and integration tests to your service (aim for critical paths)', 'build', 150), task('Study a system-design primer and sketch a URL shortener', 'learn', 90), task('Design a notification system on paper: queues, retries, failure modes', 'practice', 90), task('Get a peer to review your design and note what you missed', 'review', 45)],
      outcome: 'Tested code and two design write-ups.',
    },
    {
      title: 'Ship it to production',
      summary: 'Deploy, observe and document a real service.',
      skills: ['docker', 'deployment', 'ci-cd'],
      tasks: [task('Containerize the service with Docker and a compose file', 'build', 90), task('Add CI with tests and an automated deployment', 'build', 120), task('Add structured logging and a health endpoint', 'build', 60), task('Deploy, add the live URL to your profile and write the README', 'review', 75)],
      outcome: 'A live backend service with CI.',
    },
  ],

  'ai-ml-engineer': [
    {
      title: 'Strengthen the math and statistics core',
      summary: 'Make model behavior intuitive instead of magical.',
      skills: ['math', 'statistics'],
      tasks: [task('Review linear algebra and probability essentials with worked examples', 'learn', 150), task('Implement linear and logistic regression from scratch with NumPy', 'build', 150), task('Explain bias-variance and regularization in a short notebook', 'review', 60), task('Do five statistics practice problems on hypothesis testing', 'practice', 60)],
      outcome: 'A from-scratch notebook you can explain.',
    },
    {
      title: 'Deep learning in practice',
      summary: 'Train, debug and evaluate real neural networks.',
      skills: ['deep-learning', 'data-processing'],
      tasks: [task('Build a clean data pipeline with validation and train / val / test splits', 'build', 120), task('Train a CNN or transformer baseline and track experiments', 'build', 180), task('Diagnose overfitting with learning curves and fix it', 'practice', 90), task('Write up results with an honest error analysis', 'review', 60)],
      outcome: 'An experiment log with clear findings.',
    },
    {
      title: 'Deployment and evaluation',
      summary: 'Turn a notebook into a service people can call.',
      skills: ['model-deployment', 'research'],
      tasks: [task('Wrap your model in a FastAPI service with input validation', 'build', 120), task('Containerize it and add a simple monitoring check', 'build', 90), task('Define metrics and a small evaluation set for regression tests', 'practice', 90), task('Reproduce one result from a recent paper', 'learn', 180)],
      outcome: 'A deployed model with evaluation.',
    },
    {
      title: 'Ship an end-to-end AI project',
      summary: 'One polished project that shows the full loop.',
      skills: ['python', 'git'],
      tasks: [task('Pick a real problem and write a one-page project brief', 'review', 45), task('Build the data, model, API and a small UI', 'build', 360), task('Write a README with results, limits and how to reproduce', 'review', 75), task('Publish the repo and add it to your profile and resume', 'review', 30)],
      outcome: 'A portfolio-ready AI project.',
    },
  ],

  'game-developer': [
    {
      title: '3D math and core gameplay loop',
      summary: 'Get comfortable with the math behind movement and cameras.',
      skills: ['math-3d', 'game-programming'],
      tasks: [task('Review vectors, matrices and quaternions with interactive examples', 'learn', 120), task('Implement a third-person controller with a smooth follow camera', 'build', 180), task('Add coyote time, input buffering and tune game feel', 'practice', 90), task('Record a short clip of the before / after feel', 'review', 30)],
      outcome: 'A controller that feels good to play.',
    },
    {
      title: 'Gameplay systems',
      summary: 'Build reusable systems rather than one-off scripts.',
      skills: ['gameplay-systems', 'game-ai'],
      tasks: [task('Design an ability or inventory system using data-driven assets', 'build', 180), task('Add enemy AI with a state machine and basic pathfinding', 'build', 150), task('Write the system up as a short breakdown with diagrams', 'review', 45)],
      outcome: 'Two reusable systems with a breakdown.',
    },
    {
      title: 'Optimization and polish',
      summary: 'Keep frame times stable on real hardware.',
      skills: ['optimization', 'shaders'],
      tasks: [task('Profile a scene and find the top three frame-time costs', 'practice', 90), task('Reduce draw calls and fix GC spikes; measure the improvement', 'build', 150), task('Write one simple shader effect (dissolve, outline or water)', 'build', 120), task('Note your before / after frame times for the portfolio', 'review', 30)],
      outcome: 'Measured performance wins.',
    },
    {
      title: 'Ship a playable build',
      summary: 'A finished small game beats a large unfinished one.',
      skills: ['git'],
      tasks: [task('Scope a 2-week game with a clear core loop', 'review', 45), task('Build it, then playtest with three people and fix the top issues', 'build', 360), task('Publish a playable build and a 60-second trailer', 'review', 120), task('Add the project to your portfolio with a dev breakdown', 'review', 60)],
      outcome: 'A playable build and trailer.',
    },
  ],

  '3d-designer': [
    { title: 'Modeling and topology', summary: 'Clean geometry makes everything downstream easier.', skills: ['modeling'], tasks: [task('Study edge flow and topology for hard-surface and organic forms', 'learn', 90), task('Model three props from reference with clean quads', 'build', 240), task('Get critique on topology from a community and apply it', 'review', 45)], outcome: 'Three clean, presentable models.' },
    { title: 'Texturing and materials', summary: 'Believable surfaces sell a model.', skills: ['texturing'], tasks: [task('Learn the PBR workflow: albedo, roughness, metalness and normals', 'learn', 90), task('Texture one of your props with a full PBR set', 'build', 180), task('Create a small smart-material you can reuse', 'practice', 90)], outcome: 'A textured hero prop.' },
    {
      title: 'Lighting and rendering',
      summary: 'Lighting decides mood - practice it on purpose.',
      skills: ['lighting', 'rendering'],
      tasks: [task('Recreate three lighting setups: product, dramatic, soft daylight', 'practice', 150), task('Render your props with a clean turntable and beauty shots', 'build', 120), task('Do a simple compositing pass for contrast and color', 'practice', 60)],
      outcome: 'A set of polished renders.',
    },
    {
      title: 'Build a portfolio piece',
      summary: 'One complete scene with a breakdown of your process.',
      skills: ['animation-3d', 'art-fundamentals'],
      tasks: [task('Plan a composed scene with a clear focal point and story', 'review', 60), task('Build the scene, add subtle animation, and render final frames', 'build', 360), task('Publish the breakdown (wireframe, textures, lighting) on Behance', 'review', 90), task('Add the piece to your portfolio site and share it for feedback', 'review', 30)],
      outcome: 'A published portfolio piece with a breakdown.',
    },
  ],

  'ui-ux-designer': [
    {
      title: 'Research and problem framing',
      summary: 'Start from evidence, not opinions.',
      skills: ['ux-research'],
      tasks: [task('Run three short user interviews on a product you care about', 'practice', 150), task('Synthesize findings into insights and a problem statement', 'build', 90), task('Map the current user journey and mark the top three pain points', 'build', 60)],
      outcome: 'A framed problem backed by evidence.',
    },
    { title: 'Wireframes and prototypes', summary: 'Explore quickly, then make it feel real.', skills: ['wireframing', 'prototyping'], tasks: [task('Sketch three solution directions and pick one with reasons', 'build', 90), task('Build a clickable mid-fidelity prototype in Figma', 'build', 180), task('Add micro-interactions to the two key moments', 'practice', 75)], outcome: 'An interactive prototype.' },
    { title: 'Test and refine', summary: 'Let real users break your assumptions.', skills: ['usability-testing', 'accessibility'], tasks: [task('Run five usability sessions and log issues by severity', 'practice', 150), task('Fix the top issues and check contrast, focus and target sizes', 'build', 120), task('Document what changed and why', 'review', 45)], outcome: 'A validated, accessible design.' },
    {
      title: 'Publish a case study',
      summary: 'Tell the story so a stranger understands your thinking.',
      skills: ['storytelling', 'visual-design'],
      tasks: [task('Outline the story: problem, process, decisions, outcome', 'review', 45), task('Write and lay out the case study with real artifacts', 'build', 240), task('Get two reviewers to read it and tighten the first screen', 'review', 60), task('Publish it on your portfolio and share it on Behance or Dribbble', 'review', 30)],
      outcome: 'A published, portfolio-ready case study.',
    },
  ],
}
