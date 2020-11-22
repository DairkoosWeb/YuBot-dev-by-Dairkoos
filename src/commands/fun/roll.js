const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');

module.exports = class RollCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'dés',
      aliases: ['dice', 'r'],
      usage: '<dés numros>',
      description: 'Lance un dé avec le nombre de faces spécifié. Sera par défaut à 6 côtés si aucun numéro n\'est donné.',
      type: client.types.FUN,
      examples: ['dés 20']
    });
  }
  run(message, args) {
    let limit = args[0];
    if (!limit) limit = 6;
    const n = Math.floor(Math.random() * limit + 1);
    if (!n || limit <= 0)
      return this.sendErrorMessage(message, 0, 'Veuillez fournir un nombre valide de faces de dés');
    const embed = new MessageEmbed()
      .setTitle('🎲  Lancer de dés  🎲')
      .setDescription(`${message.member}, tu est tombé sur un **${n}**`)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor('#d1b7ff');
    message.channel.send(embed);
  }
};
