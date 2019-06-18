const GAME_URL = 'http://localhost:8080/game';
const MAZE_URL = 'http://mazemasterjs.com/api/maze';
const TEAM_URL = 'http://mazemasterjs.com/api/team';

let curGame;
let actionQueue = [];
let totalMoves = 0;
let totalScore = 1000;

// const loadMazes = new Promise(function(resolve, reject) {

// })
function loadMazes() {
    console.log('Loading maze list...');
    return $.getJSON(MAZE_URL + '/get', (mazes) => {
        for (const maze of mazes) {
            let opt = "<option value='" + maze.id + "'>";
            opt += maze.name + ' (' + maze.height + ' x ' + maze.width + ')';
            opt += '</option>';
            $('#selMaze').append(opt);
        }
    })
        .done(() => {
            return Promise.resolve();
        })
        .fail((err) => {
            logError('ERROR LOADING MAZES', err.status + ' - ' + err.statusText);
            return Promise.reject(err);
        });
}

function loadTeams() {
    console.log('Loading teams list...');
    return $.getJSON(TEAM_URL + '/get', (data) => {
        teams = data;
        for (const team of teams) {
            let opt = "<option value='" + team.id + "'>";
            opt += team.name;
            opt += '</option>';
            $('#selTeam').append(opt);
        }
    })
        .done(() => {
            return Promise.resolve();
        })
        .fail((err) => {
            logError('ERROR LOADING TEAMS', err.status + ' - ' + err.statusText);
            return Promise.reject(err);
        });
}

function loadBots(teamId) {
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
    })
        .done(() => {
            return Promise.resolve();
        })
        .fail((err) => {
            logError('ERROR LOADING BOTS', err.status + ' - ' + err.statusText);
            return Promise.reject(err);
        });
}

async function loadControls() {
    loadMazes().then(() => {
        loadTeams().then(() => {
            loadBots($('#selTeam :selected').val()).then(() => {
                logMessage('READY TO ROCK!', 'Action Queue is empty and waiting - start a new game or run your bot!');
            });
        });
    });
    loadTeams();
}

function logBotMsg(message) {
    const textLog = $('#textLog');
    let htmlOut = '<p class="botMsgHdr">A MESSAGE FROM YOUR BOT</p>';
    if (message) htmlOut += '<p class="botMsgBdy">' + message + '</p>';
    textLog.append(htmlOut);
    textLog.scrollTop(textLog[0].scrollHeight);
}

function logMessage(header, message) {
    const textLog = $('#textLog');
    let htmlOut = '<p class="msgHdr">' + header + '</p>';
    if (message) htmlOut += '<p class="msgBdy">' + message + '</p>';
    textLog.append(htmlOut);
    textLog.scrollTop(textLog[0].scrollHeight);
}

function logError(header, message) {
    const textLog = $('#textLog');
    let htmlOut = '<p class="errHdr">' + header + '</p>';
    if (message) htmlOut += '<p class="errBdy">' + message + '</p>';
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
        timeout: 500,
        method: 'PUT', // method is any HTTP method
        data: {}, // data as js object
        success: function(data) {
            $('#textLog').empty();
            $('#actionLog').empty();
            logMessage('Game Created', 'Game.Id :: ' + data.game.gameId);
        },
        error: function(error) {
            if (error.responseJSON && error.responseJSON.message) {
                if (error.responseJSON.message.indexOf('game already exists') >= 0) {
                    logError('GAME IN PROGRESS', 'Game.Id :: ' + error.responseJSON.gameId);
                } else {
                    logError('ERROR STARTING GAME', error.status + ' - ' + error.statusText);
                }
            } else {
                logError('ERROR STARTING GAME', error.status + ' - ' + error.statusText);
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
                // report command and direction
                let logMsg = 'Command: ' + Object.keys(COMMANDS)[data.command] + '<br />';
                logMsg += 'Direction: ' + Object.keys(DIRS)[data.direction] + '<br />';

                // include message if one was given
                if (data.message !== '') logMsg += 'Message: ' + data.message + '<br />';

                // add outcomes to the log
                logMsg += 'OUTCOME:<br />';
                for (let pos = 0; pos < data.outcomes.length - 2; pos++) {
                    logMsg += pos + 1 + ': ' + data.outcomes[pos] + '<br />';
                }

                // track total move count and score
                totalMoves += data.moveCount;
                totalScore += data.score;

                // now dump it all in the log
                logMessage('ACTION ' + totalMoves + ', SCORE: ' + totalScore, logMsg);

                // DEBUG STUFF : SHOW MAP AND LIST TROPHIES
                $('#actionLog').empty();
                $('#actionLog').append('MAP:<br/><pre style="text-align:center">' + data.outcomes[data.outcomes.length - 1] + '</pre>');
                $('#actionLog').append('TROPHIES:<br/>');
                for (const trophy of data.trophies) {
                    $('#actionLog').append(trophy.id + '<br />');
                }

                return Promise.resolve(data);
            },
            error: function(error) {
                console.log('Error: ' + JSON.stringify(error));
                logError('ACTION ERROR', error.responseJSON.message);
            }
        });
    }

    logMessage('ACTION QUEUE EMPTY');
}
