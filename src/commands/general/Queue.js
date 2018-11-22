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
    if (msg.dbLobby.isALobby === false) {
      return msg.createErrorReply('this channel is not a lobby.');
    }

    if (msg.dbLobby.currentGame.isPickingTeams === false) {
      if (msg.dbLobby.currentGame.queuedPlayerIDs.length > 0) {
        let reply = '';
        const queuedIds = msg.dbLobby.currentGame.queuedPlayerIDs;

        for (let i = 0; i < queuedIds.length; i++) {
          reply += queuedIds[i].mention() + '\n';
        }

        return msg.channel.createMessage(reply, { title: `Player List [${queuedIds.length}/${msg.dbLobby.userLimit}]`});
      } else {
        return msg.createErrorReply('The queue is empty.');
      }
    } else {
      const currentGame = msg.dbLobby.currentGame;
      let team1 = '';
      let team2 = '';
      let playerPool = '';

      for (let i = 0; i < msg.dbLobby.userLimit; i++) {
        team1 += currentGame.team1.players[i] !== undefined ? currentGame.team1.players[i].mention() + ', ' : '';
        team2 += currentGame.team2.players[i] !== undefined ? currentGame.team2.players[i].mention() + ', ' : '';
      }

      for (let i = 0; i < currentGame.queuedPlayerIDs.length; i++) {
        playerPool += currentGame.queuedPlayerIDs[i].mention() + ' | ';
      }

      return msg.channel.createMessage('**Team 1:** ' + team1.substring(0, team1.length - 2) + '\n\n' +
                                      '**Team 2:** ' + team2.substring(0, team2.length - 2) + '\n\n' +
                                      '**Player Pool**\n' +
                                      playerPool.substring(0, playerPool.length - 2));
    }
  }
}

module.exports = new Queue();
