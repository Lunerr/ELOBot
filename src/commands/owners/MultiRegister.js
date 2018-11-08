const patron = require('patron.js');

class MultiRegister extends patron.Command {
  constructor() {
    super({
      names: ['multiregister'],
      groupName: 'owners',
      description: 'Toggle whether users can use the register command more than once.'
    });
  }

  async run(msg) {
    const multiRegister = !msg.dbGuild.registration.allowMultiRegistration;

    await msg.client.db.guildRepo.updateGuild(msg.guild.id, { $set: { ['registration.allowMultiRegistration']: multiRegister } });

    return msg.createReply('you\'ve successfully ' + (multiRegister ? 'enabled' : 'disabled') + ' multi registration for this server.');
  }
}

module.exports = new MultiRegister();
