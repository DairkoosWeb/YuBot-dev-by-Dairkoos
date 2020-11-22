const Command = require('../Command.js');
const ReactionMenu = require('../ReactionMenu.js');
const { MessageEmbed } = require('discord.js');

module.exports = class EmojisCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'emojis',
      aliases: ['e'],
      usage: 'emojis',
      description: 'liste des émojis.',
      type: client.types.INFO
    });
  }
  run(message) {

    const emojis = [];
    message.guild.emojis.cache.forEach(e => emojis.push(`${e} **-** \`:${e.name}:\``));

    const embed = new MessageEmbed()
      .setTitle(`<:leftarrow:759752103815675965> Liste des émojis [${message.guild.emojis.cache.size}] <:rightarrow:759752085847277620>`)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor('#d1b7ff');

    const interval = 25;
    if (emojis.length === 0) message.channel.send(embed.setDescription('<:close:759714410187980861> **Aucun émojis trouvé sur ce serveur.** <:close:759714410187980861>'));
    else if (emojis.length <= interval) {
      const range = (emojis.length == 1) ? '[1]' : `[1 - ${emojis.length}]`;
      message.channel.send(embed
        .setTitle(`<:leftarrow:759752103815675965> Liste des émojis ${range} <:rightarrow:759752085847277620>`)
        .setDescription(emojis.join('\n'))
        .setColor('#d1b7ff')
        .setThumbnail(message.guild.iconURL({ dynamic: true }))
      );
    
    // Reaction Menu
    } else {

      embed
        .setTitle('<:leftarrow:759752103815675965> Liste des émojis <:rightarrow:759752085847277620>`')
        .setColor('#d1b7ff') 
        .setThumbnail(message.guild.iconURL({ dynamic: true }))
        .setFooter(
          'Expire après 2 minutes.\n' + message.member.displayName,  
          message.author.displayAvatarURL({ dynamic: true })
        );

      new ReactionMenu(message.client, message.channel, message.member, embed, emojis, interval);
    }
  }
};
