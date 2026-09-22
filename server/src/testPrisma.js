import prisma from "./lib/prisma.js";

try {
  const result = await prisma.$queryRaw`SELECT 1`;

  console.log("Prisma connected:", result);
} catch (error) {
  console.error("Prisma connection failed:");
  console.error(error.message);
} finally {
  await prisma.$disconnect();
}