let dec = [];
dec.push('');
dec.push('/**');
dec.push(' * Sends a command to the MazeMasterJS Game Server');
dec.push(' *');
dec.push(' * @param {action} action Actions include a command, a direction, and an optional message.');
dec.push(' */');
dec.push('declare function sendAction(action: Action): void');

const BOT_ACTION_DECLARATION = dec.join('\n');
