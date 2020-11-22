const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const { pong } = require('../../utils/emojis.json');

module.exports = class PingCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'ping',
      usage: 'ping',
      description: 'Gets Calypso\'s current latency and API latency.',
      type: client.types.INFO
    });
  }
  async run(message) {
    const embed = new MessageEmbed()
      .setDescription('`Je recherche le ping de Yû`')
      .setColor('#d1b7ff');   
    const msg = await message.channel.send(embed);
    const timestamp = (message.editedTimestamp) ? message.editedTimestamp : message.createdTimestamp; // Check if edited
    const latency = `> **${Math.floor(msg.createdTimestamp - timestamp)}ms**`;
    const apiLatency = `> **${Math.round(message.client.ws.ping)}ms**`;
    embed.setTitle(`Ping trouvé <:check1:759715187807879168>`)
      .setDescription('')
      .addField('<:wifi:759753473939734538> Latence', latency, true)
      .addField('<:wifi1:759753410060353596> API Latence', apiLatency, true)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp();
    msg.edit(embed);
  }
};
