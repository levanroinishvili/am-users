export const CONFIG = {

    // When loading takes a long time, specify duration after which to show the loading indicator
    showLoadingIndicatorAfter: 500, // Milliseconds

    // Number of entries per page
    pagesize: 12, // Items per request

    // Settings for running in demo mode
    demo: {
        // For demonstration, some API calls may be delayed by a random period
        maxDelay: 3000, // Milliseconds

        // For demonstration, some API calls may return error with a probability given below
        errorProbability: .1, // 0 <= p <= 1, where 0 means no errors, 1 menas - always errors
    },

};
