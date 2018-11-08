const NumberUtil = require('../utility/NumberUtil.js');

class RankService {
  async handle(dbUser, dbGuild, member) {
    await member.guild.members.fetch(member.client.user);

    if (!member.guild.me.hasPermission('MANAGE_ROLES')) {
      return;
    } else if (dbUser.registered === false) {
      return;
    }

    const highsetRolePosition = member.guild.me.roles.highest.position;
    const rolesToAdd = [];
    const rolesToRemove = [];
    const points = dbUser.score.points;

    for (const rank of dbGuild.roles.rank) {
      const role = member.guild.roles.get(rank.id);

      if (role && role.position < highsetRolePosition) {
        if (!member.roles.has(role.id)) {
          if (points >= rank.threshold) {
            rolesToAdd.push(role);
          }
        } else if (points < rank.threshold) {
          rolesToRemove.push(role);
        }
      }
    }

    if (member.roles.highest.position < member.guild.me.roles.highest.position && member.id !== member.guild.ownerID) {
      member.setNickname(dbGuild.registration.nameFormat.format(dbUser.username, dbUser.score.points));
    }

    if (rolesToAdd.length > 0) {
      return member.roles.add(rolesToAdd);
    } else if (rolesToRemove.length > 0) {
      return member.roles.remove(rolesToRemove);
    }
  }

  getRank(dbUser, dbGuild, guild) {
    let role;
    const points = dbUser.score.points;

    for (const rank of dbGuild.roles.rank.sort((a, b) => a.threshold - b.threshold)) {
      if (points >= rank.threshold) {
        role = guild.roles.get(rank.id);
      }
    }

    if (role === undefined) {
      return 'unranked';
    }

    return role;
  }
}

module.exports = new RankService();
