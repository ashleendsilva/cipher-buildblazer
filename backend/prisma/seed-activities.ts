import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const activities = [
  "Applied Machine Learning",
  "Industrial Visit",
  "LaTeX Tool",
  "Robotic Process Automation using UiPath",
  "HackTO Future 20",
  "How to Win at the Sport of Programming",
  "Introduction to Google Crowdsource",
  "Educational Session on GitHub",
  "Industrial Visit",
  "UDAAN Mock Interview",
  "Freshers Onboarding Programme",
  "Projects Funded by KSCST",
  "Generative AI Tools for Research",
  "Introduction to Blockchain: Solidity Workshop",
  "Star UML",
  "Generative AI: Custom Solutions",
  "React.js and Node.js Workshop",
];

async function main() {
  await prisma.activity.deleteMany();

  await prisma.activity.createMany({
    data: activities.map((name) => ({
      name,
      url: "#",
    })),
  });

  console.log(`Seeded ${activities.length} activities.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });