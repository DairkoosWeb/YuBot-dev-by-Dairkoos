const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const answers = [
  'Il est certain.',
  'Cest décidément ainsi...',
  'Sans aucun doute.',
  'Oui définitivement.',
  'Vous pouvez vous y fier.',
  'Comme je le vois oui.',
  'Probablement.',
  'Bonne perspective.',
  'Oui.',
  'Les signe montre que oui.',
  'Demander à nouveau plus tard :D',
  'Mieux vaut ne pas te le dire maintenant.',
  'Impossible de prédire maintenant.',
  'Concentrez-vous et demandez à nouveau.',
  'Ne comptez pas dessus..',
  'Ma réponse est non.',
  'Mes sources disent que non.',
  'Les perspectives ne sont pas si bonnes.',
  'Très douteux.'
];

module.exports = class EightBallCommand extends Command {
  constructor(client) {
    super(client, {
      name: '8ball',
      aliases: ['fortune'],
      usage: ' 8ball <question>',
      description: '> Demande au Magic 8-Ball un peu de sagesse psychique.',
      type: client.types.FUN,
      examples: ['> 8ball est-ce que je vais gagné a la loterie']
    });
  }
  run(message, args) {
    const question = args.join(' ');
    if (!question) return this.sendErrorMessage(message, 0, '> <:pin:759751021118881822> Veuillez fournir une question. <:pin:759751021118881822>');
    const embed = new MessageEmbed()
      .setTitle('🎱 8ball  🎱')
      .addField('> <:aques:759717451901566977> Question', question)
      .addField('> <:info:759717833260924978> Réponse', `${answers[Math.floor(Math.random() * answers.length)]}`)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    message.channel.send(embed);
  }
};
