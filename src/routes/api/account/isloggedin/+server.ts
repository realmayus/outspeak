import { getUser } from "../../../../util";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ request }) => {
    const user = await getUser(request);
    return new Response(JSON.stringify({ success: true }));
};
