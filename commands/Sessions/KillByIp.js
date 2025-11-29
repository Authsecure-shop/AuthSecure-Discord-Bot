const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");
const { getSellerKey } = require("../../utils/config");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("killsessionsip")
        .setDescription("Terminate all sessions from a specific IP address")
        .addStringOption(o =>
            o.setName("ip")
                .setDescription("IP address to terminate sessions")
                .setRequired(true)
        ),

    async execute(interaction) {

        const sellerKey = getSellerKey();
        const BASE_URL = process.env.BASE_URL;

        if (!sellerKey) {
            return interaction.reply("❌ Seller key not set. Use `/setsellerkey` first.");
        }

        const ip = interaction.options.getString("ip");
        const url = `${BASE_URL}/session_kill_ip.php?sellerkey=${sellerKey}&type=kill_ip&ip=${ip}`;

        try {
            const res = await axios.get(url);

            // If API returns JSON message
            if (typeof res.data === "object") {
                if (res.data.success) {
                    return interaction.reply(`🛑 **Sessions Terminated**\nIP: \`${ip}\``);
                }
                return interaction.reply(`❌ Failed: ${res.data.message}`);
            }

            // Fallback to text response
            return interaction.reply(`🛑 ${res.data}`);

        } catch (err) {
            console.error(err);
            return interaction.reply("❌ API request failed. Check console.");
        }
    }
};
