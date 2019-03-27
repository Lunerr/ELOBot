const patron = require('patron.js');

class SetRegisterRole extends patron.Command {
  constructor() {
    super({
      names: ['setregisterrole', 'setregisteredrole'],
      groupName: 'administration',
      description: 'Sets the registered role.',
      botPermissions: ['MANAGE_ROLES'],
      args: [
        new patron.Argument({
          name: 'role',
          key: 'role',
          type: 'role',
          example: 'Registered',
          preconditions: ['hierarchy'],
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    await msg.client.db.guildRepo.upsertGuild(msg.guild.id, { $set: { 'roles.registered': args.role.id } });

    return msg.createReply('you have successfully set the registered role to ' + args.role.toString() + '.');
  }
}

module.exports = new SetRegisterRole();
