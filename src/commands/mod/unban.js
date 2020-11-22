const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');

const rgx = /^(?:<@!?)?(\d+)>?$/;

module.exports = class UnbanCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'unban',
      usage: 'unban <user ID> [reason]',
      description: 'Unbans a member from your server.',
      type: client.types.MOD,
      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'BAN_MEMBERS'],
      userPermissions: ['BAN_MEMBERS'],
      examples: ['unban 134672335474130944']
    });
  }
  async run(message, args) {
    const id = args[0];
    if (!rgx.test(id)) return this.sendErrorMessage(message, 0, 'Veuillez fournir un identifiant d\'utilisateur valide ou bien mentionné le');
    const bannedUsers = await message.guild.fetchBans();
    const user = bannedUsers.get(id).user;
    if (!user) return this.sendErrorMessage(message, 0, 'Impossible de trouver l\'utilisateur, veuillez vérifier l\'ID fourni');

    let reason = args.slice(1).join(' ');
    if (!reason) reason = '`Aucune`';
    if (reason.length > 1024) reason = reason.slice(0, 1021) + '...';

    await message.guild.members.unban(user, reason);
    const embed = new MessageEmbed()
      .setTitle('Unban')
      .setDescription(`${user.tag} a été débannis avec succès.`)
      .addField('Modérateur', message.member, true)
      .addField('Membre', user.tag, true)
      .addField('Raison', reason)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);

    message.channel.send(embed);
    message.client.logger.info(`${message.guild.name}: ${message.author.tag} débannis ${user.tag}`);
    
    // Update modlog
    this.sendModlogMessage(message, reason, { Member: user.tag });
  }
};
