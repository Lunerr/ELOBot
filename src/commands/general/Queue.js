const patron = require('patron.js');
const Constants = require('../../utility/Constants.js');

class Queue extends patron.Command {
  constructor() {
    super({
      names: ['queue', 'q', 'listplayers', 'playerlist', 'lps'],
      groupName: 'general',
      description: 'View the current lobby\'s queue.'
    });
  }

  async run(msg) {
    if (msg.dbLobby.currentGame.isPickingTeams === false) {
      if (msg.dbLobby.currentGame.queuedPlayerIDs.length > 0) {
        let reply = '';
        const queuedIds = msg.dbLobby.currentGame.queuedPlayerIDs;

        for (let i = 0; i < queuedIds.length; i++) {
          reply += msg.client.users.get(queuedIds[i]).tag + '\n';
        }

        return msg.channel.createMessage(reply, { title: `Player List [${queuedIds.length}/${msg.dbLobby.userLimit}]`});
      } else {
        return msg.createErrorReply('The queue is empty.');
      }
    } else {
      const currentGame = msg.dbLobby.currentGame;
      let team1 = '';
      let team2 = '';

      for (let i = 0; i < currentGame.team1.players.length; i++) {
        team1 += msg.client.users.get(currentGame.team1.players[i]).tag + '\n';
        team2 += msg.client.users.get(currentGame.team2.players[i]).tag + '\n';
      }

      return msg.channel.createMessage('**Team 1:** ' + team1 + '\n\n' +
                                      '**Team 2:** ' + team2 + '\n\n' +
                                      '**Player Pool**\n' +
                                      team1 + team2);
    }
  }
}

module.exports = new Queue();
