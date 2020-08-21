const Discord = require("discord.js");
const config = require("../config.json")

module.exports.run = async (client, message, args) => {
    if(message.channel.type == "dm") return;
    client.generateInvite("ADMINISTRATOR").then(invite => message.channel.send(new Discord.MessageEmbed()
        .setAuthor(client.user.username, client.user.avatarURL())
        .setTitle("Invite The Bot")
        .setDescription(`Invite me to your server with this invite link:\n${invite}`)
        .setImage("https://media.discordapp.net/attachments/735810225990402078/735874070423404754/Plan_de_travail_1.png?width=1204&height=677")
        .setColor(config.embedColor)
        .setFooter(config.copyright)))


}

module.exports.help = {
    name: "invite",
    aliases: ["inv"]
}