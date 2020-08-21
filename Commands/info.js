const Discord = require("discord.js");
const config = require("../config.json")
const db = require("../db/db")

module.exports.run = async (client, message, args) => {
  if(message.channel.type == "dm") return;
    db.con.query("SELECT * FROM guilds WHERE id = ?", message.guild.id, (err, rows)=>{
        if (err) throw err;

        let boughtJoins;
        let currentJoins;
        let boughtBoost;
        let currentBoost;

        if(rows.length < 1){
            message.channel.send(new Discord.MessageEmbed()
            .setTitle(`${message.guild.name} JoinPlus+ Orders`)
            .setDescription(`Here is the curent status of your latest order.`)
            .setThumbnail(message.guild.iconURL())
            .addField(`Want to Unlock Faster Order Completion?`, `Vote for the bot on https://top.gg/bot/${client.user.id} every 12 hours to unlock faster order completion.`)
            .addField(`Error`, `You do not have a current order.`)
            .setColor(config.embedColor)
            .setFooter(config.copyright))
            return;
          }else {
            boughtJoins = rows[0].boughtJoins;
            currentJoins = rows[0].currentJoins;
            boughtBoost = rows[0].boughtBoost;
            currentBoost = rows[0].currentBoost;
          }

          let embed = new Discord.MessageEmbed()
          .setTitle(`${message.guild.name} JoinPlus+ Orders`)
          .setDescription(`Here is the curent status of your latest order.`)
          .setThumbnail(message.guild.iconURL())
          .addField(`Want to Unlock Faster Order Completion?`, `Vote for the bot on https://top.gg/bot/${client.user.id} every 12 hours to unlock faster order completion.`)
          .setColor(config.embedColor)
          .setFooter(config.copyright)

          let percentJoins = (currentJoins / boughtJoins) * 100;
          let percentBoost = (currentBoost / boughtBoost) * 100;
          let loadingJoins = "";
          let loadingBoost = "";

          for(let i = 0; i < 100; i = i += 10){
            if(i < percentJoins){
              loadingJoins = loadingJoins + "#";
            } else {
              loadingJoins = loadingJoins + "=";
            }

            if(i < percentBoost){
              loadingBoost = loadingBoost + "#";
            } else {
              loadingBoost = loadingBoost + "=";
            }
          }

          if(boughtJoins<=0){
            embed.addField(`Error`, `You do not have a current order.`)
          } else if(boughtJoins>0){
            embed.addField(`Current Order:`, `${loadingJoins} (${currentJoins} / ${boughtJoins})`);
            if(currentBoost>0){
              embed.addField(`Current Boost Order:`, `${loadingBoost} (${currentBoost} / ${boughtBoost})`);
            }
          }
        
          
          message.channel.send(embed);
      });
}

module.exports.help = {
    name: "info",
    aliases: ["inf"]
}
