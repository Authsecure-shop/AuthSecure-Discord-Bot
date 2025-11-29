const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");
const { getSellerKey } = require("../../utils/config");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("deleteallunused")
        .setDescription("Delete ALL unused (not activated) licenses"),

    async execute(interaction) {

        const sellerKey = getSellerKey();
        const BASE_URL = process.env.BASE_URL;

        if (!sellerKey) {
            return interaction.reply("❌ Seller key not set. Use `/setsellerkey` first.");
        }

        const url = `${BASE_URL}/seller_delete_all_unused.php?sellerkey=${sellerKey}`;

        try {
            const res = await axios.get(url);

            // JSON response → { success:true, deleted_unused: NUMBER }
            if (typeof res.data === "object") {
                return interaction.reply(
                    `🗑️ **Unused Licenses Deleted:** ${res.data.deleted_unused}`
                );
            }

            // Fallback plain text
            return interaction.reply("🗑️ " + res.data);

        } catch (err) {
            console.error(err);
            return interaction.reply("❌ API request failed. Check console.");
        }
    }
};
