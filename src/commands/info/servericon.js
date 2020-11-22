const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');

module.exports = class ServerIconCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'serveuricon',
      aliases: ['icon', 'i'],
      usage: 'serveuricon',
      description: '-',
      type: client.types.INFO
    });
  }
  run(message) {
    const embed = new MessageEmbed()
      .setTitle(`<:coeuryu:759745558000435206> Voici l'icone du serveur ${message.guild.name}`)
      .setImage(message.guild.iconURL({ dynamic: true, size: 512 }))
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor('#d1b7ff');
    message.channel.send(embed);
  }
};
