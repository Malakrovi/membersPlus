const Discord = require('discord.js');
const shard = new Discord.ShardingManager('./joinplus.js');
shard.spawn(1);