const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const moment = require('moment');
const emojis = require('../../utils/emojis.json');
const statuses = {
  online: `${emojis.online} `,
  idle: `${emojis.idle} `,
  offline: `${emojis.offline}`,
  dnd: `${emojis.dnd} `
};
const flags = {
  DISCORD_EMPLOYEE: `${emojis.discord_employee} `,
  DISCORD_PARTNER: `${emojis.discord_partner} `,
  BUGHUNTER_LEVEL_1: `${emojis.bughunter_level_1} `,
  BUGHUNTER_LEVEL_2: `${emojis.bughunter_level_2} `,
  HYPESQUAD_EVENTS: `${emojis.hypesquad_events} `,
  HOUSE_BRAVERY: `${emojis.house_bravery} `,
  HOUSE_BRILLIANCE: `${emojis.house_brilliance} `,
  HOUSE_BALANCE: `${emojis.house_balance} `,
  EARLY_SUPPORTER: `${emojis.early_supporter} `,
  TEAM_USER: 'Team User',
  SYSTEM: 'System',
  VERIFIED_BOT: `${emojis.verified_bot} `,
  VERIFIED_DEVELOPER: `${emojis.verified_developer} `
};

module.exports = class UserInfoCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'userinfo',
      aliases: ['whois', 'user', 'ui'],
      usage: 'userinfo [user mention/ID]',
      description: '-',
      type: client.types.INFO,
      examples: ['userinfo @Nettles']
    });
  }
  async run(message, args) {
    const member =  this.getMemberFromMention(message, args[0]) || 
      message.guild.members.cache.get(args[0]) || 
      message.member;
    const userFlags = (await member.user.fetchFlags()).toArray();
    const activities = [];
    let customStatus;
    for (const activity of member.presence.activities.values()) {
      switch (activity.type) {
        case 'PLAYING':
          activities.push(`> <:gamepadeee:759982853647499274> **Joue a** \`${activity.name}\``);
          break;
        case 'LISTENING':
          if (member.user.bot) activities.push(`Écoute **${activity.name}**`);
          else activities.push(`> <:spotifyeee:759982146768863232> **Écoute** \`${activity.details}\` **de** \`${activity.state}\``);
          break;
        case 'WATCHING':
          activities.push(`**Regarde** \`${activity.name}\``);
          break;
        case 'STREAMING':
          activities.push(`**Stream** \`${activity.name}\``);
          break;
        case 'CUSTOM_STATUS':
          customStatus = activity.state;
          break;
      }
    }
    
    // Trim roles
    let roles = message.client.utils.trimArray(member.roles.cache.array().filter(r => !r.name.startsWith('#')));
    roles = message.client.utils.removeElement(roles, message.guild.roles.everyone)
      .sort((a, b) => b.position - a.position).join(' ');
    
    const embed = new MessageEmbed()
      .setTitle(`<:info:759717833260924978> Information de : ${member.displayName}`)
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .addField('<:coentactee:759936748959825962> Membre', member, true)
      .addField('<:hashtagzzz:759985273823690763> Tag', `> #${member.user.discriminator}`, true)
      .addField('<:idcard:759985699054682193> Identifiant', `> ${member.id}`, true)
      .addField('<:toggle:759719422788501504> Status', statuses[member.presence.status], true)
      .addField('<:robotzzz:759986264992251964> Bot', `> ${member.user.bot}`, true)
      .addField('<:timeeeeeeeeeeee:759986886919192646> Rejoins le', `> ${moment(member.joinedAt).format('MMM DD YYYY')}`, true)
      .addField('<:user1eeee:759986861312704582> Crée le', `> ${moment(member.user.createdAt).format('MMM DD YYYY')}`, true)
      .addField('<:aques:759717451901566977> Rôles', roles || '> Aucun')
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor('#d1b7ff');
    if (activities.length > 0) embed.setDescription(activities.join('\n'));
    if (customStatus) embed.spliceFields(0, 0, { name: '> <:controls:759984557012811787> Custom Status', value: customStatus});
    if (userFlags.length > 0) embed.addField('> <:toilealala:759751035971174401> Badges', userFlags.map(flag => flags[flag]).join('\n'));
    message.channel.send(embed);
  }
};
