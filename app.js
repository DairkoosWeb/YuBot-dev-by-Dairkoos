  
const config = require('./config.json');
const Client = require('./src/Client.js');
const { Intents } = require('discord.js');
global.__basedir = __dirname;


const intents = new Intents();
intents.add(
  'GUILDS',
  'GUILD_VOICE_STATES',
  'GUILD_MESSAGES',
  'GUILD_MESSAGE_REACTIONS',
);
const client = new Client(config, { ws: { intents: intents } });


function init() {
  client.loadEvents('./src/events');
  client.loadCommands('./src/commands');
  client.loadTopics('./data/trivia');
  client.login(client.token);
}

init();

process.on('unhandledRejection', err => client.logger.error(err));