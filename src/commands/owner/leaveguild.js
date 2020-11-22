const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');

const rgx = /^(?:<@!?)?(\d+)>?$/;

module.exports = class LeaveGuildCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'quitteserveur',
      usage: 'quitteserveur <serveur ID>',
      description: 'Forcez Yû a quitter le serveur demander',
      type: client.types.OWNER,
      ownerOnly: true,
      examples: ['leaveguild 709992782252474429']
    });
  }
  async run(message, args) {
    const guildId = args[0];
    if (!rgx.test(guildId))
      return this.sendErrorMessage(message, 0, '<:close:759714410187980861> Veuillez me donné L\'ID du serveur <:close:759714410187980861>');
    const guild = message.client.guilds.cache.get(guildId);
    if (!guild) return this.sendErrorMessage(message, 0, '<:close:759714410187980861> Impossible de trouver le serveur, vérifiez l\'ID que vous avez fournis <:close:759714410187980861>');
    await guild.leave();
    const embed = new MessageEmbed()
      .setDescription(`<:check1:759715187807879168> J'ai bien quitter **${guild.name}** avec succès. <:check1:759715187807879168>`)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor('#d1b7ff');
    message.channel.send(embed);
  } 
};
