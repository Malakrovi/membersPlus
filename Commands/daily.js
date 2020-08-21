const Discord = require("discord.js");
const config = require("../config.json")
const db = require("../db/db")
var dailyClaimed = {};

module.exports.run = async (client, message, args) => {
    if(message.channel.type == "dm") return;
    if(dailyClaimed[message.author.id] == true) return message.channel.send("You already claimed your daily coins !")
    dailyClaimed[message.author.id] = true;
    setTimeout(() => {
        dailyClaimed[message.author.id] = false;
    }, 86400000)


    const arguments = message.content.slice(config.prefix.length).trim().split(' ');

    let moneyToGive = parseInt(10)
    
    
    db.con.query("SELECT * FROM members WHERE id = ?", message.author.id, (err, rowsAuthor) => {
        if(err) throw err;
        
        if(rowsAuthor.length < 1){
            let transactionAuthor = [];
            transactionAuthor.unshift(`[+${moneyToGive}] Daily`)

            db.con.query("INSERT INTO `members`(`id`, `tag`, `transaction`, `coins`) VALUES (?, ?, ?, ?)", [message.author.id, message.author.tag, JSON.stringify(transactionAuthor), moneyToGive])

            message.channel.send("Your daily coins has been sent")
        } else {
                if(err) throw err;
                let authorCoins = rowsAuthor[0].coins;
                let transactionAuthor = [];
            transactionAuthor = rowsAuthor[0].transaction
            if(transactionAuthor == null) transactionAuthor = [];
            transactionAuthor.unshift(`[+${moneyToGive}] Daily`)

                    db.con.query("UPDATE `members` SET `coins`= ? WHERE id = ?", [parseFloat((authorCoins + moneyToGive)), message.author.id])
                    db.con.query("UPDATE `members` SET `transaction`= ? WHERE id = ?", [JSON.stringify(transactionAuthor), message.author.id])
                    message.channel.send("Your daily coins has been sent")

                
        }
    })
    



}

module.exports.help = {
    name: "daily",
    aliases: ["d"]
}

function isInt(value) {
    return !isNaN(value) && 
           parseInt(Number(value)) == value && 
           !isNaN(parseInt(value, 10));
  }