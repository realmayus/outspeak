import { iso6393 } from "iso-639-3";
import db from "$lib/database";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
  const languageFriendly = iso6393.find((x) => x.iso6393 === params.language)?.name;

  const allPronunciations = await db.prisma.pronunciation.findMany({
    include: {
      author: { select: { username: true } },
      votes: true,
      word: { select: { word: true } }
    }
  });

  console.log(allPronunciations);

  if (languageFriendly) {
    return {
      languageFriendly,
      allPronunciations
    };
  }

  throw error(404, "Not found");
};
