import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { bearer, jwt, openAPI } from "better-auth/plugins";
import { config } from "dotenv";
import { prisma } from "../db/index.ts";
import { sendEmail } from "../utils/send-email.utils.js";

config();

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      await sendEmail({
        to: user.email,
        subject: "Verify your email address",
        text: `Click the link to verify your email: ${url}`,
      });
    },
  },
  plugins: [
    jwt({
      jwt: {
        definePayload: (user) => {
          return {
            id: user.id,
            email: user.email,
            role: user.role,
          };
        },
        issuer: process.env.BETTER_AUTH_URL,
        audience: "http://localhost:3001",
        expirationTime: "1h",
      },
      jwks: {
        keyPairConfig: {
          alg: "EdDSA",
          crv: "Ed25519",
        },
      },
    }),
    bearer(),
    openAPI(),
  ],
});
