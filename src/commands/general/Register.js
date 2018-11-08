const patron = require('patron.js');

class Register extends patron.Command {
  constructor() {
    super({
      names: ['register'],
      groupName: 'system',
      description: 'Register as a user.',
      args: [
        new patron.Argument({
          name: 'username',
          key: 'username',
          type: 'string',
          defaultValue: '',
          example: 'cesvy.#0059',
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    let username = args.username;
    if (String.isNullOrWhiteSpace(username)) {
      username = msg.author.username;
    }

    if (msg.dbUser.registered === true) {
      if (!msg.dbGuild.registration.allowMultiRegistration) {
        return msg.createErrorReply('you are not allowed to re-register');
      }

      await msg.client.db.userRepo.updateUser(msg.author.id, msg.guild.id, { $set: { username: username }});

      await msg.channel.createMessage('You have re-registered.\n**Name:** ' + msg.dbUser.username + ' => ' + username + '\nRole\'s have been updated\nStates have been saved.');
    } else {
      const update = {
        $set: {
          username: username,
          ['score.points']: msg.dbGuild.registration.registrationBonus,
          registered: true
        }
      };
  
      await msg.client.db.userRepo.updateUser(msg.author.id, msg.guild.id, update);
      await msg.channel.createMessage(msg.dbGuild.registration.message, { title: 'Success, Registered as ' + username});
    }

    if (msg.member.roles.highest.position < msg.member.guild.me.roles.highest.position && msg.member.id !== msg.member.guild.ownerID) {
      msg.member.setNickname(msg.dbGuild.registration.nameFormat.format(username, msg.dbUser.score.points));
    }

    return;
  }
}

module.exports = new Register();
