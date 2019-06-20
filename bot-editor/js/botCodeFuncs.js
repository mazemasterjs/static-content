const GAME_URL = 'http://mazemasterjs.com/game';
const MAZE_URL = 'http://mazemasterjs.com/api/maze';
const TEAM_URL = 'http://mazemasterjs.com/api/team';

function loadBotCode(botId, version) {
    console.log('Loading bot code - botId=' + botId + ', version=' + version);
    const url = CODE_URL + '/get/botCode?botId=' + botId;

    return $.getJSON(CODE_URL, (codeDocs) => {
        $('#selBotVersion').empty();
        for (const codeDoc of codeDocs) {
            let opt = "<option value='" + codeDoc.version + "'>";
            opt += codeDoc.version;
            opt += '</option>';
            $('#selBotVersion').append(opt);
        }
    })
        .done(() => {
            return Promise.resolve();
        })
        .fail((err) => {
            logError('ERROR LOADING BOT VERSIONS', err.status + ' - ' + err.statusText);
            return Promise.reject(err);
        });
}

function saveBotCode() {
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
