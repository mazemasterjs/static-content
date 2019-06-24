"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Enums_1 = require("@mazemasterjs/shared-library/Enums");
const Engram_1 = require("@mazemasterjs/shared-library/Engram");
class BotAction {
    constructor(command, direction, message) {
        this.command = command;
        this.direction = direction;
        this.message = message;
        this.result = {
            command: Enums_1.COMMANDS.NONE,
            direction: Enums_1.DIRS.NONE,
            message: '',
            engram: new Engram_1.Engram(),
            outcomes: [],
            trophies: [],
            botCohesion: [],
            moveCount: 0,
            score: 0,
        };
    }
    SendCommand() {
        // tslint:disable-next-line: no-console
        console.log('command sent');
    }
    get Result() {
        return this.result;
    }
}
exports.BotAction = BotAction;
exports.default = BotAction;
//# sourceMappingURL=BotAction.js.map