const FAIL_IMG_COUNT = 31;
const SUCC_IMG_COUNT = 32;
const AJAX_TIMEOUT = 5000;

const GAME_URL = 'http://mazemasterjs.com/game';
//const GAME_URL = 'http://localhost:8080/game';
const MAZE_URL = 'http://mazemasterjs.com/api/maze';
const TEAM_URL = 'http://mazemasterjs.com/api/team';
// const TEAM_URL = 'http://localhost:8083/api/team';

// Game tracking variables
let curGame = {};
let totalMoves = 0;
let totalScore = 1000;

// stringify and formaat return json string for
// cleaner action/engram rendering
const jsonToStr = obj => {
  return JSON.stringify(obj).replace(/\,\"/g, ', "');
};

/**
 * Loads the controls on the page
 */
async function loadControls() {
  return loadMazes().then(() => {
    return loadTeams().then(() => {
      return loadBots($('#selTeam :selected').val()).then(() => {
        logMessage('log', 'READY TO&nbsp;<b>ROCK!</b>', 'The bot editor is ready.');
      });
    });
  });
}

// resets the global game tracking values
function resetTrackingVars() {
  curGame = {};
  totalMoves = 0;
  totalScore = 1000;
}

function loadMazes() {
  console.debug('Loading maze list...');
  return $.getJSON(MAZE_URL + '/get', mazes => {
    $('#selMaze').empty();

    for (const maze of mazes) {
      let opt = "<option value='" + maze.id + "'>";
      opt += `${maze.name} (${maze.height} x ${maze.width})`;
      opt += '</option>';
      $('#selMaze').append(opt);
    }
    return Promise.resolve();
  }).fail(err => {
    logMessage('err', 'ERROR LOADING MAZES', err !== undefined ? `${error.status} - ${error.statusText}` : undefined);
  });
}

function loadTeams() {
  console.log('Loading teams list...');
  return $.getJSON(TEAM_URL + '/get', data => {
    teams = data;
    $('#selTeam').empty();

    for (const team of teams) {
      let opt = "<option value='" + team.id + "'>";
      opt += team.name;
      opt += '</option>';
      $('#selTeam').append(opt);
    }
    return Promise.resolve();
  }).fail(err => {
    logMessage('err', 'ERROR LOADING TEAMS', err.status !== 0 ? `${error.status} - ${error.statusText}` : undefined);
  });
}

async function loadBots(teamId) {
  console.log('Loading bots for team ' + teamId);
  if (!teams || !teamId) return;

  return $.getJSON(TEAM_URL + '/get?id=' + teamId, data => {
    team = data[0];
    $('#selBot').empty();

    for (const bot of team.bots) {
      let botSel = `<option value='${bot.id}' name='${bot.name}'>${bot.name} (${bot.coder})</option>`;
      $('#selBot').append(botSel);
    }

    let debugBotSel = "<option value='jd-test-bot'>";
    debugBotSel += 'jd-test-bot (jd-test-bot)';
    debugBotSel += '</option>';
    $('#selBot').append(debugBotSel);
  })
    .done(() => {
      loadBotVersions($('#selBot :selected').val());
    })
    .fail(err => {
      logMessage('err', 'ERROR LOADING BOTS', err.status !== 0 ? `${error.status} - ${error.statusText}` : undefined);
    });
}

function deleteBotCodeVersion(botId, version) {
  const deleteUrl = TEAM_URL + `/delete/botCode/${botId}/${version}`;
  $.ajax({
    url: deleteUrl,
    dataType: 'json',
    method: 'DELETE',
    success: function() {
      logMessage('wrn', `BOT CODE v${version} DELETED`);
    },
    error: function(error) {
      logMessage('err', `ERROR DELETING BOT CODE v${version}`, error.message === undefined ? `${error.status} - ${error.statusText}` : error.message);
    },
  });
}

/**
 * Populates the version select control with all versions available for the given bot
 *
 * @param {*} botId
 */
function loadBotVersions(botId, autoLoadBot = true) {
  const url = TEAM_URL + '/get/botCode?botId=' + botId;
  console.log('Loading bot versions for botId=' + botId);

  return $.getJSON(url, docs => {
    $('#selBotVersion').empty();
    console.log(`${docs.length} versions found`);
    let versionCount = 0;
    for (const doc of docs.reverse()) {
      versionCount++;
      if (versionCount > 25) {
        deleteBotCodeVersion(botId, doc.version);
      } else {
        $('#selBotVersion').append(`<option value="${doc.version}">${doc.version}</option>`);
      }
    }
  })
    .done(() => {
      if (autoLoadBot) {
        loadBotCode($('#selBot :selected').val());
      }
    })
    .fail(err => {
      if (err.status === 404) {
        versionBotCode(botId, editor.getValue());
      } else {
        logMessage('err', `ERROR LOADING BOT CODE &rsaquo; ${err.status} (${err.statusText})`, `Cannot load code for bot&nbsp;<b>${botId}</b>.`);
      }
    });
}

/**
 * Loads the version of bot  code associated with botId.version - if no
 * version is provided, loads the latest version instead
 *
 * @param {*} botId
 * @param {*} version
 */
function loadBotCode(botId, version) {
  let url = TEAM_URL + '/get/botCode?botId=' + botId;

  // if no version supplied, assume we're getting the latest version
  if (version === undefined) {
    version = -1;
  } else {
    url += `&version=${version}`;
  }

  console.log(`Loading bot code - botId=${botId}, version=${version}`);

  return $.getJSON(url, docs => {
    let botCode;

    // if no version given, find the higest version returned
    if (version === -1) {
      version = docs.sort((first, second) => {
        return parseInt(second.version.replace(/\./g, '')) - parseInt(first.version.replace(/\./g, ''));
      })[0].version;
    }

    console.log(`version = ${version}`);

    // now load the version
    botCode = docs.find(doc => {
      return doc.version === version;
    });

    if (botCode !== undefined) {
      $('#selBotVersion').val(botCode.version);
      let date = new Date(botCode.lastUpdated);

      logMessage(
        'log',
        `"${$('#selBot :selected').attr('name')}" v${botCode.version} Loaded.`,
        `"${$('#selBot :selected').attr('name')}" v${botCode.version} was saved on ${date.toLocaleDateString()} at ${date.toLocaleTimeString()}.`,
      );

      // load the code into the editor
      editor.setValue(botCode.code);

      // and format the code once that's done
      editor.trigger('', 'editor.action.formatDocument');

      setSaveButtonStates(false);
    } else {
      logMessage('wrn', 'BOT CODE NOT FOUND');
    }
  }).fail(err => {
    logMessage('err', `ERROR LOADING BOT CODE &rsaquo; ${err.status} (${err.statusText})`, `Cannot load code for bot&nbsp;<b>${botId}.</b>`);
  });
}

/**
 * Generates a new version of the bot's code and stores it in
 * the bot_code collection.
 *
 * @param {*} botId
 * @param {*} code
 */
function updateBotCode(botId, version, code) {
  const putUrl = TEAM_URL + '/update/botCode';

  $.ajax({
    url: putUrl,
    dataType: 'json',
    timeout: AJAX_TIMEOUT,
    method: 'PUT',
    data: {
      botId: botId,
      version: version,
      code,
    },
    success: function() {
      logMessage('bot', `"${$('#selBot :selected').attr('name')}" v<b>${version}</b>&nbsp;- Updated.`);

      // and format the code once that's done
      editor.trigger('', 'editor.action.formatDocument');
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
 */
function getNextVersion(version) {
  let curVer = version.split('.');
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
 */
function versionBotCode(botId, code) {
  const getUrl = TEAM_URL + '/get/botCode?botId=' + botId;
  const putUrl = TEAM_URL + '/insert/botCode';

  $.getJSON(getUrl, docs => {})
    .done(docs => {
      topVersion = docs.sort((first, second) => {
        return parseInt(second.version.replace(/\./g, '')) - parseInt(first.version.replace(/\./g, ''));
      })[0].version;

      const newVersion = getNextVersion(topVersion);
      console.log('Next Version=' + newVersion);

      $.ajax({
        url: putUrl,
        dataType: 'json',
        timeout: AJAX_TIMEOUT,
        method: 'PUT',
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
    })
    .fail(err => {
      $.ajax({
        url: putUrl,
        dataType: 'json',
        timeout: AJAX_TIMEOUT,
        method: 'PUT',
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
    });
}

/**
 * Adds a formatted message to the output log.
 *
 * @param {*} source log | bot | wrn | err
 * @param {*} header The contents of the header section
 * @param {*} message The contents of the body section
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

function startGame() {
  const mazeId = $('#selMaze').val();
  const teamId = $('#selTeam').val();
  const botId = $('#selBot :selected').val();
  const url = GAME_URL + '/new/' + mazeId + '/' + teamId + '/' + botId + '?forceId=FORCED_JD_EDITOR_002';

  $.ajax({
    url: url,
    dataType: 'json',
    timeout: AJAX_TIMEOUT,
    method: 'PUT', // method is any HTTP method
    data: {}, // data as js object
    success: function(data) {
      $('#textLog').empty();
      $('#actionLog').empty();

      // set tracking vars to new game values
      curGame = data.game;
      totalMoves = data.game.score.moveCount;
      totalScore = data.totalScore;

      // load the minimap
      let mapText = faceAvatar(data.action.outcomes[data.action.outcomes.length - 1], DIRS.SOUTH);
      scaleMiniMap(mapText);

      // log game creation
      logMessage('log', 'Game Created', `gameId ->${data.game.gameId}`);

      // and display the most recent action (new game action)
      renderAction(data);
    },
    error: function(error) {
      if (error.responseJSON && error.responseJSON.message) {
        if (error.responseJSON.message.indexOf('game already exists') >= 0) {
          loadGame(error.responseJSON.gameId);
        } else {
          logMessage('err', 'ERROR STARTING GAME', `${error.status} - ${error.statusText}`);
        }
      } else {
        logMessage('err', 'ERROR STARTING GAME', `${error.status} - ${error.statusText}`);
      }
    },
  });
}

async function loadGame(gameId) {
  const url = GAME_URL + `/get/${gameId}`;

  await $.getJSON(url, data => {
    curGame = data.game;
    totalScore = data.totalScore;
    totalMoves = data.game.score.moveCount;

    // log status
    logMessage('wrn', 'RESUMING GAME IN PROGRESS', `gameId ->${data.game.gameId}`);

    // render the game action
    renderAction(data);

    // load the minimap
    let mapText = faceAvatar(data.action.outcomes[data.action.outcomes.length - 1], data.playerFacing);
    scaleMiniMap(mapText);
    1;
  }).fail(err => {
    logMessage('err', 'ERROR LOADING GAME', err.status !== 0 ? `${error.status} - ${error.statusText}` : undefined);
  });
}

/**
 * Sends the given action to the game server to be processed
 * and returns the resulting data
 *
 * @param {*} action
 */
async function executeAction(action) {
  console.log('executeAction', action);
  const url = GAME_URL + '/action';

  return await $.ajax({
    url: url,
    method: 'PUT', // method is any HTTP method
    dataType: 'json',
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

  // log the local "here" engram
  logMsg += `<h5>ENGRAM.HERE</h5>`;
  logMsg += `<span class='engramData'><b>.exitNorth=</b>${jsonToStr(engram.here.exitNorth)}</span>`;
  logMsg += `<span class='engramData'><b>.exitSouth=</b>${jsonToStr(engram.here.exitSouth)}</span>`;
  logMsg += `<span class='engramData'><b>.exitEast=</b>${jsonToStr(engram.here.exitEast)}</span>`;
  logMsg += `<span class='engramData'><b>.exitWest=</b>${jsonToStr(engram.here.exitWest)}</span>`;
  logMsg += `<span class='engramData'><b>.messages=</b>${jsonToStr(engram.here.messages)}</span>`;
  logMsg += `<span class='engramData'><b>.intuition=</b>${jsonToStr(engram.here.intuition)}</span>`;

  // log directional engrams
  for (const dir in DIRS) {
    if (DIRS[dir] >= DIRS.NORTH && DIRS[dir] <= DIRS.WEST) {
      logMsg += `<h5>ENGRAM.${dir}</h5>`;
      logMsg += `<span class='engramData'><b>.see=</b>${jsonToStr(engram[dir.toLowerCase()].see)}</span>`;
      logMsg += `<span class='engramData'><b>.hear=</b>${jsonToStr(engram[dir.toLowerCase()].hear)}</span>`;
      logMsg += `<span class='engramData'><b>.smell=</b>${jsonToStr(engram[dir.toLowerCase()].smell)}</span>`;
      logMsg += `<span class='engramData'><b>.feel=</b>${jsonToStr(engram[dir.toLowerCase()].feel)}</span>`;
      logMsg += `<span class='engramData'><b>.taste=</b>${jsonToStr(engram[dir.toLowerCase()].taste)}</span>`;
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
    logMessage('err', 'GAME OVER');
    scaleMiniMap(skully);
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

// botId: "A_BOT"
// gameId: "FORCED_JD_EDITOR_002"
// gameMode: 2
// gameState: 1
// mazeStub: {id: "3:3:1:TinTre_v1.0.0", height: 3, width: 3, challenge: 1, name: "Tiny Trek", …}
// score:
// backtrackCount: 0
// bonusPoints: 0
// botId: "A_BOT"
// gameId: "FORCED_JD_EDITOR_002"
// gameMode: 1
// gameResult: 1
// gameRound: 1
// id: "54ea3f805e6fc4b685d525d54f99c4b0"
// lastUpdated: 1561762964184
// mazeId: "3:3:1:TinTre_v1.0.0"
// moveCount: 1
// teamId: "JD_A_TEAM_01"
// trophyStubs: []
// __proto__: Object
// teamId: "JD_A_TEAM_01"
// url: "http://localhost:8080/gameFORCED_JD_EDITOR_002"

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

// validates the syntax of code in the editor
function validateSyntax() {
  let markers = monaco.editor.getModelMarkers();

  if (markers.length > 0) {
    let msg = '<span style="color:antiquewhite">';
    for (const marker of markers) {
      msg += `Line <b>${marker.endLineNumber}</b>, Column <b>${marker.endColumn}</b>: ${marker.message}<br>`;
    }
    msg += '</span>';
    logMessage('wrn', 'Bot Run Aborted - Syntax Error(s) Found', msg);
  }

  return markers.length === 0;
}

// toggles warning queue css classes when sytnax errors exist
function setWarningCues(enabled) {
  if (enabled) {
    $('#editor').addClass('codeWarnings');
    // $('#btnStartBot').addClass('btnDisabled');
    // $('#btnStartBot').removeClass('btnEnabled');
    // $('#btnStartBot').attr('disabled', true);
    // $('#btnDebugBot').addClass('btnDisabled');
    // $('#btnDebugBot').removeClass('btnEnabled');
    // $('#btnDebugBot').attr('disabled', true);
  } else {
    $('#editor').removeClass('codeWarnings');
    // $('#btnStartBot').addClass('btnEnabled');
    // $('#btnStartBot').removeClass('btnDisabled');
    // $('#btnStartBot').attr('disabled', false);
    // $('#btnDebugBot').addClass('btnEnabled');
    // $('#btnDebugBot').removeClass('btnDisabled');
    // $('#btnDebugBot').attr('disabled', false);
  }
}

/**
 * Start the bot...
 */
function startBot(debug = false) {
  // validate and report errors - if any are found, do not continue
  if (!validateSyntax()) {
    return;
  }

  let bot = editor.getValue();

  // save any outstanding changes when run
  if ($('#btnSaveBotCode').hasClass('btnEnabled')) {
    updateBotCode($('#selBot :selected').val(), $('#selBotVersion :selected').val(), editor.getValue());
  }

  // If debugging, inject a debugger; command at the
  // start of the script if one isn't already found elsewhere.
  if (debug && bot.indexOf('debugger;') === -1) {
    bot = 'debugger;\n' + bot;
  }

  // if not debugging, strip out all the debugger; instances
  // before execution
  if (!debug) {
    bot = bot.replace(/debugger;/, '');
  }

  try {
    console.log('bot go ');
    eval(bot);
    console.log('bot no-more-go ');
  } catch (evalErr) {
    console.error(evalErr);
    logMessage('err', `Bot Code Error: ${evalErr.message}`, `${JSON.stringify(evalErr, null, 2)}`);
  }
}

/**
 * Stop the bot..
 */
function stopBot() {
  console.log('Stopping Bot #...');
}

// returns the key name of the given for an iterable
function getObjValName(obj, val) {
  for (const item in obj) {
    if (obj[item] === val) {
      return item;
    }
  }
}

// a list of all selected values in a bitwise iterable
function getSelectedValueNames(obj, val) {
  let vals = [];
  for (const item in obj) {
    if (!!(obj[item] & val)) {
      vals.push(`<b>${item}</b>&nbsp;&nbsp[&nbsp;${obj[item]}&nbsp;]`);
    }
  }
  return vals.join(', ');
}

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

// update the avatar icon with a facing direction, if provided
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

// Enable chrome's data-loss warning if there are unsaved code changes
function setSaveButtonStates(enabled) {
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
