import type { PageServerLoad } from "./$types";
import db from "$lib/database";
import { error } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ params }) => {
    if (isNaN(Number(params.userID))) {
        throw error(400, "Invalid options");
    }
    const user = await db.prisma.user.findUnique({
        where: { id: Number(params.userID) },
        include: { nativeLanguages: { select: { id: true } } }
    });
    if (!user) {
        throw error(404, "Couldn't find user");
    }

    return {
        geohash: user.geohash,
        voiceType: user.voiceType,
        karma: user.karma,
        roles: user.roles,
        createdAt: user.createdAt.toString(),
        nativeLanguages: user.nativeLanguages.map((i) => i.id),
        username: user.username
        //TODO pronunciations
    };
};
