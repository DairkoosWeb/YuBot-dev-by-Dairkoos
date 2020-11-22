const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const { success } = require('../../utils/emojis.json');

module.exports = class SetPrefixCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setprefix',
      aliases: ['setp', 'sp'],
      usage: 'setprefix <prefix>',
      description: 'Sets the command `prefix` for your server. The max `prefix` length is 3 characters.',
      type: client.types.ADMIN,
      userPermissions: ['MANAGE_GUILD'],
      examples: ['setprefix !']
    });
  }
  run(message, args) {
    const oldPrefix = message.client.db.settings.selectPrefix.pluck().get(message.guild.id);
    const prefix = args[0];
    if (!prefix) return this.sendErrorMessage(message, 0, 'Veuillez fournir un préfix');
    else if (prefix.length > 3) 
      return this.sendErrorMessage(message, 0, 'Veuillez vous assurer que le préfix ne dépasse pas 3 caractères');
    message.client.db.settings.updatePrefix.run(prefix, message.guild.id);
    const embed = new MessageEmbed()
      .setTitle('Settings: `Prefix`')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription(`le \`prefix\` a bien été changer. ${success}`)
      .addField('Préfix', `\`${oldPrefix}\` ➔ \`${prefix}\``)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    message.channel.send(embed);
  }
};
