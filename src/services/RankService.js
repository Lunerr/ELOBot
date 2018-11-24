const NumberUtil = require('../utility/NumberUtil.js');

class RankService {
  async handle(dbUser, lbUser, dbGuild, msg) {
    await msg.member.guild.members.fetch(msg.member.client.user);

    if (!msg.member.guild.me.hasPermission('MANAGE_ROLES')) {
      return;
    } else if (dbUser.registered === false) {
      return;
    }

    const highsetRolePosition = msg.member.guild.me.roles.highest.position;
    const rolesToAdd = [];
    const rolesToRemove = [];
    const points = lbUser.points;

    for (const rank of dbGuild.roles.rank) {
      const role = msg.member.guild.roles.get(rank.id);

      if (role && role.position < highsetRolePosition) {
        if (!msg.member.roles.has(role.id)) {
          if (points >= rank.threshold) {
            rolesToAdd.push(role);
          }
        } else if (points < rank.threshold) {
          rolesToRemove.push(role);
        }
      }
    }

    if (msg.member.roles.highest.position < msg.member.guild.me.roles.highest.position && msg.member.id !== msg.member.guild.ownerID) {
      if (dbUser.displayedLb !== null) {
        const leaderboard = await msg.client.db.leaderboardRepo.findOne({ guildId: msg.guild.id, name: dbUser.displayedLb });

        if (leaderboard !== null) {
          const dbLeaderboard = await msg.client.db.leaderboardRepo.getLeaderboard(msg.guild.id, dbUser.displayedLb);
          const lbUser = dbLeaderboard.users.find(x => x.userId === msg.member.id);

          if (lbUser === undefined) {
            const upsertUser = Constants.config.user;
            upsertUser.userId = user.id;
            await msg.client.db.leaderboardRepo.upsertLeaderboard(msg.guild.id, dbUser.displayedLb, { $push: { 'users': upsertUser }});

            msg.member.setNickname(msg.dbGuild.registration.nameFormat.format(upsertUser.points, username));
          } else {
            msg.member.setNickname(msg.dbGuild.registration.nameFormat.format(lbUser.points, username));
          }
        } else {
          msg.member.setNickname(username);
        }
      } else {
        msg.member.setNickname(username);
      }
    }

    if (rolesToAdd.length > 0) {
      return msg.member.roles.add(rolesToAdd);
    } else if (rolesToRemove.length > 0) {
      return msg.member.roles.remove(rolesToRemove);
    }
  }

  getRank(lbUser, dbGuild, guild) {
    let role;
    const points = lbUser.points;

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

  getGuildRank(lbUser, dbGuild) {
    let role;
    const points = lbUser.points;

    for (const rank of dbGuild.roles.rank.sort((a, b) => a.threshold - b.threshold)) {
      if (points >= rank.threshold) {
        role = dbGuild.roles.rank.find(x => x.id === rank.id);
      }
    }

    if (role === undefined) {
      return 'unranked';
    }

    return role;
  }
}

module.exports = new RankService()