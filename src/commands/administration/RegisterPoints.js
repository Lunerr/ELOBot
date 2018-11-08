const patron = require('patron.js');

class RegisterPoints extends patron.Command {
  constructor() {
    super({
      names: ['registerpoints'],
      groupName: 'administration',
      description: 'Set the default points users are given when registering.',
      args: [
        new patron.Argument({
          name: 'points',
          key: 'points',
          type: 'int',
          example: '8',
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    const regmsg = 'registration.registrationBonus';
    
    await msg.client.db.guildRepo.upsertGuild(msg.guild.id, { $set: { [regmsg]: args.points }});

    return msg.createReply('you have successfully set the registration points bonus to `' + args.points + '`.');
  }
}

module.exports = new RegisterPoints();
