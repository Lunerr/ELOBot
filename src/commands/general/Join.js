const patron = require('patron.js');
const Constants = require('../../utility/Constants.js');
const Random = require('../../utility/Random.js');

class Join extends patron.Command {
  constructor() {
    super({
      names: ['join', 'j', 'sign', 'play', 'rdy', 'ready'],
      groupName: 'general',
      description: 'Join the current lobby\'s queue.'
    });
  }

  async run(msg) {
    if (msg.dbLobby.isALobby === false) {
      return msg.createErrorReply('this channel is not a lobby.');
    }

    if (msg.dbLobby.currentGame.queuedPlayerIDs.includes(msg.author.id)) {
      return msg.createErrorReply('You are already queued for this lobby.');
    }

    if (msg.dbUser.registered === false) {
      return msg.createErrorReply('you have not registered yet.');
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

        const currentGame = msg.dbLobby.currentGame;
        const players = [];

        for (let i = 0; i < currentGame.queuedPlayerIDs.length; i++) {
          players.push(await msg.client.db.userRepo.getUser(currentGame.queuedPlayerIDs[i], msg.guild.id));
        }
    
        players.sort((a, b) => b.score.points - a.score.points);
    
        const top4 = players.slice(0, 4);

        const captain1 = Random.arrayElement(top4);
        const capt1Index = top4.indexOf(captain1);

        top4.splice(capt1Index, 1);
        
        const captain2 = Random.arrayElement(top4);

        // set captains for their teams
        await msg.client.db.lobbyRepo.upsertLobby(msg.channel.id, { $set: { 'currentGame.team1.captain': captain1.userId } });
        await msg.client.db.lobbyRepo.upsertLobby(msg.channel.id, { $set: { 'currentGame.team2.captain': captain2.userId } });

        // push captains into their teams
        await msg.client.db.lobbyRepo.upsertLobby(msg.channel.id, { $push: { 'currentGame.team1.players': captain1.userId } });
        await msg.client.db.lobbyRepo.upsertLobby(msg.channel.id, { $push: { 'currentGame.team2.players': captain2.userId } });

        // pull captains from queued players
        await msg.client.db.lobbyRepo.upsertLobby(msg.channel.id, { $pull: { 'currentGame.queuedPlayerIDs': captain1.userId } });
        await msg.client.db.lobbyRepo.upsertLobby(msg.channel.id, { $pull: { 'currentGame.queuedPlayerIDs': captain2.userId } });

        // set values
        await msg.client.db.lobbyRepo.upsertLobby(msg.channel.id, { $set: { 'currentGame.isPickingTeams': true, 'currentGame.team1.turnToPick': true, 'currentGame.team2.turnToPick': false } });

        const gameLobby = await msg.client.db.lobbyRepo.getLobby(msg.channel.id);

        let playerPool = '';

        for (let i = 0; i < gameLobby.currentGame.queuedPlayerIDs.length; i++) {
          playerPool += gameLobby.currentGame.queuedPlayerIDs[i].mention() + ' | ';
        }

        // send message
        return msg.channel.createMessage('**Team 1 Captain:** ' + captain1.userId.mention() + '\n' +
                                          '**Team 2 Captain:** ' + captain2.userId.mention() + '\n\n' +
                                          '**Select Your Teams using `' + Constants.data.misc.prefix + 'pick <@user>`**\n' +
                                          '**Captain 1 Always Picks First**\n\n' +
                                          '**Player Pool**\n' +
                                          playerPool.substring(0, playerPool.length - 2));
      }
    } else {
      return msg.channel.createMessage(`[${queuedIds.length}/${msg.dbLobby.userLimit}] Added ${msg.author} to queue.`);
    }
  }
}

module.exports = new Join();
