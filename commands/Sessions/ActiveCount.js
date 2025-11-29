const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");
const { getSellerKey } = require("../../utils/config");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("activecount")
        .setDescription("Check active authenticated session count"),

    async execute(interaction) {

        const sellerKey = getSellerKey();
        const BASE_URL = process.env.BASE_URL;

        if (!sellerKey)
            return interaction.reply("❌ Seller key not set. Use `/setsellerkey` first.");

        const url = `${BASE_URL}/session_count_active.php?sellerkey=${sellerKey}`;

        try {
            const res = await axios.get(url);

            if (typeof res.data === "object" && res.data.success) {
                return interaction.reply(`📊 **Active Sessions:** \`${res.data.active_sessions}\``);
            }

            return interaction.reply("❌ Unexpected response: " + res.data);

        } catch (err) {
            console.error(err);
            return interaction.reply("❌ API Request Failed.");
        }
    }
};
