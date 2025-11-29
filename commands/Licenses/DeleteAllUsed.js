const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");
const { getSellerKey } = require("../../utils/config");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("deleteallused")
        .setDescription("Delete ALL used licenses from your application"),

    async execute(interaction) {
        const sellerKey = getSellerKey();
        const BASE_URL = process.env.BASE_URL;

        if (!sellerKey) {
            return interaction.reply("❌ Seller key not set. Use `/setsellerkey` first.");
        }

        const url = `${BASE_URL}/seller_delete_all_used.php?sellerkey=${sellerKey}`;

        try {
            const res = await axios.get(url);

            // Plain JSON response {success:true, deleted_used: NUMBER}
            if (typeof res.data === "object") {
                return interaction.reply(
                    `🗑️ **Deleted Used Keys:** ${res.data.deleted_used}`
                );
            }

            // Fallback plain text
            return interaction.reply("🗑️ " + res.data);

        } catch (err) {
            console.log(err);
            return interaction.reply("❌ API request failed.");
        }
    }
};
