import { Webhook } from "svix";
import { headers } from "next/headers";
import type { WebhookEvent } from "@clerk/nextjs/server";
import { createUser } from "@/server/actions/users/createUser"; // Import your database function
import type { ClerkUserType } from "@/schema/userSchema";

export async function POST(req: Request) {
  // 1. Get the webhook secret from environment variables
  const WEBHOOK_SECRET =
    process.env.CLERK_WEBHOOK_SECRET || process.env.SIGNING_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error(
      "Missing CLERK_WEBHOOK_SECRET or SIGNING_SECRET environment variable"
    );
    return new Response("Missing webhook secret", { status: 500 });
  }

  // 2. Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // 3. Validate the headers
  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error("Missing Svix headers", {
      svix_id,
      svix_timestamp,
      svix_signature,
    });
    return new Response("Missing Svix headers", { status: 400 });
  }

  // 4. Get the body
  let payload;
  try {
    payload = await req.json();
  } catch (err) {
    console.error("Error parsing request body", err);
    return new Response("Error parsing request body", { status: 400 });
  }

  // 5. Create the Svix headers object
  const svixHeaders = {
    "svix-id": svix_id,
    "svix-timestamp": svix_timestamp,
    "svix-signature": svix_signature,
  };

  // 6. Verify the webhook
  let evt: WebhookEvent;
  try {
    const wh = new Webhook(WEBHOOK_SECRET);
    const body = JSON.stringify(payload);

    // Log some debug info (remove in production)
    console.log("Webhook verification attempt:", {
      secret_length: WEBHOOK_SECRET.length,
      body_length: body.length,
      headers: svixHeaders,
    });

    evt = wh.verify(body, svixHeaders) as WebhookEvent;
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return new Response(
      `Webhook verification failed: ${
        err instanceof Error ? err.message : "Unknown error"
      }`,
      {
        status: 400,
      }
    );
  }

  // 7. Handle the webhook event
  try {
    const eventType = evt.type;
    console.log(`Webhook event type: ${eventType}`);

    if (eventType === "user.created") {
      console.log("Processing user.created event");
      const userData = evt.data as ClerkUserType;

      // Create the user in your database
      const newUser = await createUser(userData);
      console.log("User created in database:", newUser);

      return new Response(
        JSON.stringify({ success: true, message: "User created" }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    } else if (eventType === "user.updated") {
      // Handle user updates
      console.log("Processing user.updated event");
      // Implement your update logic here

      return new Response(
        JSON.stringify({ success: true, message: "User updated" }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    } else if (eventType === "user.deleted") {
      // Handle user deletion
      console.log("Processing user.deleted event");
      // Implement your deletion logic here

      return new Response(
        JSON.stringify({ success: true, message: "User deleted" }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Handle other event types
    return new Response(
      JSON.stringify({
        success: true,
        message: `Webhook received: ${eventType}`,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error processing webhook:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Error processing webhook" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
