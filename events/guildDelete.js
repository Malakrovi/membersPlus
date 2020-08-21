const config = require("../config.json")
const Discord = require("discord.js")
const db = require("../db/db")

module.exports = async (client, guild) => {

    const promises = [
        client.shard.fetchClientValues('guilds.cache.size'),
        client.shard.broadcastEval('this.guilds.cache.reduce((prev, guild) => prev + guild.memberCount, 0)'),
    ];
    
    Promise.all(promises)
        .then(results => {
            const totalGuilds = results[0].reduce((prev, guildCount) => prev + guildCount, 0);
            const totalMembers = results[1].reduce((prev, memberCount) => prev + memberCount, 0);


            db.con.query("UPDATE `stats` SET `Servers`= ?", totalGuilds)
            db.con.query("UPDATE `stats` SET `Users`= ?", totalMembers)
        })
        .catch(console.error);

        
    let embed = new Discord.MessageEmbed()
    .setTitle("Removed Guild 😥")
    .setDescription(`**Name:** ${guild.name}\n**MemberCount:** ${guild.memberCount}\n**Owner:** ${guild.owner.user.tag}`)
    .setFooter(config.copyright)
    .setColor(config.embedColor)

client.guilds.resolve("734831500553355375").channels.resolve(config.GuildNotifChannel).send(embed)


        db.con.query("DELETE FROM `guilds` WHERE id = ?", [guild.id], function (err, result) {
            if (err) throw err;
            console.log(result);
        });

}
