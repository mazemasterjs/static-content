let dec = [];
dec.push('');
dec.push('/**');
dec.push(' * Sends a command to the MazeMasterJS Game Server');
dec.push(' *');
dec.push(' * @param {action} action Actions include a command, a direction, and an optional message.');
dec.push(' */');
dec.push('declare function sendAction(action: Action): void');

dec.push('/**');
dec.push(' * Starts a chain of events');
dec.push(' *');
dec.push(' * @param {action} action Actions include a command, a direction, and an optional message.');
dec.push(' * @param {callback} the function to call after the action is completed');
dec.push(' */');
dec.push('declare function startActionChain(action: Action, callback: function): void');

dec.push('declare const DIRS = {');
dec.push('  NONE: 0,');
dec.push('  NORTH: 1,');
dec.push('  SOUTH: 2,');
dec.push('  EAST: 4,');
dec.push('  WEST: 8,');
dec.push('  LEFT: 16,');
dec.push('  RIGHT: 32');
dec.push('};');

dec.push('declare PLAYER_STATES = {');
dec.push('  NONE: 0,');
dec.push('  STANDING: 1,');
dec.push('  SITTING: 2,');
dec.push('  LYING: 4,');
dec.push('  STUNNED: 8,');
dec.push('  BLIND: 16,');
dec.push('  BURNING: 32,');
dec.push('  LAMED: 64,');
dec.push('  BEARTRAPPED: 128,');
dec.push('  SLOWED: 256,');
dec.push('  DEAD: 512');
dec.push('};');

dec.push('declare COMMANDS = {');
dec.push('  NONE: 0,');
dec.push('  FACE: 1,');
dec.push('  LISTEN: 2,');
dec.push('  LOOK: 3,');
dec.push('  SIT: 4,');
dec.push('  SNIFF: 5,');
dec.push('  STAND: 6,');
dec.push('  TURN: 7,');
dec.push('  MOVE: 8,');
dec.push('  JUMP: 9,');
dec.push('  WAIT: 10,');
dec.push('  WRITE: 11,');
dec.push('  QUIT: 12');
dec.push('};');

const BOT_ACTION_DECLARATION = dec.join('\n');
