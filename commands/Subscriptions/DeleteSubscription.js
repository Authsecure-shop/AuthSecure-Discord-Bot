const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");
const { getSellerKey } = require("../../utils/config");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("delsub")
        .setDescription("Delete a subscription")
        .addStringOption(o =>
            o.setName("name")
                .setDescription("Subscription name to delete")
                .setRequired(true)
        ),

    async execute(interaction) {

        const sellerKey = getSellerKey();
        const BASE_URL = process.env.BASE_URL;

        if (!sellerKey) {
            return interaction.reply("❌ Seller key not set. Use `/setsellerkey` first.");
        }

        const name = interaction.options.getString("name");

        const url = `${BASE_URL}/seller_delete_subscription.php` +
            `?sellerkey=${sellerKey}` +
            `&name=${encodeURIComponent(name)}`;

        try {
            const res = await axios.get(url);

            // JSON RESPONSE
            if (typeof res.data === "object") {

                if (!res.data.success) {
                    return interaction.reply("❌ " + (res.data.message || "Failed to delete subscription"));
                }

                return interaction.reply(
                    `🗑️ **Subscription Deleted**\n` +
                    `Name: **${name}**`
                );
            }

            // TEXT fallback
            return interaction.reply("🗑️ " + res.data);

        } catch (err) {
            console.error(err);
            return interaction.reply("❌ API Request failed. Check console.");
        }
    }
};
