const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const ms = require('ms');

module.exports = class MuteCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'mute',
      usage: 'mute @Membre <durée> [raison]',
      description: '',
      type: client.types.MOD,
      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'MANAGE_ROLES'],
      userPermissions: ['MANAGE_ROLES'],
      examples: ['-']
    });
  }
  async run(message, args) {

    const muteRoleId = message.client.db.settings.selectMuteRoleId.pluck().get(message.guild.id);
    let muteRole;
    if (muteRoleId) muteRole = message.guild.roles.cache.get(muteRoleId);
    else return this.sendErrorMessage(message, 1, 'Aucun rôle muet n\'est actuellement défini sur ce serveur');

    const member = this.getMemberFromMention(message, args[0]) || message.guild.members.cache.get(args[0]);
    if (!member) 
      return this.sendErrorMessage(message, 0, 'Veuillez mentionner un utilisateur ou fournir un ID utilisateur valide');
    if (member === message.member)
      return this.sendErrorMessage(message, 0, 'You cannot mute yourself');
    if (member === message.guild.me) return this.sendErrorMessage(message, 0, 'Vous ne pouvez pas me mute');
    if (member.roles.highest.position >= message.member.roles.highest.position)
      return this.sendErrorMessage(message, 0, 'Vous ne pouvez pas mute une personne ayant un rôle égal ou supérieur');
    if (!args[1])
      return this.sendErrorMessage(message, 0, 'Veuillez saisir une durée de 14 jours ou moins (1s/m/h/d)');
    let time = ms(args[1]);
    if (!time || time > 1209600000) // Cap at 14 days, larger than 24.8 days causes integer overflow
      return this.sendErrorMessage(message, 0, 'Veuillez saisir une durée de 14 jours ou moins (1s/m/h/d)');

    let reason = args.slice(2).join(' ');
    if (!reason) reason = '`Aucune`';
    if (reason.length > 1024) reason = reason.slice(0, 1021) + '...';

    if (member.roles.cache.has(muteRoleId))
      return this.sendErrorMessage(message, 0, 'Le membre est déja muté');

    // Mute member
    try {
      await member.roles.add(muteRole);
    } catch (err) {
      message.client.logger.error(err.stack);
      return this.sendErrorMessage(message, 1, 'Vérifié mes permissions', err.message);
    }
    const muteEmbed = new MessageEmbed()
      .setDescription(`${member} est maintenant mute pendant **${ms(time, { long: true })}**.`)
      .setColor('#d1b7ff')
      .addField('Modérateur', message.member, true)
      .addField('Membre', member, true)
      .addField('Durée', `\`${ms(time)}\``, true)
      .addField('Raison', reason)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    message.channel.send(muteEmbed);

    // Unmute member
    member.timeout = message.client.setTimeout(async () => {
      try {
        await member.roles.remove(muteRole);
        const unmuteEmbed = new MessageEmbed()
          .setDescription(`${member} est maintenant autorisé a parler.`)
          .setColor('#d1b7ff')
          .setTimestamp()
          .setColor(message.guild.me.displayHexColor);
        message.channel.send(unmuteEmbed);
      } catch (err) {
        message.client.logger.error(err.stack);
        return this.sendErrorMessage(message, 1, 'Vérifié mes permissions', err.message);
      }
    }, time);

    // Update mod log
    this.sendModLogMessage(message, reason, { Member: member, Time: `\`${ms(time)}\`` });
  }
};