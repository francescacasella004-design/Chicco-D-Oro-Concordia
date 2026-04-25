import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'file:C:/Users/franc/OneDrive/Documenti/GitHub/Chicco-D-Oro-Concordia/dev.db',
    },
  },
})

async function main() {
  try {
    const compCount = await prisma.competitor.count()
    console.log({ compCount })
    if (compCount > 0) {
      const comps = await prisma.competitor.findMany({ take: 10 })
      console.log('Competitors:', comps.map(c => c.name))
    }
  } catch (e) {
    console.error('Error:', e.message)
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())
