const patron = require('patron.js');

class ModifyRank extends patron.Command {
  constructor() {
    super({
      names: ['modifyrank'],
      groupName: 'administration',
      description: 'Add a rank.',
      botPermissions: ['MANAGE_ROLES'],
      args: [
        new patron.Argument({
          name: 'role',
          key: 'role',
          type: 'role',
          example: 'legends',
          preconditions: ['hierarchy']
        }),
        new patron.Argument({
          name: 'threshold',
          key: 'threshold',
          type: 'int',
          example: '500'
        }),
        new patron.Argument({
          name: 'winmodifier',
          key: 'winModifier',
          type: 'int',
          example: '10'
        }),
        new patron.Argument({
          name: 'lossmodifier',
          key: 'lossModifier',
          type: 'int',
          example: '5'
        })
      ]
    });
  }

  async run(msg, args) {
    if (!msg.dbGuild.roles.rank.some(role => role.id === args.role.id)) {
      return msg.createErrorReply('you may not modify a rank role that has not been set.');
    }

    const remove = new msg.client.db.updates.Pull('roles.rank', { id: args.role.id });

    await msg.client.db.guildRepo.upsertGuild(msg.guild.id, remove);

    const update = new msg.client.db.updates.Push('roles.rank', { id: args.role.id, winsModifier: args.winModifier, lossModifier: args.lossModifier, threshold: args.threshold, isDefault: false });

    await msg.client.db.guildRepo.upsertGuild(msg.guild.id, update);

    return msg.createReply('you have successfully modified the rank role ' + args.role.toString() + ' with a threshold amount of ' + args.threshold + ', win modifier of ' + args.winModifier + ', and loss modifier of ' + args.lossModifier + '.');
  }
}

module.exports = new ModifyRank();
