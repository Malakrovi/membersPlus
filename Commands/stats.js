const Discord = require("discord.js");
const config = require("../config.json")

module.exports.run = async (client, message, args) => {
    if(message.channel.type == "dm") return;
    if(message.member.guild == "734831500553355375" && message.member.hasPermission("ADMINISTRATOR")){
        const promises = [
            client.shard.fetchClientValues('guilds.cache.size'),
            client.shard.broadcastEval('this.guilds.cache.reduce((prev, guild) => prev + guild.memberCount, 0)'),
        ];
        
        Promise.all(promises)
            .then(results => {
                let totalGuilds = results[0].reduce((prev, guildCount) => prev + guildCount, 0);
                let totalMembers = results[1].reduce((prev, memberCount) => prev + memberCount, 0);
                return message.channel.send(`**Total servers**: ${totalGuilds}\n **Total members:** ${totalMembers}`);
            })
            .catch(console.error);
    }

}

module.exports.help = {
    name: "stats",
    aliases: ["statistique"]
}