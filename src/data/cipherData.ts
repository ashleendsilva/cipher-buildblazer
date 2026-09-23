import { Leader, DomainItem, EventItem, ArchiveItem } from '../types';

export const CIPHER_META = {
  name: 'CIPHER',
  fullName: 'Student Association of Computer Science & Engineering',
  institution: 'St Joseph Engineering College (SJEC)',
  node: 'NODE_SJEC_CSE_01',
  term: '2025 — 2026',
  tagline: 'Bridging academic knowledge and practical application — a community of aspiring professionals in computing.',
  about: 'CIPHER is the student association of the Department of Computer Science & Engineering. It serves as a platform for students to nurture their technical and interpersonal skills through innovative and collaborative activities. The association strives to bridge the gap between academic knowledge and practical application, fostering a community of aspiring professionals dedicated to excellence in computing.',
};

export const DOMAINS: DomainItem[] = [
  {
    id: 'tech-skill',
    code: '01',
    title: 'Technical Skill Building',
    sessionsCount: 5,
    description: 'Hands-on workshops, coding sessions, and tech talks that turn theory into working software.',
    icon: 'Code2',
    tags: ['Full-Stack', 'AI Systems', 'System Design', 'Open Source'],
    recentWorkshops: ['React & Node.js Deep Dive', 'Solidity & Web3 Protocols', 'RPA Automation']
  },
  {
    id: 'leadership',
    code: '02',
    title: 'Leadership & Governance',
    sessionsCount: 3,
    description: 'Annual elections for President, Secretary, and office bearers - guided by the HOD and Faculty Coordinator.',
    icon: 'Crown',
    tags: ['Elections', 'Mentorship', 'Policy', 'Executive Board'],
    recentWorkshops: ['Board Strategy Sync', 'Parliamentary Debate Protocol', 'Team Orchestration']
  },
  {
    id: 'events-collab',
    code: '03',
    title: 'Events & Collaboration',
    sessionsCount: 6,
    description: 'Hackathons, seminars, and department-level competitions that bring students together.',
    icon: 'Layers',
    tags: ['Hackathons', 'Branch Gala', 'AgentBlazer', 'Prompt Ops'],
    recentWorkshops: ['PROMPT OPS-2K26', 'HACKTO Future 20', 'Lumière Gala']
  },
  {
    id: 'industry',
    code: '04',
    title: 'Industry Readiness',
    sessionsCount: 4,
    description: 'Bridging classroom learning with real-world application to prepare students for the field.',
    icon: 'Rocket',
    tags: ['Mock Interviews', 'KSCST Funding', 'Tech Talks', 'Career Prep'],
    recentWorkshops: ['UDAAN Placement Series', 'KSCST Project Incubation', 'Industrial Visits']
  }
];

export const LEADERS: Leader[] = [
  {
    id: 'elston-pereira',
    name: 'Elston Herold Pereira',
    role: 'PRESIDENT',
    category: 'executive',
    image: '/images/Elston.PNG',
    bio: 'Leads the CIPHER executive committee, orchestrating technical initiatives, university collaborations, and departmental vision.',
    quote: 'Computing is not just code—it is the architecture of modern possibility.',
    contributions: ['Spearheaded HacktoFuture 20', 'Overhauled student mentorship workflow', 'Led Industry Outreach sprint'],
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    email: 'elston.pereira@sjec.ac.in'
  },
  {
    id: 'raynell-lewis',
    name: 'Raynell Lewis',
    role: 'VICE PRESIDENT',
    category: 'executive',
    image: '/images/Raynell.JPG',
    bio: 'Oversees operational execution of departmental competitions, workshops, and inter-collegiate technical symposiums.',
    quote: 'Empowering peers to step outside textbooks and ship tangible software.',
    contributions: ['Coordinated PROMPT OPS-2K26', 'Curated Applied ML series', 'Initiated peer-to-peer code reviews'],
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    email: 'raynell.lewis@sjec.ac.in'
  },
  {
    id: 'nazmin-ziya',
    name: 'Nazmin Ziya',
    role: 'TREASURER',
    category: 'executive',
    image: '/images/Nazmin.JPG',
    bio: 'Manages CIPHER financial budget, sponsor relations, event grants, and fiscal governance across all flagship summits.',
    quote: 'Resource allocation and financial clarity drive sustainable innovation.',
    contributions: ['KSCST grant disbursements', 'Gala logistics budgeting', 'Sponsor procurement'],
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    email: 'nazmin.ziya@sjec.ac.in'
  },
  {
    id: 'jeslin-ninora',
    name: 'Jeslin Ninora',
    role: 'JOINT TREASURER',
    category: 'executive',
    image: '/images/jeslin.jpeg',
    bio: 'Assists in auditing workshop expenditures, participant registrations, prize endowments, and logistics tracking.',
    quote: 'Precision in execution transforms good intentions into landmark events.',
    contributions: ['Inventory management', 'Registration desks automated flow', 'Audit documentation'],
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    email: 'jeslin.ninora@sjec.ac.in'
  },
  {
    id: 'chaitra-r',
    name: 'Chaitra R',
    role: 'SECRETARY',
    category: 'executive',
    image: '/images/Chaitra.JPG',
    bio: 'Maintains official correspondence, meeting minutes, departmental notices, and liaison between students and faculty.',
    quote: 'Clear documentation is the bedrock of transparent community leadership.',
    contributions: ['Freshers Onboarding Guide', 'Executive board circulars', 'Academic calendar coordination'],
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    email: 'chaitra.r@sjec.ac.in'
  },
];

export const EVENTS: EventItem[] = [
  {
    id: 'lumiere-gala',
    badge: 'BRANCH GALA',
    dateStr: '29 OCT 2025',
    isoDate: '2025-10-29',
    venue: 'Kalam Auditorium',
    title: 'Lumière — The Gala',
    theme: 'Where Glam Meets Glow',
    shortSummary: 'The CSE branch entry programme at Kalam Auditorium, themed "Where Glam Meets Glow." Organised by the Cipher Association with coordinated red, gold and black décor, it welcomed students into the department and reinforced a shared sense of collective identity.',
    fullNarrative: [
      'The Department of Computer Science and Engineering (CSE) held its branch entry programme, "Lumière – The Gala," on 29 October 2025 at the Kalam Auditorium. Organised by the Cipher Association, the event welcomed students into the department through a formal gathering centered on the theme "Where Glam Meets Glow."',
      'The venue featured coordinated red, gold and black décor, floral arrangements, illuminated panels and a central Lumière backdrop, creating an atmospheric setting for the inaugural celebration.',
      'The programme gave students an opportunity to interact with peers and take part in a shared departmental event beyond academics, highlighting the role of the Cipher Association in organising student-led activities. The event concluded as a formal branch entry that marked the students’ transition into the department and reinforced a sense of collective identity.'
    ],
    highlights: [
      'Theme: "Where Glam Meets Glow"',
      'Coordinated Red, Gold & Black Décor',
      'Kalam Auditorium Grand Assembly',
      'Ceremonial Lamp Lighting ',
      'Cultural Performances'
    ],
    galleryImages: [
      {
        url: '/images/IMG_7354.JPG',
        caption: 'Kalam Auditorium stage presentation and inaugural address',
        tag: 'LUMIERE GALA INAUGURATION'
      },
      {
        url: '/images/IMG_7350.JPG',
        caption: '',
        tag: ''
      },
      {
        url: '/images/IMG_7369.JPG',
        caption: '',
        tag: ''
      },
      {
        url: '/images/IMG_7372.JPG',
        caption: '',
        tag: ''
      },
      {
        url: '/images/IMG_7386.JPG',
        caption: '',
        tag: ''
      },
      {
        url: '/images/IMG_7354.JPG',
        caption: '',
        tag: ''
      },
      {
        url: '/images/IMG_7388.JPG',
        caption: '',
        tag: ''
      },
      {
        url: '/images/IMG_7397.JPG',
        caption: '',
        tag: ''
      }
    ]
  },
  {
    id: 'prompt-ops',
    badge: 'COMPETITION',
    dateStr: '25 MAR 2026',
    isoDate: '2026-03-25',
    venue: 'CSE Advanced Computing Labs',
    title: 'PROMPT OPS-2K26',
    theme: 'Prompt Engineering & Autonomous AI Challenge',
    shortSummary: 'A technical competition on prompt engineering and AI tools by the AgentBlazer Club and Cipher. Track 1 (1st Year) covered invitation, logo and image recreation; Track 2 (2nd Year) tested JSON conversion, Python debugging and a Gemini AI security prompt challenge.',
    fullNarrative: [
      'Organized by the AgentBlazer Club and Cipher under the guidance of Ms. Nisha J Roche, Ms. Jaishma K, and HOD Dr. Melwyn D’Souza, this technical competition focused on prompt engineering and AI tools (mapped to PO4, PO5, PO8, PO11).',
      'The competition was partitioned into two competitive tracks tailored to students’ technical maturity: Track 1 (1st Year) featured invitation generation, logo recreation, and image recreation rounds, with Chinmayee, Chris Royston Monteiro, and Deeksha Ravi Moger taking top honors., while Track 2 presented rigorous code correction, structured data transformation, and LLM security jailbreak defenses.',
      'Students demonstrated deep fluency with modern multimodal tools, prompt chain conditioning, and algorithmic problem-solving in a fast-paced timed environment.'
    ],
    tracks: [
      {
        trackName: 'Track 1: Generative Design & Multimodal Prompting',
        targetYear: '1st Year Students',
        description: 'Challenged participants in invitation synthesis, logo recreation, and image generation using precision negative prompting and aspect control.',
        winners: [
          {
            rank: '1st Place & Top Honors',
            names: ['Chinmayee', 'Chris Royston Monteiro', 'Deeksha Ravi Moger']
          }
        ]
      },
      {
        trackName: 'Track 2: Algorithmic Systems & AI Security',
        targetYear: '2nd Year Students',
        description: 'Evaluated participants on complex unstructured-to-JSON parsing, Python debugging through AI co-pilots, and Gemini AI security prompt extraction challenges.',
        winners: [
          {
            rank: '1st Place & Top Positions',
            names: ['Harimurali KS', 'Venus Suhani D’Lima', 'Venisha Snehal D’Souza']
          }
        ]
      }
    ],
    highlights: [
      'Co-hosted by AgentBlazer Club & CIPHER',
      'Guided by Dr. Melwyn D\'Souza, Ms. Nisha J Roche & Ms. Jaishma K',
      'Gemini AI Security & System Prompt Injection Defense',
      'Python code debugging'
    ],
    galleryImages: [
      {
        url: '/images/20260325_141046.jpg',
        caption: 'Participants in intense prompt engineering coding session in CSE lab',
        tag: 'PROMPT OPS'
      },
      {
        url: '/images/20260325_165226.jpg',
        caption: 'Team collaboration and prompt debugging on Gemini models',
        tag: 'PROMPT OPS'
      },
      {
        url: '/images/20260325_165255.jpg',
        caption: 'Faculty coordinators evaluating structured JSON outputs and accuracy',
        tag: 'PROMPT OPS'
      },
      {
        url: '/images/20260325_165737.jpg',
        caption: 'Certificate distribution ceremony for Track 1 & Track 2 winners',
        tag: 'PROMPT OPS'
      },
      {
        url: '/images/IMG_8492.JPG',
        caption: 'Valedictory address on ethical AI and LLM security practices',
        tag: 'PROMPT OPS'
      }
    ]
  }
];

export const ARCHIVE_ITEMS: ArchiveItem[] = [
  {
    num: '01',
    id: 'applied-ml',
    title: 'Applied Machine Learning',
    category: 'AI & ML',
    year: '2025',
    url: 'https://scikit-learn.org/stable/',
    description: 'Comprehensive walkthrough of feature engineering, scikit-learn pipelines, model hyperparameter tuning, and real-world inference deployments.',
    tags: ['Scikit-Learn', 'Feature Store', 'Classification', 'Inference'],
    leadSpeaker: 'AI Research Lab & Cipher Leads'
  },
  {
    num: '02',
    id: 'industrial-visit-1',
    title: 'Industrial Visit',
    category: 'Industry & Career',
    year: '2025',
    url: 'https://sjec.ac.in/department-computer-science.php',
    description: 'Excursion to premier enterprise IT parks, touring production tier-3 data centers, CI/CD operations, and cloud infrastructure control centers.',
    tags: ['Cloud Infrastructure', 'Enterprise DevOps', 'Data Centers'],
    leadSpeaker: 'Industry Relations Cell'
  },
  {
    num: '03',
    id: 'latex-tool',
    title: 'LaTeX Tool',
    category: 'Tools & Systems',
    year: '2025',
    url: 'https://www.overleaf.com/learn',
    description: 'Masterclass on professional research paper typesetting, mathematical equation styling, IEEE formatting, and automated bibliography management with BibTeX.',
    tags: ['IEEE Standard', 'BibTeX', 'Research Publishing', 'Typography'],
    leadSpeaker: 'Dept Research Committee'
  },
  {
    num: '04',
    id: 'rpa-uipath',
    title: 'Robotic Process Automation using UiPath',
    category: 'Development',
    year: '2025',
    url: 'https://academy.uipath.com/',
    description: 'Hands-on laboratory introducing software bots, workflow orchestrator nodes, document understanding OCR engines, and automated business processes.',
    tags: ['UiPath', 'Bot Workflows', 'Enterprise RPA', 'OCR'],
    leadSpeaker: 'UiPath Academic Alliance'
  },
  {
    num: '05',
    id: 'hackto-future-20',
    title: 'HACKTO Future 20',
    category: 'Development',
    year: '2025',
    url: 'https://hacktofuture.sjec.ac.in/',
    description: 'Flagship 24-hour hackathon bringing together multidisciplinary engineering squads to formulate, prototype, and pitch civic & AI software solutions.',
    tags: ['24h Hackathon', 'Rapid Prototyping', 'Product Pitch', 'Cash Prizes'],
    leadSpeaker: 'CIPHER Tech Council'
  },
  {
    num: '06',
    id: 'sport-programming',
    title: 'How to Win at the Sport of Programming',
    category: 'Development',
    year: '2025',
    url: 'https://codeforces.com/edu/courses',
    description: 'Competitive programming masterclass dissecting time complexities, dynamic programming recurrence relations, graph traversals, and ICPC strategies.',
    tags: ['Competitive Coding', 'DP', 'Graph Theory', 'ICPC Prep'],
    leadSpeaker: 'CodeChef & LeetCode Alumni'
  },
  {
    num: '07',
    id: 'google-crowdsource',
    title: 'Introduction to Google Crowdsource',
    category: 'Tools & Systems',
    year: '2024',
    url: 'https://crowdsource.google.com/',
    description: 'Interactive session exploring data quality in machine learning models, diverse dataset validation, language translation benchmarks, and open community science.',
    tags: ['Google AI', 'Dataset Diversity', 'Crowdsource Community'],
    leadSpeaker: 'Google Crowdsource Influencers'
  },
  {
    num: '08',
    id: 'github-session',
    title: 'Educational Session on GitHub',
    category: 'Tools & Systems',
    year: '2024',
    url: 'https://github.com/skills',
    description: 'From git init to collaborative upstream PRs: interactive workshop covering branch protection, merge conflict resolution, GitHub Actions CI, and markdown READMEs.',
    tags: ['Git CLI', 'Actions CI/CD', 'Open Source PRs', 'Collaboration'],
    leadSpeaker: 'GitHub Campus Experts'
  },
  {
    num: '09',
    id: 'industrial-visit-2',
    title: 'Industrial Visit',
    category: 'Industry & Career',
    year: '2024',
    url: 'https://sjec.ac.in/department-computer-science.php',
    description: 'On-site technical exposure visit to leading software engineering campuses and automotive embedded systems testing facilities.',
    tags: ['Software Engineering', 'Automotive Embedded', 'QA Pipelines'],
    leadSpeaker: 'Faculty Outreach Lead'
  },
  {
    num: '10',
    id: 'udaan-mock',
    title: 'UDAAN Mock Interview',
    category: 'Industry & Career',
    year: '2024',
    url: 'https://sjec.ac.in/training-and-placements.php',
    description: 'Rigorous campus interview simulation with senior alumni and HR specialists, featuring DSA technical screenings, system design rounds, and HR behavioral appraisals.',
    tags: ['Mock Technical Rounds', 'System Design', 'Behavioral HR', 'Resume Audit'],
    leadSpeaker: 'SJEC Placement Cell & Alumni Panel'
  },
  {
    num: '11',
    id: 'freshers-onboarding',
    title: 'Freshers Onboarding Programme',
    category: 'Academic & Grants',
    year: '2024',
    url: 'https://sjec.ac.in/',
    description: 'Departmental orientation introducing curriculum roadmaps, computing club domains, laboratory ethics, open-source communities, and senior mentorship pairings.',
    tags: ['Branch Induction', 'Mentorship', 'Curriculum Guide'],
    leadSpeaker: 'CIPHER Office Bearers'
  },
  {
    num: '12',
    id: 'kscst-projects',
    title: 'Projects Funded by KSCST',
    category: 'Academic & Grants',
    year: '2024',
    url: 'https://www.kscst.iisc.ernet.in/spp.html',
    description: 'Showcase and grant writing incubator guiding students in submitting high-impact engineering projects to the Karnataka State Council for Science and Technology.',
    tags: ['Research Grants', 'KSCST Funding', 'Patent Filing', 'State Innovation'],
    leadSpeaker: 'Research Advisory Board'
  },
  {
    num: '13',
    id: 'genai-research',
    title: 'Generative AI Tools for Research',
    category: 'AI & ML',
    year: '2024',
    url: 'https://arxiv.org/',
    description: 'Empowering student scholars with ethical LLM literature review tools, semantic search engines, citation cross-examiners, and synthetic data validation frameworks.',
    tags: ['Literature Synthesis', 'Semantic Search', 'Ethical AI', 'Paper Review'],
    leadSpeaker: 'AI Faculty & Research Scholars'
  },
  {
    num: '14',
    id: 'blockchain-solidity',
    title: 'Introduction to Blockchain: Solidity Workshop',
    category: 'Development',
    year: '2024',
    url: 'https://soliditylang.org/',
    description: 'Building decentralized applications on Ethereum: smart contract syntax, ERC-20 tokenomics, Hardhat testing environments, and gas optimization techniques.',
    tags: ['Solidity', 'Ethereum EVM', 'Hardhat', 'Smart Contracts'],
    leadSpeaker: 'Web3 Developer Collective'
  },
  {
    num: '15',
    id: 'star-uml',
    title: 'Star UML',
    category: 'Tools & Systems',
    year: '2024',
    url: 'https://staruml.io/',
    description: 'Practical architectural blueprinting using Star UML: class diagrams, sequence flows, use-case modeling, state machine diagrams, and enterprise software documentation.',
    tags: ['UML Modeling', 'Software Architecture', 'Sequence Flows', 'OOAD'],
    leadSpeaker: 'Software Engineering Faculty'
  },
  {
    num: '16',
    id: 'genai-openai',
    title: 'Generative AI: Custom Solutions using OpenAI',
    category: 'AI & ML',
    year: '2024',
    url: 'https://platform.openai.com/docs/',
    description: 'End-to-end tutorial on crafting context-aware enterprise copilots, utilizing function calling, streaming APIs, embedding vector databases, and Retrieval-Augmented Generation (RAG).',
    tags: ['OpenAI APIs', 'Vector Embeddings', 'RAG Architecture', 'Function Calling'],
    leadSpeaker: 'CIPHER AI Lead'
  },
  {
    num: '17',
    id: 'react-node-workshop',
    title: 'React.js and Node.js Workshop',
    category: 'Development',
    year: '2024',
    url: 'https://react.dev/',
    description: 'Hands-on full-stack bootcamp building a live real-time task manager: React state and hooks, Tailwind styling, Express REST endpoints, JWT auth, and MongoDB models.',
    tags: ['React 18', 'Node.js', 'Express', 'JWT Authentication', 'REST APIs'],
    leadSpeaker: 'Full-Stack Student Mentors'
  }
];

export interface GalleryCollageItem {
  id: number;
  url: string;
  fallbackUrl: string;
  title: string;
  subtitle: string;
  tag: string;
  positionName: 'upper-left' | 'upper-right' | 'left' | 'right' | 'lower-left' | 'lower-right' | 'bottom';
}

export const GALLERY_COLLAGE_IMAGES: GalleryCollageItem[] = [
  {
    id: 1,
    url: '/images/20260325_141046.jpg',
    fallbackUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80',
    title: '',
    subtitle: '',
    tag: 'CSE LAB',
    positionName: 'upper-left'
  },
  {
    id: 2,
    url: '/images/20260325_165226.jpg',
    fallbackUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
    title: '',
    subtitle: '',
    tag: 'PROMPT OPS',
    positionName: 'upper-right'
  },
  {
    id: 3,
    url: '/images/IMG_7350.JPG',
    fallbackUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
    title: '',
    subtitle: '',
    tag: 'LUMIÈRE',
    positionName: 'left'
  },
  {
    id: 4,
    url: '/images/IMG_7354.JPG',
    fallbackUrl: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80',
    title: '',
    subtitle: '',
    tag: 'LUMIÈRE',
    positionName: 'right'
  },
  {
    id: 5,
    url: '/images/IMG_7369.JPG',
    fallbackUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
    title: '',
    subtitle: '',
    tag: 'LUMIÈRE',
    positionName: 'lower-left'
  },
  {
    id: 6,
    url: '/images/IMG_7388.JPG',
    fallbackUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
    title: '',
    subtitle: '',
    tag: 'LUMIÈRE',
    positionName: 'lower-right'
  },
  {
    id: 7,
    url: '/images/IMG_7397.JPG',
    fallbackUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80',
    title: '',
    subtitle: '',
    tag: 'LUMIÈRE',
    positionName: 'bottom'
  }
];

