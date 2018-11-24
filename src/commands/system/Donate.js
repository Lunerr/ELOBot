const patron = require('patron.js');
const Constants = require('../../utility/Constants.js');

class Donate extends patron.Command {
  constructor() {
    super({
      names: ['donate', 'paypal'],
      groupName: 'system',
      description: 'Get the donation link.',
      usableContexts: [patron.Context.DM, patron.Context.Guild]
    });
  }

  run(msg) {
    return msg.channel.createMessage('https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=5Y6GAMGQA6RZQ&source=url', { title: 'Clash PUG Bot Donation Link'});
  }
}

module.exports = new Donate();
