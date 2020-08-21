const config = require("../config.json")
const Discord = require("discord.js")
const db = require("../db/db")

module.exports = async (client, oldR, newR) => {
   
    // Check if bot have admin perm
    if(!oldR.guild.members.cache.get(client.user.id).hasPermission("ADMINISTRATOR")){
        oldR.guild.owner.send(new Discord.MessageEmbed()
            .setTitle("JoinPlus")
            .setDescription(`JoinPlus cannot work without administrator permissions, please re-invite it with the required permissions`)
            .setFooter(config.copyright))
        oldR.guild.leave();
        db.con.query("DELETE FROM `guilds` WHERE id = ?", [oldR.guild.id], function (err, result) {
            if (err) throw err;
            console.log(result);
        });
        return;
    }
}