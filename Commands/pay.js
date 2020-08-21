const Discord = require("discord.js");
const config = require("../config.json")
const db = require("../db/db")

module.exports.run = async (client, message, args) => {
    if(message.channel.type == "dm") return;
    const arguments = message.content.slice(config.prefix.length).trim().split(' ');
    
    let target = message.mentions.members.first();
    let moneyToGive = parseInt(arguments[1])

    if(!target) return message.channel.send("Improper formatting, please make sure you do +pay and then a number like 5, followed by a message for example +pay 5 userMention. If that is still working make sure the bot as the admin permission. **Do this command in the server you want to buy in**")
    if(isInt(moneyToGive) === false) return message.channel.send("Improper formatting, please make sure you do +pay and then a number like 5, followed by a message for example +pay 5 userMention. If that is still working make sure the bot as the admin permission. **Do this command in the server you want to buy in**")

    if(moneyToGive == null) return message.channel.send("Improper formatting, please make sure you do +pay and then a number like 5, followed by a message for example +pay 5 userMention. If that is still working make sure the bot as the admin permission. **Do this command in the server you want to buy in**")
    if(target == null) return message.channel.send("Improper formatting, please make sure you do +pay and then a number like 5, followed by a message for example +pay 5 userMention. If that is still working make sure the bot as the admin permission. **Do this command in the server you want to buy in**")
    if(moneyToGive < 5) return message.channel.send("Minimum pay 5")
    
    
    db.con.query("SELECT * FROM members WHERE id = ?", message.author.id, (err, rowsAuthor) => {
        if(err) throw err;
        
        if(rowsAuthor.length < 1){
            message.channel.send("No enought coins")
            db.con.query("INSERT INTO `members`(`id`, `tag`) VALUES (?, ?)", [message.author.id, message.author.tag])
        } else {
            db.con.query("SELECT * FROM members WHERE id = ?", target.user.id, (err, rowsTarget) => {
                if(err) throw err;
                let authorCoins = rowsAuthor[0].coins;
                // AUTHOR TRANSACTION
                let transactionAuthor = [];
                transactionAuthor = rowsAuthor[0].transaction
                if(transactionAuthor == null) transactionAuthor = [];
                transactionAuthor.unshift(`[-${moneyToGive}] Send coins`)

               


                if(rowsTarget.length < 1){
                    let transactionTarget = [];
                    transactionTarget.unshift(`[+${moneyToGive}] Get coins`)
                    
                    db.con.query("INSERT INTO `members`(`id`, `tag`, `coins`, `transaction`) VALUES (?, ?, ?, ?)", [ target.user.id,  target.user.tag, parseFloat(moneyToGive), JSON.stringify(transactionTarget)])
                    db.con.query("UPDATE `members` SET `coins`= ? WHERE id = ?", [parseFloat((authorCoins - moneyToGive)), message.author.id])
                    db.con.query("UPDATE `members` SET `transaction`= ? WHERE id = ?", [JSON.stringify(transactionAuthor), message.author.id])
                    message.channel.send(`You've paid <@${target.user.id}> for ${moneyToGive} coins! [-${moneyToGive}]`)
                } else {
                    let transactionTarget = [];
                    transactionTarget = rowsTarget[0].transaction
                    if(transactionTarget == null) transactionTarget = [];
                    transactionTarget.unshift(`[+${moneyToGive}] Get coins`)
                    
                    let targetCoins = rowsTarget[0].coins;

                    if(parseFloat(moneyToGive) > authorCoins) return message.channel.send("No enought coins")

                    db.con.query("UPDATE `members` SET `coins`= ? WHERE id = ?", [parseFloat((targetCoins + moneyToGive)), target.user.id])
                    db.con.query("UPDATE `members` SET `transaction`= ? WHERE id = ?", [JSON.stringify(transactionTarget), target.user.id])
                    db.con.query("UPDATE `members` SET `coins`= ? WHERE id = ?", [parseFloat((authorCoins - moneyToGive)), message.author.id])
                    db.con.query("UPDATE `members` SET `transaction`= ? WHERE id = ?", [JSON.stringify(transactionAuthor), message.author.id])
                    message.channel.send(`You've paid <@${target.user.id}> for ${moneyToGive} coins! [-${moneyToGive}]`)

                }
            })
        }
    })
    



}

module.exports.help = {
    name: "pay",
    aliases: ["p"]
}

function isInt(value) {
    return !isNaN(value) && 
           parseInt(Number(value)) == value && 
           !isNaN(parseInt(value, 10));
  }