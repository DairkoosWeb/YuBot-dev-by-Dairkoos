const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = class CatCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'chat',
      aliases: ['kitten', 'kitty'],
      usage: 'chat',
      description: 'Trouve un chat au hasard pour votre plaisir visuel',
      type: client.types.FUN
    });
  }
  async run(message) {
    const apiKey = message.client.apiKeys.catApi;
    try {
      const res = await fetch('https://api.thecatapi.com/v1/images/search', { headers: { 'x-api-key': apiKey }});
      const img = (await res.json())[0].url;
      const embed = new MessageEmbed()
        .setTitle('🐱  Miaou  🐱')
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
