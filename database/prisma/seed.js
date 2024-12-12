const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {

    const dbAuthors = await prisma.authors.count();
    const dbCategories = await prisma.categories.count();

    if (dbAuthors === 0 && dbCategories === 0) {
        const authors = [
            {name: 'J.K. Rowling'},
            {name: 'George R.R. Martin'},
            {name: 'Stephen King'},
            {name: 'Agatha Christie'},
        ];

        for (const author of authors) {
            await prisma.authors.create({
                data: author,
            });
        }

        // Seed categories
        const categories = [
            {name: 'Fiction'},
            {name: 'Non-Fiction'},
            {name: 'Science Fiction'},
            {name: 'Mystery'},
            {name: 'Fantasy'},
        ];

        for (const category of categories) {
            await prisma.categories.create({
                data: category,
            });
        }

        console.log('Seed data inserted successfully.');
    } else {
        console.log('Database structure already exists. Skipping the seeding...');
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
