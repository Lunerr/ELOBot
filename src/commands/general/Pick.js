const patron = require('patron.js');
const Constants = require('../../utility/Constants.js');
const Random = require('../../utility/Random.js');
const { MessageEmbed } = require('discord.js');

class Pick extends patron.Command {
  constructor() {
    super({
      names: ['pick', 'p'],
      groupName: 'general',
      description: 'Pick a player for your team.',
      args: [
        new patron.Argument({
          name: 'user',
          key: 'user',
          type: 'user',
          example: 'cesvy.#0059',
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    if (msg.dbLobby.isALobby === false) {
      return msg.createErrorReply('this channel is not a lobby.');
    }

    const currentGame = msg.dbLobby.currentGame;

    if (currentGame.isPickingTeams === false) {
      return msg.createErrorReply('lobby is not picking teams at the moment.');
    }

    if (currentGame.team1.captain !== msg.author.id && currentGame.team2.captain !== msg.author.id) {
      return msg.createErrorReply('you\'re not a captain.');
    }

    if (currentGame.queuedPlayerIDs.includes(args.user.id) === false) {
      return msg.createErrorReply(args.user.tag + ' is not able to be picked.');
    }

    if (currentGame.team1.captain === msg.author.id && currentGame.team2.turnToPick === true) {
      return msg.createErrorReply('it\'s not your turn to pick.');
    }

    if (currentGame.team2.captain === msg.author.id && currentGame.team1.turnToPick === true) {
      return msg.createErrorReply('it\'s not your turn to pick.');
    }

    const team1PickIndexes = [3];
    const team2PickIndexes = [1, 5];

    if (currentGame.team1.turnToPick === true && msg.author.id === currentGame.team1.captain) {
      // push into team
      await msg.client.db.lobbyRepo.upsertLobby(msg.channel.id, { $push: { 'currentGame.team1.players': args.user.id } });

      // pull from queue
      await msg.client.db.lobbyRepo.upsertLobby(msg.channel.id, { $pull: { 'currentGame.queuedPlayerIDs': args.user.id } });

      if (team1PickIndexes.includes(msg.dbLobby.currentGame.pickIndex) === false) {
        // set values for team 2
        await msg.client.db.lobbyRepo.upsertLobby(msg.channel.id, { $set: { 'currentGame.team1.turnToPick': false, 'currentGame.team2.turnToPick': true } });
      }

      // inc pick index
      await msg.client.db.lobbyRepo.upsertLobby(msg.channel.id, { $inc: { 'currentGame.pickIndex': 1 }});
    } else if (currentGame.team2.turnToPick === true && msg.author.id === currentGame.team2.captain) {
      // push into team
      await msg.client.db.lobbyRepo.upsertLobby(msg.channel.id, { $push: { 'currentGame.team2.players': args.user.id } });

      // pull from queue
      await msg.client.db.lobbyRepo.upsertLobby(msg.channel.id, { $pull: { 'currentGame.queuedPlayerIDs': args.user.id } });
      
      if (team2PickIndexes.includes(msg.dbLobby.currentGame.pickIndex) === false) {
        // set values for team 1
        await msg.client.db.lobbyRepo.upsertLobby(msg.channel.id, { $set: { 'currentGame.team1.turnToPick': true, 'currentGame.team2.turnToPick': false } });
      }
      
      // inc pick index
      await msg.client.db.lobbyRepo.upsertLobby(msg.channel.id, { $inc: { 'currentGame.pickIndex': 1 }});
    }

    const newLobby = await msg.client.db.lobbyRepo.getLobby(msg.channel.id);
    const newCurrentGame = newLobby.currentGame;

    let team1 = '';
    let team2 = '';
    let playerPool = '';

    for (let i = 0; i < 10; i++) {
      team1 += newCurrentGame.team1.players[i] !== undefined ? newCurrentGame.team1.players[i].mention() + ' | ' : '';
      team2 += newCurrentGame.team2.players[i] !== undefined ? newCurrentGame.team2.players[i].mention() + ' | ' : '';
    }

    for (let i = 0; i < newCurrentGame.queuedPlayerIDs.length; i++) {
      playerPool += newCurrentGame.queuedPlayerIDs[i].mention() + ' | ';
    }

    if (newCurrentGame.queuedPlayerIDs.length <= 1) {
      // push into team
      await msg.client.db.lobbyRepo.upsertLobby(msg.channel.id, { $push: { 'currentGame.team1.players': newCurrentGame.queuedPlayerIDs[0] } });

      // pull from queue
      await msg.client.db.lobbyRepo.upsertLobby(msg.channel.id, { $pull: { 'currentGame.queuedPlayerIDs': newCurrentGame.queuedPlayerIDs[0] } });

      const lastPlayerLobby = await msg.client.db.lobbyRepo.getLobby(msg.channel.id);
      const newLastPlayerGame = lastPlayerLobby.currentGame;

      team1 += newCurrentGame.queuedPlayerIDs[0].mention();

      const fullTeam = newLastPlayerGame.team1.players.concat(newLastPlayerGame.team2.players);
      let hosts = [];

      for (let i = 0; i < fullTeam.length; i++){
        if (msg.guild.members.get(fullTeam[i]).roles.find(x => x.id === '512116723202260992')) {
          hosts.push(fullTeam[i]);
        }
      }

      const host = hosts.length <= 0 ? Random.arrayElement(fullTeam) : Random.arrayElement(hosts);

      await msg.client.db.gameResultRepo.getGameResult(msg.channel.id, newLobby.gamesPlayed);

      const update = {
        $set: {
          'gameNumber': newLobby.gamesPlayed,
          'lobbyId': msg.channel.id,
          'result': Constants.config.result.undecided,
          'team1': newLastPlayerGame.team1.players,
          'team2': newLastPlayerGame.team2.players,
          'time': Date.now()
        }
      };
  
      await msg.client.db.gameResultRepo.updateGameResult(msg.channel.id, newLobby.gamesPlayed, update);

      await msg.client.db.lobbyRepo.upsertLobby(msg.channel.id, { $inc: { 'gamesPlayed': 1 }});

      const map = Random.arrayElement(msg.dbLobby.maps);

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
      .addField('Team 1', team1)
      .addField('Team 2', team2.substring(0, team2.length - 2))
      .addField('Map', map)
      .addField('Selected Host', host.mention());

      return msg.channel.send({ embed });
    }

    return msg.channel.createMessage('**Team 1 Captain:** ' + newCurrentGame.team1.captain.mention() + '\n' +
                                      '**Team 1:** ' + team1.substring(0, team1.length - 2) + '\n\n' +
                                      '**Team 2 Captain:** ' + newCurrentGame.team2.captain.mention() + '\n' +
                                      '**Team 2:** ' + team2.substring(0, team2.length - 2) + '\n\n' +
                                      '**Select Your Teams using `' + Constants.data.misc.prefix + 'pick <@user>`**\n' +
                                      '**It is ' + (newCurrentGame.team1.turnToPick === true ? 'Captain 1' : 'Captain 2') + '\'s turn to pick.**' + '\n\n' +
                                      '**Player Pool** \n' + playerPool.substring(0, playerPool.length - 2));
  }
}

module.exports = new Pick();
