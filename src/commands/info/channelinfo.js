const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const moment = require('moment');
const { voice } = require('../../utils/emojis.json');
const { oneLine, stripIndent } = require('common-tags');
const channelTypes = {
  dm: '<:discussion:759720941700907008> DM',
  text: '<:chate:759908269941981194> Textuelle',
  voice: '<:vocal:759907843045589032> Vocals',
  category: '<:pin:759751021118881822> Catégorie',
  news: '<:bullhorn:759720332906725386> Annonces ',
  store: 'Store'
};

module.exports = class ChannelInfoCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'saloninfo',
      aliases: ['channel', 'ci'],
      usage: 'channelinfo [channel mention/ID]',
      description: oneLine`
      Obtenez les informations sur un salons.
      `,
      type: client.types.INFO,
      examples: ['channelinfo #general']
    });
  }
  run(message, args) {
    let channel = this.getChannelFromMention(message, args[0]) || message.guild.channels.cache.get(args[0]);
    if (channel) {
      args.shift();
    } else channel = message.channel;
    const embed = new MessageEmbed()
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .addField('<:pin:759751021118881822> Salon', channel, true)
      .addField('<:flageee:759913357246595113> ID', `> ${channel.id}`, true)
      .addField('<:aques:759717451901566977> Type', `> **${channelTypes[channel.type]}**`, true)
      .addField('<:userfdbh:759904954772226079> Membres', `> ${channel.members.size}`, true)
      .addField('<:discussion:759720941700907008> Bots', `> ${channel.members.array().filter(b => b.user.bot).length}`, true)
      .addField('<:idcard:759758639492759552> Créé le', `> ${moment(channel.createdAt).format('MMM DD YYYY')}`, true)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor('#d1b7ff');
    if (channel.type === 'text') {
      embed // Text embed
        .spliceFields(3, 0, { name: '<:info:759717833260924978> Limite', value: `> ${channel.rateLimitPerUser}`, inline: true })
        .spliceFields(6, 0, { name: '<:toilealala:759751035971174401> NSFW', value: `> ${channel.nsfw}`, inline: true });
    } else if (channel.type === 'news') {
      embed // News embed
        .spliceFields(6, 0, { name: 'NSFW', value: `> ${channel.nsfw}`, inline: true });
    } else if (channel.type === 'voice') {
      embed // Voice embed
        .spliceFields(0, 1, { name: 'Salon', value: `> ${voice} ${channel.name}`, inline: true })
        .spliceFields(5, 0, { name: 'Limite des Membres', value: `> ${channel.userLimit}`, inline: true })
        .spliceFields(6, 0, { name: 'Full', value: `> ${channel.full}`, inline: true });
      const members = channel.members.array();
      if (members.length > 0) 
        embed.addField('Membre rejoins', message.client.utils.trimArray(channel.members.array()).join(' '));
    } else return this.sendErrorMessage(message, 0, stripIndent`
      Veuillez mentionné un salon` +
      'Ou entrer l\'ID du salon'
    );
    if (channel.topic) embed.addField('Topic', channel.topic);
    message.channel.send(embed);
  }
};
