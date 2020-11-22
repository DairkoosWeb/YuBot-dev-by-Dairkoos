const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = class MemeCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'meme',
      usage: 'meme',
      description: 'Affiche un mème aléatoire du `memes`, `dankmemes`, ou `me_irl` subreddits.',
      type: client.types.FUN
    });
  }
  async run(message) {
    try {
      let res = await fetch('https://meme-api.herokuapp.com/gimme');
      res = await res.json();
      const embed = new MessageEmbed()
        .setTitle(res.title)
        .setImage(res.url)
        .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
        .setTimestamp()
        .setColor('#d1b7ff');
      message.channel.send(embed);
    } catch (err) {
      message.client.logger.error(err.stack);
      this.sendErrorMessage(message, 1, '<:close:759714410187980861> Veuillez réessayer dans quelques secondes <:close:759714410187980861>', err.message);
    }
  }
};
