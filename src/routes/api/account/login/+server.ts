import { error } from "@sveltejs/kit";
import bcrypt from "bcrypt";
import type { RequestHandler } from "./$types";
import db from "$lib/database";
import { randomBytes } from "crypto";
import { promisify } from "util";
import * as cookie from "cookie";

const randomBytesAsync = promisify(randomBytes);

export const POST: RequestHandler = async ({ request }) => {
  const body = await request.json();

  if (typeof body.password !== "string" || typeof body.email !== "string") {
    throw error(400, "Invalid options");
  }

  const user = await db.prisma.user.findUnique({ where: { email: body.email } });

  if (!user) {
    throw error(404, "Couldn't find user with this email");
  }

  const res = await bcrypt.compare(body.password, user.password);

  if (!res) {
    throw error(401, "Unauthorized");
  }

  const authToken = await randomBytesAsync(48).then((r) => r.toString("hex"));

  await db.prisma.user.update({ where: { email: body.email }, data: { authToken } });

  return new Response(authToken, {
    headers: {
      "Set-Cookie": cookie.serialize("authToken", authToken, {
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 7
      })
    }
  });
};
