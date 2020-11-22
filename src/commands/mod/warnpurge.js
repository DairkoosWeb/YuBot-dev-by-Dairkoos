const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const moment = require('moment');

module.exports = class WarnPurgeCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'warnpurge',
      aliases: ['purgewarn'],
      usage: 'warnpurge <user mention/ID> <message count> [reason]',
      description: 'Warns a member in your server and then purges their messages from the message count provided.',
      type: client.types.MOD,
      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'KICK_MEMBERS', 'MANAGE_MESSAGES'],
      userPermissions: ['KICK_MEMBERS', 'MANAGE_MESSAGES'],
      examples: ['warnpurge @Nettles 50']
    });
  }
  async run(message, args) {

    const member = this.getMemberFromMention(message, args[0]) || message.guild.members.cache.get(args[0]);
    if (!member) 
      return this.sendErrorMessage(message, 0, 'Veuillez mentionner un utilisateur ou fournir un ID utilisateur valide');
    if (member === message.member) 
      return this.sendErrorMessage(message, 0, 'Vous ne pouvez pas vous enlever vos propre warn'); 
    if (member.roles.highest.position >= message.member.roles.highest.position) 
      return this.sendErrorMessage(message, 0, 'Vous ne pouvez pas warn quelqu\'un avec un rôle égal ou supérieur');
    
    const autoKick = message.client.db.settings.selectAutoKick.pluck().get(message.guild.id); 

    const amount = parseInt(args[1]);
    if (isNaN(amount) === true || !amount || amount < 0 || amount > 100)
      return this.sendErrorMessage(message, 0, 'Please provide a message count between 1 and 100');

    let reason = args.slice(2).join(' ');
    if (!reason) reason = '`Aucune`';
    if (reason.length > 1024) reason = reason.slice(0, 1021) + '...';

    // Warn
    let warns = message.client.db.users.selectWarns.pluck().get(member.id, message.guild.id) || { warns: [] };
    if (typeof(warns) == 'string') warns = JSON.parse(warns);
    const warning = {
      mod: message.member.id,
      date:  moment().format('MMM DD YYYY'),
      reason: reason
    };

    warns.warns.push(warning);
  
    message.client.db.users.updateWarns.run(JSON.stringify(warns), member.id, message.guild.id);

    // Purge
    const messages = (await message.channel.messages.fetch({ limit: amount })).filter(m => m.member.id === member.id);
    if (messages.size > 0) await message.channel.bulkDelete(messages, true);  

    const embed = new MessageEmbed()
      .setTitle('Warnpurge')
      .setDescription(`${member} a été averti, avec **${messages.size}** messages purgés.`)
      .addField('Modérateur', message.member, true)
      .addField('Membre', member, true)
      .addField('Warn', `\`${warns.warns.length}\``, true)
      .addField('Messages', `\`${messages.size}\``, true)
      .addField('Raison', reason)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    message.channel.send(embed);
    message.client.logger.info(`${message.guild.name}: ${message.author.tag} warnpurged ${member.user.tag}`);
    
    // Update modlog
    this.sendModlogMessage(message, reason, { 
      Member: member, 
      'Total de warn': `\`${warns.warns.length}\``,
      'Nombre de messages': `\`${messages.size}\``
    });

    // Check for auto kick
    if (autoKick && warns.warns.length === autoKick) {
      message.client.commands.get('kick')
        .run(message, [member.id, `Limite d'avertissement atteinte. Lancé automatiquement par ${message.guild.me}.`]);
    }

  }
};
