let teams;
let curMaze;
const curLoc = {row: 0, col: 0};
const prevLoc = {row: 0, col: 0};

function movePlayer(newRow, newCol, dir) {
    // store previous location
    prevLoc.row = curLoc.row;
    prevLoc.col = curLoc.col;

    // set new location
    curLoc.row = newRow;
    curLoc.col = newCol;

    // grab the right cell elements
    const prevLocDiv = $('#' + prevLoc.row + '-' + prevLoc.col);
    const curLocDiv = $('#' + curLoc.row + '-' + curLoc.col);

    const prevCell = curMaze.cells[prevLoc.row][prevLoc.col];
    const curCell = curMaze.cells[curLoc.row][curLoc.col];

    // clean up the previous (now empty) cell
    styleCellDiv(prevCell, prevLocDiv, curLoc);

    // update the newly, rat-filled cell
    styleCellDiv(curCell, curLocDiv, curLoc);

    // remark the path if player stepped on it
    if (!!(curCell.tags & CELL_TAGS.PATH) || !!(prevCell.tags & CELL_TAGS.PATH)) {
        console.log('Player marred the path, redrawing..');
        markPath(curMaze, curMaze.cells[curMaze.startCell.row][curMaze.startCell.col], DIRS.NONE);
    }
}

function startBotGame(teamId, botId, mazeId) {}
function doAction(command, direction, message) {}

function loadTeamSelect() {
    console.log('Loading teams list...');
    $.getJSON('http://mazemasterjs.com/api/team/get', (data) => {
        teams = data;
        for (const team of teams) {
            let opt = "<option value='" + team.id + "'>";
            opt += team.name;
            opt += '</option>';
            $('#selTeam').append(opt);
        }
        loadBotSelect(teams[0].id);
    });
}

function loadBotSelect(teamId) {
    console.log('Loading bots for team ' + teamId);
    if (!teams || !teamId) return;

    $('#selBot').empty();
    const team = teams.find((team) => {
        return team.id === teamId;
    });

    for (const bot of team.bots) {
        let botSel = "<option val='" + bot.id + "'>";
        botSel += bot.name + ' (' + bot.coder + ')';
        botSel += '</option>';
        $('#selBot').append(botSel);
    }
}

function loadGameSelect() {
    console.log('Loading active games list...');
    $.getJSON('http://mazemasterjs.com/game/get', (games) => {
        console.log(games);
        return;
        for (const game of games) {
            let opt = "<option value='" + game.id + "'>";
            opt += game.team.name + ' : ' + game.maze.name;
            opt += '</option>';
            $('#selGame').append(opt);
        }
    });
}

/**
 * Load all maze stub data from the maze-service
 *
 * @param {*} mazeId
 */
function loadMazeSelect() {
    console.log('Loading maze list...');
    $.getJSON('http://mazemasterjs.com/api/maze/get', (mazes) => {
        for (const maze of mazes) {
            let opt = "<option value='" + maze.id + "'>";
            opt += maze.name + ' (' + maze.height + ' x ' + maze.width + ')';
            opt += '</option>';
            $('#selMaze').append(opt);
        }

        loadMaze($('#selMaze option:selected').val());
    });
}

/**
 * Load the requested maze from the maze-service
 *
 * @param {*} mazeId
 */
function loadMaze(mazeId) {
    console.log('Loading maze ' + mazeId);
    $('#loadingScreen').toggle();

    $.getJSON('http://mazemasterjs.com/api/maze/get?id=' + mazeId, (data) => {
        // set the maze global
        curMaze = data[0];

        $(':root').css('--rows', curMaze.cells.length);
        $(':root').css('--cols', curMaze.cells[0].length);

        // set player location to start cell
        curLoc.row = curMaze.startCell.row;
        curLoc.col = curMaze.startCell.col;

        // $('#textRender').text(curMaze.textRender);

        // render the maze
        renderMaze(curMaze);

        // hide the loading screen
        $('#loadingScreen').toggle();
    });
}

/**
 * Returns the opposite direction
 *
 * @param {*} dir
 */
function reverseDir(dir) {
    switch (dir) {
        case DIRS.NORTH: {
            return DIRS.SOUTH;
        }
        case DIRS.SOUTH: {
            return DIRS.NORTH;
        }
        case DIRS.EAST: {
            return DIRS.WEST;
        }
        case DIRS.WEST: {
            return DIRS.EAST;
        }
        default: {
            return DIRS.NONE;
        }
    }
}
