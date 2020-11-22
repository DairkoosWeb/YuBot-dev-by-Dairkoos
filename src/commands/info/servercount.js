const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const { stripIndent } = require('common-tags');

module.exports = class ServerCountCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'servercount',
      aliases: ['usercount', 'sc', 'uc'],
      usage: 'servercount',
      description: 'Fetches Calypso\'s current server and user count.',
      type: client.types.INFO
    });
  }
  run(message) {
    const counts = stripIndent`
      **Serveurs** : ${message.client.guilds.cache.size}
      **Membres**  : ${message.client.users.cache.size}
    `;
    const embed = new MessageEmbed()
      .setDescription(stripIndent`${counts}`)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    message.channel.send(embed);
  }
};
