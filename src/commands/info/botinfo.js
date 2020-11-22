const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const pkg = require(__basedir + '/package.json');
const { owner } = require('../../utils/emojis.json');
const { oneLine, stripIndent } = require('common-tags');

module.exports = class BotInfoCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'botinfo',
      aliases: ['bot', 'bi'],
      usage: 'botinfo',
      description: 'Obtenez les informations sur le bot',
      type: client.types.INFO
    });
  }
  run(message) {
    const botOwner = message.client.users.cache.get(message.client.ownerId);
    const prefix = message.client.db.settings.selectPrefix.pluck().get(message.guild.id);

    const embed = new MessageEmbed()
      .setTitle('Informations de Yû')
      .setDescription(oneLine`**Bot Francais multifonctions crée par Kizu & Dairkoos.**.
      `)
      .addField('Préfix', `${prefix}`, true)
      .addField('Client ID', `${message.client.user.id}`, true)
      .addField(`Dévelloper`, `Dairkoos | Kizu`, true)
      .addField(`Version`, `${pkg.version} `, true)
      .addField(`Node  `,`Node.js v12.16.3`, true)
      .addField(`Version Discord`,`Discord.js v12.2.0`, true)
      .addField(
        'Lien', 
        '**[Invite](https://discord.com/api/oauth2/authorize?client_id=735561873608540281&permissions=8&scope=bot) | ' +
        '[Support](https://discord.gg/xkFnsYZ) | ' +
        '[Vote](https://top.gg/bot/735561873608540281/vote)**'
      )
      .setImage('https://thumbs.gfycat.com/HelpfulBriskDore-size_restricted.gif')
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    message.channel.send(embed);
  }
};
