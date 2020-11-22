const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const { success } = require('../../utils/emojis.json');

module.exports = class SetAdminRoleCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setadminrole',
      aliases: ['setar', 'sar'],
      usage: 'setadminrole <role mention/ID>',
      description: 'Définit le `rôle administrateur` pour votre serveur est pour la commande admin`.',
      type: client.types.ADMIN,
      userPermissions: ['MANAGE_GUILD'],
      examples: ['setadminrole @Admin']
    });
  }
  run(message, args) {
    const adminRoleId = message.client.db.settings.selectAdminRoleId.pluck().get(message.guild.id);
    const oldAdminRole = message.guild.roles.cache.find(r => r.id === adminRoleId) || '`Aucun`';

    const embed = new MessageEmbed()
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription(`${success} Le \`rôle administrateur\` a bien été mise a jours. ${success}`)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor('#d1b7ff');

    // Clear if no args provided
    if (args.length === 0) {
      message.client.db.settings.updateAdminRoleId.run(null, message.guild.id);
      return message.channel.send(embed.addField('Rôle administrateur', `${oldAdminRole} ➔ \`Aucun\``));
    }

    // Update role
    const adminRole = this.getRoleFromMention(message, args[0]) || message.guild.roles.cache.get(args[0]);
    if (!adminRole) return this.sendErrorMessage(message, 0, 'Veuillez mentionner un rôle ou fournir un ID de rôle valide');
    message.client.db.settings.updateAdminRoleId.run(adminRole.id, message.guild.id);
    message.channel.send(embed.addField('Rôle administrateur', `${oldAdminRole} ➔ ${adminRole}`));
  }
};