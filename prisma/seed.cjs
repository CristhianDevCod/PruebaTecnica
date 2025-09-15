// prisma/seed.cjs
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.news.createMany({
    data: [
      {
        title: "Avances en Inteligencia Artificial revolucionan la búsqueda semántica",
        body: "Los nuevos modelos de lenguaje están transformando la manera en que buscamos y encontramos información...",
        author: "María García",
        date: new Date('2024-03-15T10:30:00'),
        imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=500&h=300&fit=crop",
      },
      {
        title: "Next.js 15 introduce nuevas funcionalidades para desarrolladores",
        body: "La última versión del framework de React incluye mejoras significativas en performance...",
        author: "Carlos Rodríguez",
        date: new Date('2024-03-14T14:20:00'),
        imageUrl: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=500&h=300&fit=crop",
      }
    ],
    skipDuplicates: true
  });
}

main()
  .catch((e) => {
    console.error("Error en seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
