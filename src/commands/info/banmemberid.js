const Command = require('../Command.js');
const Discord = require('discord.js');
const emojis = require('../../utils/emojis.json');
const { oneLine, stripIndent } = require('common-tags');

module.exports = class HelpCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'vote',
      aliases: ['upvote', 'voted'],
      usage: 'help [commande | all]',
      description: oneLine`-`,
      type: client.types.INFO,
      examples: ['y!vote']
    });
  }
  run(message, args) {

    const embedCreated = new Discord.MessageEmbed()
  
    .setDescription('Tu souhaite Nous soutenir c\'est par ici')
    .setImage('https://i.pinimg.com/originals/af/b1/b2/afb1b2f825284dd186daaeaaeedeaf1f.gif')
    .setColor('#d1b7ff')
    .addField('<:ownerrrr:759724247584079902> top.gg', `> **[Clique ici](https://top.gg/bot/735561873608540281)**`)
    .addField('<:soleilbb:759751009366704148> discordbotlist', `> **[Clique ici](https://discordbotlist.com/bots/yu)**`)
    .addField('<:coeuryu:759745558000435206> discord.bots.gg', `> **[Clique ici](https://discord.bots.gg/bots/735561873608540281)**`)
    .setTimestamp()
    .setFooter(`${message.author.username}#${message.author.discriminator}`, message.author.avatarURL);
  
    message.channel.send(embedCreated);
  };
}  
