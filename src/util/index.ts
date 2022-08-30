import { error } from "@sveltejs/kit";
import * as cookie from "cookie";
import db from "../lib/database";

export function isPrintableASCII(str: string) {
    // eslint-disable-next-line no-control-regex
    return /^[\x21-\x7E]*$/.test(str);
}

export function isValidEmail(str: string) {
    return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(
        str
    );
}

export async function getUser(request: Request) {
    const cookieHeader = request.headers.get("Cookie");
    if (typeof cookieHeader !== "string") {
        throw error(401, "Unauthorized");
    }
    const parsed = cookie.parse(cookieHeader);

    if (typeof parsed.authToken !== "string") {
        throw error(401, "Unauthorized");
    }

    const user = await db.prisma.user.findUnique({ where: { authToken: parsed.authToken } });

    if (!user) {
        throw error(401, "Unauthorized");
    }
    return user;
}