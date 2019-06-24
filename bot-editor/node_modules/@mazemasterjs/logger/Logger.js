"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// console output colors
var COLORS;
(function (COLORS) {
    COLORS["NONE"] = "\u001B[49m\u001B[0m";
    COLORS["RED"] = "\u001B[49m\u001B[31m";
    COLORS["YELLOW"] = "\u001B[49m\u001B[35m";
    COLORS["BLUE"] = "\u001B[49m\u001B[36m";
    COLORS["MAGENTA"] = "\u001B[49m\u001B[35m";
    COLORS["WHITE_ON_RED"] = "\u001B[41m\u001B[37m";
})(COLORS || (COLORS = {}));
var LOG_LEVELS;
(function (LOG_LEVELS) {
    LOG_LEVELS[LOG_LEVELS["NONE"] = 0] = "NONE";
    LOG_LEVELS[LOG_LEVELS["ERROR"] = 1] = "ERROR";
    LOG_LEVELS[LOG_LEVELS["WARN"] = 2] = "WARN";
    LOG_LEVELS[LOG_LEVELS["INFO"] = 3] = "INFO";
    LOG_LEVELS[LOG_LEVELS["DEBUG"] = 4] = "DEBUG";
    LOG_LEVELS[LOG_LEVELS["TRACE"] = 5] = "TRACE";
})(LOG_LEVELS = exports.LOG_LEVELS || (exports.LOG_LEVELS = {}));
/**
 * Provides basic logging features - always outputs to console for cloud/container friendly logs
 */
class Logger {
    // must use getInstance()
    constructor() {
        this.logLevel = LOG_LEVELS.INFO;
        this.colorDisabled = false;
    }
    // singleton instance pattern
    static getInstance() {
        if (!Logger.instance) {
            Logger.instance = new Logger();
            if (process.env.NODE_ENV == 'production') {
                Logger.instance.ColorDisabled = true;
            }
        }
        return Logger.instance;
    }
    /**
     * Sets current logging level one of the values in LOG_LEVELS
     */
    set LogLevel(level) {
        this.logLevel = level;
        let method = 'setLogLevel(' + level + ')';
        console.log('%s : %s : %s : %s : Log Level set to %s', getTimeStamp(), 'N/A', fileName(__filename), method, LOG_LEVELS[this.logLevel]);
    }
    /**
     * Returns the current logging level as one of the values in LOG_LEVELS
     */
    get LogLevel() {
        return this.logLevel;
    }
    /**
     * Gets the colorDisabled option value
     */
    get ColorDisabled() {
        return this.colorDisabled;
    }
    /**
     * Set the colorDisabled option to the given boolean
     * @param val - true if colors in log lines should be disabled
     */
    set ColorDisabled(val) {
        this.colorDisabled = val;
    }
    /**
     * "debug" logging is moderately verbose and generally not appropriate for production environments
     *
     * @param file calling file name (__filename)
     * @param method calling method name
     * @param message message to display
     */
    debug(file, method, message) {
        if (this.logLevel >= LOG_LEVELS.DEBUG) {
            console.log('%s%s : %s : %s' + (method == '' ? '' : ' : ') + '%s : %s%s', this.colorDisabled ? '' : COLORS.BLUE, getTimeStamp(), 'DBG', fileName(file), method, message, this.colorDisabled ? '' : COLORS.NONE);
        }
    }
    /**
     * "error" logging should used when an unexpected exception occurs - this demands attention
     *
     * @param file calling file name (__filename)
     * @param method calling method name
     * @param message message to display
     */
    error(file, method, message, error) {
        if (this.logLevel >= LOG_LEVELS.ERROR) {
            console.log('%s%s : %s : %s' + (method == '' ? '' : ' : ') + '%s : %s %s%s', this.colorDisabled ? '' : COLORS.RED, getTimeStamp(), 'ERR', fileName(file), method, message, this.logLevel >= LOG_LEVELS.TRACE ? '\r\n' + error.stack : error.message, this.colorDisabled ? '' : COLORS.NONE);
        }
    }
    /**
     * "warn" logging should be used to indicate a problem or handled error that need attention
     *
     * @param file calling file name (__filename)
     * @param method calling method name
     * @param message message to display
     */
    warn(file, method, message) {
        if (this.logLevel >= LOG_LEVELS.WARN) {
            console.log('%s%s : %s : %s' + (method == '' ? '' : ' : ') + '%s : %s%s', this.colorDisabled ? '' : COLORS.YELLOW, getTimeStamp(), 'WRN', fileName(file), method, message, this.colorDisabled ? '' : COLORS.NONE);
        }
    }
    /**
     * "info" logging is useful for logging application-level events, like startup or shutdown
     *
     * @param file calling file name (__filename)
     * @param method calling method name
     * @param message message to display
     */
    info(file, method, message) {
        if (this.logLevel >= LOG_LEVELS.INFO) {
            console.log('%s%s : %s : %s' + (method == '' ? '' : ' : ') + '%s : %s%s', this.colorDisabled ? '' : COLORS.NONE, getTimeStamp(), 'INF', fileName(file), method, message, this.colorDisabled ? '' : COLORS.NONE);
        }
    }
    /**
     * "trace" logging is extremely verbose and should only be used during development
     *
     * @param file calling file name (__filename)
     * @param method calling method name
     * @param message message to display
     */
    trace(file, method, message) {
        if (this.logLevel >= LOG_LEVELS.TRACE) {
            console.log('%s%s : %s : %s' + (method == '' ? '' : ' : ') + '%s : %s', this.colorDisabled ? '' : COLORS.MAGENTA, getTimeStamp(), 'TRC', fileName(file), method, message, this.colorDisabled ? '' : COLORS.NONE);
        }
    }
    /**
     * "force" is a special log level that ignores the current value of LOG_LEVEL - use sparingly.
     *
     * @param file calling file name (__filename)
     * @param method calling method name
     * @param message message to display
     */
    force(file, method, message) {
        console.log('%s%s : %s : %s' + (method == '' ? '' : ' : ') + '%s : %s', this.colorDisabled ? '' : COLORS.BLUE, getTimeStamp(), 'FRC', fileName(file), method, message, this.colorDisabled ? '' : COLORS.NONE);
    }
    /**
     * Reads and returns application name and version from package.json
     *
     * @return name:string, version: string
     */
    get PackageInfo() {
        /* istanbul ignore else */
        if (fs_1.default && fs_1.default.readFileSync) {
            let data = JSON.parse(fs_1.default.readFileSync(path_1.default.resolve('package.json'), 'utf8'));
            return { name: data.name, version: data.version };
        }
        else {
            return { name: 'CANNOT_READ_FILE', version: 'CANNOT_READ_FILE' };
        }
    }
}
exports.Logger = Logger;
// returns the current timestamp
function getTimeStamp() {
    var dt = new Date();
    return dt.toLocaleDateString() + ' ' + dt.toLocaleTimeString();
}
// strips path and returns just the name (and extension) of the file
function fileName(file) {
    return path_1.default.basename(file);
}
exports.default = Logger;
//# sourceMappingURL=Logger.js.map