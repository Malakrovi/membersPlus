const Discord = require("discord.js");
const config = require("../config.json")
const db = require("../db/db")

module.exports.run = async (client, message, args) => {
    if(message.channel.type == "dm") return;
    const arguments = message.content.slice(config.prefix.length).trim().split(' ');
    //+buy #OfCoins AdvertisementMessage
    console.log(arguments[0])

    if(!arguments[1]) return message.channel.send("Improper formatting, please make sure you do .buy and then a number like 5, followed by a message for example .buy 5 join my server. If that is still working make sure the bot as the admin permission. **Do this command in the server you want to buy in**")
    if(arguments[1] < 3) return message.channel.send("Orders must be 3 coins or larger.")

    if(!isInt(arguments[1]))  return message.channel.send("Improper formatting, please make sure you do .buy and then a number like 5, followed by a message for example .buy 5 join my server. If that is still working make sure the bot as the admin permission. **Do this command in the server you want to buy in**")
    let advertMessage;
    if(arguments[2]){
        if(arguments[2].length > 30) return message.channel.send("Advert message to long, max 30 characters")
        advertMessage = message.content.substring(config.prefix.length + arguments[1].length + arguments[2].length + 1)
    }else{
        advertMessage = message.guild.name;
    }

    

    db.con.query("SELECT * FROM members WHERE id = ?", message.author.id, (err, rowsMember) => {
        if(err) throw err;

        if(rowsMember.length < 1){
            message.channel.send(new Discord.MessageEmbed()
                .setTitle("Order Failed")
                .setDescription("You do not have sufficient funds.Try using .find to find servers to join.")
                .setFooter(config.copyright)
                .setColor(config.embedColor)
            )
            db.con.query("INSERT INTO `members`(`id`, `tag`) VALUES (?, ?)", [message.author.id, message.author.tag])
            return;
        } else {
            let memberCoins = rowsMember[0].coins
            console.log(memberCoins)
            if(memberCoins < parseInt(arguments[1])) return message.channel.send(new Discord.MessageEmbed()
            .setTitle("Order Failed")
            .setDescription("You do not have sufficient funds.Try using .find to find servers to join.")
            .setFooter(config.copyright)
            .setColor(config.embedColor)
        )

            let transactionAuthor = [];
                transactionAuthor = rowsMember[0].transaction
                if(transactionAuthor == null) transactionAuthor = [];
                transactionAuthor.unshift(`[-${arguments[1]}] Buy ads`)

            db.con.query("UPDATE members SET coins = ? WHERE id = ?", [memberCoins - parseInt(arguments[1]), message.author.id])
            db.con.query("UPDATE members SET transaction = ? WHERE id = ?", [JSON.stringify(transactionAuthor), message.author.id])
            
             let invitecode = "";

            let invite = message.guild.channels.cache.filter(channel => channel.type == "text").random().createInvite({
                maxAge: 0,
                maxUses: 0
            }).then(invite => {
                invitecode = invite.code;
            })

            db.con.query("SELECT * FROM guilds WHERE id = ?", message.guild.id, (err, rowsServer) => {
                if(err) throw err;
        
                if(rowsServer.length < 1){
                    console.log("no server")
                } else {
                    let bJ = rowsServer[0].boughtJoins
        
                   
                   db.con.query("SELECT * FROM guilds WHERE id = ?", message.guild.id, (err, rowsServer) => {
                   	if(rowsServer.length < 1){
                   		db.con.query("INSERT INTO `guilds`(`id`, `name`, `memberCount`, `invite`, `advertName`) VALUES (?, ?, ?, ?, ?)", [message.guild.id, message.guild.name, message.guild.memberCount, invitecode, advertMessage])
                   	}else {
                   		db.con.query("UPDATE guilds SET boughtJoins = ? WHERE id = ?", [parseInt(bJ) + parseInt(arguments[1]), message.guild.id])
                    db.con.query("UPDATE guilds SET advertName = ? WHERE id = ?", [advertMessage, message.guild.id])
                   	}
                   })

                   
                }


			        console.log(invite.code)

                message.channel.send(new Discord.MessageEmbed()
            .setTitle(`Order for ${message.guild.name}`)
            .setDescription(`Your order has been placed. Use .info to track its progress.\nMessage: ${advertMessage}`)
            .setFooter(config.copyright)
            .setColor(config.embedColor)
            .setThumbnail(message.guild.iconURL())
    )
        
            })
        }

    })

}

module.exports.help = {
    name: "buy",
    aliases: ["acheter"]
}

function isInt(value) {
    return !isNaN(value) && 
           parseInt(Number(value)) == value && 
           !isNaN(parseInt(value, 10));
  }
