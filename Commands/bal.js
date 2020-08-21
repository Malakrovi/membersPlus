const Discord = require("discord.js");
const config = require("../config.json")
const db = require("../db/db")

module.exports.run = async (client, message, args) => {
    if(message.channel.type == "dm") return;
    db.con.query("SELECT * FROM members WHERE id = ?", message.author.id, (err, rows) => {

        let coins;
        let transaction;
        let transactionText = "";

        if(rows.length < 1){
            db.con.query("INSERT INTO `members`(`id`, `tag`) VALUES (?, ?)", [message.author.id, message.author.tag])
            coins = 0;
            transactionText = "No previous transactions"
        } else {
            coins = rows[0].coins
            transaction = rows[0].transaction;
            
            if(transaction == null){
                transaction = "No previous transactions"
            } else {
                for(let i = 0; i < 10; i++){
                    if(transaction[i] != undefined) transactionText += `${transaction[i]}\n`
                }
            }

            if(transactionText == ""){
                transactionText = "No previous transactions"
            }

            
        }
        coins = parseFloat(coins).toFixed(2)

        message.channel.send(new Discord.MessageEmbed()
            .setTitle(`Balance: ${coins} Coins`)
            .setAuthor(`${message.author.username}'s JoinPlus Coin Balance`, message.author.avatarURL())
            .addField("__**Don't Want To Join Servers For Coins?**__", "Purchase more coins on discord server (https://discord.gg/fFdsEs6) to get up to 75000 coins a month to grow your server fast. Or use +daily to get 10 coins for free.")
            .addField("Transactions:", `${transactionText}`)
            .setFooter(config.copyright)
            .setColor(config.embedColor)
            )
        
    })
}

module.exports.help = {
    name: "bal",
    aliases: ["b"]
}