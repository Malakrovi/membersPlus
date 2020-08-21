const Discord = require("discord.js");
const config = require("../config.json")
var paypal = require('paypal-rest-sdk');
const { parentPort } = require("worker_threads");
var website = require("../website/server")
var path = require("path")
let db = require("../db/db")


paypal.configure({
    'mode': 'live', //sandbox or live
    'client_id': '',
    'client_secret': config.pclient
  });
  
module.exports.run = async (client, message, args) => {
    let embed = new Discord.MessageEmbed()
        .setTitle("Purchase coins")
        .setDescription("You can pay just with paypal. ")
        .addField("1️⃣ 1000 coins", "€19.99")
        .addField("2️⃣ 2500 (+300 Bonus) coins", "€49.99")
        .addField("3️⃣ 6000 (+1500 Bonus) coins", "€119.99")
        .addField("4️⃣ 10000 (+3500 Bonus) coins", "€199.99")
        .setFooter(config.copyright)
        .setColor(config.embedColor)


        try {
            message.channel.send("Check your private message")
        } catch(err) {
            message.channel.send("Please enable your dm")
        }

        let payerDiscordID = message.author.id;               
        let payerDiscordTAG = message.author.tag;
        

        let msg = await message.author.send(embed)
           msg.react("1️⃣")
           msg.react("2️⃣")
           msg.react("3️⃣")
           msg.react("4️⃣")

          let collector = msg.createReactionCollector((reaction, user) => user.id === message.author.id);


          collector.on("collect", async(reaction, user) => {
            

            if(reaction.emoji.name === "1️⃣") {
                let price = 19.99;
                let paidCoins = 1000;

                let itemName = "JoinPlus - 1000 coins"
                let description = "JoinPlus - 1000 coins"
                let invoiceAuthorid = reaction.message.author.id;
                
                var create_payment_json = {
                    "intent": "sale",
                    "payer": {
                        "payment_method": "paypal"
                    },
                    "redirect_urls": {
                        "return_url": "http://164.132.216.153/success",
                        "cancel_url": "http://164.132.216.153/cancel"
                    },
                    "transactions": [{
                        "item_list": {
                            "items": [{
                                "name": itemName,
                                "sku": "001",
                                "price": price,
                                "currency": "EUR",
                                "quantity": 1
                            }]
                        },
                        "amount": {
                            "currency": "EUR",
                            "total": price
                        },
                        "description": description
                    }]
                };
                
                paypal.payment.create(create_payment_json, function (error, payment) {
                    if (error) {
                        throw error;
                    } else {
                        for(let i = 0;i < payment.links.length;i++){
                          if(payment.links[i].rel === 'approval_url'){
                            reaction.message.channel.send(new Discord.MessageEmbed()
                                .setDescription(`[Click Here To Pay](${payment.links[i].href})`)
                                .setFooter(config.copyright)
                                .setColor(config.embedColor)
                            );
                          }
                        }
                    }
                  });

                
                  website.app.get('/success', (req, res) => {
                    const payerId = req.query.PayerID;
                    const paymentId = req.query.paymentId;
                  
                    const execute_payment_json = {
                      "payer_id": payerId,
                      "transactions": [{
                          "amount": {
                              "currency": "EUR",
                              "total": price
                          }
                      }]
                    };
                  
                    paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
                      if (error) {
                          console.log(error.response);
                          throw error;
                      } else {
                          res.sendFile(path.join(__dirname, '../website', 'success.html'));

                          

                          


                          db.con.query("SELECT * FROM members WHERE id = ?",payerDiscordID, (err, rowss) => {
                            let transaction = [];
                            if(rowss.length < 1){
                                transaction.unshift(`[+${paidCoins}] Buy coins`)
                                db.con.query("INSERT INTO `members`(`id`, `tag`, `coins`, `transaction`) VALUES (?,?,?,?)", [payerDiscordID, payerDiscordTAG, parseFloat(paidCoins), JSON.stringify(transaction)])
                            } else {
                                let coins = rowss[0].coins
                                transaction = rowss[0].transaction
                                if(transaction == null) transaction = [];
                                transaction.unshift(`[+${paidCoins}] Buy coins`)
        
                                db.con.query("UPDATE `members` SET `coins`= ? WHERE id = ?", [parseFloat(coins + paidCoins), payerDiscordID])
                                db.con.query("UPDATE `members` SET `transaction`= ? WHERE id = ?", [JSON.stringify(transaction), payerDiscordID])
                                
                            }
                           
                        })

                      }
                  });
                  });
                  
                  website.app.get('/cancel', (req, res) => res.sendFile(path.join(__dirname, '../website', 'error.html')));
                  
            }

            if(reaction.emoji.name === "2️⃣") {
                let price = 49.99;
                let paidCoins = 2800;

                let itemName = "JoinPlus - 2800 coins"
                let description = "JoinPlus - 2800 coins"
                let invoiceAuthorid = reaction.message.author.id;
                
                var create_payment_json = {
                    "intent": "sale",
                    "payer": {
                        "payment_method": "paypal"
                    },
                    "redirect_urls": {
                        "return_url": "http://164.132.216.153/success",
                        "cancel_url": "http://164.132.216.153/cancel"
                    },
                    "transactions": [{
                        "item_list": {
                            "items": [{
                                "name": itemName,
                                "sku": "001",
                                "price": price,
                                "currency": "EUR",
                                "quantity": 1
                            }]
                        },
                        "amount": {
                            "currency": "EUR",
                            "total": price
                        },
                        "description": description
                    }]
                };
                
                paypal.payment.create(create_payment_json, function (error, payment) {
                    if (error) {
                        throw error;
                    } else {
                        for(let i = 0;i < payment.links.length;i++){
                          if(payment.links[i].rel === 'approval_url'){
                            reaction.message.channel.send(new Discord.MessageEmbed()
                                .setDescription(`[Click Here To Pay](${payment.links[i].href})`)
                                .setFooter(config.copyright)
                                .setColor(config.embedColor)
                            );
                          }
                        }
                    }
                  });

                
                  website.app.get('/success', (req, res) => {
                    const payerId = req.query.PayerID;
                    const paymentId = req.query.paymentId;
                  
                    const execute_payment_json = {
                      "payer_id": payerId,
                      "transactions": [{
                          "amount": {
                              "currency": "EUR",
                              "total": price
                          }
                      }]
                    };
                  
                    paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
                      if (error) {
                          console.log(error.response);
                          throw error;
                      } else {
                          res.sendFile(path.join(__dirname, '../website', 'success.html'));

                          

                          


                          db.con.query("SELECT * FROM members WHERE id = ?",payerDiscordID, (err, rowss) => {
                            let transaction = [];
                            if(rowss.length < 1){
                                transaction.unshift(`[+${paidCoins}] Buy coins`)
                                db.con.query("INSERT INTO `members`(`id`, `tag`, `coins`, `transaction`) VALUES (?,?,?,?)", [payerDiscordID, payerDiscordTAG, parseFloat(paidCoins), JSON.stringify(transaction)])
                            } else {
                                let coins = rowss[0].coins
                                transaction = rowss[0].transaction
                                if(transaction == null) transaction = [];
                                transaction.unshift(`[+${paidCoins}] Buy coins`)
        
                                db.con.query("UPDATE `members` SET `coins`= ? WHERE id = ?", [parseFloat(coins + paidCoins), payerDiscordID])
                                db.con.query("UPDATE `members` SET `transaction`= ? WHERE id = ?", [JSON.stringify(transaction), payerDiscordID])
                                
                            }
                           
                        })

                      }
                  });
                  });
                  
                  website.app.get('/cancel', (req, res) => res.sendFile(path.join(__dirname, '../website', 'error.html')));
            }

            if(reaction.emoji.name === "3️⃣") {
                let price = 119.99;
                let paidCoins = 7500;

                let itemName = "JoinPlus - 7500 coins"
                let description = "JoinPlus - 7500 coins"
                let invoiceAuthorid = reaction.message.author.id;
                
                var create_payment_json = {
                    "intent": "sale",
                    "payer": {
                        "payment_method": "paypal"
                    },
                    "redirect_urls": {
                        "return_url": "http://164.132.216.153/success",
                        "cancel_url": "http://164.132.216.153/cancel"
                    },
                    "transactions": [{
                        "item_list": {
                            "items": [{
                                "name": itemName,
                                "sku": "001",
                                "price": price,
                                "currency": "EUR",
                                "quantity": 1
                            }]
                        },
                        "amount": {
                            "currency": "EUR",
                            "total": price
                        },
                        "description": description
                    }]
                };
                
                paypal.payment.create(create_payment_json, function (error, payment) {
                    if (error) {
                        throw error;
                    } else {
                        for(let i = 0;i < payment.links.length;i++){
                          if(payment.links[i].rel === 'approval_url'){
                            reaction.message.channel.send(new Discord.MessageEmbed()
                                .setDescription(`[Click Here To Pay](${payment.links[i].href})`)
                                .setFooter(config.copyright)
                                .setColor(config.embedColor)
                            );
                          }
                        }
                    }
                  });

                
                  website.app.get('/success', (req, res) => {
                    const payerId = req.query.PayerID;
                    const paymentId = req.query.paymentId;
                  
                    const execute_payment_json = {
                      "payer_id": payerId,
                      "transactions": [{
                          "amount": {
                              "currency": "EUR",
                              "total": price
                          }
                      }]
                    };
                  
                    paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
                      if (error) {
                          console.log(error.response);
                          throw error;
                      } else {
                          res.sendFile(path.join(__dirname, '../website/events/', 'success.html'));

                          

                          


                          db.con.query("SELECT * FROM members WHERE id = ?",payerDiscordID, (err, rowss) => {
                            let transaction = [];
                            if(rowss.length < 1){
                                transaction.unshift(`[+${paidCoins}] Buy coins`)
                                db.con.query("INSERT INTO `members`(`id`, `tag`, `coins`, `transaction`) VALUES (?,?,?,?)", [payerDiscordID, payerDiscordTAG, parseFloat(paidCoins), JSON.stringify(transaction)])
                            } else {
                                let coins = rowss[0].coins
                                transaction = rowss[0].transaction
                                if(transaction == null) transaction = [];
                                transaction.unshift(`[+${paidCoins}] Buy coins`)
        
                                db.con.query("UPDATE `members` SET `coins`= ? WHERE id = ?", [parseFloat(coins + paidCoins), payerDiscordID])
                                db.con.query("UPDATE `members` SET `transaction`= ? WHERE id = ?", [JSON.stringify(transaction), payerDiscordID])
                                
                            }
                           
                        })

                      }
                  });
                  });
                  
                  website.app.get('/cancel', (req, res) => res.sendFile(path.join(__dirname, '../website/events/', 'error.html')));
                }

            if(reaction.emoji.name === "4️⃣") {
                let price = 199.99;
                let paidCoins = 13500;

                let itemName = "JoinPlus - 7500 coins"
                let description = "JoinPlus - 7500 coins"
                let invoiceAuthorid = reaction.message.author.id;
                
                var create_payment_json = {
                    "intent": "sale",
                    "payer": {
                        "payment_method": "paypal"
                    },
                    "redirect_urls": {
                        "return_url": "http://164.132.216.153/success",
                        "cancel_url": "http://164.132.216.153/cancel"
                    },
                    "transactions": [{
                        "item_list": {
                            "items": [{
                                "name": itemName,
                                "sku": "001",
                                "price": price,
                                "currency": "EUR",
                                "quantity": 1
                            }]
                        },
                        "amount": {
                            "currency": "EUR",
                            "total": price
                        },
                        "description": description
                    }]
                };
                
                paypal.payment.create(create_payment_json, function (error, payment) {
                    if (error) {
                        throw error;
                    } else {
                        for(let i = 0;i < payment.links.length;i++){
                          if(payment.links[i].rel === 'approval_url'){
                            reaction.message.channel.send(new Discord.MessageEmbed()
                                .setDescription(`[Click Here To Pay](${payment.links[i].href})`)
                                .setFooter(config.copyright)
                                .setColor(config.embedColor)
                            );
                          }
                        }
                    }
                  });

                
                  website.app.get('/success', (req, res) => {
                    const payerId = req.query.PayerID;
                    const paymentId = req.query.paymentId;
                  
                    const execute_payment_json = {
                      "payer_id": payerId,
                      "transactions": [{
                          "amount": {
                              "currency": "EUR",
                              "total": price
                          }
                      }]
                    };
                  
                    paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
                      if (error) {
                          console.log(error.response);
                          throw error;
                      } else {
                          res.sendFile(path.join(__dirname, '../website', 'success.html'));

                          

                          


                          db.con.query("SELECT * FROM members WHERE id = ?",payerDiscordID, (err, rowss) => {
                            let transaction = [];
                            if(rowss.length < 1){
                                transaction.unshift(`[+${paidCoins}] Buy coins`)
                                db.con.query("INSERT INTO `members`(`id`, `tag`, `coins`, `transaction`) VALUES (?,?,?,?)", [payerDiscordID, payerDiscordTAG, parseFloat(paidCoins), JSON.stringify(transaction)])
                            } else {
                                let coins = rowss[0].coins
                                transaction = rowss[0].transaction
                                if(transaction == null) transaction = [];
                                transaction.unshift(`[+${paidCoins}] Buy coins`)
        
                                db.con.query("UPDATE `members` SET `coins`= ? WHERE id = ?", [parseFloat(coins + paidCoins), payerDiscordID])
                                db.con.query("UPDATE `members` SET `transaction`= ? WHERE id = ?", [JSON.stringify(transaction), payerDiscordID])
                                
                            }
                           
                        })

                      }
                  });
                  });
                  
                  website.app.get('/cancel', (req, res) => res.sendFile(path.join(__dirname, '../website', 'error.html')));
            }
            collector.stop()
        }); 

        



}

module.exports.help = {
    name: "purchase",
    aliases: ["p"]
}