const patron = require('patron.js');

class SetScoreReportersRole extends patron.Command {
  constructor() {
    super({
      names: ['setscorereporters', 'setscorereporter', 'addscorereporter', 'addscorereporters', 'setscorereporterrole', 'setscorereportersrole'],
      groupName: 'administration',
      description: 'Sets the score reporter role.',
      botPermissions: ['MANAGE_ROLES'],
      args: [
        new patron.Argument({
          name: 'role',
          key: 'role',
          type: 'role',
          example: 'Reporter',
          preconditions: ['hierarchy'],
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    await msg.client.db.guildRepo.upsertGuild(msg.guild.id, { $set: { 'roles.reporters': args.role.id } });

    return msg.createReply('you have successfully set the score repoter role to ' + args.role.toString() + '.');
  }
}

module.exports = new SetScoreReportersRole();
