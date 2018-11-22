const patron = require('patron.js');
const Constants = require('../../utility/Constants.js');
const { MessageEmbed } = require('discord.js');
const RankService = require('../../services/RankService.js');

class Game extends patron.Command {
  constructor() {
    super({
      names: ['game'],
      groupName: 'general',
      description: 'Submit a game result.',
      args: [
        new patron.Argument({
          name: 'channel',
          key: 'channel',
          type: 'textchannel',
          example: 'pugs'
        }),
        new patron.Argument({
          name: 'gameNumber',
          key: 'gameNumber',
          type: 'int',
          example: '13'
        }),
        new patron.Argument({
          name: 'result',
          key: 'result',
          type: 'string',
          example: 'team1'
        })
      ]
    });
  }

  async run(msg, args) {
    let leaderboards = await msg.client.db.leaderboardRepo.findMany({ guildId: msg.guild.id });
    let dbLeaderboard = leaderboards.find(x => x.lobbies.includes(args.channel.id));

    if (dbLeaderboard === undefined) {
      return msg.createErrorReply('this lobby channel isn\'t assigned to a leaderboard.');
    }

    if (!msg.member.roles.find(x => x.id === '499981512205139993')) {
      //return msg.createErrorReply('you are not a score reporter.');
    }

    const selectedGame = await msg.client.db.gameResultRepo.getGameResult(args.channel.id, args.gameNumber);

    if (selectedGame === undefined) {
      return msg.createErrorReply('game unavailable. Incorrect data.');
    }

    let results = [];

    for (let i = 0; i < Object.keys(Constants.config.result).length; i++) {
      results.push(Object.keys(Constants.config.result)[i]);
    }

    if (!results.includes(args.result.toLowerCase())) {
      return msg.createErrorReply('this is not a valid choice.');
    }

    if (selectedGame.result !== Constants.config.result.undecided) {
      await msg.channel.createMessage('This game\'s result has already been set to:\n' + selectedGame.result + '\nPlease reply with `yes` to still modify the result and update scores\nOr reply with `no` to cancel this command within 5 minutes.');
      const result = await msg.channel.awaitMessages(m => m.author.id === msg.author.id && m.content.toLowerCase().includes('yes') || m.content.toLowerCase().includes('no'), { time: 300000, max: 1 });
      if (result.first().content.toLowerCase() === 'no') {
        return;
      }
    }

    if (args.result.toLowerCase() === Constants.config.result.canceled) {
      return msg.channel.send('Success, game has been canceled.');
    }

    const userList = selectedGame.team1.concat(selectedGame.team2);

    const winEmbed = new MessageEmbed()
    .setColor([0, 255, 0]);
    const loseEmbed = new MessageEmbed()
    .setColor([255, 0, 0]);

    for (let i = 0; i < userList.length; i++) {
      var user = msg.guild.members.get(userList[i]);

      if (!user) {
        return;
      }

      var dbUser = await msg.client.db.userRepo.getUser(user.id, msg.guild.id);
      let lbUser = dbLeaderboard.users.find(x => x.userId === user.id);
  
      if (lbUser === undefined) {
        const upsertUser = Constants.config.user;
        upsertUser.userId = user.id;
        await msg.client.db.leaderboardRepo.upsertLeaderboard(msg.guild.id, dbLeaderboard.name, { $push: { 'users': upsertUser }});
      }

      leaderboards = await msg.client.db.leaderboardRepo.findMany({ guildId: msg.guild.id });

      dbLeaderboard = leaderboards.find(x => x.lobbies.includes(args.channel.id));

      lbUser = dbLeaderboard.users.find(x => x.userId === user.id);
  
      const maxRank = RankService.getGuildRank(lbUser, msg.dbGuild);

      if (args.result.toLowerCase() === Constants.config.result.team1 && selectedGame.team1.includes(user.id)) {
        await msg.client.db.leaderboardRepo.upsertLeaderboard(msg.guild.id, dbLeaderboard.name, { $pull: { 'users': lbUser } });
        lbUser.points = lbUser.points + maxRank.winsModifier;
        lbUser.wins = lbUser.wins + 1;
        
        await msg.client.db.leaderboardRepo.upsertLeaderboard(msg.guild.id, dbLeaderboard.name, { $push: { 'users': lbUser} });
        winEmbed.addField(dbUser.username + ' (+' + maxRank.winsModifier + ')', 'Points: ' + lbUser.points + '\nWins: ' + lbUser.wins);
      } else if (args.result.toLowerCase() === Constants.config.result.team2 && selectedGame.team2.includes(user.id)) {
        await msg.client.db.leaderboardRepo.upsertLeaderboard(msg.guild.id, dbLeaderboard.name, { $pull: { 'users': lbUser } });
        lbUser.points = lbUser.points + maxRank.winsModifier;
        lbUser.wins = lbUser.wins + 1;

        await msg.client.db.leaderboardRepo.upsertLeaderboard(msg.guild.id, dbLeaderboard.name, { $push: { 'users': lbUser} });
        winEmbed.addField(dbUser.username + ' (+' + maxRank.winsModifier + ')', 'Points: ' + lbUser.points + '\nWins: ' + lbUser.wins);
      } else {
        await msg.client.db.leaderboardRepo.upsertLeaderboard(msg.guild.id, dbLeaderboard.name, { $pull: { 'users': lbUser } });
        lbUser.points = lbUser.points - maxRank.lossModifier;
        lbUser.losses = lbUser.losses + 1;
        lbUser.gamesPlayed = lbUser.gamesPlayed + 1;

        if (lbUser.points < 0) {
          lbUser.points = 0;
        }

        await msg.client.db.leaderboardRepo.upsertLeaderboard(msg.guild.id, dbLeaderboard.name, { $push: { 'users': lbUser} });
        loseEmbed.addField(dbUser.username + ' (-' + maxRank.lossModifier + ')', 'Points: ' + lbUser.points + '\nLosses: ' + lbUser.losses);
      }

      await RankService.handle(dbUser, lbUser, msg.dbGuild, user);
    }

    const updateGame = {
      $set: {
        'result': args.result.toLowerCase()
      }
    };

    await msg.client.db.gameResultRepo.updateGameResult(msg.channel.id, args.gameNumber, updateGame);
    await msg.channel.send({ embed: winEmbed });
    return msg.channel.send({ embed: loseEmbed });
  }
}

module.exports = new Game();
