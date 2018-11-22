const patron = require('patron.js');

class SetLobbbyLeaderboard extends patron.Command {
  constructor() {
    super({
      names: ['setlobbyleaderboard', 'addlobbyleaderboard'],
      groupName: 'administration',
      description: 'Sets a lobby\'s leaderboard.',
      args: [
        new patron.Argument({
          name: 'channel',
          key: 'channel',
          type: 'textchannel',
          example: 'Pugs'
        }),
        new patron.Argument({
          name: 'leaderboard',
          key: 'leaderboard',
          type: 'string',
          example: '5v5s',
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    const leaderboard = await msg.client.db.leaderboardRepo.findOne({ guildId: msg.guild.id, name: args.leaderboard });

    if (leaderboard === null) {
      return msg.createErrorReply('this leaderboard does not exist.');
    }

    const guildLeaderboards = await msg.client.db.leaderboardRepo.findMany({ guildId: msg.guild.id });
    const dbLeaderboard = guildLeaderboards.find(x => x.lobbies.includes(msg.channel.id));

    if (dbLeaderboard !== undefined) {
      return msg.createErrorReply('this lobby already has a set leaderboard.');
    }

    await msg.client.db.leaderboardRepo.upsertLeaderboard(msg.guild.id, args.leaderboard, { $push: { 'lobbies': args.channel.id }});
    await msg.client.db.lobbyRepo.upsertLobby(args.channel.id, { $set: { 'isALobby': true } });

    return msg.createReply('you have successfully set ' + args.channel.toString() + ' to leaderboard ' + args.leaderboard + '.');
  }
}

module.exports = new SetLobbbyLeaderboard();
