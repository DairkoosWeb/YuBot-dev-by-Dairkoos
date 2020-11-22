const { MessageEmbed } = require('discord.js');
const { fail } = require('../utils/emojis.json');

module.exports = (client, guild) => {

  client.logger.info(`a été retirer de  ${guild.name}`);
  const serverLog = client.channels.cache.get(client.serverLogChannelId);
  if (serverLog)
    serverLog.send(new MessageEmbed().setDescription(`${client.user} has left **${guild.name}** ${fail}`));

  client.db.settings.deleteGuild.run(guild.id);
  client.db.users.deleteGuild.run(guild.id);

  if (guild.job) guild.job.cancel(); // Cancel old job

};
