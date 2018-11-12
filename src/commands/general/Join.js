const patron = require('patron.js');
const Constants = require('../../utility/Constants.js');

class Join extends patron.Command {
  constructor() {
    super({
      names: ['join', 'j', 'sign', 'play', 'rdy', 'ready'],
      groupName: 'general',
      description: 'Join the current lobby\'s queue.'
    });
  }

  async run(msg) {
    if (msg.dbLobby.currentGame.queuedPlayerIDs.includes(msg.author.id)) {
      return msg.createErrorReply('You are already queued for this lobby.');
    }

    if (msg.dbUser.ban.banned === true) {
      return msg.createErrorReply('You are banned from matchmaking for another ' + msg.dbUser.ban.expireTime - Date.now() + '.');
    }

    if (msg.dbLobby.currentGame.isPickingTeams === true) {
      return msg.createErrorReply('Currently picking teams. Please wait until this is completed.');
    }

    const update = new msg.client.db.updates.Push('currentGame.queuedPlayerIDs', msg.author.id);

    await msg.client.db.lobbyRepo.upsertLobby(msg.channel.id, update);

    const newLobby = await msg.client.db.lobbyRepo.getLobby(msg.channel.id);

    const queuedIds = newLobby.currentGame.queuedPlayerIDs;

    if (msg.dbLobby.userLimit <= queuedIds.length) {
      for (let i = 0; i < queuedIds.length; i++) {
        if (msg.guild.members.find(x => x.id === queuedIds[i]) === null) {
          await msg.client.db.lobbyRepo.deleteLobby(msg.channel.id);
          return msg.channel.createMessage('Game aborted, missing player in queue.');
        }

        if (msg.dbLobby.pickMode === Constants.config.pickMode.completeRandom) {
          const shuffled = queuedIds.sort(() => 0.5 - Math.random());
          const team1 = shuffled.splice(0, 5);
          const team2 = shuffled.splice(0, 5);

          await msg.client.db.lobbyRepo.upsertLobby(msg.channel.id, { $set: { 'currentGame.team1': team1 } });
          await msg.client.db.lobbyRepo.upsertLobby(msg.channel.id, { $set: { 'currentGame.team2': team2 } });

          let team1reply = '';
          let team2reply = '';

          for (let i = 0; i < team1.length; i++) {
            team1reply += msg.client.users.get(team1[i]).tag + '\n';
            team2reply += msg.client.users.get(team2[i]).tag + '\n';
          }

          return msg.channel.createMessage('**Game has started**\n' +
                                            '**Team1**: ' + team1reply + '\n' +
                                            '**Team2**: ' + team2reply + '\n');
        }
      }
    } else {
      return msg.channel.createMessage(`[${queuedIds.length}/${msg.dbLobby.userLimit}] Added ${msg.author} to queue.`);
    }
  }
}

module.exports = new Join();
