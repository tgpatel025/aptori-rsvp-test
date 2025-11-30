// eslint-disable-next-line @typescript-eslint/no-require-imports
const { createSecureHeaders } = require("next-secure-headers");

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: createSecureHeaders({
          contentSecurityPolicy: {
            directives: {
              defaultSrc: ["'self'"],
              mediaSrc: [],
              styleSrc: ["'self'", "'unsafe-inline'"],
              objectSrc: ["'none'"],
              imgSrc: ["'self' data: blob:"],
              fontSrc: ["'self'"],
              scriptSrc: ["'self'", "'unsafe-eval'", "'unsafe-inline'"],
              connectSrc: [
                "'self'",
                "http://127.0.0.1:8000",
                "http://localhost:8000",
              ],
              frameSrc: ["'self'"],
              frameAncestors: ["'self'"],
              baseUri: "'self'",
              formAction: "'self'",
            },
          },
          frameGuard: "deny",
          noopen: "noopen",
          nosniff: "nosniff",
          xssProtection: "sanitize",
          forceHTTPSRedirect: [
            true,
            { maxAge: 60 * 60 * 24 * 360, includeSubDomains: true },
          ],
          referrerPolicy: "same-origin",
        }),
      },
    ];
  },
};

export default nextConfig;
