export declare enum LOG_LEVELS {
    NONE = 0,
    ERROR = 1,
    WARN = 2,
    INFO = 3,
    DEBUG = 4,
    TRACE = 5
}
/**
 * Provides basic logging features - always outputs to console for cloud/container friendly logs
 */
export declare class Logger {
    private static instance;
    private logLevel;
    private colorDisabled;
    private constructor();
    static getInstance(): Logger;
    /**
     * Sets current logging level one of the values in LOG_LEVELS
     */
    /**
    * Returns the current logging level as one of the values in LOG_LEVELS
    */
    LogLevel: LOG_LEVELS;
    /**
     * Gets the colorDisabled option value
     */
    /**
    * Set the colorDisabled option to the given boolean
    * @param val - true if colors in log lines should be disabled
    */
    ColorDisabled: boolean;
    /**
     * "debug" logging is moderately verbose and generally not appropriate for production environments
     *
     * @param file calling file name (__filename)
     * @param method calling method name
     * @param message message to display
     */
    debug(file: string, method: string, message: string): void;
    /**
     * "error" logging should used when an unexpected exception occurs - this demands attention
     *
     * @param file calling file name (__filename)
     * @param method calling method name
     * @param message message to display
     */
    error(file: string, method: string, message: string, error: Error): void;
    /**
     * "warn" logging should be used to indicate a problem or handled error that need attention
     *
     * @param file calling file name (__filename)
     * @param method calling method name
     * @param message message to display
     */
    warn(file: string, method: string, message: string): void;
    /**
     * "info" logging is useful for logging application-level events, like startup or shutdown
     *
     * @param file calling file name (__filename)
     * @param method calling method name
     * @param message message to display
     */
    info(file: string, method: string, message: string): void;
    /**
     * "trace" logging is extremely verbose and should only be used during development
     *
     * @param file calling file name (__filename)
     * @param method calling method name
     * @param message message to display
     */
    trace(file: string, method: string, message: string): void;
    /**
     * "force" is a special log level that ignores the current value of LOG_LEVEL - use sparingly.
     *
     * @param file calling file name (__filename)
     * @param method calling method name
     * @param message message to display
     */
    force(file: string, method: string, message: string): void;
    /**
     * Reads and returns application name and version from package.json
     *
     * @return name:string, version: string
     */
    readonly PackageInfo: {
        name: string;
        version: string;
    };
}
export default Logger;
