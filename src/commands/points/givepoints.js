const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const { stripIndent } = require('common-tags');

module.exports = class GivePointsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'givepoints',
      aliases: ['gp'],
      usage: 'givepoints <user mention/ID> <point count>',
      description: 'Gives the specified amount of your own points to the mentioned user.',
      type: client.types.POINTS,
      examples: ['givepoints @Nettles 1000']
    });
  }
  run(message, args) {
    const member = this.getMemberFromMention(message, args[0]) || message.guild.members.cache.get(args[0]);
    if (!member) return this.sendErrorMessage(message, 0, 'Veuillez mentionner un utilisateur ou fournir un ID utilisateur valide');
    if (member.id === message.client.user.id)
      return message.channel.send('Merci, vous êtes trop gentil ! Mais je dois refuser. Je préfère ne pas prendre de points.');
    const amount = parseInt(args[1]);
    const points = message.client.db.users.selectPoints.pluck().get(message.author.id, message.guild.id);
    if (isNaN(amount) === true || !amount)
      return this.sendErrorMessage(message, 0, 'Veuillez fournir un nombre de points valide');
    if (amount < 0 || amount > points) return this.sendErrorMessage(message, 0, stripIndent`
      Veuillez fournir un nombre de points inférieur ou égal à ${points} (vos point totals)
    `);
    // Remove points
    message.client.db.users.updatePoints.run({ points: -amount }, message.author.id, message.guild.id);
    // Add points
    const oldPoints = message.client.db.users.selectPoints.pluck().get(member.id, message.guild.id);
    message.client.db.users.updatePoints.run({ points: amount }, member.id, message.guild.id);
    let description;
    if (amount === 1) description = `Transféré avec succès **${amount}** point à ${member}!`;
    else description = `Transféré avec succès **${amount}** points  à  ${member}!`;
    const embed = new MessageEmbed()
      .setTitle(`${member.displayName} Points`)
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .setDescription(description)
      .addField('De', message.member, true)
      .addField('À', member, true)
      .addField('Points', `\`${oldPoints}\` ➔ \`${amount + oldPoints}\``, true)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(member.displayHexColor);
    message.channel.send(embed);
  }
};
