export const CONFIG = {

    // When loading takes a long time, specify duration after which to show the loading indicator
    showLoadingIndicatorAfter: 500, // Milliseconds

    // Number of entries per page
    pagesize: 12, // Items per request

    // Settings for running in demo mode
    demo: {
        // Default values for running in the demo mode
        default: {
            // For demonstration, some API calls may be delayed by a random period
            maxDelay: 0, // Milliseconds

            // For demonstration, some API calls may return error with a probability given below
            errorProbability: 0, // 0 <= p <= 1, where 0 means no errors, 1 menas - always errors
        },

        // Users can configure values inside the app. This configures the limitations for such configuration
        liveConfig: {
            // Maxim value for maxDelay
            maxMaxDelay: 20000, // Milliseconds
        }
    },

};

export type AppConfigType = typeof CONFIG.demo.default;
