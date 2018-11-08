const patron = require('patron.js');

class AddRank extends patron.Command {
  constructor() {
    super({
      names: ['addrank', 'setrank', 'enablerank'],
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
    if (msg.dbGuild.roles.rank.some(role => role.id === args.role.id)) {
      return msg.createErrorReply('this rank role has already been set.');
    }

    const update = new msg.client.db.updates.Push('roles.rank', { id: args.role.id, winsModifier: args.winModifier, lossModifier: args.lossModifier, threshold: args.threshold, isDefault: false });

    await msg.client.db.guildRepo.upsertGuild(msg.guild.id, update);

    return msg.createReply('you have successfully added the rank role ' + args.role.toString() + ' with a threshold amount of ' + args.threshold + ', win modifier of ' + args.winModifier + ', and loss modifier of ' + args.lossModifier + '.');
  }
}

module.exports = new AddRank();
