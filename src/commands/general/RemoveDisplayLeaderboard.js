const patron = require('patron.js');
const Constants = require('../../utility/Constants.js');

class RemoveDisplayLeaderboard extends patron.Command {
  constructor() {
    super({
      names: ['removedisplayleaderboard', 'removedisplaylb'],
      groupName: 'general',
      description: 'Remove the leaderboard score next to your nickname.'
    });
  }

  async run(msg, args) {
    if (msg.dbUser.registered === false) {
      return msg.createErrorReply('you have not registered yet.');
    }

    if (msg.dbUser.displayedLb === null) {
      return msg.createErrorReply('you already don\'t have a leaderboard set to display.');
    }

    await msg.client.db.userRepo.updateUser(msg.author.id, msg.guild.id, { $set: { displayedLb: null }});
    msg.member.setNickname(msg.dbUser.username);
    return msg.createReply('you\'ve successfully removed ' + msg.dbUser.displayedLb + ' from displaying on your nickname.');
  }
}

module.exports = new RemoveDisplayLeaderboard();
