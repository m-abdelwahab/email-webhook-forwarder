import { Form, useFetcher, type ClientActionFunctionArgs } from "react-router";
import { getAuth } from "@clerk/react-router/ssr.server";
import type { Route } from "./+types/home";
import { redirect } from "react-router";
import { db, eq } from "~/lib/db";
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

  try {
    const allServers = await db.query.servers.findMany({
      where: eq(servers.clerkUserId, userId),
    });

    return { servers: allServers };
  } catch (error) {
    throw new Error("Failed to fetch servers", { cause: error });
  }
}

export async function action(args: Route.ActionArgs) {
  const { userId } = await getAuth(args);

  if (!userId) {
    return redirect("/sign-in?redirect_url=" + args.request.url);
  }

  const formData = await args.request.formData();
  const webhookUrl = formData.get("webhookUrl") as string;

  try {
    const existingServer = await db.query.servers.findFirst({
      where: eq(servers.clerkUserId, userId),
    });

    if (existingServer) {
      return {
        success: false,
        error: "You can only create one server per account",
      };
    }

    // Create server in Postmark
    const response = await postmarkAccountClient.createServer({
      Name: `${userId} - ${new Date().toISOString()}`,
      InboundHookUrl: webhookUrl,
    });

    await db.insert(servers).values({
      clerkUserId: userId,
      serverId: response.ID.toString(),
      postmarkEmailAddress: response.InboundAddress,
      webhookUrl,
    });

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to process request" };
  }
}

export async function clientAction({ serverAction }: ClientActionFunctionArgs) {
  return serverAction<typeof action>().finally(() => {
    toast("Server created successfully!");
  });
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const servers = loaderData.servers;
  const fetcher = useFetcher();

  return (
    <div className="container mx-auto max-w-3xl py-8">
      <Heading level={1} size="xl" className="text-muted-high-contrast mb-6">
        Email Server
      </Heading>

      {servers.length === 0 ? (
        <div className="border-muted rounded-lg border p-6">
          <Heading level={2} size="md" className="mb-4">
            Create Your First Server
          </Heading>
          <Text size="sm" className="text-muted-base mb-6">
            Create a server to get started with email forwarding.
          </Text>

          <fetcher.Form method="post">
            <input type="hidden" name="action" value="create" />
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
                placeholder="https://your-webhook-url.com"
                required
                className="w-full"
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              isDisabled={fetcher.state !== "idle"}
            >
              {fetcher.state !== "idle" ? "Creating..." : "Create Server"}
            </Button>
          </fetcher.Form>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="border-muted rounded-lg border p-6">
            <>
              <div className="mb-4 grid grid-cols-1 gap-4">
                <div>
                  <Text size="sm" className="text-muted-base">
                    Email Address
                  </Text>
                  <Text
                    size="md"
                    className="text-muted-high-contrast font-medium"
                  >
                    {servers[0].postmarkEmailAddress}
                  </Text>
                </div>
                <div>
                  <Text size="sm" className="text-muted-base">
                    Webhook URL
                  </Text>
                  <div className="flex items-center gap-2">
                    <Text
                      size="md"
                      className="text-muted-high-contrast font-medium"
                    >
                      {servers[0].webhookUrl}
                    </Text>
                    <Form action={`/servers/${servers[0].serverId}/settings`}>
                      <Button
                        variant="outline"
                        type="submit"
                        className="text-muted-base hover:text-muted-high-contrast"
                      >
                        Edit
                      </Button>
                    </Form>
                  </div>
                </div>
              </div>
            </>
          </div>
        </div>
      )}
    </div>
  );
}
