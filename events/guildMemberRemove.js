const config = require("../config.json")
const Discord = require("discord.js")
const db = require("../db/db")
const guildDelete = require("./guildDelete")
var invCache = require("../inviteCache")
const temp = require("../guildFetched")

module.exports = async (client, member) => {

    const promises = [
        client.shard.fetchClientValues('guilds.cache.size'),
        client.shard.broadcastEval('this.guilds.cache.reduce((prev, guild) => prev + guild.memberCount, 0)'),
    ];
    
    Promise.all(promises)
        .then(results => {
            const totalGuilds = results[0].reduce((prev, guildCount) => prev + guildCount, 0);
            const totalMembers = results[1].reduce((prev, memberCount) => prev + memberCount, 0);


            db.con.query("UPDATE `stats` SET `Servers`= ?", totalGuilds)
            db.con.query("UPDATE `stats` SET `Users`= ?", totalMembers)
        })
        .catch(console.error);

        db.con.query("SELECT * FROM stats", (err, rows) => {
            if(rows.length < 1 ){

            } else {
                let currentJoin = rows[0].joined
                db.con.query("UPDATE stats SET joined = ?", parseInt(currentJoin + 1))
            }
        })
        

    db.con.query("SELECT * FROM joins WHERE (userID,serverID) = (?,?)",[member.id, member.guild.id], (err, rowsJoins) => {
        let transaction = [];
        if(rowsJoins < 1){
            
        } else {
            let now = new Date();
            now.setDate(now.getDate());
            if(now > rowsJoins[0].canLeaveAt){
                db.con.query("DELETE FROM `joins` WHERE (userID, serverID) = (?,?)", [member.id, member.guild.id])
            } else {
                db.con.query("SELECT * FROM members WHERE id = ?",member.id, (err, rowsUser) => {
                    if(rowsUser.length < 1){
                        db.con.query("DELETE FROM `joins` WHERE (userID, serverID) = (?,?)", [member.id, member.guild.id])
                    } else {
                        transaction = rowsUser[0].transaction
                        if(transaction == null) transaction = [];
                        transaction.unshift("[-2,00] Leaved Server")

                        db.con.query("DELETE FROM `joins` WHERE (userID, serverID) = (?,?)", [member.id, member.guild.id])
                        db.con.query("UPDATE `members` SET `coins`=?,`transaction`=? WHERE id = ?", [(rowsUser[0].coins - 2.00), JSON.stringify(transaction), member.id])
                    }
                })
            }
        }
    })

}