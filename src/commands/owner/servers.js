const Command = require('../Command.js');
const ReactionMenu = require('../ReactionMenu.js');
const { MessageEmbed } = require('discord.js');

module.exports = class ServersCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'listeserveur',
      aliases: ['servs'],
      usage: 'listeserveur',
      description: 'Displays a list of Calypso\'s joined servers.',
      type: client.types.OWNER,
      ownerOnly: true
    });
  }
  run(message) {

    const servers = message.client.guilds.cache.array().map(guild => {
      return ` <:pin:759751021118881822> \`${guild.id}\` - **${guild.name}** - \`${guild.members.cache.size}\` Membres <:userfdbh:759904954772226079>`;
    });

    const embed = new MessageEmbed()
      .setTitle('<:flageee:759913357246595113> Liste des Serveur')
      .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);

    if (servers.length <= 10) {
      const range = (servers.length == 1) ? '[1]' : `[1 - ${servers.length}]`;
      message.channel.send(embed.setTitle(`<:flageee:759913357246595113> Liste des Serveur ${range}`).setDescription(servers.join('\n')));
    } else {
      new ReactionMenu(message.client, message.channel, message.member, embed, servers);
    }
  }
};
