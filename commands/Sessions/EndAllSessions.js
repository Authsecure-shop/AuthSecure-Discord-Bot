const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");
const { getSellerKey } = require("../../utils/config");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("endallsessions")
        .setDescription("Terminate ALL active sessions for the application"),

    async execute(interaction) {

        const sellerKey = getSellerKey();
        const BASE_URL = process.env.BASE_URL;

        if (!sellerKey) {
            return interaction.reply("❌ Seller key not set. Use `/setsellerkey` first.");
        }

        const url =
            `${BASE_URL}/sessions_end_all.php?sellerkey=${sellerKey}&type=end_all`;

        try {
            const res = await axios.get(url);

            // JSON reply
            if (typeof res.data === "object") {

                if (!res.data.success) {
                    return interaction.reply("❌ " + (res.data.message || "Failed to delete sessions"));
                }

                return interaction.reply("🛑 **All Sessions Have Been Terminated Successfully!**");
            }

            // Text fallback
            return interaction.reply("🛑 " + res.data);

        } catch (err) {
            console.error(err);
            return interaction.reply("❌ API request failed. Check console.");
        }
    }
};
