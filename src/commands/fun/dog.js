const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = class DogCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'chien',
      aliases: ['puppy', 'pup'],
      usage: 'chien',
      description: 'Trouve un chien au hasard pour votre plaisir visuel.',
      type: client.types.FUN
    });
  }
  async run(message) {
    try {
      const res = await fetch('https://dog.ceo/api/breeds/image/random');
      const img = (await res.json()).message;
      const embed = new MessageEmbed()
        .setTitle('🐶  Woof  🐶')
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
