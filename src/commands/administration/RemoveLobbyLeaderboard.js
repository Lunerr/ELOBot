const patron = require('patron.js');

class RemoveLobbyLeaderboard extends patron.Command {
  constructor() {
    super({
      names: ['removelobbyleaderboard', 'removeleaderboardlobby', 'removelobbylb', 'removelblobby'],
      groupName: 'administration',
      description: 'Removes a lobby\'s leaderboard.',
      args: [
        new patron.Argument({
          name: 'channel',
          key: 'channel',
          type: 'textchannel',
          example: 'Pugs'
        })
      ]
    });
  }

  async run(msg, args) {
    const guildLeaderboards = await msg.client.db.leaderboardRepo.findMany({ guildId: msg.guild.id });
    const dbLeaderboard = guildLeaderboards.find(x => x.lobbies.includes(msg.channel.id));

    if (dbLeaderboard === undefined) {
      return msg.createErrorReply('this lobby already doesn\'t have a set leaderboard.');
    }

    await msg.client.db.leaderboardRepo.upsertLeaderboard(msg.guild.id, dbLeaderboard.name, { $pull: { 'lobbies': args.channel.id }});
    await msg.client.db.lobbyRepo.upsertLobby(args.channel.id, { $set: { 'isALobby': false } });

    return msg.createReply('you have successfully removed ' + args.channel.toString() + ' from leaderboard ' + dbLeaderboard.name + '.');
  }
}

module.exports = new RemoveLobbyLeaderboard();
