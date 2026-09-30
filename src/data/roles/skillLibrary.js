// Canonical skill catalog.
//
// Roles (roles.js) reference skills by `id`. User-entered skills ("Node", "node.js", "NodeJS") are
// matched to a catalog entry through aliases, so scoring works on free text.
//
// Fields:
//   id        stable kebab-case id
//   label     display name
//   group     'language' | 'framework' | 'tool' | 'concept'   (drives the skill picker sections)
//   why       one-line "why it matters" shown in skill gap cards
//   aliases   alternative names (normalized, see normalizeSkillKey)
//   effort    typical weeks to move up ONE level (beginner -> intermediate -> ...), default 2
//   related   [[otherSkillId, factor]] - having `otherSkillId` gives partial credit for this skill
//
// Pure module (no React / browser APIs).

const registry = []

function s(id, label, group, why, opts = {}) {
  registry.push({ id, label, group, why, aliases: opts.aliases ?? [], effort: opts.effort ?? 2, related: opts.related ?? [] })
}

/* ------------------------------ languages ------------------------------ */
s('html', 'HTML', 'language', 'Semantic markup is the foundation of accessible, SEO-friendly interfaces.', { aliases: ['html5', 'semantic html', 'markup'], effort: 1, related: [['react', 0.55]] })
s('css', 'CSS', 'language', 'Layout, theming and polish are what make interfaces feel professional.', { aliases: ['css3', 'sass', 'scss', 'less', 'flexbox', 'css grid'], effort: 1.5, related: [['tailwind', 0.7]] })
s('javascript', 'JavaScript', 'language', 'The language of the web - nearly every frontend and many backend roles assume fluency.', {
  aliases: ['js', 'es6', 'ecmascript', 'vanilla js', 'es2015'],
  related: [
    ['typescript', 0.95],
    ['react', 0.6],
    ['nodejs', 0.75],
  ],
})
s('typescript', 'TypeScript', 'language', 'Static typing catches bugs early and is now expected on most modern product teams.', { aliases: ['ts'], effort: 2, related: [] })
s('python', 'Python', 'language', 'The default language for data, AI, automation and a large share of backend work.', { aliases: ['py', 'python3'] })
s('java', 'Java', 'language', 'A staple of enterprise backends, Android and large-scale systems.', { aliases: ['java se', 'jvm', 'j2ee'], effort: 2.5 })
s('cpp', 'C++', 'language', 'Performance-critical software, engines and systems programming rely on C++.', { aliases: ['c++', 'cplusplus', 'cpp17', 'cpp20', 'modern c++'], effort: 3.5 })
s('c', 'C', 'language', 'Close-to-the-metal control matters for embedded, systems and security work.', { aliases: ['c language', 'ansi c', 'embedded c'], effort: 3 })
s('csharp', 'C#', 'language', 'Powers Unity, .NET backends and a lot of enterprise software.', { aliases: ['c#', 'csharp', 'c sharp', 'dotnet c#'], effort: 2.5 })
s('go', 'Go', 'language', 'Simple, fast and common in cloud infrastructure and high-throughput services.', { aliases: ['golang'] })
s('rust', 'Rust', 'language', 'Memory-safe systems programming with growing adoption in infrastructure and tooling.', { aliases: ['rustlang'], effort: 3.5 })
s('kotlin', 'Kotlin', 'language', 'The modern default for native Android development.', { aliases: ['kotlin android'] })
s('swift', 'Swift', 'language', 'The primary language for native iOS and macOS apps.', { aliases: ['swiftui'] })
s('dart', 'Dart', 'language', 'The language behind Flutter cross-platform apps.', { aliases: [] })
s('sql', 'SQL', 'language', 'Querying and shaping data is a daily skill across analytics, data and backend roles.', { aliases: ['t-sql', 'pl/sql', 'plsql', 'sql queries'], related: [['databases', 0.8]] })
s('bash', 'Shell scripting', 'language', 'Automation in the terminal saves hours and is essential in ops and security.', { aliases: ['bash', 'shell', 'zsh', 'powershell', 'sh', 'command line', 'cli'], effort: 1.5 })
s('solidity', 'Solidity', 'language', 'The main language for writing Ethereum-compatible smart contracts.', { aliases: ['vyper'], effort: 3 })
s('php', 'PHP', 'language', 'Still powers a large portion of the web, including WordPress and Laravel apps.', { aliases: ['laravel'] })
s('ruby', 'Ruby', 'language', 'Productive language behind Rails, popular in startups.', { aliases: ['ruby on rails', 'rails'] })
s('r', 'R', 'language', 'A statistical computing language widely used in research and analytics.', { aliases: ['rlang', 'r language', 'rstudio'] })
s('lua', 'Lua', 'language', 'A lightweight scripting language embedded in many game engines.', { aliases: [] })

/* --------------------------- frameworks & libs -------------------------- */
s('react', 'React', 'framework', 'Component-driven UI is the backbone of most modern product interfaces.', { aliases: ['reactjs', 'react.js', 'react hooks', 'jsx'], effort: 3, related: [['nextjs', 0.92]] })
s('nextjs', 'Next.js', 'framework', 'Server rendering and routing conventions make Next.js the default React framework at many companies.', { aliases: ['next', 'next.js', 'nextjs', 'app router'], effort: 2 })
s('vue', 'Vue', 'framework', 'A approachable, widely used alternative to React with a strong ecosystem.', { aliases: ['vuejs', 'vue.js', 'nuxt', 'nuxtjs', 'pinia'], effort: 2.5, related: [['react', 0.5]] })
s('angular', 'Angular', 'framework', 'A full framework common in large enterprise frontends.', { aliases: ['angularjs', 'angular 2+', 'rxjs'], effort: 3, related: [['react', 0.45]] })
s('svelte', 'Svelte', 'framework', 'A compiler-first framework with a loyal community and great performance.', { aliases: ['sveltekit'], related: [['react', 0.5]] })
s('tailwind', 'Tailwind CSS', 'framework', 'Utility-first styling speeds up consistent, responsive UI work.', { aliases: ['tailwindcss', 'tailwind css'], effort: 1 })
s('nodejs', 'Node.js', 'framework', 'JavaScript on the server enables full-stack teams to share one language.', { aliases: ['node', 'node.js', 'nodejs', 'deno', 'bun'], effort: 2.5, related: [['javascript', 0.45]] })
s('express', 'Express', 'framework', 'The most common minimal web framework for Node.js APIs.', { aliases: ['express.js', 'expressjs', 'koa', 'fastify'], effort: 1.5, related: [['nodejs', 0.7]] })
s('nestjs', 'NestJS', 'framework', 'An opinionated, scalable structure for TypeScript backends.', { aliases: ['nest.js', 'nest'], effort: 2, related: [['express', 0.85]] })
s('django', 'Django', 'framework', 'A batteries-included Python framework for shipping backends quickly.', { aliases: ['django rest framework', 'drf'], effort: 2.5 })
s('flask', 'Flask', 'framework', 'A lightweight Python web framework for APIs and services.', { aliases: [], effort: 1.5 })
s('fastapi', 'FastAPI', 'framework', 'Modern async Python APIs with automatic docs and validation.', { aliases: ['fast api', 'pydantic'], effort: 1.5 })
s('spring-boot', 'Spring Boot', 'framework', 'The de-facto framework for production Java services.', { aliases: ['spring', 'spring framework', 'spring mvc', 'spring cloud'], effort: 3 })
s('dotnet', '.NET', 'framework', 'Microsoft’s cross-platform stack for APIs, desktop and cloud apps.', { aliases: ['.net', 'dotnet', 'asp.net', 'asp.net core', 'net core', 'entity framework'], effort: 3 })
s('react-native', 'React Native', 'framework', 'Ship iOS and Android apps from one React codebase.', { aliases: ['reactnative', 'expo'], effort: 2.5, related: [['react', 0.6]] })
s('flutter', 'Flutter', 'framework', 'A fast-growing cross-platform toolkit for polished mobile UIs.', { aliases: [], effort: 2.5 })
s('android', 'Android SDK', 'framework', 'Native Android development with modern Jetpack libraries.', { aliases: ['android development', 'jetpack compose', 'android studio', 'android sdk'], effort: 3, related: [['kotlin', 0.6]] })
s('ios', 'iOS development', 'framework', 'Native iOS development with UIKit and SwiftUI.', { aliases: ['ios', 'uikit', 'xcode', 'swiftui', 'ios sdk'], effort: 3, related: [['swift', 0.6]] })
s('pytorch', 'PyTorch', 'framework', 'The leading deep-learning framework in research and increasingly in production.', { aliases: ['torch'], effort: 3, related: [['deep-learning', 0.6]] })
s('tensorflow', 'TensorFlow', 'framework', 'A mature deep-learning framework with a strong deployment story.', { aliases: ['keras', 'tf'], effort: 3, related: [['deep-learning', 0.6]] })
s('scikit-learn', 'scikit-learn', 'framework', 'The standard toolkit for classical machine-learning workflows in Python.', { aliases: ['sklearn', 'scikit learn'], effort: 2, related: [['machine-learning', 0.65]] })
s('pandas', 'Pandas & NumPy', 'framework', 'Day-to-day data wrangling in Python runs on Pandas and NumPy.', { aliases: ['pandas', 'numpy', 'scipy', 'polars'], effort: 2, related: [['data-processing', 0.8]] })
s('opencv', 'OpenCV', 'framework', 'The workhorse library for classical computer-vision pipelines.', { aliases: ['cv2', 'open cv'], effort: 2, related: [['computer-vision', 0.6]] })
s('huggingface', 'Hugging Face', 'framework', 'Pretrained models and tooling that accelerate NLP and generative work.', {
  aliases: ['transformers', 'hugging face', 'huggingface transformers', 'langchain', 'llamaindex'],
  effort: 2,
  related: [
    ['llms', 0.55],
    ['nlp', 0.55],
  ],
})
s('spark', 'Apache Spark', 'framework', 'Distributed processing for datasets too large for one machine.', { aliases: ['pyspark', 'spark', 'databricks', 'hadoop', 'big data'], effort: 3 })
s('airflow', 'Airflow & dbt', 'framework', 'Orchestration and transformation tooling for reliable data pipelines.', { aliases: ['apache airflow', 'dbt', 'prefect', 'dagster'], effort: 2, related: [['data-pipelines', 0.7]] })
s('unity', 'Unity', 'framework', 'One of the most widely used engines for games, XR and interactive apps.', { aliases: ['unity3d', 'unity engine', 'unity 3d'], effort: 3, related: [['csharp', 0.3]] })
s('unreal', 'Unreal Engine', 'framework', 'High-fidelity engine used for AAA games, film and real-time visualization.', { aliases: ['unreal engine 5', 'ue5', 'ue4', 'unreal engine 4', 'unrealengine', 'unreal'], effort: 3.5 })
s('threejs', 'Three.js & WebGL', 'framework', '3D on the web powers product configurators, data art and immersive sites.', { aliases: ['three.js', 'three', 'webgl', 'webgpu', 'react three fiber', 'r3f', 'babylon.js'], effort: 3 })
s('ros', 'ROS', 'framework', 'The standard middleware for building and testing robot software.', { aliases: ['ros2', 'robot operating system', 'gazebo'], effort: 3.5 })
s('web3', 'Web3 tooling', 'framework', 'Libraries and frameworks for wallets, dApps and contract testing.', { aliases: ['ethers.js', 'ethers', 'web3.js', 'hardhat', 'foundry', 'truffle', 'wagmi', 'viem', 'metamask'], effort: 2 })

/* --------------------------- tools & platforms -------------------------- */
s('git', 'Git', 'tool', 'Version control is table stakes for collaborating on any codebase.', { aliases: ['github', 'gitlab', 'bitbucket', 'version control', 'git flow', 'pull requests'], effort: 1 })
s('docker', 'Docker', 'tool', 'Containers make apps portable and are the starting point of most deployment pipelines.', { aliases: ['containers', 'docker compose', 'dockerfile', 'containerization'], effort: 1.5 })
s('kubernetes', 'Kubernetes', 'tool', 'The standard for orchestrating containers at scale.', { aliases: ['k8s', 'helm', 'eks', 'gke', 'aks', 'openshift'], effort: 3.5, related: [['docker', 0.35]] })
s('ci-cd', 'CI/CD', 'tool', 'Automated build, test and deploy pipelines let teams ship safely and often.', { aliases: ['cicd', 'ci/cd', 'github actions', 'jenkins', 'gitlab ci', 'circleci', 'continuous integration', 'continuous delivery', 'pipelines'], effort: 1.5 })
s('terraform', 'Infrastructure as Code', 'tool', 'Codifying infrastructure makes environments reproducible and reviewable.', { aliases: ['terraform', 'iac', 'pulumi', 'cloudformation', 'infrastructure as code', 'bicep'], effort: 2.5 })
s('ansible', 'Ansible', 'tool', 'Agentless configuration management for repeatable server setup.', { aliases: ['chef', 'puppet', 'configuration management'], effort: 2 })
s('aws', 'AWS', 'tool', 'The largest cloud platform - knowing it opens a wide range of backend and infra roles.', { aliases: ['amazon web services', 'ec2', 's3', 'lambda', 'aws cloud'], effort: 3 })
s('azure', 'Azure', 'tool', 'Microsoft’s cloud platform, dominant in enterprise environments.', { aliases: ['microsoft azure', 'azure devops'], effort: 3 })
s('gcp', 'Google Cloud', 'tool', 'Google’s cloud platform with strong data and ML services.', { aliases: ['google cloud platform', 'gcp', 'bigquery', 'firebase', 'cloud run'], effort: 3 })
s('linux', 'Linux', 'tool', 'Most servers, containers and security tooling run on Linux.', { aliases: ['ubuntu', 'debian', 'unix', 'linux administration', 'sysadmin', 'centos'], effort: 2 })
s('figma', 'Figma', 'tool', 'The collaborative design tool most product teams build in.', { aliases: ['figjam', 'figma prototyping', 'auto layout'], effort: 1.5 })
s('photoshop', 'Image editing', 'tool', 'Photo editing and compositing skills support nearly every visual discipline.', { aliases: ['photoshop', 'adobe photoshop', 'illustrator', 'adobe illustrator', 'affinity', 'gimp', 'krita'], effort: 1.5 })
s('after-effects', 'After Effects', 'tool', 'Industry-standard motion graphics and compositing software.', { aliases: ['adobe after effects', 'aftereffects', 'ae', 'premiere', 'davinci resolve', 'cinema 4d', 'c4d'], effort: 2.5 })
s('blender', 'Blender', 'tool', 'A free, fast-evolving 3D suite used from indie games to film.', { aliases: ['blender3d', 'blender 3d', 'geometry nodes'], effort: 3 })
s('maya', 'Maya', 'tool', 'A studio-standard 3D package for modeling, rigging and animation.', { aliases: ['autodesk maya', 'maya 3d'], effort: 3.5 })
s('3dsmax', '3ds Max', 'tool', 'Widely used in architectural visualization and game asset production.', { aliases: ['3ds max', '3d studio max', '3dsmax', 'autodesk 3ds max'], effort: 3 })
s('zbrush', 'ZBrush', 'tool', 'The leading digital sculpting tool for high-detail characters and props.', { aliases: ['z brush', 'mudbox'], effort: 3 })
s('substance', 'Substance', 'tool', 'Procedural and PBR texturing tools used across games and film.', { aliases: ['substance painter', 'substance designer', 'adobe substance', 'quixel', 'marmoset'], effort: 2.5 })
s('houdini', 'Houdini', 'tool', 'Node-based procedural workflows for VFX, simulation and tools.', { aliases: ['sidefx houdini', 'houdini fx'], effort: 4 })
s('excel', 'Excel & Sheets', 'tool', 'Spreadsheets remain the everyday analysis tool for business teams.', { aliases: ['excel', 'google sheets', 'spreadsheets', 'microsoft excel', 'vlookup', 'pivot tables'], effort: 1.5 })
s('bi-tools', 'Tableau & Power BI', 'tool', 'Dashboarding tools turn analysis into decisions stakeholders actually use.', { aliases: ['tableau', 'power bi', 'powerbi', 'looker', 'metabase', 'bi tools', 'data studio', 'superset'], effort: 2, related: [['data-visualization', 0.85]] })
s('security-tools', 'Security tooling', 'tool', 'Hands-on fluency with scanners and proxies is how findings get proven.', { aliases: ['burp suite', 'burpsuite', 'nmap', 'wireshark', 'metasploit', 'kali linux', 'kali', 'owasp zap', 'nessus', 'ghidra'], effort: 2 })
s('siem', 'SIEM & log analysis', 'tool', 'Detecting threats means searching and correlating large volumes of logs.', { aliases: ['splunk', 'elk', 'elk stack', 'elastic', 'sentinel', 'qradar', 'soc', 'log analysis', 'chronicle'], effort: 2.5 })
s('monitoring', 'Monitoring & observability', 'tool', 'You can only keep systems reliable if you can see how they behave.', { aliases: ['prometheus', 'grafana', 'datadog', 'observability', 'logging', 'new relic', 'opentelemetry', 'sentry', 'tracing'], effort: 2 })

/* ------------------------------- concepts ------------------------------- */
// Web / software
s('responsive-design', 'Responsive design', 'concept', 'Users arrive on every screen size - responsive layouts are a baseline expectation.', {
  aliases: ['responsive', 'mobile first', 'media queries', 'adaptive design', 'responsive web design'],
  effort: 1.5,
  related: [
    ['css', 0.55],
    ['tailwind', 0.6],
  ],
})
s('ui-implementation', 'UI implementation', 'concept', 'Turning designs into pixel-accurate, reusable components is the heart of frontend work.', {
  aliases: ['ui development', 'ui engineering', 'component development', 'pixel perfect', 'design implementation', 'component libraries', 'storybook'],
  effort: 2.5,
  related: [
    ['react', 0.5],
    ['figma', 0.3],
  ],
})
s('accessibility', 'Accessibility', 'concept', 'Accessible products reach more people and are increasingly a legal and hiring requirement.', { aliases: ['a11y', 'wcag', 'aria', 'inclusive design', 'web accessibility'], effort: 2 })
s('web-performance', 'Web performance', 'concept', 'Fast sites convert better and rank higher - performance skills set seniors apart.', { aliases: ['performance optimization web', 'core web vitals', 'lighthouse', 'lazy loading', 'bundle optimization', 'web vitals'], effort: 2.5 })
s('state-management', 'State management', 'concept', 'Predictable state handling keeps large interfaces maintainable.', { aliases: ['redux', 'zustand', 'mobx', 'recoil', 'context api', 'react query', 'tanstack query', 'ngrx', 'vuex', 'jotai'], effort: 1.5 })
s('animation', 'Animation & motion', 'concept', 'Purposeful motion makes interfaces feel responsive and polished.', { aliases: ['css animation', 'framer motion', 'gsap', 'lottie', 'web animation', 'motion', 'animations'], effort: 2 })
s('rest-apis', 'REST APIs', 'concept', 'Almost every product talks to services over HTTP - integrating and designing APIs is core.', {
  aliases: ['rest', 'restful', 'api integration', 'apis', 'api', 'http', 'rest api', 'fetch', 'axios', 'api development', 'openapi', 'swagger', 'postman'],
  effort: 2,
  related: [
    ['graphql', 0.8],
    ['express', 0.5],
    ['fastapi', 0.6],
    ['django', 0.5],
    ['spring-boot', 0.5],
  ],
})
s('graphql', 'GraphQL', 'concept', 'A flexible query layer adopted by many product and platform teams.', { aliases: ['apollo', 'graph ql', 'relay'], effort: 2 })
s('authentication', 'Authentication & security', 'concept', 'Handling identity and permissions correctly protects users and your company.', { aliases: ['auth', 'jwt', 'oauth', 'oauth2', 'sessions', 'authorization', 'openid', 'sso', 'rbac', 'passport'], effort: 2 })
s('databases', 'Databases', 'concept', 'Modeling and querying data well is central to almost every backend.', { aliases: ['database', 'mongodb', 'postgresql', 'postgres', 'mysql', 'sqlite', 'redis', 'nosql', 'dynamodb', 'database design', 'dbms', 'mariadb', 'firestore', 'supabase', 'prisma', 'orm', 'cassandra', 'sql server'], effort: 2.5, related: [['sql', 0.9]] })
s('data-modeling', 'Data modeling', 'concept', 'Good schemas and warehouse models make analytics fast and trustworthy.', { aliases: ['dimensional modeling', 'star schema', 'data warehouse', 'data warehousing', 'schema design', 'snowflake'], effort: 2.5, related: [['databases', 0.6]] })
s('system-design', 'System design', 'concept', 'Designing scalable, reliable systems is how engineers grow into senior roles.', { aliases: ['software architecture', 'architecture', 'scalability', 'distributed systems', 'high level design', 'hld', 'lld', 'low level design', 'backend architecture'], effort: 4 })
s('microservices', 'Microservices', 'concept', 'Service-oriented architectures are common in larger organizations.', { aliases: ['service oriented architecture', 'soa', 'event driven', 'event-driven architecture', 'grpc'], effort: 3, related: [['system-design', 0.4]] })
s('caching', 'Caching & performance', 'concept', 'Smart caching is often the cheapest way to make a backend dramatically faster.', { aliases: ['cdn', 'memcached', 'cache', 'performance tuning'], effort: 1.5, related: [['databases', 0.25]] })
s('message-queues', 'Message queues & streaming', 'concept', 'Asynchronous processing keeps systems decoupled and resilient.', { aliases: ['kafka', 'rabbitmq', 'sqs', 'pubsub', 'event streaming', 'nats', 'redis streams', 'kinesis'], effort: 2.5 })
s('deployment', 'Deployment', 'concept', 'Getting code safely into production is part of owning what you build.', {
  aliases: ['hosting', 'vercel', 'netlify', 'heroku', 'render', 'deploying', 'devops basics', 'nginx'],
  effort: 1.5,
  related: [
    ['docker', 0.75],
    ['aws', 0.75],
    ['azure', 0.75],
    ['gcp', 0.75],
    ['ci-cd', 0.65],
    ['kubernetes', 0.8],
  ],
})
s('testing', 'Testing', 'concept', 'Reliable tests let teams ship faster with fewer regressions.', { aliases: ['unit testing', 'jest', 'vitest', 'cypress', 'playwright', 'selenium', 'react testing library', 'testing library', 'pytest', 'junit', 'mocha', 'tdd', 'integration testing', 'e2e testing', 'test automation', 'testng', 'qa testing', 'end to end testing'], effort: 2 })
s('qa-strategy', 'QA strategy', 'concept', 'Planning what and how to test is what turns test scripts into quality.', { aliases: ['test planning', 'test cases', 'bug reporting', 'test strategy', 'quality assurance', 'qa', 'regression testing', 'manual testing', 'exploratory testing'], effort: 2, related: [['testing', 0.5]] })
s('algorithms', 'Algorithms & data structures', 'concept', 'Strong fundamentals unlock problem solving and most technical interviews.', { aliases: ['dsa', 'data structures', 'algorithms', 'data structures and algorithms', 'competitive programming', 'leetcode', 'problem solving', 'algorithmic thinking'], effort: 3 })
s('oop', 'OOP & design patterns', 'concept', 'Clean abstractions keep large codebases understandable and testable.', { aliases: ['object oriented programming', 'object-oriented', 'design patterns', 'solid principles', 'clean code', 'oop', 'clean architecture'], effort: 2 })
s('concurrency', 'Concurrency', 'concept', 'Parallel and async programming is essential for fast, responsive systems.', { aliases: ['multithreading', 'async programming', 'parallel programming', 'threading', 'asyncio', 'goroutines', 'multiprocessing'], effort: 3 })
s('memory-management', 'Memory management', 'concept', 'Understanding ownership, lifetimes and allocation is key in systems code.', {
  aliases: ['pointers', 'raii', 'smart pointers', 'memory', 'garbage collection', 'stl'],
  effort: 3,
  related: [
    ['cpp', 0.45],
    ['c', 0.5],
    ['rust', 0.6],
  ],
})
s('build-systems', 'Build systems', 'concept', 'Reliable builds and dependency management keep native projects maintainable.', { aliases: ['cmake', 'make', 'bazel', 'ninja', 'gradle', 'maven', 'webpack', 'vite', 'build tools', 'npm', 'yarn', 'pnpm'], effort: 1.5 })
s('scripting', 'Scripting & automation', 'concept', 'Automating repetitive work is a force multiplier in ops, QA and security.', {
  aliases: ['automation', 'scripts', 'task automation', 'python scripting', 'cron'],
  effort: 1.5,
  related: [
    ['bash', 0.9],
    ['python', 0.7],
  ],
})
s('networking', 'Networking', 'concept', 'Protocols, routing and DNS knowledge underpins cloud, security and backend work.', { aliases: ['tcp/ip', 'dns', 'http/2', 'networking fundamentals', 'computer networks', 'routing', 'load balancing', 'ccna', 'vpn', 'firewalls'], effort: 2.5 })
s('technical-writing', 'Technical writing', 'concept', 'Clear write-ups multiply your impact - reports, docs and specs are part of the job.', { aliases: ['documentation', 'reporting', 'report writing', 'writing', 'docs', 'communication'], effort: 1.5 })
s('storytelling', 'Storytelling & case studies', 'concept', 'Explaining your decisions and results is what makes work convincing to others.', { aliases: ['case studies', 'presentation', 'presenting', 'data storytelling', 'communication skills', 'stakeholder communication', 'public speaking'], effort: 2 })
s('product-thinking', 'Product thinking', 'concept', 'Tying design decisions to user and business outcomes is what sets product designers apart.', { aliases: ['product strategy', 'product sense', 'product management', 'product design', 'roadmapping', 'jobs to be done'], effort: 3 })
s('product-analytics', 'Product analytics', 'concept', 'Measuring behavior helps you validate that a design actually worked.', { aliases: ['analytics', 'metrics', 'a/b testing', 'mixpanel', 'amplitude', 'google analytics', 'funnel analysis'], effort: 2 })

// Data / AI
s('math', 'Mathematics', 'concept', 'Linear algebra, calculus and probability are the language of modern ML.', { aliases: ['linear algebra', 'calculus', 'maths', 'mathematics', 'discrete math', 'probability', 'numerical methods', 'optimization theory'], effort: 4 })
s('statistics', 'Statistics', 'concept', 'Sound statistical thinking separates insight from noise.', { aliases: ['stats', 'statistical analysis', 'hypothesis testing', 'regression', 'bayesian', 'inference', 'statistical modeling'], effort: 3.5 })
s('machine-learning', 'Machine learning', 'concept', 'Core ML methods - from regression to ensembles - are the base of every AI role.', { aliases: ['ml', 'ai', 'artificial intelligence', 'supervised learning', 'unsupervised learning', 'predictive modeling', 'feature engineering', 'xgboost', 'model training', 'classification', 'random forest'], effort: 4, related: [['scikit-learn', 0.75]] })
s('deep-learning', 'Deep learning', 'concept', 'Neural networks drive vision, language and generative systems.', {
  aliases: ['dl', 'neural networks', 'cnn', 'rnn', 'transformers architecture', 'gan', 'deep neural networks', 'diffusion models'],
  effort: 4,
  related: [
    ['pytorch', 0.75],
    ['tensorflow', 0.75],
  ],
})
s('data-processing', 'Data processing', 'concept', 'Cleaning and transforming data is most of real-world ML and analytics work.', {
  aliases: ['data wrangling', 'data cleaning', 'etl', 'data preprocessing', 'data preparation', 'data manipulation', 'eda', 'exploratory data analysis'],
  effort: 2,
  related: [
    ['pandas', 0.9],
    ['sql', 0.6],
  ],
})
s('data-visualization', 'Data visualization', 'concept', 'Clear visuals communicate findings faster than tables ever will.', { aliases: ['dataviz', 'charts', 'matplotlib', 'seaborn', 'plotly', 'd3', 'd3.js', 'visualization', 'data visualisation', 'recharts'], effort: 2 })
s('data-pipelines', 'Data pipelines', 'concept', 'Reliable, automated data flows are the backbone of analytics and ML platforms.', { aliases: ['etl pipelines', 'elt', 'data engineering', 'batch processing', 'stream processing', 'data ingestion', 'workflow orchestration'], effort: 3 })
s('model-deployment', 'Model deployment', 'concept', 'A model only creates value once it is served, monitored and maintained.', { aliases: ['mlops', 'model serving', 'ml deployment', 'model monitoring', 'mlflow', 'kubeflow', 'sagemaker', 'onnx', 'triton', 'bentoml', 'model ops'], effort: 3, related: [['docker', 0.3]] })
s('nlp', 'Natural language processing', 'concept', 'Language models and text pipelines power search, assistants and analytics.', {
  aliases: ['natural language processing', 'text mining', 'text classification', 'spacy', 'nltk', 'language models', 'sentiment analysis', 'embeddings'],
  effort: 3,
  related: [
    ['huggingface', 0.6],
    ['llms', 0.6],
  ],
})
s('computer-vision', 'Computer vision', 'concept', 'Teaching machines to see underpins robotics, healthcare and retail AI.', { aliases: ['cv', 'image processing', 'object detection', 'image classification', 'yolo', 'image segmentation', 'visual recognition', 'slam'], effort: 3.5, related: [['opencv', 0.65]] })
s('llms', 'LLMs & generative AI', 'concept', 'Building on large language models is fast becoming a mainstream engineering skill.', { aliases: ['large language models', 'generative ai', 'genai', 'rag', 'retrieval augmented generation', 'llm', 'openai api', 'fine-tuning', 'fine tuning', 'ai agents', 'agents', 'chatgpt api', 'gpt'], effort: 2.5, related: [['huggingface', 0.6]] })
s('prompt-engineering', 'Prompt engineering', 'concept', 'Well-structured prompts and evaluation loops determine how reliable AI features feel.', { aliases: ['prompt design', 'prompting', 'prompt engineering', 'few shot prompting', 'chain of thought', 'prompt optimization', 'prompt tuning'], effort: 2, related: [['llms', 0.5]] })
s('ai-evaluation', 'AI evaluation', 'concept', 'Measuring model quality systematically is what makes AI products trustworthy.', { aliases: ['evals', 'llm evaluation', 'benchmarking', 'model evaluation', 'red teaming', 'a/b evaluation', 'quality metrics'], effort: 2.5 })
s('ai-safety', 'Responsible AI', 'concept', 'Safety, bias and privacy practices are increasingly part of shipping AI responsibly.', { aliases: ['ai ethics', 'ai safety', 'responsible ai', 'bias mitigation', 'fairness', 'guardrails'], effort: 2 })
s('experiment-design', 'Experiment design', 'concept', 'Well-designed experiments turn opinions into evidence.', { aliases: ['a/b test', 'ab testing', 'experimentation', 'causal inference', 'hypothesis testing design'], effort: 2.5, related: [['statistics', 0.45]] })
s('research', 'Research & publications', 'concept', 'Reading, reproducing and communicating research shows depth beyond tutorials.', { aliases: ['academic research', 'publications', 'papers', 'research papers', 'thesis', 'reproducibility', 'literature review'], effort: 3 })

// Cloud / security / reliability
s('cloud-architecture', 'Cloud architecture', 'concept', 'Designing for cost, resilience and scale is the core of senior cloud work.', { aliases: ['cloud design', 'well architected', 'solutions architecture', 'cloud computing', 'multi-cloud', 'cloud migration', 'cloud security'], effort: 3.5 })
s('serverless', 'Serverless', 'concept', 'Functions and managed services reduce operational overhead for many workloads.', { aliases: ['lambda functions', 'cloud functions', 'faas', 'serverless framework', 'azure functions', 'edge functions'], effort: 2 })
s('sre', 'SRE practices', 'concept', 'SLOs, error budgets and incident discipline keep services dependable.', { aliases: ['site reliability', 'reliability engineering', 'slo', 'sli', 'incident management', 'on-call', 'postmortems', 'capacity planning', 'chaos engineering'], effort: 3 })
s('security-fundamentals', 'Security fundamentals', 'concept', 'A solid security baseline - IAM, hardening, least privilege - applies to every technical role.', { aliases: ['security basics', 'devsecops', 'iam', 'information security', 'infosec', 'hardening', 'least privilege', 'secure coding', 'compliance', 'security+'], effort: 2.5 })
s('network-security', 'Network security', 'concept', 'Defending traffic and perimeters is the foundation of most security engineering.', { aliases: ['firewalls', 'ids ips', 'intrusion detection', 'zero trust', 'vpn security', 'network defense', 'packet analysis'], effort: 3, related: [['networking', 0.5]] })
s('web-security', 'Web application security', 'concept', 'Most breaches start with common web flaws - knowing the OWASP Top 10 is essential.', { aliases: ['owasp', 'appsec', 'application security', 'xss', 'sql injection', 'owasp top 10', 'csrf', 'secure web development'], effort: 3 })
s('pen-testing', 'Penetration testing', 'concept', 'Offensive skills prove whether defenses actually hold up.', { aliases: ['pentest', 'penetration testing', 'ethical hacking', 'red team', 'red teaming', 'vulnerability assessment', 'bug bounty', 'ctf', 'capture the flag', 'oscp'], effort: 4 })
s('cryptography', 'Cryptography', 'concept', 'Understanding primitives and protocols prevents dangerous misuse.', { aliases: ['crypto', 'encryption', 'pki', 'tls', 'hashing', 'public key cryptography'], effort: 3.5 })
s('incident-response', 'Incident response', 'concept', 'Calm, structured response limits damage when something goes wrong.', { aliases: ['dfir', 'digital forensics', 'forensics', 'incident handling', 'threat hunting', 'ir', 'threat intelligence'], effort: 3, related: [['sre', 0.25]] })
s('threat-modeling', 'Threat modeling', 'concept', 'Thinking like an attacker early is cheaper than fixing flaws late.', { aliases: ['stride', 'attack surface analysis', 'risk assessment', 'security architecture', 'mitre att&ck', 'attack trees'], effort: 2.5 })
s('malware-analysis', 'Malware analysis', 'concept', 'Reverse engineering reveals how threats behave and how to stop them.', { aliases: ['reverse engineering', 'malware reversing', 'static analysis', 'dynamic analysis', 'binary analysis', 'ida pro'], effort: 4 })

// Games / 3D / XR
s('game-programming', 'Game programming', 'concept', 'Real-time loops, input and architecture patterns are unique to games.', {
  aliases: ['game development', 'gameplay programming', 'game dev', 'game loop', 'game architecture', 'game engine programming', 'game scripting'],
  effort: 3,
  related: [
    ['unity', 0.5],
    ['unreal', 0.5],
  ],
})
s('gameplay-systems', 'Gameplay systems', 'concept', 'Abilities, inventory and progression systems are what players actually feel.', {
  aliases: ['game mechanics', 'gameplay scripting', 'gameplay', 'combat systems', 'inventory systems', 'game design', 'state machines', 'ability systems', 'level design'],
  effort: 3,
  related: [
    ['game-programming', 0.6],
    ['blueprints', 0.8],
  ],
})
s('blueprints', 'Unreal Blueprints', 'concept', 'Visual scripting lets teams prototype and ship gameplay in Unreal rapidly.', { aliases: ['blueprint', 'unreal blueprints', 'visual scripting', 'ue blueprints', 'blueprint scripting'], effort: 2, related: [['unreal', 0.5]] })
s('math-3d', '3D mathematics', 'concept', 'Vectors, matrices and quaternions sit behind every camera, animation and physics system.', { aliases: ['3d math', 'vector math', 'linear algebra 3d', 'quaternions', 'matrices', 'geometry', 'transformations', 'game math', 'vectors'], effort: 3, related: [['math', 0.55]] })
s('optimization', 'Performance optimization', 'concept', 'Profiling and optimizing keeps experiences smooth on real hardware.', { aliases: ['profiling', 'performance optimization', 'performance tuning', 'optimisation', 'gpu profiling', 'frame rate optimization', 'lod', 'draw calls', 'performance'], effort: 3, related: [['caching', 0.25]] })
s('shaders', 'Shaders & materials', 'concept', 'Shaders define how everything looks on the GPU - and how efficiently it renders.', { aliases: ['hlsl', 'glsl', 'shader graph', 'shader programming', 'vfx', 'materials', 'shader development', 'compute shaders', 'niagara', 'vfx graph', 'cg'], effort: 3.5 })
s('physics', 'Physics & simulation', 'concept', 'Believable collisions, rigid bodies and forces give interactive worlds weight.', { aliases: ['game physics', 'rigid body', 'collision detection', 'physx', 'physics simulation', 'havok', 'fluid simulation', 'cloth simulation'], effort: 3, related: [['math-3d', 0.3]] })
s('game-ai', 'Game AI', 'concept', 'Pathfinding, behavior trees and decision systems bring non-player characters to life.', { aliases: ['pathfinding', 'behavior trees', 'behaviour trees', 'npc ai', 'navmesh', 'goap', 'steering behaviors', 'utility ai'], effort: 3, related: [['algorithms', 0.35]] })
s('multiplayer', 'Multiplayer & netcode', 'concept', 'Networked play adds latency, replication and cheating concerns to every system.', { aliases: ['netcode', 'networking for games', 'replication', 'photon', 'mirror', 'dedicated servers', 'online multiplayer', 'mirror networking', 'network programming'], effort: 3.5, related: [['networking', 0.35]] })
s('real-time-art', 'Real-time asset pipeline', 'concept', 'Game-ready assets must balance fidelity with strict polygon and texture budgets.', { aliases: ['game-ready assets', 'game art', 'real-time rendering', 'lods', 'asset optimization', 'game assets', 'low poly', 'asset pipeline', 'real time rendering', 'environment art', 'props'], effort: 2.5, related: [['modeling', 0.4]] })
s('modeling', '3D modeling', 'concept', 'Clean, well-proportioned geometry is the foundation of every 3D deliverable.', {
  aliases: ['3d modelling', 'hard surface', 'hard surface modeling', 'organic modeling', 'polygon modeling', 'poly modeling', 'retopology', 'topology', 'box modeling', 'modelling', 'low poly modeling', '3d modeling'],
  effort: 3,
  related: [
    ['blender', 0.35],
    ['maya', 0.35],
    ['3dsmax', 0.35],
  ],
})
s('sculpting', 'Digital sculpting', 'concept', 'Sculpting adds organic detail and character that poly modeling alone cannot.', { aliases: ['digital sculpting', 'character sculpting', 'high poly', 'highpoly', 'anatomy sculpting', 'creature design'], effort: 3, related: [['zbrush', 0.65]] })
s('texturing', 'Texturing & materials', 'concept', 'PBR texturing gives assets realism and believable surfaces.', { aliases: ['pbr', 'uv mapping', 'uv unwrapping', 'texture painting', 'texturing', 'pbr materials', 'material creation', 'texture work', 'baking'], effort: 2.5, related: [['substance', 0.65]] })
s('lighting', 'Lighting', 'concept', 'Lighting decides mood, clarity and realism more than any other single factor.', { aliases: ['lighting design', 'lighting techniques', 'lightmapping', 'lookdev', 'look development', 'hdri', 'light baking', 'three point lighting'], effort: 2.5 })
s('rendering', 'Rendering', 'concept', 'Render engines and settings convert scenes into polished final imagery.', { aliases: ['render', 'cycles', 'eevee', 'arnold', 'v-ray', 'vray', 'redshift', 'octane', 'keyshot', 'renderman', 'corona', 'path tracing', 'final rendering'], effort: 2.5 })
s('rigging', 'Rigging', 'concept', 'Rigs give models controls that animators can actually perform with.', { aliases: ['character rigging', 'skeletal rigging', 'skinning', 'weight painting', 'ik fk', 'rigging and skinning', 'auto rigging', 'control rigs'], effort: 3.5 })
s('animation-3d', '3D animation', 'concept', 'Timing, weight and performance bring 3D work to life.', { aliases: ['3d animation', 'character animation', 'keyframe animation', 'animation', 'mocap', 'motion capture', 'animation blueprint', 'state machine animation', 'skeletal animation', 'animating', 'cinematics'], effort: 3, related: [['rigging', 0.3]] })
s('compositing', 'Compositing & post', 'concept', 'Compositing ties renders into a finished, cohesive look.', { aliases: ['vfx compositing', 'nuke', 'fusion', 'color grading', 'post production', 'post-production', 'compositing', 'color correction'], effort: 2.5, related: [['after-effects', 0.6]] })
s('art-fundamentals', 'Art fundamentals', 'concept', 'Composition, color and form theory underpin every visual craft.', { aliases: ['composition', 'color theory', 'anatomy', 'form', 'drawing', 'sketching', 'design principles', 'perspective', 'visual composition', 'gesture drawing', 'illustration', 'concept art'], effort: 3 })
s('procedural-generation', 'Procedural workflows', 'concept', 'Procedural tooling multiplies output and keeps assets editable.', { aliases: ['procedural', 'procedural modeling', 'proc gen', 'procgen', 'procedural generation', 'substance designer graphs', 'geometry nodes procedural', 'generative art'], effort: 3.5, related: [['houdini', 0.7]] })
s('pipeline-tools', 'Pipeline tooling', 'concept', 'Custom tools and scripts keep art and engineering teams unblocked.', {
  aliases: ['dcc tools', 'pipeline', 'tool development', 'art pipeline', 'maxscript', 'mel', 'python for maya', 'blender python', 'pipeline td', 'tools programming', 'editor scripting'],
  effort: 2.5,
  related: [
    ['scripting', 0.5],
    ['python', 0.4],
  ],
})
s('creative-coding', 'Creative coding', 'concept', 'Code-driven visuals and interaction blend engineering with design.', {
  aliases: ['p5.js', 'p5js', 'processing', 'touchdesigner', 'generative design', 'openframeworks', 'creative technology', 'glsl art', 'shadertoy', 'interactive installations', 'cables.gl'],
  effort: 3,
  related: [
    ['threejs', 0.4],
    ['javascript', 0.3],
  ],
})
s('ar-vr', 'AR / VR development', 'concept', 'Spatial interfaces demand new interaction, performance and comfort skills.', { aliases: ['xr', 'augmented reality', 'virtual reality', 'arkit', 'arcore', 'openxr', 'webxr', 'vr', 'ar', 'mixed reality', 'quest development', 'vision os', 'spatial computing', 'hololens'], effort: 3.5 })

// Design
s('ux-research', 'UX research', 'concept', 'Evidence from real users is what separates good design from opinion.', { aliases: ['user research', 'interviews', 'user interviews', 'surveys', 'personas', 'journey mapping', 'research synthesis', 'ux research methods', 'contextual inquiry', 'competitive analysis'], effort: 3 })
s('wireframing', 'Wireframing', 'concept', 'Fast low-fidelity exploration saves expensive rework later.', { aliases: ['wireframes', 'low fidelity', 'low-fi', 'sketching ui', 'user flows', 'flow diagrams', 'lo-fi prototyping', 'user flow'], effort: 1.5 })
s('prototyping', 'Prototyping', 'concept', 'Interactive prototypes let you test ideas before engineering builds them.', { aliases: ['interactive prototypes', 'high fidelity', 'prototypes', 'protopie', 'framer', 'principle', 'rapid prototyping', 'clickable prototypes', 'high-fi prototyping'], effort: 2, related: [['figma', 0.35]] })
s('visual-design', 'Visual design', 'concept', 'Hierarchy, spacing and typography create interfaces that feel crafted.', { aliases: ['ui design', 'graphic design', 'layout', 'visual hierarchy', 'interface design', 'brand design', 'color', 'visual communication', 'ui visual design', 'iconography', 'layout design'], effort: 3, related: [['typography', 0.3]] })
s('typography', 'Typography', 'concept', 'Type choices shape readability, tone and brand perception.', { aliases: ['type design', 'typesetting', 'font pairing', 'typographic hierarchy', 'lettering', 'font design'], effort: 2 })
s('design-systems', 'Design systems', 'concept', 'Systems scale consistency and speed across teams and products.', { aliases: ['component libraries design', 'design tokens', 'style guides', 'pattern libraries', 'atomic design', 'design ops', 'ui kits', 'component design'], effort: 3, related: [['ui-implementation', 0.25]] })
s('interaction-design', 'Interaction design', 'concept', 'Thoughtful interaction and feedback make products intuitive.', { aliases: ['ixd', 'micro-interactions', 'microinteractions', 'interaction patterns', 'ux design', 'usability design', 'gestures', 'motion ux', 'spatial ux'], effort: 2.5, related: [['animation', 0.3]] })
s('usability-testing', 'Usability testing', 'concept', 'Watching people use your design reveals what no review meeting will.', { aliases: ['user testing', 'usability studies', 'moderated testing', 'unmoderated testing', 'ab testing design', 'heuristic evaluation', 'heuristics', 'tree testing', 'card sorting'], effort: 2 })
s('information-architecture', 'Information architecture', 'concept', 'Clear structure helps users find what they need without thinking.', { aliases: ['ia', 'sitemaps', 'navigation design', 'content strategy', 'taxonomy', 'content structure', 'site structure', 'content modeling'], effort: 2 })
s('design-handoff', 'Design handoff', 'concept', 'Precise specs and collaboration keep the shipped product faithful to the design.', { aliases: ['developer handoff', 'specs', 'design specs', 'design qa', 'redlines', 'design documentation', 'engineering collaboration', 'zeplin'], effort: 1.5 })
s('motion-design', 'Motion design', 'concept', 'Motion guides attention, explains change and expresses brand.', {
  aliases: ['motion graphics', 'kinetic typography', 'ui animation', 'explainer animation', 'motion principles', 'animation principles', 'storyboarding', 'title design', 'lottie animation', 'video editing'],
  effort: 3,
  related: [
    ['after-effects', 0.5],
    ['animation', 0.5],
  ],
})

// Emerging / embedded
s('smart-contracts', 'Smart contract development', 'concept', 'Deploying immutable code demands rigor around design, testing and gas costs.', { aliases: ['smart contract', 'contract development', 'dapps', 'dapp development', 'ethereum development', 'evm', 'erc-20', 'erc-721', 'contracts', 'defi development', 'nft development', 'smart contracts development'], effort: 3.5, related: [['solidity', 0.75]] })
s('blockchain-fundamentals', 'Blockchain fundamentals', 'concept', 'Consensus, wallets and token standards are the vocabulary of every web3 role.', { aliases: ['blockchain', 'ethereum', 'consensus', 'defi', 'tokenomics', 'layer 2', 'l2', 'web3 fundamentals', 'cryptocurrency', 'bitcoin', 'nfts', 'zero knowledge', 'zk', 'solana'], effort: 3 })
s('smart-contract-security', 'Contract security', 'concept', 'One exploit can drain millions - auditing mindset is non-negotiable in web3.', {
  aliases: ['contract auditing', 'smart contract auditing', 'smart contract security', 'audit', 'reentrancy', 'slither', 'mythril', 'formal verification', 'fuzzing', 'echidna'],
  effort: 3.5,
  related: [
    ['web-security', 0.3],
    ['cryptography', 0.3],
  ],
})
s('embedded', 'Embedded systems', 'concept', 'Working with microcontrollers means direct control over hardware and tight resource limits.', { aliases: ['firmware', 'microcontrollers', 'arduino', 'stm32', 'rtos', 'esp32', 'raspberry pi', 'embedded systems', 'embedded development', 'embedded c', 'avr', 'arm cortex', 'pic microcontroller', 'bare metal'], effort: 3.5, related: [['c', 0.3]] })
s('electronics', 'Electronics', 'concept', 'Reading schematics and debugging circuits keeps firmware grounded in hardware reality.', { aliases: ['circuits', 'pcb', 'schematics', 'pcb design', 'analog electronics', 'digital electronics', 'circuit design', 'kicad', 'altium', 'eagle', 'hardware design', 'oscilloscope', 'soldering', 'power electronics'], effort: 3.5 })
s('protocols', 'Hardware protocols', 'concept', 'I2C, SPI, UART and CAN are how chips and devices talk to each other.', { aliases: ['i2c', 'spi', 'uart', 'can bus', 'mqtt', 'modbus', 'serial communication', 'bluetooth low energy', 'ble', 'lora', 'usb', 'rs485', 'communication protocols', 'zigbee', 'ethernet'], effort: 2.5 })
s('real-time-systems', 'Real-time systems', 'concept', 'Deterministic timing is what keeps safety-critical and embedded systems predictable.', { aliases: ['rtos', 'freertos', 'real time systems', 'real-time programming', 'interrupts', 'scheduling', 'zephyr', 'embedded linux', 'device drivers', 'realtime'], effort: 3.5, related: [['embedded', 0.45]] })
s('iot', 'IoT systems', 'concept', 'Connected devices add telemetry, updates and security to embedded design.', {
  aliases: ['internet of things', 'iot development', 'edge computing', 'sensors', 'telemetry', 'iot platforms', 'smart devices', 'home automation'],
  effort: 2.5,
  related: [
    ['embedded', 0.35],
    ['protocols', 0.3],
  ],
})
s('control-systems', 'Control systems', 'concept', 'Feedback loops and controllers make machines move precisely and stably.', { aliases: ['control theory', 'pid control', 'pid', 'state estimation', 'kalman filter', 'motion control', 'robot control', 'feedback control', 'mpc', 'controls engineering', 'servo control'], effort: 4, related: [['math', 0.3]] })
s('robotics', 'Robotics', 'concept', 'Perception, planning and actuation come together in robotic systems.', { aliases: ['robot', 'robotics engineering', 'robotic systems', 'mobile robots', 'manipulators', 'robot navigation', 'motion planning', 'path planning', 'slam robotics', 'autonomous systems', 'kinematics'], effort: 4, related: [['ros', 0.6]] })
s('simulation', 'Simulation', 'concept', 'Simulating first saves expensive hardware iterations and accelerates testing.', {
  aliases: ['simulation environments', 'gazebo simulation', 'webots', 'isaac sim', 'digital twin', 'mujoco', 'simulink', 'matlab simulink', 'pybullet', 'carla', 'unity simulation'],
  effort: 3,
  related: [
    ['physics', 0.35],
    ['ros', 0.3],
  ],
})

/* ------------------------------ public API ------------------------------ */

/** Normalize free text so "Node.js", "node js" and "NodeJS" all become "nodejs". */
export const normalizeSkillKey = (name = '') =>
  String(name)
    .toLowerCase()
    .trim()
    .replace(/[\s._\-/]+/g, '')

export const SKILLS = registry
export const SKILL_BY_ID = Object.fromEntries(registry.map((skill) => [skill.id, skill]))

const aliasIndex = new Map()
for (const skill of registry) {
  aliasIndex.set(normalizeSkillKey(skill.id), skill.id)
  aliasIndex.set(normalizeSkillKey(skill.label), skill.id)
  for (const alias of skill.aliases) aliasIndex.set(normalizeSkillKey(alias), skill.id)
}

/** Resolve free text to a catalog entry (or null). Tolerates simple plurals. */
export function findSkill(name) {
  const key = normalizeSkillKey(name)
  if (!key) return null
  const id = aliasIndex.get(key) ?? aliasIndex.get(key.replace(/s$/, '')) ?? aliasIndex.get(`${key}s`)
  return id ? SKILL_BY_ID[id] : null
}

export const SKILL_GROUPS = [
  { id: 'language', label: 'Languages' },
  { id: 'framework', label: 'Frameworks & libraries' },
  { id: 'tool', label: 'Tools & platforms' },
  { id: 'concept', label: 'Concepts & practices' },
]

/** Case-insensitive search across labels and aliases. */
export function searchSkills(query, { limit = 12, group } = {}) {
  const q = normalizeSkillKey(query)
  const pool = group ? registry.filter((sk) => sk.group === group) : registry
  if (!q) return pool.slice(0, limit)
  const scored = []
  for (const skill of pool) {
    const label = normalizeSkillKey(skill.label)
    let score = 0
    if (label === q) score = 100
    else if (label.startsWith(q)) score = 80
    else if (label.includes(q)) score = 60
    else if (skill.aliases.some((a) => normalizeSkillKey(a).startsWith(q))) score = 50
    else if (skill.aliases.some((a) => normalizeSkillKey(a).includes(q))) score = 35
    if (score) scored.push([score, skill])
  }
  return scored
    .sort((a, b) => b[0] - a[0] || a[1].label.localeCompare(b[1].label))
    .slice(0, limit)
    .map(([, sk]) => sk)
}
