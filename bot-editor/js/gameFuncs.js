//const GAME_URL = 'http://mazemasterjs.com/game';
const GAME_URL = 'http://localhost:8080/game';
const MAZE_URL = 'http://mazemasterjs.com/api/maze';
const TEAM_URL = 'http://mazemasterjs.com/api/team';
// const TEAM_URL = 'http://localhost:8083/api/team';

let curGame;
let lastAction;
let actionQueue = [];
let totalMoves = 0;
let totalScore = 1000;

/**
 * Loads the controls on the page
 */
async function loadControls() {
    return loadMazes().then(() => {
        return loadTeams().then(() => {
            return loadBots($('#selTeam :selected').val()).then(() => {
                logMessage('log', 'READY TO&nbsp;<b>ROCK!</b>');
            });
        });
    });
}

function loadMazes() {
    console.debug('Loading maze list...');
    return $.getJSON(MAZE_URL + '/get', (mazes) => {
        $('#selMaze').empty();
        for (const maze of mazes) {
            let opt = "<option value='" + maze.id + "'>";
            opt += maze.name + ' (' + maze.height + ' x ' + maze.width + ')';
            opt += '</option>';
            $('#selMaze').append(opt);
        }
        return Promise.resolve();
    }).fail((err) => {
        logMessage('err', 'ERROR LOADING MAZES', err !== undefined ? err.status + ' - ' + err.statusText : undefined);
    });
}

function loadTeams() {
    console.log('Loading teams list...');
    return $.getJSON(TEAM_URL + '/get', (data) => {
        teams = data;
        $('#selTeam').empty();
        for (const team of teams) {
            let opt = "<option value='" + team.id + "'>";
            opt += team.name;
            opt += '</option>';
            $('#selTeam').append(opt);
        }
        return Promise.resolve();
    }).fail((err) => {
        logMessage('err', 'ERROR LOADING TEAMS', err.status !== 0 ? err.status + ' - ' + err.statusText : undefined);
    });
}

async function loadBots(teamId) {
    console.log('Loading bots for team ' + teamId);
    if (!teams || !teamId) return;

    return $.getJSON(TEAM_URL + '/get?id=' + teamId, (data) => {
        team = data[0];
        $('#selBot').empty();
        for (const bot of team.bots) {
            let botSel = "<option value='" + bot.id + "'>";
            botSel += bot.name + ' (' + bot.coder + ')';
            botSel += '</option>';
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
        .fail((err) => {
            logMessage('err', 'ERROR LOADING BOTS', err.status !== 0 ? err.status + ' - ' + err.statusText : undefined);
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
        }
    });
}

/**
 * Populates the version select control with all versions available for the given bot
 *
 * @param {*} botId
 */
function loadBotVersions(botId) {
    const url = TEAM_URL + '/get/botCode?botId=' + botId;
    console.log('Loading bot versions for botId=' + botId);

    return $.getJSON(url, (docs) => {
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
            loadBotCode($('#selBot :selected').val());
        })
        .fail((err) => {
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

    console.log('Loading bot code - botId=' + botId + ', version=' + version);

    return $.getJSON(url, (docs) => {
        let botCode;

        // if no version given, find the higest version returned
        if (version === -1) {
            version = docs.sort((first, second) => {
                return parseInt(second.version.replace(/\./g, '')) - parseInt(first.version.replace(/\./g, ''));
            })[0].version;
        }

        console.log(`version = ${version}`);

        // now load the version
        botCode = docs.find((doc) => {
            return doc.version === version;
        });

        if (botCode !== undefined) {
            console.log('Bot Loaded: ' + JSON.stringify(botCode));
            $('#selBotVersion').val(botCode.version);
            logMessage('log', `BOT CODE v${botCode.version} LOADED!`);
            editor.setValue(botCode.code);
        } else {
            logMessage('wrn', 'BOT CODE NOT FOUND');
        }
    }).fail((err) => {
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
    console.log(`updateBotCode(botId: ${botId}, version: ${version}, code: ${code.substring(0, 100)}`);
    const putUrl = TEAM_URL + '/update/botCode';

    $.getJSON(getUrl, (docs) => {})
        .done((docs) => {
            const newVersion = docs.reverse()[0].version + 1;
            console.log('top version: ' + newVersion);

            $.ajax({
                url: putUrl,
                dataType: 'json',
                timeout: 1000,
                method: 'PUT',
                data: {
                    botId: botId,
                    version: version,
                    code
                },
                success: function() {
                    logMessage('log', `BOT v${newVersion} SAVED`);
                },
                error: function(error) {
                    logMessage('err', 'ERROR SAVING BOT', error.status + ' - ' + error.statusText);
                }
            });
        })
        .fail((err) => {
            if (err.status === 404) {
                asdf;
            } else {
                logMessage(
                    'err',
                    `ERROR GENERATING NEW BOT VERSION &rsaquo; ${err.status} (${err.statusText})`,
                    `Unable to determine latest bot version for&nbsp;<b>${botId}</b>.`
                );
            }
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

    $.getJSON(getUrl, (docs) => {})
        .done((docs) => {
            topVersion = docs.sort((first, second) => {
                return parseInt(second.version.replace(/\./g, '')) - parseInt(first.version.replace(/\./g, ''));
            })[0].version;

            const newVersion = getNextVersion(topVersion);
            console.log('Next Version=' + newVersion);

            $.ajax({
                url: putUrl,
                dataType: 'json',
                timeout: 1000,
                method: 'PUT',
                data: {
                    botId: botId,
                    version: newVersion,
                    code
                },
                success: function() {
                    logMessage('bot', `MouseBot: I am now v<b>${newVersion}</b>!`);
                },
                error: function(error) {
                    if (error.status !== 404) {
                        logMessage('err', 'ERROR SAVING BOT', error.status + ' - ' + error.statusText);
                    } else {
                        console.log('New Bot - create base code version.');
                    }
                }
            }).done(() => {
                loadBotVersions(botId);
            });
        })
        .fail((err) => {
            $.ajax({
                url: putUrl,
                dataType: 'json',
                timeout: 1000,
                method: 'PUT',
                data: {
                    botId: botId,
                    version: '0.0.1',
                    code
                },
                success: function() {
                    logMessage('bot', `MouseBot&nbsp;<b>v0.0.1</b>&nbsp;Activated!`);
                    if ($('#selBotVersion').children().length === 0) {
                        $('#selBotVersion').append(`<option value="${botId}">0.0.1</option>`);
                    }
                },
                error: function(error) {
                    logMessage('err', 'ERROR INITIALIZING BOT', `${error.status} - ${error.statusText} initializing bot&nbsp;<b>${botId}</span>`);
                }
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
    const hdr = `${source}MsgHdr`;
    const bdy = `${source}MsgBdy`;
    const emp = `${source}MsgEmp`;

    if (source === 'bot') {
        'MouseBot Says: '.concat(header);
    }

    // headers are always uppercase
    //    header = header.toUpperCase();

    // build the html content
    let htmlOut = `<p class="${hdr}">${header}</p>`;

    if (message !== undefined) {
        htmlOut += `<p class="${bdy}">${message}</p>`;
    }

    // added it to the log
    textLog.append(htmlOut);

    // and scroll to the bottom
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
        timeout: 1000,
        method: 'PUT', // method is any HTTP method
        data: {}, // data as js object
        success: function(data) {
            $('#textLog').empty();
            $('#actionLog').empty();
            curGame = data;
            logMessage('log', 'Game Created', 'Game.Id :: ' + data.game.gameId);
        },
        error: function(error) {
            if (error.responseJSON && error.responseJSON.message) {
                if (error.responseJSON.message.indexOf('game already exists') >= 0) {
                    logMessage('err', 'GAME IN PROGRESS', 'Game.Id :: ' + error.responseJSON.gameId);
                } else {
                    logMessage('err', 'ERROR STARTING GAME', error.status + ' - ' + error.statusText);
                }
            } else {
                logMessage('err', 'ERROR STARTING GAME', error.status + ' - ' + error.statusText);
            }
        }
    });
}

function queueAction(gameId, command, direction, message) {
    actionQueue.push({
        gameId: gameId,
        command: command,
        direction: direction,
        message: message
    });
}

async function processActionQueue() {
    const url = GAME_URL + '/action';
    while (actionQueue.length > 0) {
        action = actionQueue.shift();

        await $.ajax({
            url: url,
            method: 'PUT', // method is any HTTP method
            dataType: 'json',
            data: action,
            success: function(data) {
                lastAction = data;
                renderAction(data);
                return Promise.resolve(data);
            },
            error: function(error) {
                console.log('Error: ' + JSON.stringify(error));
                logMessage('err', 'ACTION ERROR', error.responseJSON.message);
            }
        });
    }

    logMessage('log', 'ACTION QUEUE EMPTY');
}

function renderAction(action) {
    // report command and direction
    // let logMsg = '<pre>';
    // logMsg += JSON.stringify(action, null, 2);
    // logMsg += '</pre>';
    let logMsg = '<div class="actionBody">';

    logMsg += `Command: ${getObjValName(COMMANDS, action.command)} `;
    logMsg += `Direction: ${getObjValName(DIRS, action.direction)}`;

    logMsg += `Sight: ${action.engram.sight}`;
    logMsg += `Sound: ${action.engram.sound}</br>`;
    logMsg += `Smell: ${action.engram.smell}</br>`;
    logMsg += `Touch: ${action.engram.touch}</br>`;
    logMsg += `Taste: ${action.engram.taste}</br>`;
    logMsg += '</div>';

    // include message if one was given
    if (action.message !== '') logMsg += 'Message: ' + action.message + '<br />';

    // add outcomes to the log
    logMsg += 'OUTCOMES:<br />';
    for (let pos = 0; pos < action.outcomes.length - 2; pos++) {
        logMsg += pos + 1 + ': ' + action.outcomes[pos] + '<br />';
    }

    // track total move count and score
    totalMoves += action.moveCount;
    totalScore += action.score;

    // now dump it all in the log
    console.log(logMsg);
    logMessage('log', `${getCommandIcon(action.command)} ${getDirectionIcon(action.direction)} MOVE #${totalMoves},  SCORE: ${totalScore}`, logMsg);

    // DEBUG STUFF : SHOW MAP AND LIST TROPHIES
    $('#miniMapContent').empty();
    $('#miniMapContent').append(`<pre>${action.outcomes[action.outcomes.length - 1]}</pre>`);
}

function getCommandIcon(command) {
    switch (command) {
        case COMMANDS.NONE:
            return '<span class="ui-icon ui-icon-cancel"></span>';
        case COMMANDS.FACE:
            return '<span class="ui-icon ui-icon-refresh"></span>';
        case COMMANDS.LISTEN:
            return '<span class="ui-icon ui-icon-volume-on"></span>';
        case COMMANDS.LOOK:
            return '<span class="ui-icon ui-icon-search"></span>';
        case COMMANDS.SIT:
            return '<span class="ui-icon ui-icon-arrowstop-1-s"></span>';
        case COMMANDS.SNIFF:
            return '<span class="ui-icon ui-icon-caret-2-e-w"></span>';
        case COMMANDS.STAND:
            return '<span class="ui-icon ui-icon-arrowstop-1-n"></span>';
        case COMMANDS.TURN:
            return '<span class="ui-icon ui-icon-refresh"></span>';
        case COMMANDS.MOVE:
            return '<span class="ui-icon ui-icon-transfer-e-w"></span>';
        case COMMANDS.JUMP:
            return '<span class="ui-icon ui-icon-eject"></span>';
        case COMMANDS.WAIT:
            return '<span class="ui-icon ui-icon-clock"></span>';
        case COMMANDS.WRITE:
            return '<span class="ui-icon ui-icon-pencil"></span>';
        case COMMANDS.QUIT:
            return '<span class="ui-icon ui-icon-power"></span>';
    }
    return '';
}

function getDirectionIcon(direction) {
    switch (direction) {
        case DIRS.NONE:
            return '<span class="ui-icon ui-icon-arrow-4-diag"></span>';
        case DIRS.NORTH:
            return '<span class="ui-icon ui-icon-triangle-1-n"></span>';
        case DIRS.SOUTH:
            return '<span class="ui-icon ui-icon-triangle-1-s"></span>';
        case DIRS.EAST:
            return '<span class="ui-icon ui-icon-triangle-1-e"></span>';
        case DIRS.WEST:
            return '<span class="ui-icon ui-icon-triangle-1-w"></span>';
        case DIRS.LEFT:
            return '<span class="ui-icon ui-icon-arrowrefresh-1-w"></span>';
        case DIRS.RIGHT:
            return '<span class="ui-icon ui-icon-arrowrefresh-1-e"></span>';
    }
    return '';
}

/**
 * Start the bot...
 */
function startBot() {
    console.log('Starting bot...');
    const bot = editor.getValue();
    eval(bot);
    processActionQueue();
}

/**
 * Stop the bot..
 */
function stopBot() {
    console.log('Stopping Bot #...');
}

// returns the value
function getObjValName(obj, val) {
    for (const item in obj) {
        if (obj[item] === val) {
            return item;
        }
    }
}
