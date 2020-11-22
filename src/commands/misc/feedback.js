const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const { oneLine } = require('common-tags');

module.exports = class FeedbackCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'avis',
      aliases: ['fb'],
      usage: 'avis <message>',
      description: 'Envoie un avis au développer du bot',
      type: client.types.MISC,
      examples: ['avis jaime bien Yû il est trop beau 🤩']
    });
  }
  run(message, args) {
    const feedbackChannel = message.client.channels.cache.get(message.client.feedbackChannelId);
    if (!feedbackChannel) 
      return this.sendErrorMessage(message, 1, '<:close:759714410187980861> ID non définis contacté le support <:close:759714410187980861>');
    if (!args[0]) return this.sendErrorMessage(message, 0, '<:close:759714410187980861> Veuillez entrer un message. <:close:759714410187980861>');
    let feedback = message.content.slice(message.content.indexOf(args[0]), message.content.length);

    // Send report
    const feedbackEmbed = new MessageEmbed()
      .setThumbnail(feedbackChannel.guild.iconURL({ dynamic: true }))
      .setDescription(feedback)
      .addField('> <:userfdbh:759904954772226079> Membre', message.member, true)
      .addField('<:flageee:759913357246595113> Serveur', message.guild.name, true)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor('#d1b7ff');
    feedbackChannel.send(feedbackEmbed);

    // Send response
    if (feedback.length > 1024) feedback = feedback.slice(0, 1021) + '...';
    const embed = new MessageEmbed()
      .setThumbnail('https://thumbs.gfycat.com/GroundedPeskyIvorybilledwoodpecker-size_restricted.gif')
      .setDescription(oneLine`
      <:check1:759715187807879168> Votre avis a bien été envoyer.
        s'il vous plait rejoingnez --> [Yû support (serv)](https://discord.gg/zRXTK7q) pour discuté de votre avis. <:coeuryu:759745558000435206>
      `) 
      .addField('> <:userfdbh:759904954772226079> Membre', message.member, true)
      .addField('> <:pushfgg:759754863113404426> Message', feedback)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor('#d1b7ff');
    message.channel.send(embed);
  }
};
