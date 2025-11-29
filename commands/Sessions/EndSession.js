const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");
const { getSellerKey } = require("../../utils/config");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("endsession")
        .setDescription("End a specific session by session_id")
        .addStringOption(o =>
            o.setName("session_id")
                .setDescription("Session ID to terminate")
                .setRequired(true)
        ),

    async execute(interaction) {

        const sellerKey = getSellerKey();
        const BASE_URL = process.env.BASE_URL;

        if (!sellerKey) {
            return interaction.reply("❌ Seller key not set. Use `/setsellerkey` first.");
        }

        const sessionID = interaction.options.getString("session_id");

        const url =
            `${BASE_URL}/sessions_end_single.php?sellerkey=${sellerKey}` +
            `&type=end_session&session_id=${encodeURIComponent(sessionID)}`;

        try {
            const res = await axios.get(url);

            // Object(JSON) response
            if (typeof res.data === "object") {

                if (!res.data.success) {
                    return interaction.reply("❌ " + (res.data.message || "Failed to end session"));
                }

                return interaction.reply(
                    `🛑 **Session Ended Successfully**\nSession ID: \`${sessionID}\``
                );
            }

            // If API returns plain text
            return interaction.reply("🛑 " + res.data);

        } catch (err) {
            console.error(err);
            return interaction.reply("❌ API request failed, check console.");
        }
    }
};
