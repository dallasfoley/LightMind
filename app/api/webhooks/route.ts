import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { createUser } from "@/server/actions/users/createUser"; // Import your database function
import { ClerkUserType } from "@/schema/userSchema";

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.SIGNING_SECRET;

  if (!SIGNING_SECRET) {
    throw new Error(
      "Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  const wh = new Webhook(SIGNING_SECRET);
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error: Missing Svix headers", { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error: Could not verify webhook:", err);
    return new Response("Error: Verification error", { status: 400 });
  }

  // *** Database Interaction ***
  if (evt.type === "user.created") {
    try {
      // Create the user in your database
      console.log("evt.data: ", evt.data);
      const newUser = await createUser(evt.data as ClerkUserType);

      console.log("User created in database:", newUser);
      return new Response("User created", { status: 200 }); // Important: 200 status for success
    } catch (dbError) {
      console.error("Error creating user in database:", dbError);
      return new Response("Error creating user in database", { status: 500 }); // 500 status for database error
    }
  } else if (evt.type === "user.updated") {
    // Handle user updates if needed.  Similar to create, but use update logic.
    // ...
  } else if (evt.type === "user.deleted") {
    // Handle user deletion if needed.
    // ...
  }

  return new Response("Webhook received (no user.created event)", {
    status: 200,
  }); // Handle other event types or no action
}
