import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'file:./dev.db',
    },
  },
})

async function main() {
  try {
    const compCount = await prisma.competitor.count()
    const bmCount = await prisma.bonusMalus.count()
    console.log({ compCount, bmCount })
    if (compCount > 0) {
      const firstComp = await prisma.competitor.findFirst()
      console.log('First competitor:', firstComp.name)
    }
  } catch (e) {
    console.error('Error connecting to dev.db:', e.message)
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())
