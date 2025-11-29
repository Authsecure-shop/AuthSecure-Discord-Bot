const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");
const { getSellerKey } = require("../../utils/config");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("getsessions")
        .setDescription("Retrieve all active sessions"),

    async execute(interaction) {

        const sellerKey = getSellerKey();
        const BASE_URL = process.env.BASE_URL;

        if (!sellerKey) {
            return interaction.reply("❌ Seller key not set. Use `/setsellerkey` first.");
        }

        const url = `${BASE_URL}/sessions_get.php?sellerkey=${sellerKey}&format=json`;

        try {
            const res = await axios.get(url);

            if (!res.data.success || !res.data.sessions) {
                return interaction.reply("❌ Failed to retrieve sessions.");
            }

            const sessions = res.data.sessions;

            if (sessions.length === 0) {
                return interaction.reply("📭 No active sessions found.");
            }

            let output = "";
            sessions.forEach(s => {
                output += `🔹 **Session ID:** ${s.session_id}\n👤 User: ${s.username}\n🌐 IP: ${s.ip_address}\n⏳ Created: ${s.created_at}\n🚫 Expire: ${s.expired_at}\n\n`;
            });

            await interaction.reply(`📌 **Active Sessions:**\n\`\`\`\n${output}\`\`\``);

        } catch (err) {
            console.error(err);
            return interaction.reply("❌ API request failed. Check console.");
        }
    }
};
