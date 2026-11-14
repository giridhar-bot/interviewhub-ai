import "server-only";

export function getEnabledOAuthProviders(): Array<"google" | "github"> {
  const providers: Array<"google" | "github"> = [];
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) providers.push("google");
  if (process.env.GITHUB_ID && process.env.GITHUB_SECRET) providers.push("github");
  return providers;
}
