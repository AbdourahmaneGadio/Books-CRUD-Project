const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker');

const prisma = new PrismaClient();

async function main() {
    await prisma.$transaction(async (prisma) => {
        // Seed authors
        const authors = Array.from({ length: 10 }, () => ({
            name: faker.person.fullName(),
        }));
        await prisma.author.createMany({ data: authors });

        // Seed categories
        const categories = ['Fiction', 'Non-Fiction', 'Science Fiction', 'Mystery', 'Fantasy', 'Graphic Novel'];
        const categoryData = categories.map(name => ({ name }));
        await prisma.category.createMany({ data: categoryData });

        // Seed images
        const images = Array.from({ length: 20 }, () => ({
            filename: faker.system.fileName(),
            url: faker.image.url(),
            alt: faker.lorem.sentence(),
        }));
        await prisma.image.createMany({ data: images });

        // Fetch all authors, categories, and images for linking
        const allAuthors = await prisma.author.findMany();
        const allCategories = await prisma.category.findMany();
        const allImages = await prisma.image.findMany();

        // Seed books and book images
        const books = Array.from({ length: 50 }, () => ({
            title: faker.commerce.productName(),
            synopsis: faker.lorem.paragraph(),
            authorId: faker.helpers.arrayElement(allAuthors).id,
            price: parseFloat(faker.commerce.price({ min: 5, max: 100, dec: 2 })),
            isbn: faker.string.uuid(),
            pageNum: faker.number.int({ min: 50, max: 1000 }),
            categoryId: faker.helpers.arrayElement(allCategories).id,
        }));

        await prisma.book.createMany({ data: books });

        const allBooks = await prisma.book.findMany();

        const bookImages = [];

        allBooks.forEach(book => {
            const coverImageId = faker.helpers.arrayElement(allImages).id;
            bookImages.push({
                bookId: book.id,
                imageId: coverImageId,
                type: 'COVER',
                order: 0,
            });

            if (faker.datatype.boolean()) { // Randomly add additional images as illustrations
                const illustrationImageId = faker.helpers.arrayElement(allImages).id;
                bookImages.push({
                    bookId: book.id,
                    imageId: illustrationImageId,
                    type: 'ILLUSTRATION',
                    order: bookImages.length, // Incremental order based on current length of array
                });
            }
        });

        await prisma.bookImage.createMany({ data: bookImages });
    });

    console.log('Seed data inserted successfully.');
}

main()
    .catch((e) => {
        console.error(e);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
