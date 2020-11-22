const Command = require('../Command.js');
const ReactionMenu = require('../ReactionMenu.js');
const { MessageEmbed } = require('discord.js');

module.exports = class AdminsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'admins',
      usage: 'admins',
      description: 'Affiche une liste de tous les administrateurs actuels.',
      type: client.types.INFO,
      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'ADD_REACTIONS']
    });
  }
  run(message) {
    
    // Get admin role
    const adminRoleId = message.client.db.settings.selectAdminRoleId.pluck().get(message.guild.id);
    const adminRole = message.guild.roles.cache.get(adminRoleId) || '`Aucun`';

    const admins = message.guild.members.cache.filter(m => {
      if (m.roles.cache.find(r => r === adminRole)) return true;
    }).sort((a, b) => (a.joinedAt > b.joinedAt) ? 1 : -1).array();

    const embed = new MessageEmbed()
      .setTitle(`Liste d'administrateur [${admins.length}]`)
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .addField('<:ownerrrr:759724247584079902> Rôle Administrateur ', adminRole)
      .addField('<:info:759717833260924978> Nombre d\'administrateur ', `> **${admins.length}** pour **${message.guild.members.cache.size}** membres`)
      .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor('#d1b7ff');

    const interval = 25;
    if (admins.length === 0) message.channel.send(embed.setDescription('<:close:759714410187980861> **Aucun administrateur trouvé faites la commande y!setadminrole.** <:close:759714410187980861>'));
    else if (admins.length <= interval) {
      const range = (admins.length == 1) ? '[1]' : `[1 - ${admins.length}]`;
      message.channel.send(embed
        .setTitle(`<:idcard:759758639492759552> Liste des administrateurs  ${range}`)
        .setDescription(admins.join('\n'))
      );

    // Reaction Menu
    } else {

      embed
        .setTitle('<:idcard:759758639492759552> Liste des administrateurs ')
        .setColor('#d1b7ff')
        .setThumbnail(message.guild.iconURL({ dynamic: true }))
        .setFooter(
          'Expire après 2 minutes.\n' + message.member.displayName,  
          message.author.displayAvatarURL({ dynamic: true })
        );

      new ReactionMenu(message.client, message.channel, message.member, embed, admins, interval);
    }
  }
};