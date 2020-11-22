const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const { oneLine, stripIndent } = require('common-tags');

module.exports = class PurgeCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'purge',
      aliases: ['clear'],
      usage: 'purge [channel mention/ID] [user mention/ID] <message count> [reason]',
      description: oneLine`
    purge un salon
      `,
      type: client.types.MOD,
      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'MANAGE_MESSAGES'],
      userPermissions: ['MANAGE_MESSAGES'],
      examples: ['purge 20', 'purge #general 10', 'purge @dairkoos 50', 'purge #general @dairkoos 5']
    });
  }
  async run(message, args) {

    let channel = this.getChannelFromMention(message, args[0]) || message.guild.channels.cache.get(args[0]);
    if (channel) {
      args.shift();
    } else channel = message.channel;

    // Check type and viewable
    if (channel.type != 'text' || !channel.viewable) return this.sendErrorMessage(message, 0, stripIndent`
    Veuillez mentionner un canal de texte accessible ou fournir un ID de canal de texte valide
    `);

    let member = this.getMemberFromMention(message, args[0]) || message.guild.members.cache.get(args[0]);
    if (member) {
      args.shift();
    }

    const amount = parseInt(args[0]);
    if (isNaN(amount) === true || !amount || amount < 0 || amount > 100)
      return this.sendErrorMessage(message, 0, 'Veuillez fournir un nombre compris entre 1 et 100');

    // Check channel permissions
    if (!channel.permissionsFor(message.guild.me).has(['MANAGE_MESSAGES']))
      return this.sendErrorMessage(message, 0, 'Je n\'ai pas l\'autorisation de gérer les messages dans ce salon fourni');

    let reason = args.slice(1).join(' ');
    if (!reason) reason = '`Aucune`';
    if (reason.length > 1024) reason = reason.slice(0, 1021) + '...';

    await message.delete(); // Delete command message

    // Find member messages if given
    let messages;
    if (member) {
      messages = (await channel.messages.fetch({ limit: amount })).filter(m => m.member.id === member.id);
    } else messages = amount;

    if (messages.size === 0) { // No messages found

      message.channel.send(
        new MessageEmbed()
          .setTitle('Purge')
          .setDescription(`
           Impossible de trouver les messages de ${member}. 
           Ce message sera supprimé après \`10 secondes\`.
          `)
          .addField('Salon', channel, true)
          .addField('Membre', member )
          .addField('Messages trouvés', `\`${messages.size}\``, true)
          .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
          .setTimestamp()
          .setColor(message.guild.me.displayHexColor)
      ).then(msg => msg.delete({ timeout: 10000 })).catch(err => message.client.logger.error(err.stack));

    } else { // Purge messages

      channel.bulkDelete(messages, true).then(messages => {
        const embed = new MessageEmbed()
          .setTitle('Purge')
          .setDescription(`
          Supprimé avec succès **${messages.size}** message(s). 
          Ce message sera supprimé après \`10 secondes\`.
          `)
          .addField('Salon', channel, true)
          .addField('Nombre de messages', `\`${messages.size}\``, true)
          .addField('Raison', reason)
          .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
          .setTimestamp()
          .setColor(message.guild.me.displayHexColor);
  
        if (member) {
          embed
            .spliceFields(1, 1, { name: 'Messages trouvés', value:  `\`${messages.size}\``, inline: true})
            .spliceFields(1, 0, { name: 'Membre', value: member, inline: true});
        }

        message.channel.send(embed).then(msg => msg.delete({ timeout: 10000 }))
          .catch(err => message.client.logger.error(err.stack));
      });
    }
    
    // Update modlog
    const fields = { 
      Channel: channel
    };

    if (member) {
      fields['Membre'] = member;
      fields['Messages trouvés'] = `\`${messages.size}\``;
    } else fields['Nombre de messages'] = `\`${amount}\``;

    this.sendModlogMessage(message, reason, fields);

  }
};
