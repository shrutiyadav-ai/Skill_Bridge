import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    select: { id: true, email: true, name: true, role: true, passwordHash: true }
  });
  console.log("Total users in Supabase DB:", users.length);
  for (const u of users) {
    const isMatch = await bcrypt.compare("SkillBridge@2024", u.passwordHash);
    console.log(`- ${u.email} | Role: ${u.role} | Password match: ${isMatch}`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
