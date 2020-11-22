const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');

module.exports = class KickCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'kick',
      usage: 'kick @membre [raison]',
      description: 'Kicks a member from your server.',
      type: client.types.MOD,
      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'KICK_MEMBERS'],
      userPermissions: ['KICK_MEMBERS'],
      examples: ['kick @Membre']
    });
  }
  async run(message, args) {

    const member = this.getMemberFromMention(message, args[0]) || message.guild.members.cache.get(args[0]);
    if (!member)
      return this.sendErrorMessage(message, 0, 'Veuillez mentionner un utilisateur ou fournir un ID utilisateur valide');
    if (member === message.member) 
      return this.sendErrorMessage(message, 0, 'Vous ne pouvez pas vous expulsez'); 
    if (member.roles.highest.position >= message.member.roles.highest.position)
      return this.sendErrorMessage(message, 0, 'Vous ne pouvez pas expulsez quelqu\'un avec un rôle égal ou supérieur');
    if (!member.kickable) 
      return this.sendErrorMessage(message, 0, 'Le membre fourni est introuvable');

    let reason = args.slice(1).join(' ');
    if (!reason) reason = '`Aucune`';
    if (reason.length > 1024) reason = reason.slice(0, 1021) + '...';

    await member.kick(reason);

    const embed = new MessageEmbed()
      .setDescription(`<:check1:759715187807879168> ${member} a bien été exclus du serveur.`)
      .setColor('#d1b7ff')
      .addField('Modérateur', message.member, true)
      .addField('Membre', member, true)
      .addField('Raison', reason)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    message.channel.send(embed);
    message.client.logger.info(`${message.guild.name}: ${message.author.tag} kick ${member.user.tag}`);
    
    // Update modlog
    this.sendModlogMessage(message, reason, { Member: member});
  }
};
