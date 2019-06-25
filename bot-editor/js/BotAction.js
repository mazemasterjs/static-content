/**
 * Sends a command to the MazeMasterJS Game Server
 *
 * @param {action} action Actions include a command, a direction, and an optional message.
 */
async function sendAction(action) {
    console.log(`Sending action to game #${curGame.gameId}. Action: ${JSON.stringify(action)}`);

    if (!action) {
        const err = new Error('Missing Action - You must supply an action object.');
        logMessage('err', 'Invalid Action', err.message);
        return Promise.reject(err);
    }

    if (!action.command || action.command.trim() === '') {
        let err = new Error('Missing action.command - Your action must include a command.');
        logMessage('err', 'Missing action.command', err.message);
        return Promise.reject(err);
    }

    if (!curGame.gameId || curGame.gameId.trim() === '') {
        let err = new Error('Invalid Game - sendAction() requires an a valid gameId.');
        logMessage('err', 'Invalid Game', err.message);
        return Promise.reject(err);
    } else {
        action.gameId = curGame.gameId;
    }

    return await executeAction(action)
        .then((data) => {
            // console.log('BotAction.sendAction() -> gameFuncs.executeAction Response: ' + JSON.stringify(data));
            return Promise.resolve(data);
        })
        .catch((error) => {
            // console.log('BotAtion.sendAction() -> gameFuncs.executeAction Error: ' + JSON.stringify(error));
            return Promise.reject(error);
        });
}

/**
 * Sends a command to the MazeMasterJS Game Server
 *
 * @param {action} action Actions include a command, a direction, and an optional message.
 * @param {action} callback The functoin to call back to with response data.
 */
async function startActionChain(action, callback) {
    console.log(`Sending action to game #${curGame.gameId}. Action: ${JSON.stringify(action)}`);

    if (!action) {
        const err = new Error('Missing Action - You must supply an action object.');
        logMessage('err', 'Invalid Action', err.message);
        throw err;
    }

    if (!action.command || action.command.trim() === '') {
        let err = new Error('Missing action.command - Your action must include a command.');
        logMessage('err', 'Missing action.command', err.message);
        throw err;
    }

    if (!callback) {
        let err = new Error('Missing callback - startActionChain() requires a callback function.');
        logMessage('err', 'Missing callback', err.message);
        throw err;
    }

    if (!curGame || !curGame.gameId || curGame.gameId.trim() === '') {
        let err = new Error('Invalid Game - No game is currently in progress.');
        logMessage('err', 'Invalid Game', err.message);
        throw err;
    } else {
        action.gameId = curGame.gameId;
    }

    return await executeAction(action)
        .then((data) => {
            console.log('BotAction.startActionChain() -> gameFuncs.executeAction Response: ' + JSON.stringify(data));
            callback(data);
        })
        .catch((error) => {
            if (error.status === 404) {
                logMessage('err', 'Game Not Found', `Game ${curGame.gameId} was not found. Please start a new game and try again.`);
                throw error;
            } else {
                console.log('BotAtion.startActionChain() -> gameFuncs.executeAction Error: ' + JSON.stringify(error));
                callback(error);
            }
        });
}
