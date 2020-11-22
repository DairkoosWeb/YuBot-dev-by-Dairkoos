const Command = require('../Command.js');
const Discord = require("discord.js");
const { MessageEmbed } = require('discord.js');
const moment = require('moment');
const { owner, voice } = require('../../utils/emojis.json');
const { stripIndent } = require('common-tags');
const region = {
  'us-central': ':flag_us:  `US Central`',
  'us-east': ':flag_us:  `US East`',
  'us-south': ':flag_us:  `US South`',
  'us-west': ':flag_us:  `US West`',
  'europe': ':flag_eu:  `Europe`',
  'singapore': ':flag_sg:  `Singapore`',
  'japan': ':flag_jp:  `Japan`',
  'russia': ':flag_ru:  `Russia`',
  'hongkong': ':flag_hk:  `Hong Kong`',
  'brazil': ':flag_br:  `Brazil`',
  'sydney': ':flag_au:  `Sydney`',
  'southafrica': '`South Africa` :flag_za:'
};
const verificationLevels = {
  NONE: '`Aucun`',
  LOW: '`Faible`',
  MEDIUM: '`Moyen`',
  HIGH: '`Haut`',
  VERY_HIGH: '`Le plus élevé`'
};
const notifications = {
  ALL: '`tout`',
  MENTIONS: '`Avec mention`'
};

module.exports = class ServerInfoCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'say',
      aliases: [],
      usage: 'serveurinfo',
      description: '-',
      type: client.types.INFO
    });
  }
  run(message, args) {
	let channel = this.getChannelFromMention(message, args[0]) || message.guild.channels.cache.get(args[0]);
    if (channel) {
      args.shift();
    } else channel = message.channel;

    // Check type and viewable
    if (channel.type != 'text' || !channel.viewable) return this.sendErrorMessage(message, 0, stripIndent`
      Veuillez mentionner un canal de texte accessible ou fournir un ID de canal de texte valide
    `);

    if (!args[0]) return this.sendErrorMessage(message, 0, 'Veuillez me fournir un message à dire');

    // Check channel permissions
    if (!channel.permissionsFor(message.guild.me).has(['SEND_MESSAGES']))
      return this.sendErrorMessage(message, 0, '<:Yu_ErrorSystem:750768068732518471> Je nai pas lautorisation denvoyer des messages dans le canal fourni');

    if (!channel.permissionsFor(message.member).has(['SEND_MESSAGES']))
      return this.sendErrorMessage(message, 0, '<:Yu_ErrorSystem:750768068732518471> <:Yu_ErrorSystem:750768068732518471> Vous nêtes pas autorisé à envoyer des messages dans le canal fourni');

    const msg = message.content.slice(message.content.indexOf(args[0]), message.content.length);
    channel.send(msg, { disableMentions: 'everyone' });
  } 
};