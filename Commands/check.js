const Discord = require("discord.js");
const config = require("../config.json")
const db = require("../db/db")

module.exports.run = async (client, message, args) => {
    if(message.channel.type == "dm") return;
    db.con.query("SELECT * FROM joins WHERE (userID,serverID) = (?,?)",[message.author.id, message.guild.id], (err, rowsJoins) => {
        if(rowsJoins.length < 1){
            message.channel.send(new Discord.MessageEmbed()
                    .setTitle(`JoinPlus Check for ${message.author.username}`)
                    .setDescription(`You can leave without losing coins.\nMake sure to check out the new +check feature on the JoinPlus dashboard. It allows you to see **all the servers you can leave at once.**`)
                    .setFooter(config.copyright)
                    .setColor(config.embedColor)
                )
        } else {
            let now = new Date();
            now.setDate(now.getDate());
            if(now > rowsJoins[0].canLeaveAt){
                message.channel.send(new Discord.MessageEmbed()
                    .setTitle(`JoinPlus Check for ${message.author.username}`)
                    .setDescription(`You can leave without losing coins.\nMake sure to check out the new +check feature on the JoinPlus dashboard. It allows you to see **all the servers you can leave at once.**`)
                    .setFooter(config.copyright)
                    .setColor(config.embedColor)
                )
            } else {
                message.channel.send(new Discord.MessageEmbed()
                    .setTitle(`JoinPlus Check for ${message.author.username}`)
                    .setDescription(`You joined this server at ${rowsJoins[0].joinedAt}. You can leave without losing coins at ${rowsJoins[0].canLeaveAt}. It allows you to see all the servers you can leave at once.`)
                    .setFooter(config.copyright)
                    .setColor(config.embedColor)
                )
            }
        }
    })
}

module.exports.help = {
    name: "check",
    aliases: ["chk"]
}
