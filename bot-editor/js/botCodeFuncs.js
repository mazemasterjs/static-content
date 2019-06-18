const GAME_URL = 'http://localhost:8080/game';
const MAZE_URL = 'http://mazemasterjs.com/api/maze';
const TEAM_URL = 'http://mazemasterjs.com/api/team';

function startGame() {
    prepend('Starting game...');

    const mazeId = $('#selMaze').val();
    const teamId = $('#selTeam').val();
    const botId = $('#selBot :selected').val();
    const url = GAME_URL + '/new/' + mazeId + '/' + teamId + '/' + botId + '?forceId=FORCED_JD_EDITOR_002';

    $.ajax({
        url: url,
        method: 'PUT', // method is any HTTP method
        data: {}, // data as js object
        success: function(data) {
            console.log('success');
            logMessage(JSON.stringify(data));
        },
        error: function(error) {
            console.log('error');
            logError('Error: ' + error.responseJSON.message);
        }
    });
}
