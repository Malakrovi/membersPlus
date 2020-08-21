const config = require("../config.json")
const Discord = require("discord.js")
const db = require("../db/db")
const guildDelete = require("./guildDelete")
var inviteCache = require("../inviteCache")


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



    const cachedInvites = inviteCache.guildInvite.get(member.guild.id);
    const newInvites = await member.guild.fetchInvites();

    inviteCache.guildInvite.set(member.guild.id, newInvites)

    let inviter;
        try{
            const usedInvite = newInvites.find(inv => cachedInvites.get(inv.code).uses < inv.uses);
            inviter = usedInvite.inviter.id;
        } catch(err){
            console.log(err)
        }
        console.log("inviter " + inviter)

    if(inviter != client.user.id) return;
        let isFinded = true;

        db.con.query("SELECT * FROM find WHERE userID = ?", member.id, (err, rowsFind) => {
            if(err) throw err;
            if(rowsFind.length < 1){
                isFinded = false;
            }else {
                let serverFindPreviously = rowsFind[0].serverArray;
                console.log(serverFindPreviously)
                for(let i = 0; i < serverFindPreviously.length; i++){
                    if(member.guild.id == serverFindPreviously[i]) isFinded = true;
                }
                    
                
            }
        })

        if(isFinded == false) return;

    db.con.query("SELECT * FROM guilds ORDER BY boughtJoins DESC", (err, rows) => {
        if(err) throw err;

        if(rows.length < 1){                
            console.log("No server found")
        } else {
            for(let i = 0; i < rows.length; i++) if(member.guild.id == rows[i].id){
                db.con.query("SELECT * FROM members WHERE id = ?",member.id, (err, rowss) => {
                    let transaction = [];
                    if(rowss.length < 1){
                        transaction.unshift("[+1] Joined Server")
                        db.con.query("INSERT INTO `members`(`id`, `tag`, `coins`, `transaction`) VALUES (?,?,?,?)", [member.id, member.user.tag, parseFloat(1), JSON.stringify(transaction)])
                    } else {
                        let coins = rowss[0].coins
                        transaction = rowss[0].transaction
                        if(transaction == null) transaction = [];
                        transaction.unshift("[+1] Joined Server")

                        db.con.query("UPDATE `members` SET `coins`= ? WHERE id = ?", [parseFloat(coins + 1), member.id])
                        db.con.query("UPDATE `members` SET `transaction`= ? WHERE id = ?", [JSON.stringify(transaction), member.id])
                        
                    }

                    db.con.query("SELECT * FROM guilds WHERE id = ?", member.guild.id, (err, rowsServer) => {
                        if(err) throw err;

                        if(rowsServer.length < 1){
                            console.log("no server")
                        } else {
                            let cJ = rowsServer[0].currentJoins
                            let bJ = rowsServer[0].boughtJoins
                            if(cJ + 1 >= bJ){
                                db.con.query("UPDATE guilds SET currentJoins = ? WHERE id = ?", [0, member.guild.id])
                                db.con.query("UPDATE guilds SET boughtJoins = ? WHERE id = ?", [0, member.guild.id])
                            } else {
                                db.con.query("UPDATE guilds SET currentJoins = ? WHERE id = ?", [cJ + 1, member.guild.id])
                            }
                            
                        }

                    })

                    db.con.query("SELECT * FROM joins WHERE (userID,serverID) = (?,?)",[member.id, member.guild.id], (err, rowsJoins) => {
                        if(rowsJoins < 1){
                            let numWeeks = 2;
                            let now = new Date();
                            now.setDate(now.getDate() + numWeeks * 7);
                            db.con.query("INSERT INTO `joins`(`userID`, `serverID`, `canLeaveAt`) VALUES (?,?,?)", [member.id, member.guild.id, now])
                        } else {
                            let numWeeks = 2;
                            let now = new Date();
                            let createdAt = new Date();
                            createdAt.setDate(createdAt.getDate());
                            now.setDate(now.getDate() + numWeeks * 7);

                            db.con.query("UPDATE `joins` SET `userID`=?,`serverID`=?,`joinedAt`=?,`canLeaveAt`=? WHERE (userID, serverID) = (?,?)", [member.id, member.guild.id, createdAt, now, member.id, member.guild.id])
                        }
                    })

                   
                })
            }
        }

    });

}