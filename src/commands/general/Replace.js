const patron = require('patron.js');

class Replace extends patron.Command {
  constructor() {
    super({
      names: ['replace'],
      groupName: 'general',
      description: 'Replace a user in the current queue.',
      args: [
        new patron.Argument({
          name: 'user',
          key: 'user',
          type: 'user',
          example: 'WreckIt#0018'
        })
      ]
    });
  }

  async run(msg, args) {
    const game = msg.dbLobby.currentGame;

    if (msg.dbUser.registered === false) {
      return msg.createErrorReply('you have not registered yet.');
    }

    if (game.queuedPlayerIDs.includes(args.user.id) === false && game.team1.players.includes(args.user.id) === false && game.team2.players.includes(args.user.id) === false) {
      return msg.createErrorReply('user is not queued.');
    }

    if (game.team1.captain === args.user.id || game.team2.captain === args.user.id) {
      return msg.createErrorReply('you cannot replace a team captain.');
    }

    if (game.queuedPlayerIDs.includes(msg.author.id) || game.team1.players.includes(msg.author.id) || game.team2.players.includes(msg.author.id)) {
      return msg.createErrorReply('you cannot replace a user is you are in the queue yourself.');
    }

    if (game.queuedPlayerIDs.includes(args.user.id)) {
      await msg.client.db.lobbyRepo.upsertLobby(msg.channel.id, { $pull: { 'currentGame.queuedPlayerIDs': args.user.id } });
      await msg.client.db.lobbyRepo.upsertLobby(msg.channel.id, { $push: { 'currentGame.queuedPlayerIDs': msg.author.id } });
    } else if (game.team1.players.includes(args.user.id)) {
      await msg.client.db.lobbyRepo.upsertLobby(msg.channel.id, { $pull: { 'currentGame.team1.players': args.user.id } });
      await msg.client.db.lobbyRepo.upsertLobby(msg.channel.id, { $push: { 'currentGame.team1.players': msg.author.id } });
    } else if (game.team2.players.includes(args.user.id)) {
      await msg.client.db.lobbyRepo.upsertLobby(msg.channel.id, { $pull: { 'currentGame.team2.players': args.user.id } });
      await msg.client.db.lobbyRepo.upsertLobby(msg.channel.id, { $push: { 'currentGame.team2.players': msg.author.id } });
    }

    return msg.channel.createMessage('Success, ' + msg.author.id.mention() + ' replaced ' + args.user.id.mention() + '.');
  }
}

module.exports = new Replace();
