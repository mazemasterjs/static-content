/**
 * Sends a command to the MazeMasterJS Game Server
 *
 * @param {action} action Actions include a command, a direction, and an optional message.
 */
async function sendAction(action) {
  console.log(`Sending action to game #${curGame.gameId}. Action: ${JSON.stringify(action)}`);

  if (!action) {
    logMessage('err', 'Invalid Action', 'You must supply an action to send!');
    throw new Error(
      'sendAction requires an action parameter.  Example: <b>sendAction</b>(<i>myAction</i>) or <b>sendAction</b>(<i>{command: "look", direction: "north", message:""}</i>);',
    );
  }

  if (!curGame.gameId || curGame.gameId.trim() === '') {
    logMessage('err', 'Invalid Game', 'You need an active game before you can send actions.');
    let err = new Error('sendAction requires an a valid gameId.');
    return Promise.reject(err);
  } else {
    action.gameId = curGame.gameId;
  }

  if (!action.command) {
    logMessage('err', 'Invalid Command', 'Your action must include a command. Example: {<b>command</b>: "look", direction: "north", message:""}');
    let err = new Error('BotAction: INVALID COMMAND');
    return Promise.reject(err);
  }

  return await executeAction(action)
    .then(data => {
      console.log('BotAction.sendCommand() -> executeAction Response: ' + JSON.stringify(data));
      return Promise.resolve(data);
    })
    .catch(error => {
      console.log('BotAtion.sendCommand() -> executeAction Error: ' + JSON.stringify(error));
      return Promise.reject(error);
    });
}
