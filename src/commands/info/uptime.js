const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const moment = require('moment');

module.exports = class UptimeCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'uptime',
      aliases: ['up'],
      usage: 'uptime',
      description: '-',
      type: client.types.INFO
    });
  }
  run(message) {
    const d = moment.duration(message.client.uptime);
    const days = (d.days() == 1) ? `${d.days()} jours` : `${d.days()} jours`;
    const hours = (d.hours() == 1) ? `${d.hours()} heures` : `${d.hours()} heures`;
    const minutes = (d.minutes() == 1) ? `${d.minutes()} minutes` : `${d.minutes()} minutes`;
    const seconds = (d.seconds() == 1) ? `${d.seconds()} secondes` : `${d.seconds()} secondes`;
    const date = moment().subtract(d, 'ms').format('dddd, MMMM Do YYYY');
    const embed = new MessageEmbed()
      .setThumbnail('https://data.whicdn.com/images/203270237/original.gif')
      .setDescription(`> <:wifi:759753473939734538> ** ${days}, ${hours}, ${minutes}, et ${seconds} **`)
      .addField('> <:settings:759758045496213504> Lancer le', date) 
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor('#d1b7ff');
    message.channel.send(embed);
  }
};
