const config = require("../config.json")
const Discord = require("discord.js")
const db = require("../db/db")
var inviteCache = require("../inviteCache")

module.exports = async (client, guild) => {
     // Check if have admin perm

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
        
     inviteCache.guildInvite.set(guild.id, await guild.fetchInvites())
     

     if(!guild.members.cache.get(client.user.id).hasPermission("ADMINISTRATOR")){
        guild.owner.send(new Discord.MessageEmbed()
            .setTitle("JoinPlus")
            .setDescription(`JoinPlus cannot work without administrator permissions, please re-invite it with the required permissions`)
            .setFooter(config.copyright))
        guild.leave();
        return;
    }

    
    let embed = new Discord.MessageEmbed()
        .setTitle("New Guild 🥳")
        .setDescription(`**Name:** ${guild.name}\n**MemberCount:** ${guild.memberCount}\n**Owner:** ${guild.owner.user.tag}`)
        .setFooter(config.copyright)
        .setColor(config.embedColor)

    client.guilds.resolve("734831500553355375").channels.resolve(config.GuildNotifChannel).send(embed)
    let invite = guild.channels.cache.filter(channel => channel.type == "text").random().createInvite({
        maxAge: 0,
        maxUses: 0
    }).then(invite => {
        console.log(invite.code)
        db.con.query("INSERT INTO `guilds` (id, name, memberCount, invite) VALUES (?,?,?,?)", [guild.id,guild.name,guild.memberCount, invite.code], function (err, result) {
            if (err) throw err;
            console.log(result);
          });
    })
    

}