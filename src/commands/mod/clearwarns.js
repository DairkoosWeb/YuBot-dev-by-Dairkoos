const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const { oneLine } = require('common-tags');

module.exports = class ClearWarnsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'clearwarns',
      usage: 'clearwarns @membre [raison]',
      description: 'Clears all the warns of the provided member.',
      type: client.types.MOD,
      userPermissions: ['KICK_MEMBERS'],
      examples: ['clearwarns @Membre']
    });
  }
  run(message, args) {

    const member = this.getMemberFromMention(message, args[0]) || message.guild.members.cache.get(args[0]);
    if (!member)
      return this.sendErrorMessage(message, 0, 'veuillez mentionner un utilisateur ou donné son ID');
    if (member === message.member) 
      return this.sendErrorMessage(message, 0, 'Vous ne pouvez pas effacer vos propres warns'); 
    if (member.roles.highest.position >= message.member.roles.highest.position)
      return this.sendErrorMessage(message, 0, 'Vous ne pouvez pas effacer les warns d\'une personne ayant un rôle égal ou supérieur');

    let reason = args.slice(1).join(' ');
    if (!reason) reason = '`Aucune`';
    if (reason.length > 1024) reason = reason.slice(0, 1021) + '...';
    
    message.client.db.users.updateWarns.run('', member.id, message.guild.id);

    const embed = new MessageEmbed()
      .setDescription(`<:check1:759715187807879168> Les warns de ${member} on bien été supprimé.`)
      .setColor('#d1b7ff')
      .addField('Modérateur', message.member, true)
      .addField('Membre', member, true)
      .addField('Nombre de warns', '`0`', true)
      .addField('Raison', reason)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    message.channel.send(embed);
    message.client.logger.info(oneLine`
      ${message.guild.name}: ${message.author.tag} a éffacer les warns de ${member.user.tag}
    `);
    
    // Update modlog
    this.sendModlogMessage(message, reason, { Member: member, 'Nombre de warns': '`0`' });
  }
};
