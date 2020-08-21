const Discord = require("discord.js");
const config = require("../config.json")

module.exports.run = async (client, message, args) => {
    if(message.channel.type == "dm") return;
        return message.channel.send(`Vote for the bot here and get **two** coins: https://top.gg/bot/715386505354543195/vote`);


}

module.exports.help = {
    name: "vote",
    aliases: ["v"]
}