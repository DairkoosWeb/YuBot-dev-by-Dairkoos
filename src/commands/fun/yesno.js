const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = class YesNoCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'ouinon',
      aliases: ['yn'],
      usage: 'ouinon',
      description: 'Récupère un gif dun oui ou dun non.',
      type: client.types.FUN
    });
  }
  async run(message) {
    try {
      const res = await (await fetch('http://yesno.wtf/api/')).json();
      let answer = message.client.utils.capitalize(res.answer);
      if (answer === 'Oui') answer = '👍  ' + answer + '!  👍';
      else if (answer === 'Non') answer = '👎  ' + answer + '!  👎';
      else answer = '👍  ' + answer + '...  👎';
      const img = res.image;
      const embed = new MessageEmbed()
        .setTitle(answer)
        .setImage(img)
        .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
        .setTimestamp()
        .setColor(message.guild.me.displayHexColor);
      message.channel.send(embed);
    } catch (err) {
      message.client.logger.error(err.stack);
      this.sendErrorMessage(message, 1, '<:close:759714410187980861> Veuillez réessayer dans quelques secondes <:close:759714410187980861>', err.message);
    }
  }
};
