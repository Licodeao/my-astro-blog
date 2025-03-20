/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly OSS_REGION: string;
  readonly OSS_ACCESS_KEY_ID: string;
  readonly OSS_ACCESS_KEY_SECRET: string;
  readonly OSS_BUCKET_NAME: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
