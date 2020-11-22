const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const emojis = require('../../utils/emojis.json');
const { oneLine, stripIndent } = require('common-tags');

module.exports = class AliasesCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'aliases',
      aliases: ['alias', 'ali', 'a'],
      usage: 'aliases [command type]',
      description: oneLine`
        Obtenir tout les aliases de toutes le commandes.
      `,
      type: client.types.INFO,
      examples: ['aliases Fun']
    });
  }
  run(message, args) {

    // Get disabled commands
    let disabledCommands = message.client.db.settings.selectDisabledCommands.pluck().get(message.guild.id) || [];
    if (typeof(disabledCommands) === 'string') disabledCommands = disabledCommands.split(' ');

    const aliases = {};
    const embed = new MessageEmbed();
    for (const type of Object.values(message.client.types)) {
      aliases[type] = [];
    }

    const type = (args[0]) ? args[0].toLowerCase() : '';
    const types = Object.values(message.client.types);
    const { INFO, FUN, COLOR, POINTS, MISC, MOD, ADMIN, OWNER } = message.client.types;
    const { capitalize } = message.client.utils;

    const emojiMap = {
      [INFO]: `${emojis.info} ${capitalize(INFO)}`,
      [FUN]: `${emojis.fun} ${capitalize(FUN)}`,
      [COLOR]: `${emojis.color} ${capitalize(COLOR)}`,
      [POINTS]: `${emojis.points} ${capitalize(POINTS)}`,
      [MISC]: `${emojis.misc} ${capitalize(MISC)}`,
      [MOD]: `${emojis.mod} ${capitalize(MOD)}`,
      [ADMIN]: `${emojis.admin} ${capitalize(ADMIN)}`,
      [OWNER]: `${emojis.owner} ${capitalize(OWNER)}`
    };
    
    if (args[0] && types.includes(type) && (type != OWNER || message.client.isOwner(message.member))) {
      
      message.client.commands.forEach(command => {
        if (command.aliases && command.type === type && !disabledCommands.includes(command.name)) 
          aliases[command.type].push(`**${command.name}:** ${command.aliases.map(a => `\`${a}\``).join(' ')}`);
      });

      embed
        .setTitle(`Aliases : \`${capitalize(type)}\``)
        .setThumbnail('https://cdn.discordapp.com/attachments/736245330710102048/750656078743732274/unnamed.gif')
        .addField(
          `**${emojiMap[type]} [${aliases[type].reduce((a, b) => a + b.split(' ').slice(1).length, 0)}]**`, 
          aliases[type].join('\n')
        )
        .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
        .setTimestamp()
        .setColor(message.guild.me.displayHexColor);

    } else if (type) {
      return this.sendErrorMessage(message, 0, 'Impossible de trouver le type de commande, veuillez vérifier le type fourni');

    } else {

      message.client.commands.forEach(command => {
        if (command.aliases && !disabledCommands.includes(command.name)) 
          aliases[command.type].push(`**${command.name}:** ${command.aliases.map(a => `\`${a}\``).join(' ')}`);
      });

      const prefix = message.client.db.settings.selectPrefix.pluck().get(message.guild.id);

      embed
        .setTitle('Yû Aliases')
        .setDescription(stripIndent`
          **Préfix :** \`${prefix}\`
          **Information:** \`${prefix}aliases [commandes]\`
        `)
        .setImage('https://cdn.discordapp.com/attachments/736245330710102048/750656078743732274/unnamed.gif')
        .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
        .setTimestamp()
        .setColor(message.guild.me.displayHexColor);

      for (const type of Object.values(message.client.types)) {
        if (type === OWNER && !message.client.isOwner(message.member)) continue;
        if (aliases[type][0]) 
          embed.addField(
            `**${emojiMap[type]}**`, `
            \`${aliases[type].reduce((a, b) => a + b.split(' ').slice(1).length, 0)}\` aliases`, 
            true
          );
      }

      embed.addField(
        '**Lien**', 
        '**[Invite](https://discord.com/api/oauth2/authorize?client_id=735561873608540281&permissions=8&scope=bot) | ' +
        '[Support](https://discord.gg/xkFnsYZ) | ' +
        '[vote](https://top.gg/bot/735561873608540281/vote)**'
      );

    }

    message.channel.send(embed);
  }
};
