const patron = require('patron.js');
const Constants = require('../../utility/Constants.js');
const { MessageEmbed } = require('discord.js');
const RankService = require('../../services/RankService.js');

class Test extends patron.Command {
  constructor() {
    super({
      names: ['test'],
      groupName: 'system',
      description: 'Get information about the specified user profile.'
    });
  }

  async run(msg, args) {
    var dbUser = await msg.client.db.userRepo.getUser(msg.author.id, msg.guild.id);

    let leaderboards = await msg.client.db.leaderboardRepo.findMany({ guildId: msg.guild.id });

    let dbLeaderboard = leaderboards.find(x => x.lobbies.includes(msg.channel.id));

    let lbUser = dbLeaderboard.users.find(x => x.userId === msg.author.id);

    console.log(lbUser);

    if (lbUser === undefined) {
      const upsertUser = Constants.config.user;
      upsertUser.userId = msg.author.id;
      await msg.client.db.leaderboardRepo.upsertLeaderboard(msg.guild.id, dbLeaderboard.name, { $push: { 'users': upsertUser }});
    }

    leaderboards = await msg.client.db.leaderboardRepo.findMany({ guildId: msg.guild.id });

    dbLeaderboard = leaderboards.find(x => x.lobbies.includes(msg.channel.id));

    lbUser = dbLeaderboard.users.find(x => x.userId === msg.author.id);

    const maxRank = RankService.getGuildRank(lbUser, msg.dbGuild);

    await msg.client.db.leaderboardRepo.upsertLeaderboard(msg.guild.id, '5v5s', { $pull: { 'users': lbUser } });

    lbUser.points = lbUser.points + maxRank.winsModifier;
    lbUser.wins = lbUser.wins + 1;
    lbUser.gamesPlayed = lbUser.gamesPlayed + 1;

    if (lbUser.points < 0) {
      lbUser.points = 0;
    }

    return msg.client.db.leaderboardRepo.upsertLeaderboard(msg.guild.id, '5v5s', { $push: { 'users': lbUser} });
  }
}

module.exports = new Test();
