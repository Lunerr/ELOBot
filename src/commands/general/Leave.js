const patron = require('patron.js');
const Constants = require('../../utility/Constants.js');

class Leave extends patron.Command {
  constructor() {
    super({
      names: ['leave', 'l', 'out', 'unsign', 'remove', 'unready'],
      groupName: 'general',
      description: 'Leave the current lobby\'s queue.'
    });
  }

  async run(msg) {
    if (msg.dbLobby.isALobby === false) {
      return msg.createErrorReply('this channel is not a lobby.');
    }
    
    if (msg.dbLobby.currentGame.queuedPlayerIDs.includes(msg.author.id)) {
      if (msg.dbLobby.currentGame.isPickingTeams === true) {
        return msg.createErrorReply('Currently picking teams. Please wait until this is completed.');
      }

      const update = new msg.client.db.updates.Pull('currentGame.queuedPlayerIDs', msg.author.id);

      await msg.client.db.lobbyRepo.upsertLobby(msg.channel.id, update);

      const newLobby = await msg.client.db.lobbyRepo.getLobby(msg.channel.id);

      const queuedIds = newLobby.currentGame.queuedPlayerIDs;

      return msg.channel.createMessage(`[${queuedIds.length}/${msg.dbLobby.userLimit}] Removed ${msg.author} from queue.`);
    }

    return msg.createErrorReply('You cannot leave a lobby you aren\'t queued for.');
  }
}

module.exports = new Leave();
