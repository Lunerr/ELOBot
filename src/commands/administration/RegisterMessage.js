const patron = require('patron.js');

class RegisterMessage extends patron.Command {
  constructor() {
    super({
      names: ['registermessage'],
      groupName: 'administration',
      description: 'Set the message that is displayed to users when registering.',
      args: [
        new patron.Argument({
          name: 'message',
          key: 'message',
          type: 'string',
          example: 'Welcome to the server!',
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    const regmsg = 'registration.message';
    
    await msg.client.db.guildRepo.upsertGuild(msg.guild.id, { $set: { [regmsg]: args.message }});

    return msg.createReply('you have successfully set the registration message to `' + args.message + '`.');
  }
}

module.exports = new RegisterMessage();
