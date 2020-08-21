const Discord = require("discord.js");
const config = require("../config.json")

module.exports.run = async (client, message, args) => {
    if(message.channel.type == "dm") return;
    const arguments = message.content.slice(config.prefix.length).trim().split(' ');
    let embed;

        if(!arguments[1]){
            embed = new Discord.MessageEmbed()
            .setTitle("JoinPlus+ 1.0 Help")
            .setAuthor(client.user.username, client.user.avatarURL())
            .setDescription(`If you need more help please ask for it on our support server: ${config.supportServer} by making a ticket. **A video tutorial can be found here: https://www.youtube.com/watch?v=dd_3UjDadZg**`)
            .addField(config.prefix + "vote", "Get free coins without joining any servers.")
            .addField(config.prefix + "invite", "Invite the bot to your server.")
            .addField(config.prefix + "help members", "Commands to get members on your server.")
            .addField(config.prefix + "help economy", "Commands to manage your coins.")
            .addField(config.prefix + "purchase", "Get coins without having to join servers.")
            .addField(config.prefix + "check", "Check if you can leave servers without losing coins or not")
            .addField(config.prefix + "daily", "Get your daily coins")
                .addField(config.prefix + "leaderboard", "See the richest people in JoinPlus")
            .setFooter(config.copyright)
            .setColor(config.embedColor)

        }

        if(arguments[1] == "members"){
            embed = new Discord.MessageEmbed()
            .setTitle("JoinPlus+ 1.0 Help")
            .setAuthor(client.user.username, client.user.avatarURL())
            .setDescription(`If you need more help please ask for it on our support server: ${config.supportServer} by making a ticket. **A video tutorial can be found here: https://www.youtube.com/watch?v=dd_3UjDadZg**`)
            .addField("Find servers to join for coins", "Find servers to join, each time getting a certain amount of coins.\n**+f or +find**")
            .addField("Buy guarenteed joins to your server. 1 coins = 1 join.", `Check '+help economy' to learn more about coins.\n**${config.prefix}buy #OfCoins AdvertisementMessage**`)
            .addField(`See your current ${config.prefix}buy order progress.`, `See how far your order is and how many people have joined so far.\n${config.prefix}info`)

            .setFooter(config.copyright)
            .setColor(config.embedColor)
        }


        if(arguments[1] == "economy"){
            embed = new Discord.MessageEmbed()
            .setTitle("JoinPlus+ 1.0 Help")
            .setAuthor(client.user.username, client.user.avatarURL())
            .setDescription(`If you need more help please ask for it on our support server: ${config.supportServer} by making a ticket. **A video tutorial can be found here: https://www.youtube.com/watch?v=dd_3UjDadZg**`)
            .addField("Pay another user coins", `Pay your friends for stuff with the pay command.\n**${config.prefix}pay @user #amount reason**`)
            .addField("Skip joining servers and get coins directly", `Run this command to get a link to our online coin store.\n**${config.prefix}purchase**`)
            .setFooter(config.copyright)
            .setColor(config.embedColor)
        }

        return message.channel.send(embed);


}

module.exports.help = {
    name: "help",
    aliases: ["h"]
}