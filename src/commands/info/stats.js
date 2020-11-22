const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const moment = require('moment');
const { mem, cpu, os } = require('node-os-utils');
const { stripIndent } = require('common-tags');

module.exports = class StatsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'stats',
      aliases: ['statistics', 'metrics'],
      usage: 'stats',
      description: 'Fetches Calypso\'s statistics.',
      type: client.types.INFO
    });
  }
  async run(message) {
    const d = moment.duration(message.client.uptime);
    const days = (d.days() == 1) ? `${d.days()} jours` : `${d.days()} jours`;
    const hours = (d.hours() == 1) ? `${d.hours()} heures` : `${d.hours()} heures`;
    const clientStats = stripIndent`
     > **Serveurs  : ${message.client.guilds.cache.size} **
     > **Membres   : ${message.client.users.cache.size} **
     > **Salons    : ${message.client.channels.cache.size} **
     > **Ping      : ${Math.round(message.client.ws.ping)}ms **
     > **Uptime    : ${days} & ${hours}**
    `;
    const { totalMemMb, usedMemMb } = await mem.info();
    const serverStats = stripIndent`
     > ** OS        : ${await os.oos()} **
     > ** CPU       : ${cpu.model()} **
     > ** Cores    : ${cpu.count()}  **
     > ** CPU Usage : ${await cpu.usage()} %  **
     > ** RAM       : ${totalMemMb} MB **
     > ** RAM Usage : ${usedMemMb} MB **
    `;
    const embed = new MessageEmbed()
      .setTitle('Voci les stats de Yû')
      .addField('> <:pin:759751021118881822> Commandes', `**${message.client.commands.size} Commandes**`, true)
      .addField('> <:pushfgg:759754863113404426> Aliases', `**${message.client.aliases.size} Aliases**`, true)
      .addField('> <:attention:759717913098715186> Informations', `${clientStats}`)
      .addField('> <:settings:759758045496213504>  VPS', `${serverStats}`)
      .addField(
        '<:share:759718377081143317> Lien', 
        '**[Invite](https://discord.com/api/oauth2/authorize?client_id=735561873608540281&permissions=8&scope=bot) | ' +
        '[Support](https://discord.gg/xkFnsYZ) | ' +
        '[Vote](https://top.gg/bot/735561873608540281/vote)**'
      )
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor('#d1b7ff');
    message.channel.send(embed);
  }
};
