import { COMMANDS, DIRS } from '@mazemasterjs/shared-library/Enums';
import { IAction } from '@mazemasterjs/shared-library/Interfaces/IAction';
import { Engram } from '@mazemasterjs/shared-library/Engram';

export class BotAction {
  public command: COMMANDS;
  public direction: DIRS;
  public message: string;
  private result: IAction;

  constructor(command: COMMANDS, direction: DIRS, message: string) {
    this.command = command;
    this.direction = direction;
    this.message = message;

    this.result = {
      command: COMMANDS.NONE,
      direction: DIRS.NONE,
      message: '',
      engram: new Engram(),
      outcomes: [],
      trophies: [],
      botCohesion: [],
      moveCount: 0,
      score: 0,
    };
  }

  public SendCommand() {
    // tslint:disable-next-line: no-console
    console.log('command sent');
  }

  public get Result(): IAction {
    return this.result;
  }
}

export default BotAction;
