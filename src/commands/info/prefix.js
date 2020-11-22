const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');

module.exports = class PrefixCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'prefix',
      aliases: ['pre'],
      usage: 'prefix',
      description: '-',
      type: client.types.INFO
    });
  }
  run(message) {
    const prefix = message.client.db.settings.selectPrefix.pluck().get(message.guild.id); // Get prefix
    const embed = new MessageEmbed()
      .setTitle('Voici le préfix de Yû <:attention:759717913098715186>')
      .setThumbnail('https://64.media.tumblr.com/108cc9421c3168b0bacace1f806c28b1/tumblr_npyw4yYvCk1thvxebo10_500.gif')
      .addField('<:info:759717833260924978> Préfix', `> **${prefix}**`, true)
      .addField('<:aques:759717451901566977> Example', `> **${prefix}invite**`, true)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor('#d1b7ff'); 
    message.channel.send(embed);
  }
};
