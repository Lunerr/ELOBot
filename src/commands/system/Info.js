const patron = require('patron.js');
const Constants = require('../../utility/Constants.js');

class Info extends patron.Command {
  constructor() {
    super({
      names: ['info', 'information', 'cashinfo', 'cashhelp'],
      groupName: 'system',
      description: 'All the information about the Clash Pug Bot system.',
      usableContexts: [patron.Context.DM, patron.Context.Guild]
    });
  }

  async run(msg) {
    const dbGuild = await msg.client.db.guildRepo.getGuild(msg.guild.id);

    await msg.author.DM('=====ClashNetwork Services===== \n' +
    'First things first, Clash Network the main competitive hub for BlackOps4 PC \n\n\n' +
    '======How To Participate In Pugs===== \n\n' +
    '1.Start by going to <#505815723159846920>  and picking your region(EU or NA) by clicking on your regions Reaction Icon \n\n' +
    '2. Then head to the <#499977973265334275>  channel and type "+Register <Your InGameName>". This will add you to our playerbase \n\n' +
    '3. Read the competitive restrictions(rules) they are in the <#501928615169228810>. anyone found breaking these rules on purpose will make a bad name for themselves and be have elo points sanctioned. \n\n' +
    '4. Head to either <#512178027627675663> <#515125409281605652> <#505778727251083279> <#515142812790947840> or <#515128119904960522> and type "+Join" or abbreviated: "+J" to be added to the queue *Make sure youre in a lobby  channel or this will not work! \n\n' +
    '5. Once youve entered the Queue and the bot has confirmed it, you will need to wait for the queue to fill up 10/10 or 4/4 (Queue size is relative to the lobby youre in). \n\n' +
    '6. Once FULL QUEUE is reached; The Clash Elo BOT will pick 2 captains automatically(the 2 Captains are picked randomly within top 4 members with the most ELO points within the current queue) \n' +
    'The captains will then proceed to picking their players.\n\n' +
    '7.Once teams have been made, join your assigned team in the corresponding voice channel and hop ingame! \n\n' +
    'MATCH COMPLETED.\n\n' +
    '8.One your match is over, a member of the community with the assigned score-reporter role will report the game score to the ELO BOT in <#503982160919658496> or <#505778666484006922>. the ELO BOT work its magic by rewarding the winners with +100 elo and take away elo points from the losing team.\n\n' +
    '9.Make sure to rejoin the queue in #pug-lobby to participate in the next available game. **(JOINING A QUEUE WHILE ALREADY IN A PUG IS AGAINST THE RULES AND WILL RESULT IN A -60 ELO PENALTY)');

    if (msg.channel.type !== 'dm') {
      return msg.createReply('you have been DMed all the information about the Clash Pug Bot System!');
    }
  }
}

module.exports = new Info();
