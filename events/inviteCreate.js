const config = require("../config.json")
const Discord = require("discord.js")
const db = require("../db/db")
var inviteCache = require("../inviteCache")

module.exports = async (client, invite) => {
    inviteCache.guildInvite.set(invite.guild.id, await invite.guild.fetchInvites())
}   