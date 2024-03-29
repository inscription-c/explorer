/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_INDEXER_URL: string
  readonly VITE_EXPLORER_URL: string
  readonly VITE_MEMPOOL_URL: string
  readonly VITE_SENTRY_DSN: string
  readonly VITE_SENTRY_TRACES_SAMPLE_RATE: string
}
