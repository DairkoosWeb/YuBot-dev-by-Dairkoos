const Command = require('../Command.js');
const Discord = require('discord.js');
const emojis = require('../../utils/emojis.json');
const { oneLine, stripIndent } = require('common-tags');

module.exports = class HelpCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'banserver',
      aliases: ['dgtfyhdb', 'bbdbdbdbh'],
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
    .setDescription('Le membre TaiK#0008 du serveur 🎃 | NightMare a bien été bannis.')
  
    message.channel.send(embedCreated);
  };
}  
