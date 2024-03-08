export type ConfigProps = {
    theme: string;
    sentry: {
        dsn: string,
        tracesSampleRate: number,
        tracePropagationTargets: string[],
        replaysSessionSampleRate: number,
        replaysOnErrorSampleRate: number,
    },
    indexerUrl: string,
    explorerUrl: string,
    mempoolUrl: string,
};

const config: ConfigProps = {
    theme: 'BLUE_THEME',
    sentry: {
        dsn: import.meta.env.VITE_SENTRY_DSN,
        tracesSampleRate: parseFloat(import.meta.env.VITE_SENTRY_TRACES_SAMPLE_RATE),
        tracePropagationTargets: [ 'localhost' ],
        replaysSessionSampleRate: 0.1,
        replaysOnErrorSampleRate: 1,
    },
    indexerUrl: import.meta.env.VITE_INDEXER_URL,
    explorerUrl: import.meta.env.VITE_EXPLORER_URL,
    mempoolUrl: import.meta.env.VITE_MEMPOOL_URL,
};

export default config;
