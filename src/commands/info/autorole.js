const Command = require('../Command.js');
const Discord = require('discord.js');
const emojis = require('../../utils/emojis.json');
const { oneLine, stripIndent } = require('common-tags');module.exports = class HelpCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'autorole',
      aliases: [],
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
    .setDescription(`

    ┌─────────────── •✧✧• ───────────────┐
       
   
    ˚ ༘✶ ⋆｡˚ ⁀➷    𝙏𝙪 𝙚𝙨 𝙢𝙞𝙣𝙚𝙪𝙧 𝙘𝙡𝙞𝙦𝙪𝙚 𝙨𝙪𝙧 : <a:nekopurple:766484746669785110>
    

    
     
    ˚ ༘✶ ⋆｡˚ ⁀➷    𝙏𝙪 𝙚𝙨 𝙢𝙖𝙟𝙚𝙪𝙧 𝙘𝙡𝙞𝙦𝙪𝙚 𝙨𝙪𝙧 : <a:umaruwow:690948258125709352> 
    

    └─────────────── •✧✧• ───────────────┘`)
    .setImage('https://i.pinimg.com/originals/97/b7/6c/97b76c03a1f679538211d9c7d6e826bb.gif')
    .setColor('#f3339c')
    .setFooter('NightMare | 2021')
  
    message.channel.send(embedCreated);
  };
}  
