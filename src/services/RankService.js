const Constants = require('../utility/Constants.js');
class RankService {
  async handle(dbUser, dbGuild, client, member) {
    await member.guild.members.fetch(member.client.user);

    if (!member.guild.me.hasPermission('MANAGE_ROLES')) {
      return;
    } else if (dbUser.registered === false) {
      return;
    }

    const highsetRolePosition = member.guild.me.roles.highest.position;
    const rolesToAdd = [];
    const rolesToRemove = [];
    let points = 0;

    if (member.roles.highest.position < member.guild.me.roles.highest.position && member.id !== member.guild.ownerID) {
      if (dbUser.displayedLb !== null) {
        const leaderboard = await client.db.leaderboardRepo.findOne({ guildId: member.guild.id, name: dbUser.displayedLb });

        if (leaderboard !== null) {
          const dbLeaderboard = await client.db.leaderboardRepo.getLeaderboard(member.guild.id, dbUser.displayedLb);
          const lbUserNickname = dbLeaderboard.users.find(x => x.userId === member.id);

          if (lbUserNickname === undefined) {
            const upsertUser = Constants.config.user;
            upsertUser.userId = member.id;
            await client.db.leaderboardRepo.upsertLeaderboard(member.guild.id, dbUser.displayedLb, { $push: { 'users': upsertUser }});

            points = upsertUser.points
            member.setNickname(dbGuild.registration.nameFormat.format(upsertUser.points, dbUser.username));
          } else {
            points = lbUserNickname.points

            member.setNickname(dbGuild.registration.nameFormat.format(lbUserNickname.points, dbUser.username));
          }

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

          if (rolesToAdd.length > 0) {
            member.roles.add(rolesToAdd);
          } else if (rolesToRemove.length > 0) {
            member.roles.remove(rolesToRemove);
          }
        } else {
          member.setNickname(dbUser.username);
        }
      } else {
        member.setNickname(dbUser.username);
      }

      return;
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
