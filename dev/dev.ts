import { PrismaClient } from "@prisma/client";
import { iso6393 } from "iso-639-3";
import {exec} from "child_process";
import {promisify} from "util";
import { faker } from "@faker-js/faker";
import geohash from "latlon-geohash";

function randomFromArray<T>(arr: Array<T>): T {
    return arr[Math.floor(Math.random()*arr.length)];
}

const execute = promisify(exec);

try {
    await execute("psql -U postgres -c \"DROP DATABASE outspeak;\"");
    await execute("psql -U postgres -c \"CREATE DATABASE outspeak;\"");
    await execute("npx prisma migrate dev --name auto");
// eslint-disable-next-line no-empty
} catch (e) {
    console.error("Couldn't init database");
}


const prisma = new PrismaClient();


for (const i of iso6393) {
    if(i.name.includes("Sign")) {  // skip sign languages
        continue;
    }
    await prisma.language.create({data: {id: i.iso6393, name: i.name}});
}

for (const i of Array.from({ length: 20 }).keys()) {
    await prisma.user.create({data: {
            username: faker.internet.userName(),
            email: "test+" + i + "@realmayus.xyz",
            password: faker.internet.password(10),
            createdAt: faker.date.past(2),
            voiceType: randomFromArray(["MALE", "FEMALE"]),
            verifiedEmail: randomFromArray([true, false]),
            geohash: geohash.encode(faker.address.latitude(), faker.address.longitude()),
    }});
}
