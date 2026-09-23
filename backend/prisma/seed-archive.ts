import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const archiveItems = [
  {
    num: "01",
    id: "applied-ml",
    title: "Applied Machine Learning",
    category: "AI & ML",
    year: "2025",
    description:
      "Comprehensive walkthrough of feature engineering, scikit-learn pipelines, model hyperparametertuning, and real-world inference deployments.",
    tags: ["Scikit-Learn", "Feature Store", "Classification", "Inference"],
    leadSpeaker: "AI Research Lab & Cipher Leads",
  },
  {
    num: "02",
    id: "industrial-visit-1",
    title: "Industrial Visit",
    category: "Industry & Career",
    year: "2025",
    description:
      "Excursion to premier enterprise IT parks, touring production tier-3 data centers, CI/CD operations, and cloud infrastructure control centers.",
    tags: ["Cloud Infrastructure", "Enterprise DevOps", "Data Centers"],
    leadSpeaker: "Industry Relations Cell",
  },
  {
    num: "03",
    id: "latex-tool",
    title: "LaTeX Tool",
    category: "Tools & Systems",
    year: "2025",
    description:
      "Masterclass on professional research paper typesetting, mathematical equation styling, IEEE formatting, and automated bibliography management with BibTeX.",
    tags: ["IEEE Standard", "BibTeX", "Research Publishing", "Typography"],
    leadSpeaker: "Dept Research Committee",
  },
  {
    num: "04",
    id: "rpa-uipath",
    title: "Robotic Process Automation using UiPath",
    category: "Development",
    year: "2025",
    description:
      "Hands-on laboratory introducing software bots, workflow orchestrator nodes, document understanding OCR engines, and automated business processes.",
    tags: ["UiPath", "Bot Workflows", "Enterprise RPA", "OCR"],
    leadSpeaker: "UiPath Academic Alliance",
  },
  {
    num: "05",
    id: "hackto-future-20",
    title: "HACKTO Future 20",
    category: "Development",
    year: "2025",
    description:
      "Flagship 24-hour hackathon bringing together multidisciplinary engineering squads to formulate, prototype, and pitch civic & AI software solutions.",
    tags: ["24h Hackathon", "Rapid Prototyping", "Product Pitch", "Cash Prizes"],
    leadSpeaker: "CIPHER Tech Council",
  },
  {
    num: "06",
    id: "sport-programming",
    title: "How to Win at the Sport of Programming",
    category: "Development",
    year: "2025",
    description:
      "Competitive programming masterclass dissecting time complexities, dynamic programming recurrence relations, graph traversals, and ICPC strategies.",
    tags: ["Competitive Coding", "DP", "Graph Theory", "ICPC Prep"],
    leadSpeaker: "CodeChef & LeetCode Alumni",
  },
  {
    num: "07",
    id: "google-crowdsource",
    title: "Introduction to Google Crowdsource",
    category: "Tools & Systems",
    year: "2024",
    description:
      "Interactive session exploring data quality in machine learning models, diverse dataset validation, language translation benchmarks, and open community science.",
    tags: ["Google AI", "Dataset Diversity", "Crowdsource Community"],
    leadSpeaker: "Google Crowdsource Influencers",
  },
  {
    num: "08",
    id: "github-session",
    title: "Educational Session on GitHub",
    category: "Tools & Systems",
    year: "2024",
    description:
      "From git init to collaborative upstream PRs: interactive workshop covering branch protection, merge conflict resolution, GitHub Actions CI, and markdown READMEs.",
    tags: ["Git CLI", "Actions CI/CD", "Open Source PRs", "Collaboration"],
    leadSpeaker: "GitHub Campus Experts",
  },
  {
    num: "09",
    id: "industrial-visit-2",
    title: "Industrial Visit",
    category: "Industry & Career",
    year: "2024",
    description:
      "On-site technical exposure visit to leading software engineering campuses and automotive embedded systems testing facilities.",
    tags: ["Software Engineering", "Automotive Embedded", "QA Pipelines"],
    leadSpeaker: "Faculty Outreach Lead",
  },
  {
    num: "10",
    id: "udaan-mock",
    title: "UDAAN Mock Interview",
    category: "Industry & Career",
    year: "2024",
    description:
      "Rigorous campus interview simulation with senior alumni and HR specialists, featuring DSA technical screenings, system design rounds, and HR behavioral appraisals.",
    tags: ["Mock Technical Rounds", "System Design", "Behavioral HR", "Resume Audit"],
    leadSpeaker: "SJEC Placement Cell & Alumni Panel",
  },
  {
    num: "11",
    id: "freshers-onboarding",
    title: "Freshers Onboarding Programme",
    category: "Academic & Grants",
    year: "2024",
    description:
      "Departmental orientation introducing curriculum roadmaps, computing club domains, laboratory ethics, open-source communities, and senior mentorship pairings.",
    tags: ["Branch Induction", "Mentorship", "Curriculum Guide"],
    leadSpeaker: "CIPHER Office Bearers",
  },
  {
    num: "12",
    id: "kscst-projects",
    title: "Projects Funded by KSCST",
    category: "Academic & Grants",
    year: "2024",
    description:
      "Showcase and grant writing incubator guiding students in submitting high-impact engineering projects to the Karnataka State Council for Science and Technology.",
    tags: ["Research Grants", "KSCST Funding", "Patent Filing", "State Innovation"],
    leadSpeaker: "Research Advisory Board",
  },
  {
    num: "13",
    id: "genai-research",
    title: "Generative AI Tools for Research",
    category: "AI & ML",
    year: "2024",
    description:
      "Empowering student scholars with ethical LLM literature review tools, semantic search engines,citation cross-examiners, and synthetic data validation frameworks.",
    tags: ["Literature Synthesis", "Semantic Search", "Ethical AI", "Paper Review"],
    leadSpeaker: "AI Faculty & Research Scholars",
  },
  {
    num: "14",
    id: "blockchain-solidity",
    title: "Introduction to Blockchain: Solidity Workshop",
    category: "Development",
    year: "2024",
    description:
      "Building decentralized applications on Ethereum: smart contract syntax, ERC-20 tokenomics, Hardhat testing environments, and gas optimization techniques.",
    tags: ["Solidity", "Ethereum EVM", "Hardhat", "Smart Contracts"],
    leadSpeaker: "Web3 Developer Collective",
  },
  {
    num: "15",
    id: "star-uml",
    title: "Star UML",
    category: "Tools & Systems",
    year: "2024",
    description:
      "Practical architectural blueprinting using Star UML: class diagrams, sequence flows, use-case modeling, state machine diagrams, and enterprise software documentation.",
    tags: ["UML Modeling", "Software Architecture", "Sequence Flows", "OOAD"],
    leadSpeaker: "Software Engineering Faculty",
  },
  {
    num: "16",
    id: "genai-openai",
    title: "Generative AI: Custom Solutions using OpenAI",
    category: "AI & ML",
    year: "2024",
    description:
      "End-to-end tutorial on crafting context-aware enterprise copilots, utilizing function calling,streaming APIs, embedding vector databases, and Retrieval-Augmented Generation (RAG).",
    tags: ["OpenAI APIs", "Vector Embeddings", "RAG Architecture", "Function Calling"],
    leadSpeaker: "CIPHER AI Lead",
  },
  {
    num: "17",
    id: "react-node-workshop",
    title: "React.js and Node.js Workshop",
    category: "Development",
    year: "2024",
    description:
      "Hands-on full-stack bootcamp building a live real-time task manager: React state and hooks, Tailwind styling, Express REST endpoints, JWT auth, and MongoDB models.",
    tags: ["React 18", "Node.js", "Express", "JWT Authentication", "REST APIs"],
    leadSpeaker: "Full-Stack Student Mentors",
  },
];

async function main() {
  await prisma.archiveItem.deleteMany();

  await prisma.archiveItem.createMany({
    data: archiveItems,
  });

  console.log(`Seeded ${archiveItems.length} archive items.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });