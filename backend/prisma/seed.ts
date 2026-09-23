import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.event.deleteMany();

  await prisma.event.createMany({
    data: [
      {
        id: "lumiere-gala",
        badge: "BRANCH GALA",
        dateStr: "29 OCT 2025",
        isoDate: "2025-10-29",
        venue: "Kalam Auditorium",
        title: "Lumière — The Gala",
        theme: "Where Glam Meets Glow",
        shortSummary:
          'The CSE branch entry programme at Kalam Auditorium, themed "Where Glam Meets Glow." Organised by the Cipher Association with coordinated red, gold and black décor, it welcomed students into the department and reinforced a shared sense of collective identity.',
        fullNarrative: [
          'The Department of Computer Science and Engineering (CSE) held its branch entry programme, "Lumière – The Gala," on 29 October 2025 at the Kalam Auditorium. Organised by the Cipher Association, the event welcomed students into the department through a formal gathering centered on the theme "Where Glam Meets Glow."',
          "The venue featured coordinated red, gold and black décor, floral arrangements, illuminated panels and a central Lumière backdrop, creating an atmospheric setting for the inaugural celebration.",
          "The programme gave students an opportunity to interact with peers and take part in a shared departmental event beyond academics, highlighting the role of the Cipher Association in organising student-led activities. It represented a celebratory entry that marked the students’ transition into the department and reinforced a sense of collective identity.",
        ],
        highlights: [
          'Theme: "Where Glam Meets Glow"',
          "Coordinated Red, Gold & Black Décor",
          "Kalam Auditorium Grand Assembly",
          "Ceremonial Lamp Lighting & Induction",
          "Cultural Performances & Faculty Felicitations",
        ],
        galleryImages: [
          {
            url: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80",
            caption: "Kalam Auditorium stage presentation and inaugural address",
            tag: "AUDITORIUM_INAUGURATION",
          },
          {
            url: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80",
            caption: "Lumière themed stage lighting and commemorative floral installations",
            tag: "STAGE_GLOW",
          },
        ],
        tracks: [],
      },
      {
        id: "prompt-ops",
        badge: "COMPETITION",
        dateStr: "25 MAR 2026",
        isoDate: "2026-03-25",
        venue: "CSE Advanced Computing Labs",
        title: "PROMPT OPS-2K26",
        theme: "Prompt Engineering & Autonomous AI Challenge",
        shortSummary:
          "A technical competition on prompt engineering and AI tools by the AgentBlazer Club and Cipher.",
        fullNarrative: [
          "Organized by the AgentBlazer Club and Cipher under the guidance of Ms. Nisha J Roche, Ms. Jaishma K, and HOD Dr. Melwyn D’Souza, this technical competition focused on prompt engineering and AI tools.",
          "The competition was partitioned into two competitive tracks tailored to students’ technical maturity.",
          "Students demonstrated fluency with modern multimodal tools, prompt chain conditioning, and algorithmic problem-solving.",
        ],
        highlights: [
          "Co-hosted by AgentBlazer Club & CIPHER",
          "Real-time automated evaluation scoreboard",
          "Gemini AI Security & System Prompt Injection Defense",
          "Certificates of Excellence and cash prizes awarded",
        ],
        tracks: [
          {
            trackName: "Track 1: Generative Design & Multimodal Prompting",
            targetYear: "1st Year Students",
            description:
              "Challenged participants in invitation synthesis, logo recreation, and image generation using precision negative prompting and aspect control.",
            winners: [
              {
                rank: "1st Place & Top Honors",
                names: ["Chinmayee", "Chris Royston Monteiro", "Deeksha Ravi Moger"],
              },
            ],
          },
          {
            trackName: "Track 2: Algorithmic Systems & AI Security",
            targetYear: "2nd Year Students",
            description:
              "Evaluated participants on structured data transformation, Python debugging and Gemini AI security challenges.",
            winners: [
              {
                rank: "1st Place & Top Positions",
                names: ["Harimurali KS", "Venus Suhani D’Lima", "Venisha Snehal D’Souza"],
              },
            ],
          },
        ],
        galleryImages: [],
      },
    ],
  });

  console.log("Events seeded successfully.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());