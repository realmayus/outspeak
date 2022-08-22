import { error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { isPrintableASCII, isValidEmail } from "../../../../util";
import { setApiKey, send } from "@sendgrid/mail";
import { v4 as uuidv4 } from "uuid";
import db from "$lib/database";
import { iso6393 } from "iso-639-3";
import bcrypt from "bcrypt";

setApiKey(process.env.SENDGRID_API_KEY || "undefined");

export const PUT: RequestHandler = async ({ request }) => {
  const body = await request.json();

  if (
    !(
      typeof body.email === "string" &&
      typeof body.username === "string" &&
      typeof body.voiceType === "string" &&
      Array.isArray(body.nativeLanguages) &&
      typeof body.password === "string"
    )
  ) {
    throw error(400, "Invalid options");
  }

  if (!["FEMALE", "MALE"].includes(body.voiceType)) {
    throw error(400, "voiceType has to be either 'FEMALE' or 'MALE'");
  }

  if (!(body.nativeLanguages.length >= 1 && body.nativeLanguages.length <= 3)) {
    throw error(400, "Can't have less than one or more than three native languages");
  }

  body.nativeLanguages.forEach((lang: string) => {
    console.log(body.nativeLanguages);
    if (!iso6393.find((x) => x.iso6393 === lang)) {
      throw error(404, `Language '${lang}' doesn't exist`);
    }
  });

  if (!isValidEmail(body.email)) {
    throw error(400, "Invalid email address.");
  }

  if (!isPrintableASCII(body.username)) {
    throw error(400, "Username needs to be in extended ASCII set");
  }

  if (body.password.length < 8) {
    throw error(400, "Password needs to have at least 8 characters");
  }

  const token = uuidv4();
  console.log(token);

  const langs = await db.prisma.language.findMany({ where: { id: { in: body.nativeLanguages } } });

  const passwordHash = await bcrypt.hash(body.password, 8);

  await db.prisma.user.create({
    data: {
      username: body.username,
      email: body.email,
      password: passwordHash,
      voiceType: body.voiceType,
      nativeLanguages: { connect: langs.map((i) => ({ id: i.id })) },
      verificationToken: token,
      geohash: "NA"
    }
  });

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
