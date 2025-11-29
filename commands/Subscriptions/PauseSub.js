const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");
const { getSellerKey } = require("../../utils/config");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("pausesub")
        .setDescription("Pause a subscription")
        .addStringOption(o =>
            o.setName("subscription")
                .setDescription("Subscription name to pause")
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
            `${BASE_URL}/seller_pause_subscription.php?sellerkey=${sellerKey}` +
            `&subscription=${encodeURIComponent(subName)}`;

        try {
            const res = await axios.get(url);

            // JSON response
            if (typeof res.data === "object") {

                if (!res.data.success) {
                    return interaction.reply("❌ " + (res.data.message || "Failed to pause subscription"));
                }

                return interaction.reply(
                    `⏸️ **Subscription Paused**\nSubscription: **${subName}**`
                );
            }

            // TEXT fallback
            return interaction.reply("⏸️ " + res.data);

        } catch (err) {
            console.error(err);
            return interaction.reply("❌ API request failed.");
        }
    }
};
