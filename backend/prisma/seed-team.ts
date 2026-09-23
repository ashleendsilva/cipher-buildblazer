import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.teamMember.deleteMany();

  await prisma.teamMember.createMany({
    data: [
      {
        id: "elston-pereira",
        name: "Elston Herold Pereira",
        role: "PRESIDENT",
        category: "executive",
        image: "/images/Elston.PNG",
        bio: "Leads the CIPHER executive committee, orchestrating technical initiatives, university collaborations, and departmental vision.",
        quote: "Computing is not just code—it is the architecture of modern possibility.",
        contributions: [
          "Spearheaded HacktoFuture 20",
          "Overhauled student mentorship workflow",
          "Led Industry Outreach sprint",
        ],
        github: "https://github.com",
        linkedin: "https://linkedin.com",
        email: "elston.pereira@sjec.ac.in",
      },
      {
        id: "raynell-lewis",
        name: "Raynell Lewis",
        role: "VICE PRESIDENT",
        category: "executive",
        image: "/images/Raynell.JPG",
        bio: "Oversees operational execution of departmental competitions, workshops, and inter-collegiate technical symposiums.",
        quote: "Empowering peers to step outside textbooks and ship tangible software.",
        contributions: [
          "Coordinated PROMPT OPS-2K26",
          "Curated Applied ML series",
          "Initiated peer-to-peer code reviews",
        ],
        github: "https://github.com",
        linkedin: "https://linkedin.com",
        email: "raynell.lewis@sjec.ac.in",
      },
      {
        id: "nazmin-ziya",
        name: "Nazmin Ziya",
        role: "TREASURER",
        category: "executive",
        image: "/images/Nazmin.JPG",
        bio: "Manages CIPHER financial budget, sponsor relations, event grants, and fiscal governance across all flagship summits.",
        quote: "Resource allocation and financial clarity drive sustainable innovation.",
        contributions: [
          "KSCST grant disbursements",
          "Gala logistics budgeting",
          "Sponsor procurement",
        ],
        github: "https://github.com",
        linkedin: "https://linkedin.com",
        email: "nazmin.ziya@sjec.ac.in",
      },
      {
        id: "jeslin-ninora",
        name: "Jeslin Ninora",
        role: "JOINT TREASURER",
        category: "executive",
        image: "/images/jeslin.jpeg",
        bio: "Assists in auditing workshop expenditures, participant registrations, prize endowments, and logistics tracking.",
        quote: "Precision in execution transforms good intentions into landmark events.",
        contributions: [
          "Inventory management",
          "Registration desks automated flow",
          "Audit documentation",
        ],
        github: "https://github.com",
        linkedin: "https://linkedin.com",
        email: "jeslin.ninora@sjec.ac.in",
      },
      {
        id: "chaitra-r",
        name: "Chaitra R",
        role: "SECRETARY",
        category: "executive",
        image: "/images/Chaitra.JPG",
        bio: "Maintains official correspondence, meeting minutes, departmental notices, and liaison between students and faculty.",
        quote: "Clear documentation is the bedrock of transparent community leadership.",
        contributions: [
          "Freshers Onboarding Guide",
          "Executive board circulars",
          "Academic calendar coordination",
        ],
        github: "https://github.com",
        linkedin: "https://linkedin.com",
        email: "chaitra.r@sjec.ac.in",
      },
      {
        id: "dr-melwyn-dsouza",
        name: "Dr. Melwyn D'Souza",
        role: "HEAD OF DEPARTMENT",
        subtitle: "HOD, Computer Science & Engineering",
        category: "faculty",
        image:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=700&q=80",
        bio: "Guiding visionary for CIPHER, nurturing research ethics, industry partnerships, and state-of-the-art curriculum alignments.",
        quote: "Excellence in computing is achieved when academic discipline meets creative curiosity.",
        contributions: [
          "Departmental Research Advisor",
          "KSCST Project Endorsement",
          "Industry MoU Lead",
        ],
        email: "hodcse@sjec.ac.in",
      },
      {
        id: "ms-nisha-roche",
        name: "Ms. Nisha J Roche",
        role: "FACULTY COORDINATOR",
        subtitle: "Assistant Professor, Dept of CSE",
        category: "faculty",
        image:
          "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=700&q=80",
        bio: "Provides operational mentorship, program moderation, and guidance for technical hackathons and student governance.",
        quote: "Guiding the next generation of software pioneers to dream big and build responsibly.",
        contributions: [
          "Faculty Mentor for AgentBlazer Club",
          "PROMPT OPS-2K26 Oversight",
        ],
        email: "nisha.roche@sjec.ac.in",
      },
      {
        id: "ms-jaishma-k",
        name: "Ms. Jaishma K",
        role: "FACULTY COORDINATOR",
        subtitle: "Assistant Professor, Dept of CSE",
        category: "faculty",
        image:
          "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=700&q=80",
        bio: "Mentors student project development, competitive programming initiatives, and technical symposium compliance.",
        quote: "Continuous learning through hands-on experimentation builds true engineering character.",
        contributions: [
          "Coordinated Industry Visits",
          "Technical Session Reviewer",
        ],
        email: "jaishma.k@sjec.ac.in",
      },
    ],
  });

  console.log("Team seeded successfully.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());