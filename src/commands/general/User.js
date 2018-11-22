const patron = require('patron.js');
const { MessageEmbed } = require('discord.js');
const Random = require('../../utility/Random.js');
const Constants = require('../../utility/Constants.js');
const RankService = require('../../services/RankService.js');

class User extends patron.Command {
  constructor() {
    super({
      names: ['getuser', 'userstats', 'statsuser', 'user', 'userinfo'],
      groupName: 'system',
      description: 'Get information about the specified user profile.',
      args: [
        new patron.Argument({
          name: 'leaderboard',
          key: 'leaderboard',
          type: 'string',
          example: '5v5-pugs'
        }),
        new patron.Argument({
          name: 'member',
          key: 'member',
          type: 'member',
          defaultValue: patron.ArgumentDefault.Member,
          example: 'Blast It Baby#6969',
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

    const dbLeaderboard = await msg.client.db.leaderboardRepo.getLeaderboard(msg.guild.id, args.leaderboard);
    const dbUser = msg.author.id === args.member.id ? msg.dbUser : await msg.client.db.userRepo.getUser(args.member.id, msg.guild.id);
    const lbUser = dbLeaderboard.users.find(x => x.userId === args.member.id);

    if (dbUser.registered === false) {
      return msg.createErrorReply('user is not registered.');
    } else if (lbUser === undefined) {
      return msg.createErrorReply('user is not on this leaderboard.');
    }

    const embed = new MessageEmbed()
      .setColor(Random.arrayElement(Constants.data.colors.defaults))
      .setTitle(dbUser.username + ' Profile')
      .addField("Points", lbUser.points, true)
      .addField("Rank", RankService.getRank(lbUser, msg.dbGuild, msg.guild), true)
      .addField("Games", "**Games Played**\n" +
        lbUser.gamesPlayed + '\n' +
        "**Wins**\n" +
        lbUser.wins + '\n' +
        "**Losses**\n" +
        lbUser.losses + '\n' +
        "**WLR**\n" +
        (lbUser.wins / lbUser.losses), true);

    if (msg.dbGuild.settings.useKD) {
      embed.addField("K/D", "**Kills**\n" +
        lbUser.kills + '\n' +
        "**Deaths**\n" +
        lbUser.deaths + '\n' +
        "**KDR**\n" +
        (lbUser.kills / dbUser.deaths), true);
    }

    return msg.channel.send({ embed });
  }
}

module.exports = new User();
