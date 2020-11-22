const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');

module.exports = class SupportServerCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'supportserver',
      aliases: ['support', 'ss'],
      usage: 'supportserver',
      description: '-',
      type: client.types.INFO
    });
  }
  run(message) {
    const embed = new MessageEmbed()
      .setThumbnail('https://thumbs.gfycat.com/HelpfulBriskDore-size_restricted.gif')
      .setDescription('<:discussion:759720941700907008> **Clique [ici](https://discord.gg/xkFnsYZ) pour rejoindre le serveur de Support <:settings:759758045496213504>**')
      .addField('<:share:759718377081143317> Lien', 
        '**[Invite](https://discord.com/api/oauth2/authorize?client_id=735561873608540281&permissions=8&scope=bot) | ' +
        '[Vote](https://top.gg/bot/735561873608540281/vote)**'
      )
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor('#d1b7ff');
    message.channel.send(embed);
  }
};
