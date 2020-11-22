const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = class DuckCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'canard',
      usage: 'canard',
      description: 'Trouve un canard au hasard pour votre plaisir visuel.',
      type: client.types.FUN
    });
  }
  async run(message) {
    try {
      const res = await fetch('https://random-d.uk/api/v2/random');
      const img = (await res.json()).url;
      const embed = new MessageEmbed()
        .setTitle('🦆  Quack  🦆')
        .setImage(img)
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
