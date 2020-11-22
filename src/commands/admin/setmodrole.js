const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const { success } = require('../../utils/emojis.json');

module.exports = class SetModRoleCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setmodrole',
      aliases: ['setmr', 'smr'],
      usage: 'setmodrole <role mention/ID>',
      description: '-',
      type: client.types.ADMIN,
      userPermissions: ['MANAGE_GUILD'],
      examples: ['setmodrole @Modérateur']
    });
  }
  run(message, args) {
    const modRoleId = message.client.db.settings.selectModRoleId.pluck().get(message.guild.id);
    const oldModRole = message.guild.roles.cache.find(r => r.id === modRoleId) || '`Aucun`';

    const embed = new MessageEmbed()
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription(`<:check1:759715187807879168> Le \`rôle modérateur\` a bien été mise a jours . ${success}`)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor('#d1b7ff');

    // Clear if no args provided
    if (args.length === 0) {
      message.client.db.settings.updateModRoleId.run(null, message.guild.id);
      return message.channel.send(embed.addField('Rôle modérateur', `${oldModRole} ➔ \`Aucun\``));
    }

    // Update role
    const modRole = this.getRoleFromMention(message, args[0]) || message.guild.roles.cache.get(args[0]);
    if (!modRole) return this.sendErrorMessage(message, 0, '<:close:759714410187980861> Aucun Modérateur trouvé faits la commande y!setmodrole <:close:759714410187980861>');
    message.client.db.settings.updateModRoleId.run(modRole.id, message.guild.id);
    message.channel.send(embed.addField('Rôle modérateur', `${oldModRole} ➔ ${modRole}`));
  }
};