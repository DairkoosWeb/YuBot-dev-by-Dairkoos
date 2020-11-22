const Command = require('../Command.js');
const ReactionMenu = require('../ReactionMenu.js');
const { MessageEmbed } = require('discord.js');

module.exports = class ModsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'modo',
      usage: 'modo',
      description: '-',
      type: client.types.INFO,
      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'ADD_REACTIONS']
    });
  }
  run(message) {
    
    // Get mod role
    const modRoleId = message.client.db.settings.selectModRoleId.pluck().get(message.guild.id);
    const modRole = message.guild.roles.cache.get(modRoleId) || '`Aucun`';

    const mods = message.guild.members.cache.filter(m => {
      if (m.roles.cache.find(r => r === modRole)) return true;
    }).sort((a, b) => (a.joinedAt > b.joinedAt) ? 1 : -1).array();

    const embed = new MessageEmbed()
      .setTitle(`<:idcard:759758639492759552> Liste des modérateurs [${mods.length}]`)
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .addField('<:userfdbh:759904954772226079> Rôle Modérateur', modRole)
      .addField('<:info:759717833260924978> Nombre de Modérateurs', `> **${mods.length}** pour **${message.guild.members.cache.size}** Membres`)
      .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor('#d1b7ff');

    const interval = 25;
    if (mods.length === 0) message.channel.send(embed.setDescription('<:close:759714410187980861> Aucun modérateur. <:close:759714410187980861>'));
    else if (mods.length <= interval) {
      const range = (mods.length == 1) ? '[1]' : `[1 - ${mods.length}]`;
      message.channel.send(embed
        .setTitle(`<:idcard:759758639492759552> Liste des modérateurs ${range}`)
        .setDescription(mods.join('\n'))
      );

    // Reaction Menu
    } else {

      embed
        .setTitle('<:idcard:759758639492759552> Liste des modérateurs')
        .setThumbnail(message.guild.iconURL({ dynamic: true }))
        .setFooter(
          'Expire après 2 minutes.\n' + message.member.displayName,  
          message.author.displayAvatarURL({ dynamic: true })
        );

      new ReactionMenu(message.client, message.channel, message.member, embed, mods, interval);
    }
  }
};