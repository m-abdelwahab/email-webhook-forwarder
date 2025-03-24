import { z, type TypeOf } from "zod";

const zodEnv = z.object({
  VITE_CLERK_PUBLISHABLE_KEY: z.string(),
  CLERK_SECRET_KEY: z.string(),
  DATABASE_URL: z.string(),
  POSTMARK_API_KEY: z.string(),
  CLERK_SIGN_IN_URL: z.string(),
  CLERK_SIGN_IN_FALLBACK_REDIRECT_URL: z.string(),
  CLERK_SIGN_UP_FALLBACK_REDIRECT_URL: z.string(),
  CLERK_SIGN_UP_URL: z.string(),
});

declare global {
  namespace NodeJS {
    interface ProcessEnv extends TypeOf<typeof zodEnv> {}
  }
}

try {
  zodEnv.parse(process.env);
} catch (err) {
  if (err instanceof z.ZodError) {
    const { fieldErrors } = err.flatten();
    const errorMessage = Object.entries(fieldErrors)
      .map(([field, errors]) =>
        errors ? `${field}: ${errors.join(", ")}` : field,
      )
      .join("\n  ");
    throw new Error(`Missing environment variables:\n  ${errorMessage}`);
  }
}
