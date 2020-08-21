const Discord = require("discord.js");
const config = require("../config.json")
const db = require("../db/db")

module.exports.run = async (client, message, args) => {
    if(message.channel.type == "dm") return;
    let msg = await message.channel.send(new Discord.MessageEmbed()
        .setDescription("Checking all members...")
        .setFooter(config.copyright)
    )

    let servers = await client.guilds.cache.size;
    let users = await client.users.cache.size;

    msg.edit(new Discord.MessageEmbed()
    .addField("Servers", servers, false)
    .addField("Users", users)
    .setFooter(config.copyright))

}

module.exports.help = {
    name: "botStats",
    aliases: ["conStats", "stats", "memberCount", "serverCount"]
}
