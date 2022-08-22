import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import db from "$lib/database";

export const load: PageServerLoad = async ({ params }) => {
  const result = await db.prisma.user.findUnique({ where: { verificationToken: params.token } });
  if (!result) {
    throw error(404, "Couldn't find this verification token");
  }

  await db.prisma.user.update({
    where: { verificationToken: params.token },
    data: { verificationToken: null, verifiedEmail: true }
  });
};
