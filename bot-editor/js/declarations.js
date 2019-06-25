let dec = [];
dec.push('');
dec.push('/**');
dec.push(' * Sends a command to the MazeMasterJS Game Server');
dec.push(' *');
dec.push(' * @param {action} action Actions include a command, a direction, and an optional message.');
dec.push(' */');
dec.push('declare function sendAction(action: Action): void');
dec.push('');
dec.push('/**');
dec.push(' * Starts a chain of events');
dec.push(' *');
dec.push(' * @param {action} action Actions include a command, a direction, and an optional message.');
dec.push(' * @param {callback} the function to call after the action is completed');
dec.push(' */');
dec.push('declare function startActionChain(action: Action, callback: function): void');

const BOT_ACTION_DECLARATION = dec.join('\n');
