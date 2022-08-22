import db from "$lib/database";

/** @type {import('./__types/admin').RequestHandler} */
export async function GET() {
  const allPronunciations = await db.prisma.pronunciation.findMany({
    include: {
      author: { select: { username: true } },
      votes: true,
      word: { select: { word: true, language: true } }
    }
  });

  console.log(allPronunciations);

  return {
    status: 200,
    headers: {},
    body: {
      allPronunciations
    }
  };
}
