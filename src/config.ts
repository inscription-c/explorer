export type ConfigProps = {
    Sidebar_drawer: any;
    Customizer_drawer: boolean;
    mini_sidebar: boolean;
    setHorizontalLayout: boolean;
    setRTLLayout: boolean;
    actTheme: string;
    boxed: boolean;
    setBorderCard: boolean;

    sentry: {
        dsn: string,
        tracesSampleRate: number,
        tracePropagationTargets: string[],
        replaysSessionSampleRate: number,
        replaysOnErrorSampleRate: number,
    },
    serverUrl: string,
};

const config: ConfigProps = {
    Sidebar_drawer: null,
    Customizer_drawer: false,
    mini_sidebar: false,
    setHorizontalLayout: false, // Horizontal layout
    setRTLLayout: false, // RTL layout
    actTheme: 'BLUE_THEME',
    boxed: true,
    setBorderCard: false,

    sentry: {
        dsn: import.meta.env.VITE_SENTRY_DSN,
        tracesSampleRate: parseFloat(import.meta.env.VITE_SENTRY_TRACES_SAMPLE_RATE),
        tracePropagationTargets: [ 'localhost' ],
        replaysSessionSampleRate: 0.1,
        replaysOnErrorSampleRate: 1,
    },
    serverUrl: import.meta.env.VITE_SERVER_URL,
};

export default config;
