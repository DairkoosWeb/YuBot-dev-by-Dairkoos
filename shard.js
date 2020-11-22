

const { ShardingManager } = require('discord.js');

const manager = new ShardingManager('./app.js', {

    totalShards: 'auto',
    token: 'NzM1NTYxODczNjA4NTQwMjgx.XxiDYA.QuEQyPIcmoFoqxNwoChEJroX4Wk'
});

manager.spawn();

manager.on('shardCreate', (shard) => console.log(`Shard ${shard.id} launched`));