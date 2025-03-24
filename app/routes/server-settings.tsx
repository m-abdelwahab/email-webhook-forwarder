import {
  Form,
  useFetcher,
  redirect,
  type ClientActionFunctionArgs,
} from "react-router";
import { getAuth } from "@clerk/react-router/ssr.server";
import type { Route } from "./+types/server-settings";
import { db, eq, and } from "~/lib/db";
import { servers } from "~/lib/db/schema";
import { postmarkAccountClient } from "~/lib/postmark";
import { Button } from "~/components/ui/button";
import { Heading } from "~/components/ui/heading";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import { toast } from "sonner";

export async function loader(args: Route.LoaderArgs) {
  const { userId } = await getAuth(args);

  if (!userId) {
    return redirect("/sign-in?redirect_url=" + args.request.url);
  }

  const serverId = args.params.serverId;

  try {
    const server = await db.query.servers.findFirst({
      where: and(
        eq(servers.clerkUserId, userId),
        eq(servers.serverId, serverId),
      ),
    });

    if (!server) {
      throw new Error("Server not found");
    }

    return { server };
  } catch (error) {
    throw new Error("Failed to fetch server", { cause: error });
  }
}

export async function action(args: Route.ActionArgs) {
  const { userId } = await getAuth(args);

  if (!userId) {
    return redirect("/sign-in?redirect_url=" + args.request.url);
  }

  const serverId = args.params.serverId;
  const formData = await args.request.formData();
  const webhookUrl = formData.get("webhookUrl") as string;

  try {
    const server = await db.query.servers.findFirst({
      where: and(
        eq(servers.clerkUserId, userId),
        eq(servers.serverId, serverId),
      ),
    });

    if (!server) {
      return {
        success: false,
        error: "Server not found",
      };
    }

    // Update webhook URL in Postmark
    await postmarkAccountClient.editServer(parseInt(serverId), {
      InboundHookUrl: webhookUrl,
    });

    // Update webhook URL in our database
    await db
      .update(servers)
      .set({
        webhookUrl,
        updatedAt: new Date(),
      })
      .where(
        and(eq(servers.clerkUserId, userId), eq(servers.serverId, serverId)),
      );

    return { success: true, redirectTo: "/" };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to update webhook URL" };
  }
}

export async function clientAction({ serverAction }: ClientActionFunctionArgs) {
  const result = await serverAction<typeof action>();

  toast("Webhook URL updated successfully!");

  if (result.redirectTo) {
    return redirect(result.redirectTo);
  }

  return result;
}

export default function ServerSettings({ loaderData }: Route.ComponentProps) {
  const { server } = loaderData;
  const fetcher = useFetcher();

  return (
    <div className="container mx-auto max-w-3xl py-8">
      <Heading level={1} size="xl" className="text-muted-high-contrast mb-6">
        Server Settings
      </Heading>

      <div className="border-muted rounded-lg border p-6">
        <Heading level={2} size="md" className="mb-4">
          Edit Webhook URL
        </Heading>
        <Text size="sm" className="text-muted-base mb-6">
          Update the webhook URL for your server
        </Text>

        <fetcher.Form method="post">
          <div className="mb-4">
            <label
              htmlFor="webhookUrl"
              className="text-muted-high-contrast mb-2 block text-sm font-medium"
            >
              Webhook URL
            </label>

            <Input
              id="webhookUrl"
              name="webhookUrl"
              defaultValue={server.webhookUrl}
              placeholder="https://your-webhook-url.com"
              required
              className="w-full"
            />
          </div>

          <div className="flex gap-4">
            <Button
              type="submit"
              variant="primary"
              isDisabled={fetcher.state !== "idle"}
            >
              {fetcher.state !== "idle" ? "Saving..." : "Save Changes"}
            </Button>

            <Form action="/">
              <Button
                variant="outline"
                type="submit"
                className="text-muted-base hover:text-muted-high-contrast"
              >
                Cancel
              </Button>
            </Form>
          </div>
        </fetcher.Form>
      </div>
    </div>
  );
}
