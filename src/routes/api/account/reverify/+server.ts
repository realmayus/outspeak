import { error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { isPrintableASCII, isValidEmail } from "../../../../util";
import { setApiKey, send } from "@sendgrid/mail";
import { v4 as uuidv4 } from "uuid";
import db from "$lib/database";
import { iso6393 } from "iso-639-3";
import bcrypt from "bcrypt";

setApiKey(process.env.SENDGRID_API_KEY || "undefined");

export const POST: RequestHandler = async ({ request }) => {
    const body = await request.json();

    if (typeof body.email !== "string") {
        throw error(400, "Invalid options");
    }

    const user = await db.prisma.user.findUnique({ where: { email: body.email } });

    if (!user) {
        throw error(404, "Couldn't find user with this email");
    }

    if (user.verifiedEmail) {
        throw error(400, "User already verified");
    }

    const token = uuidv4();

    db.prisma.user.update({ where: { email: body.email }, data: { verificationToken: token } });

    const msg = {
        to: body.email,
        from: "marius@realmayus.xyz",
        subject: "Verify your outspeak Account",
        html: `Please click this link to verify your email address in order to start using outspeak: <br/><a href='https://outspeak.net/user/verify/${token}'>Verify Email</a>`
    };

    (async () => {
        try {
            await send(msg);
        } catch (err: any) {
            console.error(err);

            if (err.response) {
                console.error(err.response.body);
            }
        }
    })();

    return new Response();
};
