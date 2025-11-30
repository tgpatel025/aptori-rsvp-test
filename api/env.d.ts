declare namespace NodeJS {
  export interface ProcessEnv {
    DATABASE_URL: string;
    AUTH0_ISSUER_BASE_URL: string;
    AUTH0_AUDIENCE: string;
  }
}
