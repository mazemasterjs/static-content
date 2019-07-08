/* eslint-disable no-unused-vars */
const TROPHY_IDS = {
  CHEDDAR_DINNER: 0,
  DAZED_AND_CONFUSED: 1,
  DOUBLE_BACKER: 2,
  FLAWLESS_VICTORY: 3,
  JUMPING_JACK_FLASH: 4,
  KICKING_UP_DUST: 5,
  LIGHT_AT_THE_END: 6,
  LOOPER: 7,
  MIGHTY_MOUSE: 8,
  NERVOUS_WALK: 9,
  OUT_OF_MOVES: 10,
  PAPERBACK_WRITER: 11,
  SCRIBBLER: 12,
  SHORTCUTTER: 13,
  SPINNING_YOUR_WHEELS: 14,
  TAKING_A_STAND: 15,
  STANDING_AROUND: 16,
  THE_LONGER_WAY_HOME: 17,
  THE_LONGEST_WAY_HOME: 18,
  THE_LONG_WAY_HOME: 19,
  TOO_HOT_TO_HANDLE: 20,
  WASTED_TIME: 21,
  WATCHING_PAINT_DRY: 22,
  WISHFUL_DYING: 23,
  WISHFUL_THINKING: 24,
  YOU_FELL_FOR_IT: 25,
  YOU_FOUGHT_THE_WALL: 26,
};

const PLAYER_STATES = {
  NONE: 0,
  STANDING: 1,
  SITTING: 2,
  LYING: 4,
  STUNNED: 8,
  BLIND: 16,
  BURNING: 32,
  LAMED: 64,
  BEARTRAPPED: 128,
  SLOWED: 256,
  DEAD: 512,
  POISONED: 1024,
};

const DIRS = {
  NONE: 0,
  NORTH: 1,
  SOUTH: 2,
  EAST: 4,
  WEST: 8,
  LEFT: 16,
  RIGHT: 32,
};

const CELL_TAGS = {
  NONE: 0,
  START: 1,
  FINISH: 2,
  PATH: 4,
  CARVED: 8,
  LAVA: 16,
};

const CELL_TRAPS = {
  NONE: 0,
  PIT: 1,
  BEARTRAP: 2,
  TARPIT: 4,
  FLAMETHOWER: 8,
};

const COMMANDS = {
  NONE: 0,
  FACE: 1,
  LISTEN: 2,
  LOOK: 3,
  SIT: 4,
  SNIFF: 5,
  STAND: 6,
  TURN: 7,
  MOVE: 8,
  JUMP: 9,
  WAIT: 10,
  WRITE: 11,
  QUIT: 12,
  SNEAK: 13,
};

const GAME_RESULTS = {
  NONE: 0,
  IN_PROGRESS: 1,
  OUT_OF_MOVES: 2,
  OUT_OF_TIME: 3,
  DEATH_TRAP: 4,
  DEATH_POISON: 5,
  DEATH_LAVA: 6,
  WIN: 7,
  WIN_FLAWLESS: 8,
  ABANDONED: 9,
};

const GAME_STATES = {
  NEW: 0,
  IN_PROGRESS: 1,
  FINISHED: 2,
  ABORTED: 3,
  ERROR: 4,
};

const GAME_MODES = {
  NONE: 0,
  SINGLE_PLAYER: 1,
  MULTI_PLAYER: 2,
};

const USER_ROLES = {
  NONE: 0,
  USER: 1,
  ASSISTANT: 2,
  INSTRUCTOR: 3,
  ADMIN: 4,
};

// some aliasing to shorten common enums
const DIRECTIONS = DIRS;
const CMDS = COMMANDS;
