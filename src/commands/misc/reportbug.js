const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const { oneLine } = require('common-tags');

module.exports = class ReportBugCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'reportbug',
      aliases: ['bugreport', 'report', 'bug', 'rb', 'br'],
      usage: 'reportbug <message>',
      description: oneLine`
      `,
      type: client.types.MISC,
      examples: ['envoyé un bug afin que nous puissons régler le probleme']
    });
  }
  run(message, args) {
    const reportChannel = message.client.channels.cache.get(message.client.bugReportChannelId);
    if (!reportChannel)
      return this.sendErrorMessage(message, 1, '<:close:759714410187980861> La propriété "bugReport" a pas été définie <:close:759714410187980861> ');
    if (!args[0]) return this.sendErrorMessage(message, 0, '<:pin:759751021118881822> Veuillez fournir un message à envoyer <:pin:759751021118881822>');
    let report = message.content.slice(message.content.indexOf(args[0]), message.content.length);

    // Send report
    const reportEmbed = new MessageEmbed()
      .setThumbnail(reportChannel.guild.iconURL({ dynamic: true }))
      .setDescription(report) 
      .addField('> <:userfdbh:759904954772226079> Membre', message.member, true)
      .addField('> <:flageee:759913357246595113> Serveur', message.guild.name, true)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor('#d1b7ff');
    reportChannel.send(reportEmbed);

    // Send response
    if (report.length > 1024) report = report.slice(0, 1021) + '...';
    const embed = new MessageEmbed()
      .setThumbnail('https://cdn.discordapp.com/attachments/726229758886543423/750697509390909530/original.gif')
      .setDescription(oneLine`
      <:check1:759715187807879168> Le bug a bien été envoyé !
        s'il vous plait rejoingnez --> [Yû support (serv)](https://discord.gg/zRXTK7q) pour discuté de votre problème. <:coeuryu:759745558000435206>
      `) 
      .addField('> <:userfdbh:759904954772226079> Membre', message.member, true)
      .addField('> <:pushfgg:759754863113404426> Message', report)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor('#d1b7ff');
    message.channel.send(embed);
  }
};
