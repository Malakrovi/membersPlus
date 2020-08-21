const Discord = require("discord.js");
const config = require("../config.json")
const db = require("../db/db")
const temp = require("../guildFetched")
const https = require('https');
var ProxyLists = require('proxy-lists');
const { set } = require("lodash");

var proxyChange = 0;

module.exports.run = async (client, message, args) => {
    if(message.channel.type == "dm") return;
    let embed = new Discord.MessageEmbed();
    
    proxyChange++

    embed.setTitle("Server Finder");
    embed.setAuthor(client.user.username, client.user.avatarURL());
    embed.setThumbnail(message.author.avatarURL())
    embed.setColor(config.embedColor)
    embed.setDescription(`Hey <@${message.author.id}>, join these servers to get 1 coins each:`);
    embed.addField("__**Want to get coins without having to join servers?**__", `Check out our coin packages with the ${config.prefix}purchase command.`);
    embed.setFooter(config.copyright)

    let proxy = "";
    let loading = await message.channel.send("Searching server")
    let intervLoaing = 0;

    let interv = setInterval(() => {
        intervLoaing++
        if(intervLoaing > 3) return intervLoaing = 0;
        let point = "";
        if(intervLoaing == 1) point = "."
        if(intervLoaing == 2) point = ".."
        if(intervLoaing == 3) point = "..."
        
        loading.edit("Searching servers" + point)


    }, 1000)

    if(proxyChange > 15) {
        var scraperapiClient = require('scraperapi-sdk')('243050401aad3d1c688ea74c64d5eb24')
        var response = await scraperapiClient.get('http://httpbin.org/ip')
        proxy = JSON.parse(response).origin;
        proxyChange = 0;
        console.log("Servers Finder Proxy Changed")
    }
    
    console.log(proxy)
    

    db.con.query("SELECT * FROM guilds ORDER BY boughtJoins DESC", async(err, rows) => {
        if(err) throw err;

        if(rows.length < 1){
            embed.addField("Error", "No server found")
        } else {
            let Found = 0;
            findServerArray = []
            let maxServ = 5
            for(let i = 0; i < maxServ; i++) if(rows[i] && rows[i].boughtJoins > 0){
                if(!client.guilds.resolve(rows[i].id).members.resolve(message.author.id)){

                    let realInvite = true;
                       
                        var options = {
                            host: proxy,
                            port: 8080,
                            path: `https://discord.com/api/invite/${rows[i].invite}`,
                        };
                            
                            let req =  https.request(`https://discord.com/api/invite/${rows[i].invite}`, function(res) {
                                res.setEncoding('utf8');

                                res.on('data', async function (chunk) {
                                if(chunk.includes('"message"')){
                                    realInvite = false;
                                    console.log(chunk)
                                }
                              });
                            })

                            req.on('error', function(e) {
                                console.log('problem with request: ' + e.message);
                              });

                              req.end();
                          
                              await sleep(500)

                              if(realInvite){
                                  console.log(realInvite.toString())
                                embed.addField(rows[i].advertName, `https://discord.gg/${rows[i].invite}`);
                                findServerArray.push(`${rows[i].id}`)
                                Found++
                              } else {
                                db.con.query("UPDATE `guilds` SET `currentJoins`=?,`boughtJoins`=? WHERE id = ?", [0, 0, rows[i].id])
                              }

                } else {
                    maxServ++
                }
                
            }
            
            if(Found < 1){
                embed.addField("Error", "No server found")
            }

            console.log(findServerArray)
            db.con.query("SELECT * FROM find WHERE userID = ?", message.author.id, (err, rowsFind) => {
                if(err) throw err;
                findServerArray = JSON.stringify(findServerArray)
                if(rowsFind.length < 1){
                    db.con.query("INSERT INTO `find` (`userID`, `serverArray`) VALUES (?,?)", [message.author.id, findServerArray])
                }else {
                    db.con.query("UPDATE `find` SET `serverArray` = ? WHERE userID = ?", [findServerArray, message.author.id])
                }
            })

        }

        let fieldTexts = {
            "Servers For No Coins": 
            "Joining these servers will not give you any coins.",

            "JoinPlus+ Official Help Server": 
            "https://discord.gg/fFdsEs6",

            "Are you seeing servers you are already in?": 
            "This means you have been in those servers for a week and can leave without losing any coins.",

            "Do none of the invite links work?": 
            "That means you have reached the max amount of servers you can join this week." +
            "Wait a week and leave the servers you are in without losing coins. Then join all new servers to get more coins."
        };

        for(let [head, text] of Object.entries(fieldTexts)) embed.addField("__**" + head + "**__", text);
        
        clearInterval(interv)
    loading.edit("__**Servers found:**__")
        message.channel.send(embed);
        
    });
    
}

module.exports.help = {
    name: "find",
    aliases: ["f"]
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}