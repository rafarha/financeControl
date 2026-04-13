import { createAuthClient } from "better-auth/client"
import { emailOTPClient, emailPasswordClient } from "better-auth/client/plugins"

export const authClient = createAuthClient({
  plugins: [
    emailPasswordClient(),
    emailOTPClient(),
  ],
})
