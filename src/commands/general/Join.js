const patron = require('patron.js');
const Constants = require('../../utility/Constants.js');
const Random = require('../../utility/Random.js');
const { MessageEmbed } = require('discord.js');

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
    } else if (msg.dbLeaderboard === null) {
      return msg.createErrorReply('this lobby does not have a leaderboard assigned to it.');
    } else if (msg.dbLobby.currentGame.queuedPlayerIDs.includes(msg.author.id)) {
      return msg.createErrorReply('You are already queued for this lobby.');
    } else if (msg.dbUser.registered === false) {
      return msg.createErrorReply('you have not registered yet.');
    } else if (msg.dbUser.ban.banned === true) {
      return msg.createErrorReply('You are banned from matchmaking for another ' + msg.dbUser.ban.expireTime - Date.now() + '.');
    } else if (msg.dbLobby.currentGame.isPickingTeams === true) {
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

        // 1v1 lobby
        if (msg.dbLobby.userLimit === 2) {
          const newLobby = await msg.client.db.lobbyRepo.getLobby(msg.channel.id);
          const newCurrentGame = newLobby.currentGame;
          let hosts = [];
    
          for (let i = 0; i < newCurrentGame.queuedPlayerIDs.length; i++){
            if (msg.guild.members.get(newCurrentGame.queuedPlayerIDs[i]).roles.find(x => x.id === '512116723202260992')) {
              hosts.push(newCurrentGame.queuedPlayerIDs[i]);
            }
          }
    
          const host = hosts.length <= 0 ? Random.arrayElement(newCurrentGame.queuedPlayerIDs) : Random.arrayElement(hosts);
    
          await msg.client.db.gameResultRepo.getGameResult(msg.channel.id, newLobby.gamesPlayed);
    
          const update = {
            $set: {
              'gameNumber': newLobby.gamesPlayed,
              'lobbyId': msg.channel.id,
              'result': Constants.config.result.undecided,
              'team1': [newCurrentGame.queuedPlayerIDs[0]],
              'team2': [newCurrentGame.queuedPlayerIDs[1]],
              'time': Date.now()
            }
          };
    
          await msg.client.db.gameResultRepo.updateGameResult(msg.channel.id, newLobby.gamesPlayed, update);
          await msg.client.db.lobbyRepo.upsertLobby(msg.channel.id, { $inc: { 'gamesPlayed': 1 }});
    
          const map = Random.arrayElement(msg.dbLobby.maps);

          for (let i = 0; i < newCurrentGame.queuedPlayerIDs.length; i++){
            const user = msg.client.users.get(newCurrentGame.queuedPlayerIDs[i]);
    
            const dmEmbed = new MessageEmbed()
            .setColor(Random.arrayElement(Constants.data.colors.defaults))
            .setTitle('Game has Started')
            .addField('Game Info', 'Guild: ' + msg.guild.name + '\nLobby: ' + msg.channel.name + '\nGame: ' + msg.dbLobby.gamesPlayed)
            .addField('Team 1', newCurrentGame.queuedPlayerIDs[0].mention())
            .addField('Team 2', newCurrentGame.queuedPlayerIDs[1].mention())
            .addField('Map', map)
            .addField('Selected Host', host.mention());
    
            await user.send({ embed: dmEmbed });
          }
    
          const updateNew = {
            $set: {
              'currentGame': Constants.config.currentGame,
              'mapInfo.lastMap': map
            }
          };
    
          await msg.client.db.lobbyRepo.upsertLobby(msg.channel.id, updateNew);

          const embed = new MessageEmbed()
          .setColor(Random.arrayElement(Constants.data.colors.defaults))
          .addField('Game Info', 'Lobby: <#' + msg.channel + '>\nGame: ' + msg.dbLobby.gamesPlayed)
          .addField('Team 1', newCurrentGame.queuedPlayerIDs[0].mention())
          .addField('Team 2', newCurrentGame.queuedPlayerIDs[1].mention())
          .addField('Map', map)
          .addField('Selected Host', host.mention());
    
          return msg.channel.send({ embed });
        }

        // other lobbies
        const currentGame = msg.dbLobby.currentGame;
        const players = [];

        for (let i = 0; i < currentGame.queuedPlayerIDs.length; i++) {
          let player = msg.dbLeaderboard.users.find(x => x.userId === currentGame.queuedPlayerIDs[i]);

          if (player === undefined) {
            const upsertUser = Constants.config.user;
            upsertUser.userId = currentGame.queuedPlayerIDs[i];
            await msg.client.db.leaderboardRepo.upsertLeaderboard(msg.guild.id, msg.dbLeaderboard.name, { $push: { 'users': upsertUser }});
          }

          player = msg.dbLeaderboard.users.find(x => x.userId === currentGame.queuedPlayerIDs[i]);
          players.push(player);
        }
    
        players.sort((a, b) => b.points - a.points);
    
        const topHalf = players.slice(0, msg.dbLobby.userLimit / 2);
        const captain1 = Random.arrayElement(topHalf);
        const capt1Index = topHalf.indexOf(captain1);
        topHalf.splice(capt1Index, 1);
        const captain2 = Random.arrayElement(topHalf);

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
