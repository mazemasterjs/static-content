export class BotAction {
  constructor(command: string, direction: string, message: string);
  sendCommand(): void;
  getResult(): any;
  setResult(any);
}
