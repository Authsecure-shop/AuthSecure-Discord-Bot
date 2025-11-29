require("dotenv").config();
const { Client, GatewayIntentBits, REST, Routes } = require("discord.js");
const { loadCommands } = require("./utils/loadCommands");
const axios = require("axios");

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

const TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
let SELLERKEY = process.env.SELLER_API_KEY;
const BASE_URL = process.env.BASE_URL;

const commandsJSON = loadCommands(client);

const rest = new REST({ version: "10" }).setToken(TOKEN);

(async () => {
    try {
        console.log("⏳ Updating slash commands...");
        await rest.put(Routes.applicationCommands(CLIENT_ID), {
            body: commandsJSON
        });
        console.log("✅ Slash Commands Updated!");
    } catch (error) {
        console.error(error);
    }
})();

client.on("interactionCreate", async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return interaction.reply("❌ Command not found");

    try {
        await command.execute(interaction, { SELLERKEY, BASE_URL, axios });
    } catch (err) {
        console.error(err);
        await interaction.reply("⚠️ Error executing command");
    }
});

client.login(TOKEN);
