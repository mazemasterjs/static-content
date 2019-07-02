/* eslint-disable no-unused-vars */
const CALLBACK_DELAY = 50;
const FAIL_IMG_COUNT = 31;
const SUCC_IMG_COUNT = 32;
const AJAX_TIMEOUT = 5000;

// eslint-disable-next-line prefer-const
let EMERGENCY_STOP_BUTTON_PUSHED = false;

// eslint-disable-next-line prefer-const
let botCallback = null;
let lastActionResult = null;

// TODO: Replace myCreds with a login and use btoa(userName + ':' + password) to send the Basic Auth header
const myCreds = 'a3JlZWJvZzoxc3VwZXIx';

const GAME_URL = 'http://mazemasterjs.com/game';
// const GAME_URL = 'http://localhost:8080/game';
const MAZE_URL = 'http://mazemasterjs.com/api/maze';
const TEAM_URL = 'http://mazemasterjs.com/api/team';
// const TEAM_URL = 'http://localhost:8083/api/team';

// Game tracking variables
let curGame = {};
let totalMoves = 0;
let totalScore = 1000;

/**
 * Stringify and formaat return json string for cleaner action/engram rendering
 *
 * @param {JSONObject} obj
 * @return {string}
 */
const jsonToStr = obj => {
  return JSON.stringify(obj).replace(/\,\"/g, ', "');
};

/**
 * Promise chain for control loading based on
 * order of load requirements
 * @return {Promise}
 */
async function loadControls() {
  console.log('loadControls -> mazes');
  return loadMazes().then(() => {
    console.log(' loadControls -> teams');
    return loadTeams().then(() => {
      console.log('  loadControls -> bots');
      return loadBots($('#selTeam :selected').val()).then(() => {
        console.log('loadControls -> Promise chain complete.');
        logMessage('log', 'READY TO&nbsp;<b>ROCK!</b>', 'The bot editor is ready.');
      });
    });
  });
}

/**
 * Resets global tracking variables
 */
function resetTrackingVars() {
  curGame = {};
  totalMoves = 0;
  totalScore = 1000;
}

/**
 * Loads maze data into local controls
 * @return {Promise}
 */
function loadMazes() {
  const MAZE_GET_URL = `${MAZE_URL}/get`;
  console.log(' -> loadMazes -> ', MAZE_GET_URL);

  return $.ajax({
    url: MAZE_GET_URL,
    dataType: 'json',
    method: 'GET',
    headers: { Authorization: 'Basic ' + myCreds },
    success: function(mazes) {
      $('#selMaze').empty();
      for (const maze of mazes) {
        let opt = "<option value='" + maze.id + "'>";
        opt += `${maze.name} (${maze.height} x ${maze.width})`;
        opt += '</option>';
        $('#selMaze').append(opt);
      }
      return Promise.resolve();
    },
    error: function(mazeLoadErr) {
      logMessage('err', 'ERROR LOADING MAZES', mazeLoadErr !== undefined ? `${mazeLoadErr.status} - ${mazeLoadErr.statusText}` : undefined);
    },
  });
}

/**
 * Loads team values into controls
 *
 * @return {Promise}
 */
function loadTeams() {
  const TEAM_GET_URL = `${TEAM_URL}/get`;
  console.log('  -> loadTeams -> ', TEAM_GET_URL);
  return $.ajax({
    url: TEAM_GET_URL,
    dataType: 'json',
    method: 'GET',
    headers: { Authorization: 'Basic ' + myCreds },
    success: function(teams) {
      $('#selTeam').empty();
      for (const team of teams) {
        let opt = "<option value='" + team.id + "'>";
        opt += team.name;
        opt += '</option>';
        $('#selTeam').append(opt);
      }
      return Promise.resolve();
    },
    error: function(error) {
      logMessage('err', 'ERROR LOADING TEAMS', err.status !== 0 ? `${error.status} - ${error.statusText}` : undefined);
    },
  });
}

/**
 * Loads bot values into controls for given team
 * @param {*} teamId
 */
async function loadBots(teamId) {
  const BOT_GET_URL = `${TEAM_URL}/get?id=${teamId}`;
  console.log('   -> loadBots -> ', teamId, BOT_GET_URL);
  if (!teamId) return;

  return $.ajax({
    url: BOT_GET_URL,
    dataType: 'json',
    method: 'GET',
    headers: { Authorization: 'Basic ' + myCreds },
    success: function(data) {
      const team = data[0];
      $('#selBot').empty();

      for (const bot of team.bots) {
        const botSel = `<option value='${bot.id}' name='${bot.name}'>${bot.name} (${bot.coder})</option>`;
        $('#selBot').append(botSel);
      }

      let debugBotSel = "<option value='jd-test-bot'>";
      debugBotSel += 'jd-test-bot (jd-test-bot)';
      debugBotSel += '</option>';
      $('#selBot').append(debugBotSel);
    },
    error: function(error) {
      logMessage('err', 'ERROR LOADING BOTS', err.status !== 0 ? `${error.status} - ${error.statusText}` : undefined);
    },
  }).done(() => {
    loadBotVersions($('#selBot :selected').val());
  });
}

/**
 * Populates the version select control with all versions available for the given bot
 * @param {*} botId
 * @param {*} autoLoadBot
 * @return {void}
 */
function loadBotVersions(botId, autoLoadBot = true) {
  const BOT_CODE_URL = TEAM_URL + '/get/botCode?botId=' + botId;
  console.log('    -> loadBotVersions ->', botId);

  return $.ajax({
    url: BOT_CODE_URL,
    dataType: 'json',
    method: 'GET',
    headers: { Authorization: 'Basic ' + myCreds },
    success: function(docs) {
      $('#selBotVersion').empty();
      let versionCount = 0;
      for (const doc of docs.reverse()) {
        versionCount++;
        if (versionCount > 25) {
          deleteBotCodeVersion(botId, doc.version);
        } else {
          $('#selBotVersion').append(`<option value="${doc.version}">${doc.version}</option>`);
        }
      }
    },
    error: function(error) {
      if (err.status === 404) {
        versionBotCode(botId, editor.getValue());
      } else {
        logMessage('err', `ERROR LOADING BOT CODE &rsaquo; ${err.status} (${err.statusText})`, `Cannot load code for bot&nbsp;<b>${botId}</b>.`);
      }
    },
  }).done(() => {
    if (autoLoadBot) {
      loadBotCode($('#selBot :selected').val());
    }
  });
}

/**
 * Delete teh specified code version for the given botId
 *
 * @param {*} botId
 * @param {*} version
 */
function deleteBotCodeVersion(botId, version) {
  const DELETE_BOT_CODE_URL = TEAM_URL + `/delete/botCode/${botId}/${version}`;
  $.ajax({
    url: DELETE_BOT_CODE_URL,
    dataType: 'json',
    method: 'DELETE',
    headers: { Authorization: 'Basic ' + myCreds },
    success: function() {
      logMessage('wrn', `BOT CODE v${version} DELETED`);
    },
    error: function(error) {
      logMessage('err', `ERROR DELETING BOT CODE v${version}`, error.message === undefined ? `${error.status} - ${error.statusText}` : error.message);
    },
  });
}

/**
 * Loads the version of bot  code associated with botId.version - if no
 * version is provided, loads the latest version instead
 *
 * @param {*} botId
 * @param {*} version
 * @return {void}
 */
function loadBotCode(botId, version) {
  let BOT_CODE_URL = TEAM_URL + '/get/botCode?botId=' + botId;

  // if no version supplied, assume we're getting the latest version
  if (version === undefined) {
    version = -1;
  } else {
    BOT_CODE_URL += `&version=${version}`;
  }

  console.log('loadBotCode', botId, version, BOT_CODE_URL);

  return $.ajax({
    url: BOT_CODE_URL,
    dataType: 'json',
    method: 'GET',
    headers: { Authorization: 'Basic ' + myCreds },
    success: function(docs) {
      // if no version given, find the higest version returned
      if (version === -1) {
        version = docs.sort((first, second) => {
          return parseInt(second.version.replace(/\./g, '')) - parseInt(first.version.replace(/\./g, ''));
        })[0].version;
      }

      // now load the version
      const botCode = docs.find(doc => {
        return doc.version === version;
      });

      if (botCode !== undefined) {
        $('#selBotVersion').val(botCode.version);
        const date = new Date(botCode.lastUpdated);

        logMessage(
          'log',
          `"${$('#selBot :selected').attr('name')}" v${botCode.version} Loaded.`,
          `"${$('#selBot :selected').attr('name')}" v${botCode.version} was last saved on ${date.toLocaleDateString()} at ${date.toLocaleTimeString()}.`,
        );

        // load the code into the editor
        editor.setValue(botCode.code);

        // and format the code once that's done
        editor.trigger('', 'editor.action.formatDocument');

        setSaveButtonStates(false);
      } else {
        logMessage('wrn', 'BOT CODE NOT FOUND');
      }
    },
    error: function(error) {
      logMessage('err', `ERROR LOADING BOT CODE &rsaquo; ${err.status} (${err.statusText})`, `Cannot load code for bot&nbsp;<b>${botId}.</b>`);
    },
  });
}

/**
 * Generates a new version of the bot's code and stores it in
 * the bot_code collection.
 *
 * @param {*} botId
 * @param {*} version
 * @param {*} code
 * @return {void}
 */
function updateBotCode(botId, version, code) {
  const putUrl = TEAM_URL + '/update/botCode';

  // first, format the code in the editor
  editor.trigger('', 'editor.action.formatDocument');

  $.ajax({
    url: putUrl,
    dataType: 'json',
    timeout: AJAX_TIMEOUT,
    method: 'PUT',
    headers: { Authorization: 'Basic ' + myCreds },
    data: {
      botId: botId,
      version: version,
      code,
    },
    success: function() {
      logMessage('bot', `"${$('#selBot :selected').attr('name')}" v<b>${version}</b>&nbsp;- Updated.`);
      setSaveButtonStates(false);
    },
    error: function(error) {
      logMessage('err', 'ERROR UPDATING BOT CODE', `${error.status} - ${error.statusText}`);
    },
  }).done(() => {
    loadBotVersions(botId, false);
  });
}

/**
 * Calculate and return the next mock-version number
 *
 * @param {*} version
 * @return {string}
 */
function getNextVersion(version) {
  const curVer = version.split('.');
  if (parseInt(curVer[2]) === 9) {
    curVer[2] = 0;
    if (parseInt(curVer[1]) === 9) {
      curVer[1] = 0;
      curVer[0] = parseInt(curVer[0]) + 1;
    } else {
      curVer[1] = parseInt(curVer[1]) + 1;
    }
  } else {
    curVer[2] = parseInt(curVer[2]) + 1;
  }

  return curVer.join('.');
}

/**
 * Generates a new version of the bot's code and stores it in
 * the bot_code collection.
 *
 * @param {*} botId
 * @param {*} code
 * @return {void}
 */
function versionBotCode(botId, code) {
  const GET_BOT_CODE_URL = TEAM_URL + '/get/botCode?botId=' + botId;
  const PUT_BOT_CODE_URL = TEAM_URL + '/insert/botCode';

  $.ajax({
    url: GET_BOT_CODE_URL,
    dataType: 'json',
    timeout: AJAX_TIMEOUT,
    method: 'GET',
    headers: { Authorization: 'Basic ' + myCreds },
    success: function(docs) {
      topVersion = docs.sort((first, second) => {
        return parseInt(second.version.replace(/\./g, '')) - parseInt(first.version.replace(/\./g, ''));
      })[0].version;

      const newVersion = getNextVersion(topVersion);
      console.log('Next Version=' + newVersion);

      $.ajax({
        url: PUT_BOT_CODE_URL,
        dataType: 'json',
        timeout: AJAX_TIMEOUT,
        method: 'PUT',
        headers: { Authorization: 'Basic ' + myCreds },
        data: {
          botId: botId,
          version: newVersion,
          code,
        },
        success: function() {
          logMessage('bot', `"${$('#selBot :selected').attr('name')}" v<b>${newVersion}</b>&nbsp;- New Version Saved.`);
          setSaveButtonStates(false);
        },
        error: function(error) {
          if (error.status !== 404) {
            logMessage('err', 'ERROR SAVING BOT', `${error.status} - ${error.statusText}`);
          } else {
            console.log('New Bot - create base code version.');
          }
        },
      }).done(() => {
        loadBotVersions(botId, false);
      });
    },
    error: function(error) {
      $.ajax({
        url: PUT_BOT_CODE_URL,
        dataType: 'json',
        timeout: AJAX_TIMEOUT,
        method: 'PUT',
        headers: { Authorization: 'Basic ' + myCreds },
        data: {
          botId: botId,
          version: '0.0.1',
          code,
        },
        success: function() {
          logMessage('bot', `${$('selBot').name()}&nbsp;<b>v0.0.1</b>&nbsp;Activated!`);
          if ($('#selBotVersion').children().length === 0) {
            $('#selBotVersion').append(`<option value="${botId}">0.0.1</option>`);
          }
        },
        error: function(error) {
          logMessage('err', 'ERROR INITIALIZING BOT', `${error.status} - ${error.statusText} initializing bot&nbsp;<b>${botId}</span>`);
        },
      });
    },
  });
}

/**
 * Adds a formatted message to the output log.
 *
 * @param {*} source log | bot | wrn | err
 * @param {*} header The contents of the header section
 * @param {*} message The contents of the body section
 * @return {void}
 */
function logMessage(source, header, message) {
  const textLog = $('#textLog');
  const hdr = `logHdr ${source}MsgHdr`;
  const bdy = `logBdy ${source}MsgBdy autoScroll`;

  // build the html content
  let htmlOut = `<h3 class="${hdr}">${header}</h3>`;

  if (message !== undefined) {
    if ((source = 'err')) {
      htmlOut += `<div class="${bdy}"><pre class='autoScroll'>${message}</pre></div>`;
    } else {
      htmlOut += `<div class="${bdy}">${message}</div>`;
    }
  } else {
    htmlOut += `<div class="${bdy}"></div>`;
  }

  // added it to the log and update display
  textLog.append(htmlOut);

  textLog.scrollTop(textLog[0].scrollHeight);
}

/**
 * Attempts to create a new MMJS Game
 *
 * @return {void}
 */
async function startGame() {
  const mazeId = $('#selMaze').val();
  const teamId = $('#selTeam').val();
  const botId = $('#selBot :selected').val();
  const url = GAME_URL + '/new/' + mazeId + '/' + teamId + '/' + botId;

  return await $.ajax({
    url: url,
    dataType: 'json',
    timeout: AJAX_TIMEOUT,
    method: 'PUT', // method is any HTTP method
    headers: { Authorization: 'Basic ' + myCreds },
    data: {}, // data as js object
    success: function(data) {
      $('#textLog').empty();
      $('#actionLog').empty();

      // set tracking vars to new game values
      curGame = data.game;
      totalMoves = data.game.score.moveCount;
      totalScore = data.totalScore;
      lastActionResult = data;

      // load the minimap
      scaleMiniMap(faceAvatar(data.action.outcomes[data.action.outcomes.length - 1], DIRS.SOUTH));

      // log game creation
      logMessage('log', 'Game Created', `gameId ->${data.game.gameId}`);

      // and display the most recent action (new game action)
      renderAction(data);

      return Promise.resolve(data.game);
    },
    error: async function(err) {
      if (err.responseJSON !== undefined) {
        const res = err.responseJSON;
        if (res.status === 400 && res.gameId !== undefined) {
          logMessage('wrn', 'GAME IN PROGRESS', `gameId: ${res.gameId}`);
        } else {
          return Promise.reject(err);
        }
      } else {
        console.warn('startGame -> ajax', err);
        logMessage('err', 'ERROR STARTING GAME', `${err.status} - ${err.statusText}`);
        return Promise.reject(err);
      }
    },
  });
}

/**
 * Attempts to load an existing MMJS game from the given gameId
 *
 * @param {*} gameId
 */
async function loadGame(gameId) {
  const LOAD_GAME_URL = GAME_URL + `/get/${gameId}`;
  console.log('loadGame', LOAD_GAME_URL);

  return await $.ajax({
    url: LOAD_GAME_URL,
    dataType: 'json',
    timeout: AJAX_TIMEOUT,
    method: 'GET', // method is any HTTP method
    headers: { Authorization: 'Basic ' + myCreds },
    data: {}, // data as js object
    success: function(data) {
      curGame = data.game;
      totalScore = data.totalScore;
      totalMoves = data.game.score.moveCount;
      lastActionResult = data;

      // render the game action
      renderAction(data);

      // load the minimap
      const mapText = faceAvatar(data.action.outcomes[data.action.outcomes.length - 1], data.playerFacing);
      scaleMiniMap(mapText);

      return Promise.resolve(data.game);
    },
    error: async function(err) {
      console.error('loadGame', err);
      logMessage('err', 'ERROR LOADING GAME', err.status !== 0 ? `${error.status} - ${error.statusText}` : undefined);
      return Promise.reject(err);
    },
  });
}

/**
 * Starts the bot by injecting and calling the goBot() function with or without
 * injected callback and debugger lines.
 *
 * @param {*} singleStep - if true, starts the bot without a callback parameter
 * @param {*} debug - adds/removes debugger; lines in bot code, as needed
 *
 */
async function startBot(singleStep = true, debug = false) {
  console.log('startBot', singleStep, debug);
  const injectionTag = '\n// @INJECTED_CODE\n';
  const debugStart = injectionTag + 'botCallback = null;\ngoBot(lastActionResult);';
  const stepStart = injectionTag + 'botCallback = null;\ngoBot(lastActionResult);';
  const loopStart = injectionTag + 'botCallback = goBot;\ngoBot(lastActionResult);';
  const debugScript = injectionTag + 'debugger;\n';

  // validate and report errors - if any are found, do not continue
  if (!validateSyntax()) {
    return;
  }

  let botCode = editor.getValue() + '';
  if (botCode.trim() === '') {
    logMessage('err', 'NO CODE TO RUN', 'Your bot code editor appears to be empty. You must write some code before you can run it!');
    return;
  }

  if (curGame.gameId === undefined || lastActionResult === null) {
    const gameReady = await startGame()
      .then(newGame => {
        console.log('startBot -> Game created.', `GameId: ${newGame.gameId}`);
        return true;
      })
      .catch(async ngErr => {
        if (ngErr.responseJSON !== undefined && ngErr.responseJSON.status === 400) {
          const res = ngErr.responseJSON;
          if (res.gameId !== '') {
            console.log('startBot -> Game in progress, attempting to reconnect.', `GameId: ${res.gameId}`);

            return await loadGame(res.gameId)
              .then(existingGame => {
                console.log('startBot -> Game loaded.', `GameId: ${existingGame.gameId}`);
                return true;
              })
              .catch(lgErr => {
                console.error('startBot -> loadGame -> Error', lgErr);
                return false;
              });
          } else {
            console.error('startBot -> startGame -> Error', lgErr);
            return false;
          }
        }
      });

    // if we didn't get a good game, bail out - start/getGame functions will log the errors.
    if (!gameReady) {
      const startBotErr = new Error('Unable to start or load a game.');
      logMessage('err', 'UNABLE TO START GAME', 'An error is preventing a game from being created and/or started. Seek assistance.');
      console.error('startBot', startBotErr);
      return;
    }
  }

  // save any outstanding changes when run
  if ($('#btnSaveBotCode').hasClass('btnEnabled')) {
    updateBotCode($('#selBot :selected').val(), $('#selBotVersion :selected').val(), editor.getValue());
  }

  // inject script values appropriate to the run time selected
  if (debug && botCode.indexOf('debugger;') === -1) {
    const insKey = 'function goBot(data) {';
    const insAt = botCode.indexOf(insKey);
    const bcTop = botCode.substr(0, insAt + insKey.length);
    const bcBot = botCode.substr(insAt + insKey.length);
    botCode = bcTop + debugScript + bcBot + debugStart;
  } else if (singleStep) {
    botCode = botCode.replace(/debugger;/g, '');
    botCode = botCode + stepStart;
  } else {
    botCode = botCode.replace(/debugger;/g, '');
    botCode = botCode + loopStart;
  }

  // give the bot it's day in the sun...
  eval(botCode); // <-- TRY/CATCH HERE MASKS ERRORS THAT HAPPEN WITHIN THE BOT - IN-BOT ERROR HANDLING WOULD BE WISE
}

/**
 * Sends the given action to the game server to be processed
 * and returns the resulting data
 *
 * @param {*} action
 */
async function executeAction(action) {
  console.log('executeAction', action);
  const GAME_ACTION_URL = GAME_URL + '/action';

  return await $.ajax({
    url: GAME_ACTION_URL,
    method: 'PUT',
    dataType: 'json',
    headers: { Authorization: 'Basic ' + myCreds },
    data: action,
  })
    .then(data => {
      renderAction(data);
      return Promise.resolve(data);
    })
    .catch(putError => {
      return Promise.reject(putError);
    });
}

/**
 * Renders the given action result
 *
 * @param {*} result
 */
function renderAction(result) {
  console.log('renderAction', result);
  const action = result.action;
  const engram = action.engram;

  let logMsg = '<div class="actionBody">';

  logMsg += `Command: <b>${getObjValName(COMMANDS, action.command)}</b>&nbsp;&nbsp[&nbsp;${action.command}&nbsp;]<br>`;
  logMsg += `Direction: <b>${getObjValName(DIRS, action.direction)}</b>&nbsp;&nbsp[&nbsp;${action.direction}&nbsp;]<br>`;
  if (action.message !== '') logMsg += `Message: <b>${action.message}</b><br>`;
  logMsg += `Player State(s): ${getSelectedValueNames(PLAYER_STATES, result.playerState)}<br>`;
  logMsg += `Player Facing: <b>${getObjValName(DIRS, result.playerFacing)}</b>&nbsp;&nbsp[&nbsp;${result.playerFacing}&nbsp;]<br>`;

  // add outcomes to the log
  if (action.outcomes.length > 1) {
    logMsg += '<hr>';
    logMsg += 'Outcome(s):<br />';
    for (let pos = 0; pos < action.outcomes.length - 1; pos++) {
      logMsg += pos + 1 + `: ${action.outcomes[pos]}<br />`;
    }
    logMsg += '<hr>';
  }

  // grab the current millis time as an action/engram ID
  const actId = Date.now();

  // log the local "here" engram
  logMsg += `<div id="${actId}_HERE" class="engramContainer" onclick="toggleEngramContent('${actId}_HERE');">`;
  logMsg += `  <h5><span id="${actId}_HERE_icon" class="ui-icon ui-icon-plusthick"></span>ENGRAM.HERE</h5>`;
  logMsg += `  <p class='engramData' style="display:none"><b>.exitNorth=</b>${jsonToStr(engram.here.exitNorth)}</p>`;
  logMsg += `  <p class='engramData' style="display:none"><b>.exitSouth=</b>${jsonToStr(engram.here.exitSouth)}</p>`;
  logMsg += `  <p class='engramData' style="display:none"><b>.exitEast=</b>${jsonToStr(engram.here.exitEast)}</p>`;
  logMsg += `  <p class='engramData' style="display:none"><b>.exitWest=</b>${jsonToStr(engram.here.exitWest)}</p>`;
  logMsg += `  <p class='engramData' style="display:none"><b>.messages=</b>${jsonToStr(engram.here.messages)}</p>`;
  logMsg += `  <p class='engramData' style="display:none"><b>.intuition=</b>${jsonToStr(engram.here.intuition)}</p>`;
  logMsg += `</div>`;

  // log directional engrams
  for (const dir in DIRS) {
    if (DIRS[dir] >= DIRS.NORTH && DIRS[dir] <= DIRS.WEST) {
      logMsg += `<div id="${actId}_${dir}" class="engramContainer" onclick="toggleEngramContent('${actId}_${dir}');">`;
      logMsg += `  <h5><span id="${actId}_${dir}_icon" class="ui-icon ui-icon-plusthick"></span>ENGRAM.${dir}</h5>`;
      logMsg += `  <p class='engramData' style="display:none"><b>.see=</b>${jsonToStr(engram[dir.toLowerCase()].see)}</p>`;
      logMsg += `  <p class='engramData' style="display:none"><b>.hear=</b>${jsonToStr(engram[dir.toLowerCase()].hear)}</p>`;
      logMsg += `  <p class='engramData' style="display:none"><b>.smell=</b>${jsonToStr(engram[dir.toLowerCase()].smell)}</p>`;
      logMsg += `  <p class='engramData' style="display:none"><b>.feel=</b>${jsonToStr(engram[dir.toLowerCase()].feel)}</p>`;
      logMsg += `  <p class='engramData' style="display:none"><b>.taste=</b>${jsonToStr(engram[dir.toLowerCase()].taste)}</p>`;
      logMsg += `</div>`;
    }
  }
  logMsg += '</div>';

  // track total move count and score
  totalMoves += action.moveCount;
  totalScore += action.score;

  // now dump it all in the log
  logMessage('log', `Move ${totalMoves} | Score ${totalScore} ${getDirectionIcon(action.direction)}${getCommandIcon(action.command)}`, logMsg);

  // log the game results if game has ended
  let textMap;
  if (result.game.score.gameResult !== GAME_RESULTS.IN_PROGRESS) {
    let msg = 'GAME OVER';

    switch (result.game.score.gameResult) {
      case GAME_RESULTS.DEATH_LAVA:
        msg += ' - You stepped into the lava.';
        scaleMiniMap(skully);
        break;
      case GAME_RESULTS.DEATH_TRAP:
        msg += ' - You hit a trap.';
        scaleMiniMap(skully);
        break;
      case GAME_RESULTS.OUT_OF_MOVES:
        msg += ' - You ran out of moves.';
        scaleMiniMap(skully);
        break;
      case GAME_RESULTS.WIN:
        msg += ' - You won!';
        scaleMiniMap('{{ CHEESE }}');
        break;
      case GAME_RESULTS.WIN_FLAWLESS:
        msg += ' - You won... FLAWLESS VICTORY!';
        scaleMiniMap('{{ GOUDA }}');
        break;
      default:
        msg += ' - You lost somehow... gameResult=' + result.game.score.gameResult;
        scaleMiniMap(skully);
    }
    logMessage('err', msg);
    curGame = {};
    botCallback = null;
  } else {
    textMap = faceAvatar(action.outcomes[action.outcomes.length - 1], result.playerFacing);
    const mmcPre = $('#miniMapContent > pre');
    if (mmcPre.length === 0) {
      scaleMiniMap(textMap);
    } else {
      mmcPre.text(textMap);
    }
  }
}

/**
 * Generate and return an HTML element with a ui-icon representation of
 * the given command.
 *
 * @param {*} command
 * @return {string}
 */
function getCommandIcon(command) {
  switch (command) {
    case COMMANDS.NONE:
      return '<div class="ui-icon ui-icon-cancel" title="No Command"></div>';
    case COMMANDS.FACE:
      return '<div class="ui-icon ui-icon-refresh" title="Face"></div>';
    case COMMANDS.LISTEN:
      return '<div class="ui-icon ui-icon-volume-on" title="Listen"></div>';
    case COMMANDS.LOOK:
      return '<div class="ui-icon ui-icon-search" title="Look"></div>';
    case COMMANDS.SIT:
      return '<div class="ui-icon ui-icon-arrowstop-1-s" title="Sit"></div>';
    case COMMANDS.SNIFF:
      return '<div class="ui-icon ui-icon-caret-2-e-w" title="Sniff"></div>';
    case COMMANDS.STAND:
      return '<div class="ui-icon ui-icon-arrowstop-1-n" title="Stand"></div>';
    case COMMANDS.TURN:
      return '<div class="ui-icon ui-icon-refresh" title="Turn"></div>';
    case COMMANDS.MOVE:
      return '<div class="ui-icon ui-icon-transfer-e-w" title="Move"></div>';
    case COMMANDS.JUMP:
      return '<div class="ui-icon ui-icon-eject" title="Jump"></div>';
    case COMMANDS.WAIT:
      return '<div class="ui-icon ui-icon-clock" title="Wait"></div>';
    case COMMANDS.WRITE:
      return '<div class="ui-icon ui-icon-pencil" title="Write"></div>';
    case COMMANDS.QUIT:
      return '<div class="ui-icon ui-icon-power" title="Quit"></div>';
  }
  return '';
}

/**
 * Generate and return an HTML element with a ui-icon representation of
 * the given direction.
 *
 * @param {*} direction
 * @return {string}
 */
function getDirectionIcon(direction) {
  switch (direction) {
    case DIRS.NONE:
      return '<div class="ui-icon ui-icon-arrow-4-diag" title="No Direction"></div>';
    case DIRS.NORTH:
      return '<div class="ui-icon ui-icon-triangle-1-n" title="North"></div>';
    case DIRS.SOUTH:
      return '<div class="ui-icon ui-icon-triangle-1-s" title="South"></div>';
    case DIRS.EAST:
      return '<div class="ui-icon ui-icon-triangle-1-e" title="East"></div>';
    case DIRS.WEST:
      return '<div class="ui-icon ui-icon-triangle-1-w" title="West"></div>';
    case DIRS.LEFT:
      return '<div class="ui-icon ui-icon-arrowrefresh-1-w" title="Left"></div>';
    case DIRS.RIGHT:
      return '<div class="ui-icon ui-icon-arrowrefresh-1-e" title="Right"></div>';
  }
  return '';
}

/**
 * If there are error markers on the editor, enumerate as HTML log them.
 *
 * @return {boolean}
 */
function validateSyntax() {
  const markers = monaco.editor.getModelMarkers();

  if (markers.length > 0) {
    let msg = '<span class="botCodeError">';
    for (const marker of markers) {
      msg += `Line <b>${marker.endLineNumber}</b>, Column <b>${marker.endColumn}</b>: ${marker.message}<br>`;
    }
    msg += '</span>';
    logMessage('err', 'BOT CODE HAS ERRORS', msg);
  }

  return markers.length === 0;
}

/**
 * Toggles warning queue css classes when sytnax errors exist
 *
 * @param {*} enabled
 * @return {void}
 */
function setWarningCues(enabled) {
  if (enabled) {
    $('#editor').addClass('codeWarnings');
  } else {
    $('#editor').removeClass('codeWarnings');
  }
}

//
/**
 * Returns the key name of the given for an iterable
 *
 * @param {*} obj
 * @param {*} val
 * @return {string}
 */
function getObjValName(obj, val) {
  for (const item in obj) {
    if (obj[item] === val) {
      return item;
    }
  }
}

/**
 * A list of all selected values in a bitwise iterable
 *
 * @param {*} obj
 * @param {*} val
 * @return {array}
 */
function getSelectedValueNames(obj, val) {
  const vals = [];
  for (const item in obj) {
    if (!!(obj[item] & val)) {
      vals.push(`<b>${item}</b>&nbsp;&nbsp[&nbsp;${obj[item]}&nbsp;]`);
    }
  }
  return vals.join(', ');
}

/**
 * Scale the minimap content to best fit the conteainer size
 *
 * @param {*} textRender
 */
function scaleMiniMap(textRender = '') {
  const mm = $('#miniMap');
  const mmc = $('#miniMapContent');
  const pre = $('#miniMapContent > pre');
  let rows;
  let cols;

  // make sure there's something to scale first and that we're
  if (textRender === '' && pre.length === 0) {
    return;
  }

  //   console.log('starting size: ', mm.width(), mm.height());

  if (textRender !== '') {
    rows = textRender.split('\n').length;
    cols = textRender.split('\n')[0].length;
  } else {
    rows = pre.text().split('\n').length;
    cols = pre.text().split('\n')[0].length;
  }

  // determine the number of characters - scale determined based on
  // 3x3 maze with text-render of 13 chars per maze column
  const baseFontSize = parseInt($(':root').css('font-size'));
  const mazeModOffset = baseFontSize - 13;
  const mazeMod = (rows > cols ? rows : cols) + mazeModOffset;
  // console.log(`row-chars: ${rows}, col-chars: ${cols}, mazeMod: ${mazeMod}`);

  const baseSize = parseInt($(':root').css('--miniMapBaseSize'));
  const newRemSize = (mmc.width() / mazeMod / baseSize).toFixed(3); // :1 aspect ratio, so only check width
  // console.log(`newRemSize: ${newRemSize}`);

  $(':root').css('--miniMapFontSize', newRemSize + 'rem');

  if (textRender !== '') {
    if (pre.length === 0) {
      mmc.html(`<pre>${textRender}</pre`);
    } else {
      pre.html(textRender);
    }
  }

  mm.width(pre.width() + pre.width() * 0.1);
  mm.height(pre.height() + $('#miniMap h3').height() + pre.width() * 0.1);
  // console.log('final size: ', mm.width(), mm.height());
}

/**
 * Update the avatar icon with a facing direction, if provided
 *
 * @param {*} textMap
 * @param {*} dir
 *
 * @return {string}
 */
function faceAvatar(textMap, dir) {
  if (dir != -1) {
    switch (dir) {
      case DIRS.NORTH: {
        textMap = textMap.replace('@', '▲');
        break;
      }
      case DIRS.SOUTH: {
        textMap = textMap.replace('@', '▼');
        break;
      }
      case DIRS.EAST: {
        textMap = textMap.replace('@', '►');
        break;
      }
      case DIRS.WEST: {
        textMap = textMap.replace('@', '◄');
        break;
      }
    }
  }

  return textMap;
}

/**
 * Toggle save/version buttons based on current bot code state
 *
 * @param {*} enabled
 */
function setSaveButtonStates(enabled) {
  if (!pageLoadComplete) return;

  if (enabled) {
    $('#btnSaveBotCode').attr('disabled', false);
    $('#btnSaveBotCode').removeClass('btnDisabled');
    $('#btnSaveBotCode').addClass('btnEnabled');
    $('#btnSaveBotCode').attr('title', 'Save Bot (shortcut: [CTRL + S] in editor');
  } else {
    $('#btnSaveBotCode').attr('disabled', true);
    $('#btnSaveBotCode').addClass('btnDisabled');
    $('#btnSaveBotCode').removeClass('btnEnabled');
    $('#btnSaveBotCode').attr('title', '');
  }
}

/**
 * Toggles display of an engram Data container
 *
 * @param {*} containerId
 */
function toggleEngramContent(containerId) {
  const icon = $(`#${containerId}_icon`);
  const content = $(`#${containerId} > p`);

  if (content.css('display') !== 'none') {
    icon.removeClass('ui-icon-minusthick');
    icon.addClass('ui-icon-plusthick');
    content.hide();
  } else {
    icon.addClass('ui-icon-minusthick');
    icon.removeClass('ui-icon-plusthick');
    content.show();
  }
}

/**
 * Sends a command to the MazeMasterJS Game Server
 *
 * @param {action} action Actions include a command, a direction, and an optional message.
 * @param {action} callback The function to call back to with response data.
 */
async function SendAction(action) {
  const method = `SendAction(action)`;
  console.log(method, action, botCallback);

  if (!action) {
    const actErr = new Error('Missing Action - You must supply an action object.');
    logMessage('err', 'Invalid Action', actErr.message);
    throw actErr;
  }

  if (!action.command) {
    const cmdErr = new Error('Missing action.command - Your action must include a command.');
    logMessage('err', 'Missing action.command', cmdErr.message);
    throw cmdErr;
  }

  if (!curGame || !curGame.gameId || curGame.gameId.trim() === '') {
    const gameIdErr = new Error('Invalid Game - No game is currently in progress.');
    logMessage('err', 'Invalid Game', gameIdErr.message);
    throw gameIdErr;
  } else {
    action.gameId = curGame.gameId;
  }

  return await executeAction(action)
    .then(data => {
      lastActionResult = data;

      // Stop the chain if EMERGENCY STOP was requested
      setTimeout(() => {
        if (EMERGENCY_STOP_BUTTON_PUSHED) {
          $('#emergencyStopDialog').html(`<img src="images/fail/${Math.floor(Math.random() * FAIL_IMG_COUNT)}.gif" style="width:100%; min-height:100px" />`);
          $('#emergencyStopDialog').dialog('open');
          logMessage('err', 'EMERGENCY STOP');
          return;
        }

        // Only continue chain if game is still in progress and botCallback is set
        if (botCallback !== null && data.game.score.gameResult === GAME_RESULTS.IN_PROGRESS) {
          botCallback(data);
        } else {
          console.log('Action Chain cannot continue.', 'gameResult=' + data.game.score.gameResult, 'botCallback=' + botCallback);
        }
      }, CALLBACK_DELAY);
    })
    .catch(reqError => {
      if (reqError.status === 404) {
        logMessage('err', 'Game Not Found', `Game ${curGame.gameId} was not found. Please start a new game and try again.`);
        throw reqError;
      } else {
        console.log('SendAction() -> gameFuncs.executeAction Error: ' + JSON.stringify(reqError));
        logMessage('err', `ACTION ERROR - ${reqError.message}`, reqError.trace);
      }
    });
}
