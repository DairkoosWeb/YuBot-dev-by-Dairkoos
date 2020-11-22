const Command = require('../Command.js');
const Discord = require('discord.js');
const emojis = require('../../utils/emojis.json');
const { oneLine, stripIndent } = require('common-tags');

module.exports = class HelpCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'help',
      aliases: ['commands', 'h'],
      usage: 'help [commande | all]',
      description: oneLine`
      Voir la liste de toute le commandes.
      `,
      type: client.types.INFO,
      examples: ['help ping']
    });
  }
  run(message, args) {

    const embedCreated = new Discord.MessageEmbed()
    .addField('<:programming:759928103744700426> Dairkoos & Kizu', `> \`listeserveur\`, \`quitteserveur\` `)
    .addField('<:ownerrrr:759724247584079902> Administrateur', `> \`setadminrole\`, \`setmuterole\`, \`setmodrole\`, `)
    .addField('<:userfdbh:759904954772226079> Modérations', `> \`ban\`, \`clearwarns\`, \`kick\`, \`mute\`, \`purge\`, \`purgebot\`, \`slowmode\`, \`softban\`, \`unban\`, \`unmute\`, \`warn\`, \`warnpurge\`, \`warns\`, \`setprefix\` `)
    .addField('<:bullhorn:759720332906725386> Informations', `> \`vote\`, \`botinfo\`, \`help\`, \`invite\`, \`permissions\`, \`ping\`, \`prefix\`, \`roleinfo\`, \`saloninfo\`,\`serveurinfo\`, \`serveuricon\`, \`serveurstaff\`, \`stats\`, \`support\`, \`modo\`, \`uptime\`, \`userinfo\` `)
    .addField('<:musicalnote1:759723714715189249> Musique', `> \`lyrics\`, \`play\`, \`queue\`, \`search\`, \`skipto\`, \`np\`, \`playlist\`, \`remove\`, \`shuffle\`, \`stop\`, \`loop\`, \`pause\`, \`pruning\`, \`resume\`, \`skip\`, \`volume\` `)
    .addField('<:nightmode:759753428338999296> Fun', `> \`8ball\`, \`oiseau\`, \`chat\`, \`chien\`, \`canard\`, \`renard\`, \`meme\`, \`dés\`, \`shiba\`, \`trumptweet\`, \`ouinon\` `)
    .addField('<:toilealala:759751035971174401> Levels', `> \`explainpoints\`, \`givepoints\`, \`leaderboard\`, \`points\`, \`pointsper\`, \`position\`, \`totalpoints\``)
    .addField('<:aques:759717451901566977> Aides', `> \`avis\`, \`reportbug\``)
    .addField('<:share:759718377081143317> Liens', `> **[Invite](https://discord.com/api/oauth2/authorize?client_id=735561873608540281&permissions=8&scope=bot) | [Support](https://discord.gg/xkFnsYZ) | [Vote](https://top.gg/bot/735561873608540281/vote) **`)
    .setColor('#d1b7ff')
    .setImage('https://cdn.discordapp.com/attachments/736245330710102048/750656078743732274/unnamed.gif')
    .setTimestamp()
    .setFooter(`${message.author.username}#${message.author.discriminator}`, message.author.avatarURL);
  
    message.channel.send(embedCreated);
  };
}  
