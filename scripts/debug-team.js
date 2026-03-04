import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const email = 'fierroalessia91@gmail.com';
    console.log(`Checking details for ${email}...`);

    const user = await prisma.user.findUnique({
        where: { email },
        include: {
            team: {
                include: {
                    competitors: {
                        include: {
                            competitor: true
                        }
                    }
                }
            }
        }
    });

    if (!user) {
        console.log('User not found');
        return;
    }

    console.log('User found:', user.name);
    if (!user.team) {
        console.log('No team found for this user.');
    } else {
        console.log('Team found:', user.team.name);
        console.log('Competitors count:', user.team.competitors.length);
        console.log('Competitors:', JSON.stringify(user.team.competitors, null, 2));
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
