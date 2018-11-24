const patron = require('patron.js');
const Constants = require('../../utility/Constants.js');

class Help extends patron.Command {
  constructor() {
    super({
      names: ['help', 'commands', 'command', 'cmd', 'cmds', 'support', 'docs'],
      groupName: 'system',
      description: 'All command information.',
      usableContexts: [patron.Context.DM, patron.Context.Guild],
      args: [
        new patron.Argument({
          name: 'command',
          key: 'command',
          type: 'string',
          defaultValue: '',
          example: 'money'
        })
      ]
    });
  }

  async run(msg, args) {
    if (String.isNullOrWhiteSpace(args.command)) {
      const cmds = msg.client.registry.commands;
      let message = '';

      for (let j = 0; j < cmds.length; j++) {
        message += cmds[j].names[0].upperFirstChar().boldify() + ': ' + cmds[j].description + '\n';

        if (message.length > 1024) {
          await msg.author.DM(message);
          message = '';
        }
      }

      await msg.author.DM(message);
      
      if (msg.channel.type !== 'dm') {
        return msg.createReply('you have been DMed with all the command information!');
      }
    } else {
      args.command = args.command.startsWith(Constants.data.misc.prefix) ? args.command.slice(Constants.data.misc.prefix.length) : args.command;

      const lowerInput = args.command.toLowerCase();
      const command = msg.client.registry.commands.find(x => x.names.some(y => y === lowerInput));

      if (!command) {
        return msg.createErrorReply('this command does not exist.');
      }

      let aliases = '';

      for (let i = 1; i < command.names.length; i++) {
        aliases += command.names[i] + ', ';
      }

      return msg.channel.createMessage(String.isNullOrWhiteSpace(aliases) ? '' : '**Aliases:** ' + aliases.substring(0, aliases.length - 2) + '\n**Description:** ' + command.description + '\n**Usage:** `' + Constants.data.misc.prefix + command.getUsage() + '`\n**Example:** `' + Constants.data.misc.prefix + command.getExample() + '`', { title: command.names[0].upperFirstChar() });
    }
  }
}

module.exports = new Help();
