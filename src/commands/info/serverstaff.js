const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');

module.exports = class ServerStaffCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'serveurstaff',
      aliases: ['staff'],
      usage: 'serveurstaff',
      description: '-',
      type: client.types.INFO
    });
  }
  run(message) {
    
    // Get mod role
    const modRoleId = message.client.db.settings.selectModRoleId.pluck().get(message.guild.id);
    let modRole, mods;
    if (modRoleId) modRole = message.guild.roles.cache.get(modRoleId);
    
    // Get admin role
    const adminRoleId = message.client.db.settings.selectAdminRoleId.pluck().get(message.guild.id);
    let adminRole, admins;
    if (adminRoleId) adminRole = message.guild.roles.cache.get(adminRoleId);
  
    let modList = [], adminList = [];

    // Get mod list
    if (modRole) modList = message.guild.members.cache.filter(m => {
      if (m.roles.cache.find(r => r === modRole)) return true;
    }).sort((a, b) => (a.joinedAt > b.joinedAt) ? 1 : -1).array();

    if (modList.length > 0) mods = message.client.utils.trimStringFromArray(modList, 1024);
    else mods = 'Aucun Modérateur éssayer d\'ajouter des modérateur avec la commande y!setmodrole';
    
    // Get admin list
    if (adminRole) adminList = message.guild.members.cache.filter(m => {
      if (m.roles.cache.find(r => r === adminRole)) return true;
    }).sort((a, b) => (a.joinedAt > b.joinedAt) ? 1 : -1).array();

    if (adminList.length > 0) admins = message.client.utils.trimStringFromArray(adminList, 1024);
    else admins = 'Aucun administrateur éssayer d\'ajouter des admin avec la commande y!setadminrole';
    

    const embed = new MessageEmbed()
      .setTitle(`<:attention:759717913098715186> Liste des modérateurs & administrateurs [${modList.length + adminList.length}]`)
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .addField(`> <:ownerrrr:759724247584079902> Administrateurs [${adminList.length}]`, admins, true)
      .addField(`> <:userfdbh:759904954772226079> Modérateurs [${modList.length}]`, mods, true)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor('#d1b7ff');
    message.channel.send(embed);
  }
};