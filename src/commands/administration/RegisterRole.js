const patron = require('patron.js');

class RegisterRole extends patron.Command {
  constructor() {
    super({
      names: ['registerrole', 'registerrank'],
      groupName: 'administration',
      description: 'Add a register rank.',
      botPermissions: ['MANAGE_ROLES'],
      args: [
        new patron.Argument({
          name: 'role',
          key: 'role',
          type: 'role',
          example: 'legends',
          preconditions: ['hierarchy']
        })
      ]
    });
  }

  async run(msg, args) {
    if (msg.dbGuild.roles.rank.some(role => role.id === args.role.id)) {
      return msg.createErrorReply('this role has already been set.');
    } else if (msg.dbGuild.roles.rank.some(role => role.isDefault === true)) {
      return msg.createErrorReply('there already is a register role set.');
    }

    const update = new msg.client.db.updates.Push('roles.rank', { id: args.role.id, winsModifier: args.winModifier, lossModifier: args.lossModifier, threshold: args.threshold, isDefault: false });

    await msg.client.db.guildRepo.upsertGuild(msg.guild.id, update);

    return msg.createReply('you have successfully added the rank role ' + args.role.toString() + ' with a threshold amount of ' + args.threshold + ', win modifier of ' + args.winModifier + ', and loss modifier of ' + args.lossModifier + '.');
  }
}

module.exports = new RegisterRole();
