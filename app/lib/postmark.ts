import { AccountClient } from "postmark";

export const postmarkAccountClient = new AccountClient(
  process.env.POSTMARK_API_KEY,
);
