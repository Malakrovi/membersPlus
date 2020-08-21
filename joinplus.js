var colors = require('colors');
const Discord = require("discord.js");
const fs = require("fs");
const db = require("./db/db")
const config = require("./config.json");
var prefix = config.prefix;
const client = new Discord.Client({
    fetchAllMembers: true
});
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
var inviteCache = require("./inviteCache")
require("./website/server")
const wait = require('util').promisify(setTimeout);

db.con.connect(function(err) {
    if (err) throw err;
    console.log("Connected to database")
});

client.login(config.token);

fs.readdir("./Commands/", (err, files) => {
    if (err) console.log(err)
    console.log(`${files.length} commands loaded`.bgRed.black);
    let jsfiles = files.filter(f => f.split(".").pop() === "js");

    if (jsfiles.length <= 0) {
        console.log("Commands not loaded")
        return;
    }

    jsfiles.forEach((f, i) => {
        let props = require(`./Commands/${f}`)
        client.commands.set(props.help.name, props);
        props.help.aliases.forEach(alias => {
            client.aliases.set(alias, props.help.name)
        })
    })
})


fs.readdir('./events/', (err, files) => {
    if (err) return console.error;
    files.forEach(file => {
        if (!file.endsWith('.js')) return;
        const evt = require(`./events/${file}`);
        let evtName = file.split('.')[0];
        console.log(`Loaded event '${evtName}'`);
        client.on(evtName, evt.bind(null, client));
    });
});


client.on("ready", () => {
    wait(1000);

    client.guilds.cache.forEach(guild => {
        guild.fetchInvites()
            .then(invites => inviteCache.guildInvite.set(guild.id, invites))
            .catch(err => console.log(err))
    });

    let promises = [
        client.shard.fetchClientValues('guilds.cache.size'),
        client.shard.broadcastEval('this.guilds.cache.reduce((prev, guild) => prev + guild.memberCount, 0)'),
    ];

    Promise.all(promises)
        .then(results => {
            let totalGuilds = results[0].reduce((prev, guildCount) => prev + guildCount, 0);
            let totalMembers = results[1].reduce((prev, memberCount) => prev + memberCount, 0);


            db.con.query("UPDATE `stats` SET `Servers`= ?", totalGuilds)
            db.con.query("UPDATE `stats` SET `Users`= ?", totalMembers)

            client.user.setActivity(config.stream, {type: "STREAMING", url: "https://twitch.tv/mlk#2389"});
        })
        .catch(console.error);

    console.log(
        `Connected has ${client.user.tag} \n`.bgGreen.black +
        `Client Id: ${client.user.id} \n `.bgGreen.black +
        `Invite: https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=8 \n`.bgGreen.black +
        `Discord Version: ${Discord.version}`.bgGreen.black
    )




})

client.on("message", async message => {
    client.emit('checkMessage', message);

    if (message.channel.id === config.boostToWinChannel) {
        if (message.author.bot) {
            null
        } else {
            const channel = client.channels.resolve(config.boostToWinChannel);
            if (!channel) return;
            const send = new Discord.MessageEmbed()
                .setColor('#ff69b4')
                .setDescription(`${message.author} won 50 coins for **boosting** the server`)
            message.channel.send(send);

            db.con.query("SELECT * FROM members WHERE id = ?", message.author.id, (err, rowsAuthor) => {
                if (err) throw err;

                if (rowsAuthor.length < 1) {
                    let transactionAuthor = [];
                    transactionAuthor.unshift(`[+50] Boosting support server`)

                    db.con.query("INSERT INTO `members`(`id`, `tag`, `transaction`, `coins`) VALUES (?, ?, ?, ?)", [message.author.id, message.author.tag, JSON.stringify(transactionAuthor), parseFloat(50)])

                } else {
                    if (err) throw err;
                    let authorCoins = rowsAuthor[0].coins;
                    let transactionAuthor = [];
                    transactionAuthor = rowsAuthor[0].transaction
                    if (transactionAuthor == null) transactionAuthor = [];
                    transactionAuthor.unshift(`[+50] Boosting support server`)

                    db.con.query("UPDATE `members` SET `coins`= ? WHERE id = ?", [parseFloat((authorCoins + 50)), message.author.id])
                    db.con.query("UPDATE `members` SET `transaction`= ? WHERE id = ?", [JSON.stringify(transactionAuthor), message.author.id])

                }
            })

        }
    }

    let prefix = config.prefix;
    if (!message.content.startsWith(prefix)) return;
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let Args = messageArray.slice(1);
    var args = message.content.substring(prefix.length).split(" ");
    let commandFile = client.commands.get(cmd.slice(prefix.length));
    if (commandFile) {
        commandFile.run(client, message, Args, args)
    } else {
        commandFile = client.commands.get(client.aliases.get(cmd.slice(prefix.length)));
        if (commandFile) {
            commandFile.run(client, message, Args, args)
        }
    }

    db.con.query("SELECT * FROM `stats`", (err, rows) => {
        if (rows.length < 1) {

        } else {
            let cm = rows[0].commandsMade;

            db.con.query("UPDATE `stats` SET `commandsMade`= ?", parseInt(cm + 1))
        }
    })



})


