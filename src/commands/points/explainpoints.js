const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const { stripIndent } = require('common-tags');

module.exports = class ExplainPointsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'explainpoints',
      aliases: ['explainp', 'ep', 'howtopoints', 'h2points'],
      usage: 'explainpoints',
      description: 'Explains the various aspects about Calypso\'s points and crown systems.',
      type: client.types.POINTS
    });
  }
  run(message) {

    // Get disabled leaderboard
    let disabledCommands = message.client.db.settings.selectDisabledCommands.pluck().get(message.guild.id) || [];
    if (typeof(disabledCommands) === 'string') disabledCommands = disabledCommands.split(' ');

    const prefix = message.client.db.settings.selectPrefix.pluck().get(message.guild.id); // Get prefix
    const { message_points: messagePoints, command_points: commandPoints, voice_points: voicePoints } 
      = message.client.db.settings.selectPoints.get(message.guild.id);

    // Points per
    let earningPoints = 
      stripIndent`Vous pouvez gagner des points des manières suivantes: En envoyant **messages**, en utilisant **commands**,` +
      ' et en passant du temps dans les ** salons vocals **.';
    if (!disabledCommands.includes('givepoints')) earningPoints += 
      ` Et si quelqu'un ce sent généreux, il peut vous donner des points en utilisant \`${prefix}givepoints\`.`;
    
    const pointsPer = stripIndent`
      Messages :: ${messagePoints} par messages
      Commandes :: ${commandPoints} par commandes
      Vocals  :: ${voicePoints} par minutes
    `;

    earningPoints += ` Voici ce serveur de **points par action **:\n\`\`\`asciidoc\n${pointsPer}\`\`\``;
 
    if (!disabledCommands.includes('pointsper'))
      earningPoints += `
        Pour revoir rapidement les points par action de votre serveur, vous pouvez utiliser la commande\`${prefix}pointsper\`.
      `;

    // Checking points
    let checkingPoints = '';

    if (!disabledCommands.includes('points'))
      checkingPoints += `\nPour voir les points actuels, utilisez \`${prefix}points\` commandes.`;
    
    if (!disabledCommands.includes('totalpoints'))
      checkingPoints += ` Pour voir les points globaux, utilisez \`${prefix}totalpoints\` .`;

    // The Leaderboard
    let leaderboard = '';

    if (!disabledCommands.includes('position'))
      leaderboard += ` Pour vérifier le classement du classement, utilisez \`${prefix}position\`.`;
      
    if (!disabledCommands.includes('leaderboard'))
      leaderboard += ` Pour voir le classement lui-même, utilisez \`${prefix}leaderboard\` .`;
    
    // The Crown
    let crown = stripIndent`
      Si un \`rôle admin \` et \`rôle modo\` sont fixés, la personne avec le plus de points gagneras ` +
      ` De plus, les points de chacun seront réinitialisés à **0** .
    `;

    if (!disabledCommands.includes('crown'))
      crown += `\nUtilisez \`${prefix}help\` commande pour des informations spécifiques au serveur.`;

    const embed = new MessageEmbed()
      .setTitle('Points et systèmes')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .addField('Gagner des points', earningPoints)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    if (checkingPoints) embed.addField('Points de contrôle', checkingPoints);
    if (leaderboard) embed.addField('Le classement', leaderboard);
    embed.addField('Yû', crown);
    message.channel.send(embed);
  }
};
