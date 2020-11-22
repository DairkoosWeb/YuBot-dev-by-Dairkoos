const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const moment = require('moment');
const permissions = require('../../utils/permissions.json');

module.exports = class RoleInfoCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'roleinfo',
      aliases: ['role', 'ri'],
      usage: 'roleinfo <role mention/ID>',
      description: '-',
      type: client.types.INFO,
      examples: ['roleinfo @Membre']
    });
  }
  run(message, args) {

    const role = this.getRoleFromMention(message, args[0]) || message.guild.roles.cache.get(args[0]);
    if (!role)
      return this.sendErrorMessage(message, 0, 'Veuillez mentionner un role ou donné l\'id du rôle');

    // Get role permissions
    const rolePermissions = role.permissions.toArray();
    const finalPermissions = [];
    for (const permission in permissions) {
      if (rolePermissions.includes(permission)) finalPermissions.push(` + **${permissions[permission]}**`);
      else finalPermissions.push(` - **${permissions[permission]} **`);
    }

    // Reverse role position
    const position = `\`${message.guild.roles.cache.size - role.position}\`/\`${message.guild.roles.cache.size}\``;

    const embed = new MessageEmbed()
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .addField('<:coentactee:759936748959825962> Mention', role, true)
      .addField('<:pin:759751021118881822> Identifiant', `> ${role.id}`, true)
      .addField('<:aques:759717451901566977> Position', position, true)
      .addField('<:discussion:759720941700907008> Mention', `> ${role.mentionable}`, true)
      .addField('<:settings:759758045496213504> Bot', `> ${role.managed}`, true)
      .addField('<:nightmode:759753428338999296> Couleur', `> ${role.hexColor.toUpperCase()}`, true)
      .addField('<:userfdbh:759904954772226079> Membres', `> ${role.members.size}`, true)
      .addField('<:idcard:759758639492759552> Crée le', `> ${moment(role.createdAt).format('MMM DD YYYY')}`, true)
      .addField('Permissions', `${finalPermissions.join('\n')}`)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor('#d1b7ff');
    message.channel.send(embed);
  }
};
