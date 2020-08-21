const Discord = require("discord.js");
const config = require("../config.json")
const db = require("../db/db")

module.exports.run = async (client, message, args) => {
    if(message.channel.type == "dm") return;

    db.con.query("SELECT * FROM `members` ORDER BY coins DESC LIMIT 25", (err, rows) => {
        let embed = new Discord.MessageEmbed()
            .setTitle("JoinPlus Leaderboard")
            .setFooter(config.copyright)
            .setColor(config.embedColor)
        if(rows.length < 1) {
            embed.addField("Error", "No user found")
            message.channel.send(embed);
        } else {
            for (var i = 0; i < 25; i++){
                 let coins = rows[i].coins
                coins = parseFloat(coins).toFixed(2)
                embed.addField(`${rows[i].tag}`, `${coins} coins`)
            }
            message.channel.send(embed);
        }

    })



}

module.exports.help = {
    name: "leaderboard",
    aliases: ["l"]
}