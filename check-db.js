import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const compCount = await prisma.competitor.count()
  const bmCount = await prisma.bonusMalus.count()
  const userCount = await prisma.user.count()
  console.log({ compCount, bmCount, userCount })
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())
