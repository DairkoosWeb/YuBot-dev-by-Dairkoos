const { MessageEmbed } = require('discord.js');
const permissions = require('../utils/permissions.json');
const { fail } = require('../utils/emojis.json');

/**
 * Calypso's custom Command class
 */
class Command {

  /**
   * Create new command
   * @param {Client} client 
   * @param {Object} options 
   */
  constructor(client, options) {

    // Validate all options passed
    this.constructor.validateOptions(client, options);

    /**
     * The client
     * @type {Client}
     */
    this.client = client;

    /**
     * Name of the command
     * @type {string}
     */
    this.name = options.name;

    /**
     * Aliases of the command
     * @type {Array<string>}
     */
    this.aliases = options.aliases || null;

    /**
     * The arguments for the command
     * @type {string}
     */
    this.usage = options.usage || options.name;

    /**
     * The description for the command
     * @type {string}
     */
    this.description = options.description || '';

    /**
     * The type of command
     * @type {string}
     */
    this.type = options.type || client.types.MISC;

    /**
     * The client permissions needed
     * @type {Array<string>}
     */
    this.clientPermissions = options.clientPermissions || ['SEND_MESSAGES', 'EMBED_LINKS'];

    /**
     * The user permissions needed
     * @type {Array<string>}
     */
    this.userPermissions = options.userPermissions || null;

    /**
     * Examples of how the command is used
     * @type {Array<string>}
     */
    this.examples = options.examples || null;
    
    /**
     * If command can only be used by owner
     * @type {boolean}
     */
    this.ownerOnly = options.ownerOnly || false;

    /**
     * If command is enabled
     * @type {boolean}
     */
    this.disabled = options.disabled || false;

    /**
     * Array of error types
     * @type {Array<string>}
     */
    this.errorTypes = ['> Argument invalide', '> Échec de la commande'];
  }

  /**
   * Runs the command
   * @param {Message} message 
   * @param {string[]} args 
   */
  // eslint-disable-next-line no-unused-vars
  run(message, args) {
    throw new Error(`> la commande ${this.name} n'a pas de méthode`);
  }

  /**
   * Gets member from mention
   * @param {Message} message 
   * @param {string} mention 
   */
  getMemberFromMention(message, mention) {
    if (!mention) return;
    const matches = mention.match(/^<@!?(\d+)>$/);
    if (!matches) return;
    const id = matches[1];
    return message.guild.members.cache.get(id);
  }

  /**
   * Gets role from mention
   * @param {Message} message 
   * @param {string} mention 
   */
  getRoleFromMention(message, mention) {
    if (!mention) return;
    const matches = mention.match(/^<@&(\d+)>$/);
    if (!matches) return;
    const id = matches[1];
    return message.guild.roles.cache.get(id);
  }

  /**
   * Gets text channel from mention
   * @param {Message} message 
   * @param {string} mention 
   */
  getChannelFromMention(message, mention) {
    if (!mention) return;
    const matches = mention.match(/^<#(\d+)>$/);
    if (!matches) return;
    const id = matches[1];
    return message.guild.channels.cache.get(id);
  }

  /**
   * Helper method to check permissions
   * @param {Message} message 
   * @param {boolean} ownerOverride 
   */
  checkPermissions(message, ownerOverride = true) {
    if (!message.channel.permissionsFor(message.guild.me).has(['SEND_MESSAGES', 'EMBED_LINKS'])) return false;
    const clientPermission = this.checkClientPermissions(message);
    const userPermission = this.checkUserPermissions(message, ownerOverride);
    if (clientPermission && userPermission) return true;
    else return false;
  }

  /**
   * Checks the user permissions
   * Code modified from: https://github.com/discordjs/Commando/blob/master/src/commands/base.js
   * @param {Message} message 
   * @param {boolean} ownerOverride 
   */
  checkUserPermissions(message, ownerOverride = true) {
    if (!this.ownerOnly && !this.userPermissions) return true;
    if (ownerOverride && this.client.isOwner(message.author)) return true;
    if (this.ownerOnly && !this.client.isOwner(message.author)) {
      return false;
    }
    
    if (message.member.hasPermission('ADMINISTRATOR')) return true;
    if (this.userPermissions) {
      const missingPermissions = message.channel.permissionsFor(message.author).missing(this.userPermissions);
      missingPermissions.forEach((perm, index) => missingPermissions[index] = permissions[perm]);
      if (missingPermissions.length !== 0) {
        const embed = new MessageEmbed()
          .setAuthor(
            `${message.member.displayName}#${message.author.discriminator}`, 
            message.author.displayAvatarURL({ dynamic: true })
          )
          .setTitle(`> ${fail} Autorisations utilisateur manquantes: ${this.name} ${fail} `)
          .setDescription(`> \n${missingPermissions.map(p => `- ${p}`).join('\n')}`)
          .setTimestamp()
          .setColor('#d1b7ff');
        message.channel.send(embed);
        return false;
      }
    }
    return true;
  }

  /**
   * Checks the client permissions
   * @param {Message} message 
   * @param {boolean} ownerOverride 
   */
  checkClientPermissions(message) {
    const missingPermissions = message.channel.permissionsFor(message.guild.me).missing(this.clientPermissions);
    missingPermissions.forEach((perm, index) => missingPermissions[index] = permissions[perm]);
    if (missingPermissions.length !== 0) {
      const embed = new MessageEmbed()
        .setAuthor(
          `${message.guild.me.displayName}#${message.client.user.discriminator}`, 
          message.client.user.displayAvatarURL({ dynamic: true })
        )
        .setTitle(`${fail} Permissions du bot manquantes: ${this.name} ${fail}`)
        .setDescription(`\n${missingPermissions.map(p => `- ${p}`).join('\n')}`)
        .setTimestamp()
        .setColor('#d1b7ff');
      message.channel.send(embed);
      return false;

    } else return true;
  }
  
  /**
   * Creates and sends command failure embed
   * @param {Message} message
   * @param {int} errorType
   * @param {string} reason 
   * @param {string} errorMessage 
   */
  sendErrorMessage(message, errorType, reason, errorMessage = null) {
    errorType = this.errorTypes[errorType];
    const prefix = message.client.db.settings.selectPrefix.pluck().get(message.guild.id);
    const embed = new MessageEmbed()
      .setAuthor(
        `${message.member.displayName}#${message.author.discriminator}`,
        message.author.displayAvatarURL({ dynamic: true })
      )
      .setTitle(`> ${fail} Erreur sur la commande : ${this.name} ${fail}`)
      .setDescription(`> \n ${errorType}\n ${reason}`)
      .addField('> <:attention:759717913098715186> Uitlisation', `${prefix}${this.usage}`)
      .setTimestamp()
      .setColor('#d1b7ff');
    if (this.examples) embed.addField('> <:aques:759717451901566977> Example', this.examples.map(e => `\`${prefix}${e}\``).join('\n'));
    if (errorMessage) embed.addField('> Erreur Message', `${errorMessage}`);
    message.channel.send(embed);
  }

  /**
   * Creates and sends modlog embed
   * @param {Message} message
   * @param {string} reason 
   * @param {Object} fields
   */
  async sendModlogMessage(message, reason, fields = {}) {
    const modlogChannelId = message.client.db.settings.selectModlogChannelId.pluck().get(message.guild.id);
    const modlogChannel = message.guild.channels.cache.get(modlogChannelId);
    if (
      modlogChannel && 
      modlogChannel.viewable &&
      modlogChannel.permissionsFor(message.guild.me).has(['SEND_MESSAGES', 'EMBED_LINKS'])
    ) {
      const caseNumber = await message.client.utils.getCaseNumber(message.client, message.guild, modlogChannel);
      const embed = new MessageEmbed()
        .setTitle(`> Action: \`${message.client.utils.capitalize(this.name)}\``)
        .addField('> Modérateur', message.member, true)
        .setFooter(`> Case #${caseNumber}`)
        .setTimestamp()
        .setColor('#d1b7ff');
      for (const field in fields) {
        embed.addField(field, fields[field], true);
      }
      embed.addField('Raison', reason);
      modlogChannel.send(embed).catch(err => message.client.logger.error(err.stack));
    }
  }

  /**
   * Validates all options provided
   * Code modified from: https://github.com/discordjs/Commando/blob/master/src/commands/base.js
   * @param {Client} client 
   * @param {Object} options 
   */
  static validateOptions(client, options) {

    if (!client) throw new Error('Aucun client n\'a été trouvé');
    if (typeof options !== 'object') throw new TypeError('Les options de commande ne sont pas un objet');

    // Name
    if (typeof options.name !== 'string') throw new TypeError('Le nom de la commande n\'est pas une aide');
    if (options.name !== options.name.toLowerCase()) throw new Error('Le nom de la commande n\'est pas en minuscules');

    // Aliases
    if (options.aliases) {
      if (!Array.isArray(options.aliases) || options.aliases.some(ali => typeof ali !== 'string'))
        throw new TypeError('Les alias de commande ne sont pas des commandes funs');

      if (options.aliases.some(ali => ali !== ali.toLowerCase()))
        throw new RangeError('les alias de commande ne sont pas en minuscules');

      for (const alias of options.aliases) {
        if (client.aliases.get(alias)) throw new Error('L\'alias de commande existe déjà');
      }
    }

    // Usage
    if (options.usage && typeof options.usage !== 'string') throw new TypeError('L\'utilisation de la commande n\'est pas une chaîne');

    // Description
    if (options.description && typeof options.description !== 'string') 
      throw new TypeError('La description de la commande n\'est pas une chaîne');
    
    // Type
    if (options.type && typeof options.type !== 'string') throw new TypeError('Le type de commande n\'est pas une chaîne');
    if (options.type && !Object.values(client.types).includes(options.type))
      throw new Error('Le type de commande n\'est pas valide');
    
    // Client permissions
    if (options.clientPermissions) {
      if (!Array.isArray(options.clientPermissions))
        throw new TypeError('Les autorisations du client de commande ne sont pas un tableau de chaînes de clés d\'autorisation');
      
      for (const perm of options.clientPermissions) {
        if (!permissions[perm]) throw new RangeError(`Autorisation du client de commande non valide: ${perm}`);
      }
    }

    // User permissions
    if (options.userPermissions) {
      if (!Array.isArray(options.userPermissions))
        throw new TypeError('Les autorisations utilisateur de la commande ne sont pas un tableau de chaînes de clés d\'autorisation');

      for (const perm of options.userPermissions) {
        if (!permissions[perm]) throw new RangeError(`Autorisation de l'utilisateur de commande non valide: ${perm}`);
      }
    }

    // Examples
    if (options.examples && !Array.isArray(options.examples))
      throw new TypeError('Les exemples de commande ne sont pas un tableau de chaînes de clé d\'autorisation');

    // Owner only
    if (options.ownerOnly && typeof options.ownerOnly !== 'boolean') 
      throw new TypeError('La commande ownerOnly n\'est pas un booléen');

    // Disabled
    if (options.disabled && typeof options.disabled !== 'boolean') 
      throw new TypeError('La commande désactivée n\'est pas un booléen');
  }
}

module.exports = Command;