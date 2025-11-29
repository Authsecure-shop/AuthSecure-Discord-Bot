const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");
const { getSellerKey } = require("../../utils/config");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("unpausesub")
        .setDescription("Unpause a subscription")
        .addStringOption(o =>
            o.setName("subscription")
                .setDescription("Subscription name to unpause")
                .setRequired(true)
        ),

    async execute(interaction) {

        const sellerKey = getSellerKey();
        const BASE_URL = process.env.BASE_URL;

        if (!sellerKey) {
            return interaction.reply("❌ Seller key not set. Use `/setsellerkey` first.");
        }

        const subName = interaction.options.getString("subscription");

        const url =
            `${BASE_URL}/seller_unpause_subscription.php?sellerkey=${sellerKey}` +
            `&subscription=${encodeURIComponent(subName)}`;

        try {
            const res = await axios.get(url);

            // JSON format
            if (typeof res.data === "object") {

                if (!res.data.success) {
                    return interaction.reply("❌ " + (res.data.message || "Failed to unpause subscription."));
                }

                return interaction.reply(
                    `▶️ **Subscription Unpaused**\nSubscription: **${subName}**`
                );
            }

            // TEXT fallback
            return interaction.reply("▶️ " + res.data);

        } catch (err) {
            console.error(err);
            return interaction.reply("❌ API Request failed. Check console.");
        }
    }
};
