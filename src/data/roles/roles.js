// Role configuration.
//
// HOW TO ADD A ROLE
//   1. Pick a `family` from families.js (it sets category weights + which external signals matter).
//   2. List `reqs` with R(skillIdOrIds, weight, targetLevel, opts). Skill ids come from skillLibrary.js.
//        - Pass an array to accept "any of" several skills (best one counts), e.g. any backend language.
//        - `weight` is relative (they're normalized); `target` is the level expected for the role.
//        - opts.label overrides the display name, opts.why overrides the "why it matters" copy.
//   3. Add `keywords` (used to judge how relevant a project / job title is to the role).
//   That's it - scoring, skill gap, roadmap and ranking all derive from this config.
//
// Pure module (no React / browser APIs).

import { FAMILIES, getFamily } from './families.js'
import { SKILL_BY_ID } from './skillLibrary.js'
import { LEVEL_BY_ID } from '../scoring.js'
import { slugify } from '../../utils/format.js'

/* ------------------------------ tiny DSL ------------------------------ */
const R = (skills, weight, target = 'advanced', opts = {}) => ({ skills: [].concat(skills), weight, target, ...opts })

// common "any of" groups
const BACKEND_LANGS = ['nodejs', 'javascript', 'typescript', 'python', 'java', 'go', 'csharp', 'php', 'ruby', 'rust']
const BACKEND_FRAMEWORKS = ['express', 'nestjs', 'django', 'flask', 'fastapi', 'spring-boot', 'dotnet', 'nodejs']
const GENERAL_LANGS = ['python', 'java', 'cpp', 'csharp', 'go', 'javascript', 'typescript', 'rust']
const CLOUDS = ['aws', 'azure', 'gcp']
const ENGINES = ['unity', 'unreal']
const DCC = ['blender', 'maya', '3dsmax']
const MOBILE = ['react-native', 'flutter', 'android', 'ios']

const definitions = []
function role(id, name, category, family, cfg) {
  definitions.push({ id, name, category, family, ...cfg })
}
// cfg.sd (optional) overrides the spread of the role's peer score distribution (see engine/ranking.js)

/* ============================ SOFTWARE DEVELOPMENT ============================ */

role('frontend-developer', 'Frontend Developer', 'software', 'web', {
  blurb: 'Build fast, accessible interfaces that people enjoy using.',
  core: ['HTML/CSS', 'JavaScript', 'React', 'TypeScript'],
  avg: 68,
  sd: 15.3,
  profiles: 2430,
  keywords: ['frontend', 'front-end', 'ui', 'web', 'website', 'dashboard', 'landing', 'portfolio', 'component', 'responsive', 'interface', 'spa', 'pwa', 'design system', 'app'],
  reqs: [
    R('html', 5, 'advanced'),
    R('css', 8, 'advanced'),
    R('javascript', 14, 'advanced'),
    R('react', 14, 'advanced'),
    R('typescript', 11, 'advanced', { why: 'Improving this skill could strengthen your readiness for modern frontend roles, where typed codebases are the norm.' }),
    R('responsive-design', 7, 'advanced'),
    R('ui-implementation', 7, 'advanced', { label: 'UI implementation' }),
    R('git', 6, 'advanced'),
    R('rest-apis', 7, 'advanced', { why: 'Nearly every interface depends on data from APIs - robust integration, error and loading states are core frontend work.' }),
    R('testing', 8, 'intermediate', { why: 'Teams expect component and integration tests; it is the most common gap between junior and mid-level frontend profiles.' }),
    R('nextjs', 4, 'intermediate'),
    R('accessibility', 4, 'intermediate'),
    R('web-performance', 3, 'intermediate'),
    R('docker', 1.5, 'beginner', { why: 'Containers show up in most team workflows - basic Docker lets you run full stacks locally and collaborate with backend engineers.' }),
    R('ci-cd', 1.5, 'beginner', { why: 'Understanding pipelines helps you ship safely and is expected as you move toward senior frontend work.' }),
    R('system-design', 1.5, 'beginner', { why: 'Frontend architecture decisions - state, caching, rendering strategy - are system design at the UI layer.' }),
  ],
})

role('backend-developer', 'Backend Developer', 'software', 'backend', {
  blurb: 'Design the APIs, data and services that power products.',
  core: ['APIs', 'Databases', 'Auth', 'System design'],
  avg: 66,
  profiles: 2180,
  keywords: ['backend', 'back-end', 'api', 'server', 'service', 'database', 'microservice', 'rest', 'graphql', 'auth', 'queue', 'scalable', 'platform'],
  reqs: [
    R(BACKEND_LANGS, 12, 'advanced', { label: 'Backend programming language' }),
    R(BACKEND_FRAMEWORKS, 10, 'advanced', { label: 'Backend framework' }),
    R('rest-apis', 10, 'advanced', { label: 'API design' }),
    R('databases', 12, 'advanced'),
    R('authentication', 8, 'advanced', { label: 'Authentication' }),
    R('system-design', 9, 'advanced'),
    R('testing', 7, 'intermediate'),
    R('git', 6, 'intermediate'),
    R('deployment', 6, 'intermediate'),
    R('docker', 4, 'intermediate'),
    R('caching', 3, 'beginner'),
    R('microservices', 3, 'beginner'),
    R('ci-cd', 3, 'beginner'),
  ],
})

role('fullstack-developer', 'Full Stack Developer', 'software', 'web', {
  blurb: 'Own features end to end, from database to interface.',
  core: ['React', 'Node.js', 'Databases', 'APIs'],
  avg: 67,
  profiles: 2950,
  keywords: ['full stack', 'fullstack', 'full-stack', 'web app', 'saas', 'dashboard', 'api', 'database', 'auth', 'ecommerce', 'platform', 'crud', 'app'],
  reqs: [
    R('javascript', 10, 'advanced'),
    R('typescript', 8, 'advanced'),
    R('react', 10, 'advanced'),
    R(BACKEND_FRAMEWORKS, 10, 'advanced', { label: 'Backend framework' }),
    R('databases', 10, 'advanced'),
    R('rest-apis', 8, 'advanced'),
    R('authentication', 6, 'intermediate'),
    R('css', 5, 'advanced'),
    R('responsive-design', 4, 'intermediate'),
    R('git', 5, 'intermediate'),
    R('testing', 6, 'intermediate'),
    R('deployment', 6, 'intermediate'),
    R('docker', 4, 'intermediate'),
    R('system-design', 4, 'intermediate'),
    R('nextjs', 4, 'intermediate'),
    R('ci-cd', 3, 'beginner'),
  ],
})

role('software-engineer', 'Software Engineer', 'software', 'backend', {
  blurb: 'Solve problems with well-designed, well-tested software.',
  core: ['Algorithms', 'System design', 'Testing', 'Git'],
  avg: 65,
  profiles: 3640,
  keywords: ['software', 'engineering', 'algorithm', 'system', 'tool', 'library', 'cli', 'api', 'service', 'app', 'compiler', 'open source'],
  reqs: [
    R('algorithms', 12, 'advanced'),
    R('oop', 8, 'advanced'),
    R(GENERAL_LANGS, 12, 'advanced', { label: 'Primary programming language' }),
    R('system-design', 10, 'intermediate'),
    R('databases', 8, 'intermediate'),
    R('git', 7, 'advanced'),
    R('testing', 8, 'intermediate'),
    R('rest-apis', 6, 'intermediate'),
    R('concurrency', 4, 'intermediate'),
    R('linux', 4, 'intermediate'),
    R('networking', 3, 'beginner'),
    R('ci-cd', 3, 'beginner'),
    R('docker', 3, 'beginner'),
  ],
})

role('python-developer', 'Python Developer', 'software', 'backend', {
  blurb: 'Build backends, automation and data tooling in Python.',
  core: ['Python', 'Django / FastAPI', 'APIs', 'Testing'],
  avg: 64,
  profiles: 1890,
  keywords: ['python', 'django', 'flask', 'fastapi', 'automation', 'script', 'api', 'backend', 'data', 'cli', 'bot'],
  reqs: [
    R('python', 18, 'advanced'),
    R(['django', 'flask', 'fastapi'], 10, 'advanced', { label: 'Python web framework' }),
    R('rest-apis', 8, 'advanced'),
    R('databases', 9, 'intermediate'),
    R('testing', 7, 'intermediate', { label: 'Testing (pytest)' }),
    R('git', 5, 'intermediate'),
    R('algorithms', 6, 'intermediate'),
    R('oop', 6, 'intermediate'),
    R('docker', 4, 'intermediate'),
    R('linux', 3, 'intermediate'),
    R('data-processing', 3, 'beginner'),
    R('ci-cd', 2, 'beginner'),
  ],
})

role('java-developer', 'Java Developer', 'software', 'backend', {
  blurb: 'Ship reliable enterprise services on the JVM.',
  core: ['Java', 'Spring Boot', 'SQL', 'Microservices'],
  avg: 63,
  profiles: 1540,
  keywords: ['java', 'spring', 'jvm', 'enterprise', 'microservice', 'api', 'backend', 'android', 'maven', 'banking', 'service'],
  reqs: [
    R('java', 18, 'advanced'),
    R('spring-boot', 14, 'advanced'),
    R('oop', 7, 'advanced'),
    R(['sql', 'databases'], 10, 'advanced', { label: 'SQL & databases' }),
    R('rest-apis', 8, 'advanced'),
    R('testing', 7, 'intermediate', { label: 'Testing (JUnit)' }),
    R('git', 5, 'intermediate'),
    R('system-design', 6, 'intermediate'),
    R('microservices', 5, 'intermediate'),
    R('docker', 4, 'intermediate'),
    R('algorithms', 5, 'intermediate'),
    R('concurrency', 5, 'intermediate'),
    R('ci-cd', 3, 'beginner'),
  ],
})

role('cpp-developer', 'C++ Developer', 'software', 'backend', {
  blurb: 'Write fast, safe systems-level software in modern C++.',
  core: ['Modern C++', 'Memory', 'Concurrency', 'Algorithms'],
  avg: 61,
  profiles: 960,
  keywords: ['c++', 'cpp', 'systems', 'engine', 'performance', 'embedded', 'compiler', 'graphics', 'low-level', 'native', 'library', 'trading'],
  reqs: [
    R('cpp', 20, 'advanced'),
    R('algorithms', 10, 'advanced'),
    R('oop', 6, 'intermediate'),
    R('memory-management', 8, 'advanced'),
    R('concurrency', 7, 'intermediate'),
    R('linux', 5, 'intermediate'),
    R('optimization', 6, 'intermediate', { label: 'Performance profiling' }),
    R('build-systems', 3, 'intermediate', { label: 'Build systems (CMake)' }),
    R('git', 5, 'intermediate'),
    R('testing', 4, 'intermediate'),
    R('networking', 3, 'beginner'),
  ],
})

role('mobile-app-developer', 'Mobile App Developer', 'software', 'web', {
  blurb: 'Craft smooth native and cross-platform mobile apps.',
  core: ['React Native / Flutter', 'Kotlin / Swift', 'APIs', 'UI'],
  avg: 65,
  profiles: 1260,
  keywords: ['mobile', 'ios', 'android', 'app', 'react native', 'flutter', 'kotlin', 'swift', 'play store', 'app store', 'cross-platform'],
  reqs: [
    R(MOBILE, 18, 'advanced', { label: 'Mobile framework' }),
    R(['kotlin', 'swift', 'dart', 'javascript', 'typescript'], 10, 'advanced', { label: 'Mobile language' }),
    R('ui-implementation', 8, 'advanced', { label: 'Mobile UI implementation' }),
    R('rest-apis', 8, 'advanced'),
    R('state-management', 6, 'intermediate'),
    R('testing', 5, 'intermediate'),
    R('git', 5, 'intermediate'),
    R('databases', 4, 'beginner', { label: 'Local storage & databases' }),
    R('optimization', 4, 'intermediate', { label: 'App performance' }),
    R('accessibility', 3, 'intermediate'),
    R('ci-cd', 3, 'beginner'),
  ],
})

role('embedded-systems-engineer', 'Embedded Systems Engineer', 'software', 'embedded', {
  blurb: 'Program microcontrollers and firmware that run real hardware.',
  core: ['C / C++', 'Microcontrollers', 'Protocols', 'RTOS'],
  avg: 59,
  profiles: 510,
  keywords: ['embedded', 'firmware', 'microcontroller', 'arduino', 'stm32', 'esp32', 'sensor', 'iot', 'rtos', 'pcb', 'hardware', 'robot', 'drone'],
  reqs: [
    R(['c', 'cpp'], 18, 'advanced', { label: 'C / C++' }),
    R('embedded', 14, 'advanced', { label: 'Microcontroller programming' }),
    R('electronics', 9, 'intermediate'),
    R('protocols', 9, 'intermediate'),
    R('real-time-systems', 8, 'intermediate'),
    R('linux', 4, 'intermediate'),
    R('git', 4, 'intermediate'),
    R('testing', 4, 'intermediate'),
    R('iot', 4, 'beginner'),
    R('python', 3, 'beginner'),
    R('networking', 3, 'beginner'),
  ],
})

role('qa-automation-engineer', 'QA Automation Engineer', 'software', 'backend', {
  blurb: 'Build the automated safety net that lets teams ship with confidence.',
  core: ['Test automation', 'CI/CD', 'APIs', 'QA strategy'],
  avg: 64,
  profiles: 720,
  keywords: ['qa', 'quality', 'test', 'automation', 'selenium', 'cypress', 'playwright', 'regression', 'ci', 'bug', 'framework'],
  reqs: [
    R('testing', 18, 'advanced', { label: 'Test automation' }),
    R(['javascript', 'typescript', 'python', 'java'], 12, 'advanced', { label: 'Automation language' }),
    R('qa-strategy', 8, 'intermediate'),
    R('ci-cd', 9, 'intermediate'),
    R('rest-apis', 8, 'intermediate', { label: 'API testing' }),
    R('git', 5, 'intermediate'),
    R('databases', 5, 'intermediate', { label: 'SQL & test data' }),
    R('web-performance', 3, 'beginner', { label: 'Performance testing' }),
    R('docker', 3, 'beginner'),
    R('technical-writing', 3, 'intermediate', { label: 'Bug reports & test documentation' }),
  ],
})

/* ================================ AI & DATA ================================ */

role('ai-ml-engineer', 'AI/ML Engineer', 'ai-data', 'ai', {
  blurb: 'Train, evaluate and ship machine-learning systems.',
  core: ['Python', 'Machine learning', 'Deep learning', 'Deployment'],
  avg: 62,
  profiles: 1720,
  keywords: ['ai', 'ml', 'machine learning', 'deep learning', 'model', 'neural', 'classification', 'prediction', 'nlp', 'vision', 'recommendation', 'detection', 'llm', 'dataset'],
  reqs: [
    R('python', 12, 'advanced'),
    R('math', 8, 'advanced', { label: 'Mathematics' }),
    R('statistics', 8, 'advanced'),
    R('machine-learning', 14, 'advanced'),
    R('deep-learning', 14, 'advanced'),
    R('data-processing', 9, 'advanced'),
    R('model-deployment', 8, 'intermediate'),
    R(['nlp', 'computer-vision', 'llms'], 5, 'intermediate', { label: 'AI specialization (NLP / Vision / LLMs)' }),
    R('research', 4, 'intermediate', { label: 'Research & experimentation' }),
    R('sql', 3, 'intermediate'),
    R('git', 4, 'intermediate'),
    R('docker', 3, 'intermediate'),
  ],
})

role('data-scientist', 'Data Scientist', 'ai-data', 'data', {
  blurb: 'Turn messy data into decisions with statistics and modeling.',
  core: ['Statistics', 'Python', 'SQL', 'Modeling'],
  avg: 63,
  profiles: 1310,
  keywords: ['data science', 'analysis', 'model', 'prediction', 'forecast', 'statistics', 'experiment', 'notebook', 'insight', 'churn', 'segmentation', 'kaggle'],
  reqs: [
    R('python', 10, 'advanced'),
    R('statistics', 14, 'advanced'),
    R('machine-learning', 12, 'advanced'),
    R('data-processing', 12, 'advanced'),
    R('sql', 10, 'advanced'),
    R('data-visualization', 8, 'advanced'),
    R('math', 5, 'intermediate'),
    R('experiment-design', 6, 'intermediate'),
    R('storytelling', 5, 'intermediate', { label: 'Data storytelling' }),
    R('git', 3, 'intermediate'),
    R('deep-learning', 3, 'beginner'),
    R('model-deployment', 3, 'beginner'),
  ],
})

role('data-analyst', 'Data Analyst', 'ai-data', 'data', {
  blurb: 'Answer business questions with clean data and clear dashboards.',
  core: ['SQL', 'Excel', 'Dashboards', 'Statistics'],
  avg: 66,
  profiles: 1680,
  keywords: ['analytics', 'analysis', 'dashboard', 'report', 'kpi', 'sql', 'excel', 'tableau', 'power bi', 'business', 'insight', 'visualization'],
  reqs: [
    R('sql', 16, 'advanced'),
    R('excel', 10, 'advanced'),
    R(['bi-tools', 'data-visualization'], 14, 'advanced', { label: 'Dashboards & BI tools' }),
    R('statistics', 10, 'intermediate'),
    R('python', 8, 'intermediate', { label: 'Python (Pandas)' }),
    R('data-processing', 10, 'advanced'),
    R('storytelling', 8, 'intermediate', { label: 'Business communication' }),
    R('experiment-design', 4, 'intermediate'),
    R('git', 2, 'beginner'),
  ],
})

role('computer-vision-engineer', 'Computer Vision Engineer', 'ai-data', 'ai', {
  blurb: 'Build systems that understand images and video.',
  core: ['Computer vision', 'Deep learning', 'PyTorch', 'OpenCV'],
  avg: 60,
  profiles: 390,
  keywords: ['vision', 'image', 'video', 'detection', 'segmentation', 'opencv', 'yolo', 'camera', 'ocr', 'tracking', 'medical imaging', 'cnn'],
  reqs: [
    R('python', 10, 'advanced'),
    R('computer-vision', 16, 'advanced'),
    R('deep-learning', 14, 'advanced'),
    R('math', 8, 'advanced'),
    R('data-processing', 6, 'intermediate'),
    R('model-deployment', 8, 'intermediate'),
    R('cpp', 4, 'intermediate', { label: 'C++ for performance' }),
    R('optimization', 4, 'intermediate', { label: 'Model & inference optimization' }),
    R('research', 5, 'intermediate'),
    R('git', 4, 'intermediate'),
    R('docker', 3, 'intermediate'),
  ],
})

role('prompt-engineer', 'Prompt Engineer', 'ai-data', 'ai', {
  blurb: 'Design prompts, evaluations and workflows for LLM products.',
  core: ['Prompt design', 'LLMs', 'Evaluation', 'Python'],
  avg: 61,
  profiles: 640,
  keywords: ['prompt', 'llm', 'gpt', 'chatbot', 'assistant', 'rag', 'agent', 'generative', 'evaluation', 'copilot', 'workflow'],
  reqs: [
    R('llms', 16, 'advanced'),
    R('prompt-engineering', 18, 'advanced'),
    R('python', 8, 'intermediate'),
    R('nlp', 6, 'intermediate'),
    R('ai-evaluation', 8, 'intermediate'),
    R('rest-apis', 7, 'intermediate', { label: 'APIs & integrations' }),
    R('data-processing', 4, 'intermediate'),
    R('technical-writing', 6, 'advanced', { label: 'Clear technical writing' }),
    R('ai-safety', 4, 'beginner'),
    R('git', 3, 'beginner'),
    R('javascript', 3, 'beginner'),
  ],
})

role('data-engineer', 'Data Engineer', 'ai-data', 'data', {
  blurb: 'Build reliable pipelines and platforms that data teams depend on.',
  core: ['SQL', 'Pipelines', 'Spark', 'Cloud'],
  avg: 62,
  profiles: 840,
  keywords: ['pipeline', 'etl', 'warehouse', 'spark', 'airflow', 'streaming', 'kafka', 'lake', 'ingestion', 'data platform', 'dbt', 'batch'],
  reqs: [
    R('python', 10, 'advanced'),
    R('sql', 14, 'advanced'),
    R(['data-pipelines', 'airflow'], 12, 'advanced', { label: 'Data pipelines & orchestration' }),
    R('spark', 10, 'advanced', { label: 'Distributed processing (Spark)' }),
    R(['databases', 'data-modeling'], 8, 'advanced', { label: 'Warehousing & data modeling' }),
    R(CLOUDS, 8, 'intermediate', { label: 'Cloud platform' }),
    R('docker', 5, 'intermediate'),
    R('git', 4, 'intermediate'),
    R('data-modeling', 7, 'intermediate'),
    R('testing', 4, 'intermediate', { label: 'Data quality testing' }),
    R('message-queues', 5, 'intermediate', { label: 'Streaming & queues' }),
    R('linux', 3, 'intermediate'),
  ],
})

role('mlops-engineer', 'MLOps Engineer', 'ai-data', 'infra', {
  blurb: 'Operationalize models with pipelines, monitoring and infrastructure.',
  core: ['Model deployment', 'Docker', 'CI/CD', 'Kubernetes'],
  avg: 59,
  profiles: 330,
  keywords: ['mlops', 'deployment', 'pipeline', 'serving', 'monitoring', 'kubeflow', 'mlflow', 'model', 'inference', 'feature store', 'registry'],
  reqs: [
    R('python', 10, 'advanced'),
    R('model-deployment', 14, 'advanced'),
    R('docker', 10, 'advanced'),
    R('kubernetes', 8, 'intermediate'),
    R('ci-cd', 9, 'advanced'),
    R(CLOUDS, 8, 'intermediate', { label: 'Cloud platform' }),
    R('monitoring', 7, 'intermediate'),
    R('machine-learning', 8, 'intermediate'),
    R('data-pipelines', 5, 'intermediate'),
    R('git', 4, 'advanced'),
    R('terraform', 4, 'beginner'),
    R('linux', 4, 'intermediate'),
  ],
})

/* ================================ CYBERSECURITY ================================ */

role('cybersecurity-engineer', 'Cybersecurity Engineer', 'security', 'security', {
  blurb: 'Build and defend secure systems across networks, apps and cloud.',
  core: ['Security fundamentals', 'Network security', 'AppSec', 'Incident response'],
  avg: 59,
  profiles: 870,
  keywords: ['security', 'cyber', 'vulnerability', 'threat', 'firewall', 'encryption', 'owasp', 'soc', 'siem', 'incident', 'hardening', 'ctf', 'pentest'],
  reqs: [
    R('security-fundamentals', 12, 'advanced'),
    R('network-security', 12, 'advanced'),
    R('networking', 8, 'intermediate'),
    R('web-security', 10, 'advanced'),
    R('linux', 7, 'intermediate'),
    R('scripting', 7, 'intermediate', { label: 'Scripting (Python / Bash)' }),
    R('cryptography', 6, 'intermediate'),
    R('threat-modeling', 6, 'intermediate'),
    R('incident-response', 7, 'intermediate'),
    R('siem', 5, 'intermediate'),
    R('pen-testing', 6, 'intermediate'),
    R('security-tools', 4, 'intermediate'),
    R('cloud-architecture', 4, 'beginner', { label: 'Cloud security' }),
    R('git', 2, 'beginner'),
  ],
})

role('penetration-tester', 'Penetration Tester', 'security', 'security', {
  blurb: 'Find weaknesses before attackers do, and explain how to fix them.',
  core: ['Pen testing', 'Web security', 'Networking', 'Reporting'],
  avg: 57,
  profiles: 360,
  keywords: ['pentest', 'penetration', 'exploit', 'red team', 'vulnerability', 'ctf', 'bug bounty', 'hack', 'owasp', 'recon', 'privilege escalation', 'burp'],
  reqs: [
    R('pen-testing', 18, 'advanced'),
    R('web-security', 12, 'advanced'),
    R('networking', 10, 'advanced'),
    R('linux', 8, 'advanced'),
    R('scripting', 8, 'intermediate', { label: 'Scripting (Python / Bash)' }),
    R('security-tools', 10, 'advanced'),
    R('cryptography', 4, 'intermediate'),
    R('technical-writing', 6, 'intermediate', { label: 'Findings & reporting' }),
    R('malware-analysis', 4, 'beginner'),
    R('cloud-architecture', 3, 'beginner', { label: 'Cloud security' }),
  ],
})

/* ================================ CLOUD & DEVOPS ================================ */

role('devops-engineer', 'DevOps Engineer', 'cloud', 'infra', {
  blurb: 'Automate delivery and keep systems running smoothly.',
  core: ['CI/CD', 'Docker', 'Kubernetes', 'Cloud'],
  avg: 60,
  profiles: 1050,
  keywords: ['devops', 'pipeline', 'deployment', 'infrastructure', 'docker', 'kubernetes', 'terraform', 'automation', 'cloud', 'monitoring', 'ci/cd', 'release'],
  reqs: [
    R('linux', 8, 'advanced'),
    R('git', 5, 'advanced'),
    R('ci-cd', 14, 'advanced'),
    R('docker', 14, 'advanced'),
    R('kubernetes', 10, 'advanced'),
    R('terraform', 9, 'intermediate'),
    R(CLOUDS, 12, 'advanced', { label: 'Cloud platform (AWS / Azure / GCP)' }),
    R('monitoring', 8, 'intermediate'),
    R('scripting', 8, 'advanced'),
    R('networking', 5, 'intermediate'),
    R('security-fundamentals', 4, 'intermediate'),
    R('ansible', 3, 'beginner'),
  ],
})

role('cloud-engineer', 'Cloud Engineer', 'cloud', 'infra', {
  blurb: 'Design and run scalable, secure cloud infrastructure.',
  core: ['AWS / Azure / GCP', 'Architecture', 'Terraform', 'Networking'],
  avg: 62,
  profiles: 980,
  keywords: ['cloud', 'aws', 'azure', 'gcp', 'infrastructure', 'serverless', 'terraform', 'migration', 'architecture', 'vpc', 'lambda', 'cost'],
  reqs: [
    R(CLOUDS, 18, 'advanced', { label: 'Cloud platform (AWS / Azure / GCP)' }),
    R('cloud-architecture', 12, 'advanced'),
    R('networking', 8, 'intermediate'),
    R('terraform', 9, 'intermediate'),
    R('linux', 7, 'intermediate'),
    R('docker', 6, 'intermediate'),
    R('serverless', 6, 'intermediate'),
    R('security-fundamentals', 7, 'intermediate', { label: 'IAM & cloud security' }),
    R('monitoring', 5, 'intermediate'),
    R('scripting', 6, 'intermediate'),
    R('ci-cd', 5, 'intermediate'),
    R('kubernetes', 4, 'beginner'),
    R('databases', 4, 'intermediate'),
  ],
})

role('site-reliability-engineer', 'Site Reliability Engineer', 'cloud', 'infra', {
  blurb: 'Keep critical services fast, observable and resilient.',
  core: ['SRE practices', 'Observability', 'Linux', 'Kubernetes'],
  avg: 58,
  profiles: 410,
  keywords: ['sre', 'reliability', 'slo', 'incident', 'observability', 'on-call', 'monitoring', 'availability', 'capacity', 'postmortem', 'chaos', 'latency'],
  reqs: [
    R('sre', 14, 'advanced'),
    R('linux', 10, 'advanced'),
    R('monitoring', 12, 'advanced'),
    R('kubernetes', 9, 'intermediate'),
    R('scripting', 9, 'advanced'),
    R('incident-response', 7, 'intermediate'),
    R('networking', 7, 'intermediate'),
    R('ci-cd', 6, 'intermediate'),
    R('terraform', 6, 'intermediate'),
    R(CLOUDS, 6, 'intermediate', { label: 'Cloud platform' }),
    R(['python', 'go'], 6, 'intermediate', { label: 'Python or Go' }),
    R('system-design', 6, 'intermediate'),
    R('docker', 5, 'intermediate'),
  ],
})

/* ================================ GAME DEVELOPMENT ================================ */

role('game-developer', 'Game Developer', 'game', 'game', {
  blurb: 'Build the systems and gameplay that make games feel great.',
  core: ['C++ / C#', 'Unity / Unreal', 'Gameplay', '3D math'],
  avg: 60,
  profiles: 740,
  keywords: ['game', 'gameplay', 'unity', 'unreal', 'player', '3d', '2d', 'level', 'prototype', 'jam', 'multiplayer', 'shooter', 'platformer', 'rpg', 'engine'],
  reqs: [
    R(['cpp', 'csharp'], 14, 'advanced', { label: 'C++ / C#' }),
    R(ENGINES, 14, 'advanced', { label: 'Game engine (Unity / Unreal)' }),
    R('game-programming', 12, 'advanced'),
    R('math-3d', 10, 'advanced'),
    R('gameplay-systems', 10, 'advanced'),
    R('optimization', 8, 'intermediate'),
    R('physics', 4, 'intermediate'),
    R('game-ai', 4, 'intermediate'),
    R('git', 5, 'intermediate'),
    R('shaders', 4, 'beginner'),
    R('multiplayer', 3, 'beginner'),
  ],
})

role('unreal-engine-developer', 'Unreal Engine Developer', 'game', 'game', {
  blurb: 'Create high-fidelity experiences in Unreal with C++ and Blueprints.',
  core: ['Unreal Engine', 'C++', 'Blueprints', 'Gameplay'],
  avg: 58,
  profiles: 410,
  keywords: ['unreal', 'ue5', 'ue4', 'blueprint', 'niagara', 'lumen', 'nanite', 'game', 'cinematic', 'multiplayer', 'shooter', 'virtual production'],
  reqs: [
    R('unreal', 18, 'advanced'),
    R('cpp', 14, 'advanced'),
    R('blueprints', 10, 'advanced'),
    R('game-programming', 8, 'advanced'),
    R('math-3d', 8, 'advanced'),
    R('gameplay-systems', 8, 'advanced'),
    R('optimization', 8, 'intermediate'),
    R('shaders', 6, 'intermediate', { label: 'Materials & shaders' }),
    R('multiplayer', 5, 'intermediate', { label: 'Replication & multiplayer' }),
    R('git', 4, 'intermediate', { label: 'Version control (Git / Perforce)' }),
    R('game-ai', 3, 'intermediate'),
    R('animation-3d', 3, 'beginner', { label: 'Animation systems' }),
  ],
})

role('unity-developer', 'Unity Developer', 'game', 'game', {
  blurb: 'Ship polished games and interactive apps with Unity and C#.',
  core: ['Unity', 'C#', 'Gameplay', 'Optimization'],
  avg: 61,
  profiles: 620,
  keywords: ['unity', 'c#', 'game', 'mobile game', 'prefab', 'scriptableobject', '2d', '3d', 'jam', 'platformer', 'ar', 'vr', 'prototype'],
  reqs: [R('unity', 18, 'advanced'), R('csharp', 16, 'advanced'), R('game-programming', 10, 'advanced'), R('gameplay-systems', 9, 'advanced'), R('math-3d', 7, 'intermediate'), R('optimization', 7, 'intermediate'), R('physics', 4, 'intermediate'), R('shaders', 4, 'beginner'), R('game-ai', 4, 'intermediate'), R('multiplayer', 3, 'beginner'), R('git', 4, 'intermediate')],
})

/* ================================ 3D & CREATIVE TECHNOLOGY ================================ */

role('3d-artist', '3D Artist', 'creative-3d', 'creative3d', {
  blurb: 'Create polished 3D assets and environments for games and film.',
  core: ['Modeling', 'Texturing', 'Lighting', 'Blender / Maya'],
  avg: 64,
  profiles: 520,
  keywords: ['3d', 'model', 'asset', 'environment', 'prop', 'character', 'sculpt', 'texture', 'render', 'scene', 'game-ready', 'diorama', 'stylized', 'hard surface'],
  reqs: [
    R('modeling', 14, 'advanced'),
    R(DCC, 14, 'advanced', { label: '3D software (Blender / Maya / 3ds Max)' }),
    R('texturing', 12, 'advanced'),
    R('lighting', 9, 'advanced'),
    R('rendering', 8, 'advanced'),
    R('sculpting', 8, 'intermediate'),
    R('art-fundamentals', 8, 'advanced'),
    R('real-time-art', 6, 'intermediate', { label: 'Game-ready asset pipeline' }),
    R('animation-3d', 4, 'beginner'),
    R('compositing', 3, 'beginner'),
    R('photoshop', 3, 'intermediate'),
  ],
})

role('3d-designer', '3D Designer', 'creative-3d', 'creative3d', {
  blurb: 'Design 3D visuals for products, brands and immersive media.',
  core: ['Blender / Maya / 3ds Max', 'Modeling', 'Lighting', 'Rendering'],
  avg: 63,
  profiles: 380,
  keywords: ['3d', 'design', 'render', 'product visualization', 'motion', 'scene', 'brand', 'animation', 'visualization', 'archviz', 'packaging', 'abstract'],
  reqs: [
    R(DCC, 16, 'advanced', { label: '3D software (Blender / Maya / 3ds Max)' }),
    R('modeling', 14, 'advanced'),
    R('texturing', 12, 'advanced'),
    R('lighting', 10, 'advanced'),
    R('rendering', 10, 'advanced'),
    R('animation-3d', 8, 'intermediate', { label: 'Animation' }),
    R('art-fundamentals', 7, 'advanced', { label: 'Design sense & composition' }),
    R('compositing', 4, 'intermediate'),
    R('photoshop', 4, 'intermediate'),
    R('sculpting', 3, 'beginner'),
    R('real-time-art', 3, 'beginner'),
  ],
})

role('technical-artist', 'Technical Artist', 'creative-3d', 'creative3d', {
  blurb: 'Bridge art and engineering with shaders, tools and optimization.',
  core: ['Shaders', 'Engine', 'Scripting', 'Optimization'],
  avg: 58,
  profiles: 210,
  keywords: ['technical art', 'shader', 'tool', 'pipeline', 'vfx', 'procedural', 'optimization', 'rigging', 'houdini', 'unreal', 'unity', 'material', 'lod'],
  reqs: [
    R('shaders', 14, 'advanced'),
    R(ENGINES, 12, 'advanced', { label: 'Game engine (Unity / Unreal)' }),
    R(['python', 'csharp'], 12, 'advanced', { label: 'Scripting (Python / C#)' }),
    R(DCC, 10, 'intermediate', { label: '3D software' }),
    R('optimization', 10, 'advanced'),
    R('real-time-art', 8, 'advanced', { label: 'Real-time asset pipeline' }),
    R('texturing', 6, 'intermediate'),
    R('rigging', 6, 'intermediate'),
    R('math-3d', 6, 'intermediate'),
    R('procedural-generation', 6, 'intermediate'),
    R('pipeline-tools', 6, 'intermediate'),
    R('git', 3, 'intermediate'),
  ],
})

role('creative-technologist', 'Creative Technologist', 'creative-3d', 'creative3d', {
  blurb: 'Prototype interactive experiences where code meets design.',
  core: ['Creative coding', 'WebGL', 'Interaction', 'Prototyping'],
  avg: 62,
  profiles: 290,
  keywords: ['creative coding', 'interactive', 'installation', 'generative', 'webgl', 'three.js', 'experience', 'prototype', 'immersive', 'audio', 'shader', 'experiment'],
  reqs: [
    R('javascript', 10, 'advanced'),
    R('threejs', 10, 'advanced'),
    R('shaders', 8, 'intermediate'),
    R('creative-coding', 10, 'advanced'),
    R('animation', 8, 'advanced'),
    R('interaction-design', 6, 'intermediate'),
    R('ar-vr', 6, 'intermediate'),
    R('visual-design', 6, 'intermediate'),
    R('prototyping', 6, 'intermediate'),
    R('git', 3, 'intermediate'),
    R('embedded', 3, 'beginner', { label: 'Hardware & sensors' }),
    R('storytelling', 4, 'intermediate'),
  ],
})

/* ================================ DESIGN ================================ */

role('ui-ux-designer', 'UI/UX Designer', 'design', 'design', {
  blurb: 'Design intuitive, beautiful interfaces grounded in research.',
  core: ['Figma', 'UX research', 'Prototyping', 'Visual design'],
  avg: 69,
  profiles: 2080,
  keywords: ['ui', 'ux', 'design', 'redesign', 'case study', 'wireframe', 'prototype', 'research', 'app', 'website', 'dashboard', 'onboarding', 'design system', 'usability'],
  reqs: [
    R('figma', 12, 'advanced'),
    R('ux-research', 10, 'advanced'),
    R('wireframing', 8, 'advanced'),
    R('prototyping', 10, 'advanced'),
    R('visual-design', 10, 'advanced'),
    R('interaction-design', 8, 'advanced'),
    R('design-systems', 8, 'intermediate'),
    R('usability-testing', 8, 'intermediate'),
    R('information-architecture', 6, 'intermediate'),
    R('accessibility', 6, 'intermediate'),
    R('typography', 5, 'intermediate'),
    R('storytelling', 6, 'intermediate', { label: 'Case-study storytelling' }),
    R('design-handoff', 4, 'intermediate'),
  ],
})

role('product-designer', 'Product Designer', 'design', 'design', {
  blurb: 'Shape products end to end, from insight to shipped experience.',
  core: ['Product thinking', 'Figma', 'Research', 'Prototyping'],
  avg: 67,
  profiles: 1120,
  keywords: ['product', 'design', 'case study', 'saas', 'app', 'onboarding', 'flow', 'mvp', 'roadmap', 'growth', 'research', 'prototype', 'metrics'],
  reqs: [
    R('figma', 10, 'advanced'),
    R('product-thinking', 12, 'advanced'),
    R('ux-research', 9, 'intermediate'),
    R('prototyping', 8, 'advanced'),
    R('visual-design', 9, 'advanced'),
    R('design-systems', 8, 'intermediate'),
    R('interaction-design', 7, 'intermediate'),
    R('storytelling', 7, 'advanced', { label: 'Storytelling & communication' }),
    R('product-analytics', 6, 'intermediate', { label: 'Data-informed design' }),
    R('usability-testing', 6, 'intermediate'),
    R('accessibility', 4, 'intermediate'),
    R('design-handoff', 4, 'intermediate'),
    R('motion-design', 3, 'beginner'),
    R('css', 3, 'beginner', { label: 'HTML/CSS basics' }),
  ],
})

role('motion-designer', 'Motion Designer', 'design', 'creative3d', {
  blurb: 'Bring brands and interfaces to life with purposeful motion.',
  core: ['After Effects', 'Motion principles', 'Storytelling', 'Typography'],
  avg: 63,
  profiles: 340,
  keywords: ['motion', 'animation', 'after effects', 'title', 'explainer', 'logo', 'kinetic', 'lottie', 'reel', 'video', 'brand', 'transition', 'storyboard'],
  reqs: [
    R('motion-design', 16, 'advanced'),
    R('after-effects', 14, 'advanced'),
    R('animation', 10, 'advanced', { label: 'Animation principles' }),
    R('visual-design', 8, 'intermediate'),
    R(DCC, 6, 'beginner', { label: '3D basics (Blender / Cinema 4D)' }),
    R('storytelling', 8, 'intermediate', { label: 'Storyboarding & storytelling' }),
    R('typography', 6, 'intermediate'),
    R('compositing', 6, 'intermediate'),
    R('prototyping', 4, 'beginner', { label: 'Lottie & UI motion handoff' }),
  ],
})

/* ================================ EMERGING TECHNOLOGY ================================ */

role('blockchain-developer', 'Blockchain Developer', 'emerging', 'emerging', {
  blurb: 'Write and secure smart contracts and decentralized applications.',
  core: ['Solidity', 'Smart contracts', 'Security', 'Web3 tooling'],
  avg: 57,
  profiles: 430,
  keywords: ['blockchain', 'web3', 'smart contract', 'solidity', 'ethereum', 'defi', 'nft', 'dao', 'token', 'wallet', 'dapp', 'evm', 'crypto', 'l2'],
  reqs: [
    R('solidity', 16, 'advanced'),
    R('smart-contracts', 14, 'advanced'),
    R('blockchain-fundamentals', 12, 'advanced'),
    R('web3', 10, 'advanced', { label: 'Web3 tooling (Hardhat / ethers)' }),
    R(['javascript', 'typescript'], 8, 'intermediate', { label: 'JavaScript / TypeScript' }),
    R('smart-contract-security', 10, 'advanced'),
    R('cryptography', 8, 'intermediate'),
    R('testing', 7, 'intermediate', { label: 'Contract testing' }),
    R('git', 4, 'intermediate'),
    R('optimization', 4, 'intermediate', { label: 'Gas optimization' }),
    R('rest-apis', 3, 'beginner'),
  ],
})

role('ar-vr-developer', 'AR/VR Developer', 'emerging', 'emerging', {
  blurb: 'Build immersive spatial experiences for headsets and phones.',
  core: ['Unity / Unreal', 'XR', 'C# / C++', '3D math'],
  avg: 59,
  profiles: 280,
  keywords: ['ar', 'vr', 'xr', 'quest', 'headset', 'immersive', 'spatial', 'hand tracking', 'arkit', 'arcore', 'hololens', 'vision pro', 'mixed reality'],
  reqs: [
    R(ENGINES, 14, 'advanced', { label: 'Game engine (Unity / Unreal)' }),
    R('ar-vr', 16, 'advanced', { label: 'XR development' }),
    R(['csharp', 'cpp'], 10, 'advanced', { label: 'C# / C++' }),
    R('math-3d', 10, 'advanced'),
    R('optimization', 8, 'intermediate', { label: 'XR performance optimization' }),
    R(DCC, 4, 'beginner', { label: '3D asset basics' }),
    R('interaction-design', 6, 'intermediate', { label: 'Spatial interaction design' }),
    R('shaders', 4, 'intermediate'),
    R('physics', 4, 'intermediate'),
    R('git', 4, 'intermediate'),
    R('javascript', 3, 'beginner', { label: 'WebXR basics' }),
  ],
})

role('robotics-engineer', 'Robotics Engineer', 'emerging', 'embedded', {
  blurb: 'Make machines perceive, plan and move in the real world.',
  core: ['ROS', 'Control systems', 'C++ / Python', 'Perception'],
  avg: 58,
  profiles: 240,
  keywords: ['robot', 'ros', 'drone', 'autonomous', 'navigation', 'manipulator', 'slam', 'control', 'lidar', 'simulation', 'gazebo', 'arm', 'rover'],
  reqs: [
    R('robotics', 16, 'advanced', { label: 'Robotics & ROS' }),
    R(['cpp', 'python'], 12, 'advanced', { label: 'C++ / Python' }),
    R('control-systems', 12, 'advanced'),
    R('math', 8, 'advanced', { label: 'Linear algebra & kinematics' }),
    R('embedded', 7, 'intermediate'),
    R('computer-vision', 6, 'intermediate', { label: 'Perception' }),
    R('electronics', 6, 'intermediate'),
    R('linux', 6, 'intermediate'),
    R('simulation', 6, 'intermediate'),
    R('git', 4, 'intermediate'),
    R('machine-learning', 3, 'beginner'),
  ],
})

/* ================================ build + validate ================================ */

const LEVEL_IDS = new Set(Object.keys(LEVEL_BY_ID))

function buildRole(def) {
  const family = getFamily(def.family)
  const totalWeight = def.reqs.reduce((acc, r) => acc + r.weight, 0)

  const requirements = def.reqs.map((req) => {
    const primary = SKILL_BY_ID[req.skills[0]]
    const share = req.weight / totalWeight
    const label = req.label ?? primary?.label ?? req.skills[0]
    // For "any of" groups the learner picks the easiest option, so effort = the lowest among them.
    const effort = Math.min(...req.skills.map((id) => SKILL_BY_ID[id]?.effort ?? 2))
    return { id: req.skills.length === 1 ? req.skills[0] : slugify(label), skills: req.skills, label, weight: req.weight, share, target: req.target, importance: share >= 0.085 ? 'high' : share >= 0.045 ? 'medium' : 'low', why: req.why ?? primary?.why ?? '', effort, group: primary?.group ?? 'concept' }
  })

  return { id: def.id, name: def.name, category: def.category, family: def.family, blurb: def.blurb, core: def.core, keywords: def.keywords ?? [], requirements, weights: def.weights ?? family.weights, signals: def.signals ?? family.signals, expectedYears: def.expectedYears ?? family.expectedYears, platform: { avg: def.avg, profiles: def.profiles, ...(def.sd ? { sd: def.sd } : {}) } }
}

export const ROLES = definitions.map(buildRole)
export const ROLE_BY_ID = Object.fromEntries(ROLES.map((r) => [r.id, r]))
export const DEFAULT_ROLE_ID = 'frontend-developer'

export const getRole = (id) => ROLE_BY_ID[id] ?? ROLE_BY_ID[DEFAULT_ROLE_ID]
export const hasRole = (id) => Boolean(ROLE_BY_ID[id])
export const rolesByCategory = (categoryId) => ROLES.filter((r) => r.category === categoryId)

/** Dev-time sanity checks (run by scripts/engine-report.mjs). Returns a list of problems. */
export function validateRoles() {
  const problems = []
  const seen = new Set()
  for (const r of ROLES) {
    if (seen.has(r.id)) problems.push(`duplicate role id: ${r.id}`)
    seen.add(r.id)
    if (!FAMILIES[r.family]) problems.push(`${r.id}: unknown family ${r.family}`)
    const weightSum = Object.values(r.weights).reduce((a, b) => a + b, 0)
    if (Math.abs(weightSum - 1) > 0.001) problems.push(`${r.id}: category weights sum to ${weightSum.toFixed(3)}`)
    for (const req of r.requirements) {
      if (!LEVEL_IDS.has(req.target)) problems.push(`${r.id}: bad target level ${req.target}`)
      for (const skillId of req.skills) if (!SKILL_BY_ID[skillId]) problems.push(`${r.id}: unknown skill id "${skillId}"`)
    }
  }
  return problems
}
