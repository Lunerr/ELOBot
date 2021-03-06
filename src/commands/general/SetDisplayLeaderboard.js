const patron = require('patron.js');
const Constants = require('../../utility/Constants.js');

class SetDisplayLeaderboard extends patron.Command {
  constructor() {
    super({
      names: ['setdisplayleaderboard', 'setdisplaylb'],
      groupName: 'general',
      description: 'Set what leaderboard score you want displayed next to your nickname.',
      args: [
        new patron.Argument({
          name: 'leaderboard',
          key: 'leaderboard',
          type: 'string',
          example: '5v5'
        })
      ]
    });
  }

  async run(msg, args) {
    if (msg.dbUser.registered === false) {
      return msg.createErrorReply('you have not registered yet.');
    }

    const leaderboard = await msg.client.db.leaderboardRepo.findOne({ guildId: msg.guild.id, name: args.leaderboard });

    if (leaderboard === null) {
      return msg.createErrorReply('this leaderboard doesn\'t exists.');
    }

    await msg.client.db.userRepo.updateUser(msg.author.id, msg.guild.id, { $set: { displayedLb: args.leaderboard } });

    if (msg.member.roles.highest.position < msg.member.guild.me.roles.highest.position && msg.member.id !== msg.member.guild.ownerID) {
      let dbLeaderboard = await msg.client.db.leaderboardRepo.getLeaderboard(msg.guild.id, args.leaderboard);
      let lbUser = dbLeaderboard.users.find(x => x.userId === msg.author.id);
      
      if (lbUser === undefined) {
        const upsertUser = Constants.config.user;
        upsertUser.userId = msg.author.id;
        await msg.client.db.leaderboardRepo.upsertLeaderboard(msg.guild.id, dbLeaderboard.name, { $push: { 'users': upsertUser }});
  
        const leaderboards = await msg.client.db.leaderboardRepo.findMany({ guildId: msg.guild.id });
  
        dbLeaderboard = leaderboards.find(x => x.name === args.leaderboard);
  
        lbUser = dbLeaderboard.users.find(x => x.userId === msg.author.id);
      }
      
      msg.member.setNickname(msg.dbGuild.registration.nameFormat.format(lbUser.points, msg.dbUser.username));
    }

    return msg.createReply('you\'ve successfully set leaderboard ' + args.leaderboard + ' to display on your nickname.');
  }
}

module.exports = new SetDisplayLeaderboard();
