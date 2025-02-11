declare namespace NodeJS {
  interface ProcessEnv {
    NEXTAUTH_SECRET: string;
    NEXTAUTH_URL: string;
    ADMIN_USERNAME: string;
    ADMIN_PASSWORD: string;
  }
}