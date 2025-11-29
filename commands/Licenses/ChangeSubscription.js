const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");
const { getSellerKey } = require("../../utils/config");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("changesub")
        .setDescription("Change a license subscription")
        .addStringOption(o =>
            o.setName("license")
                .setDescription("License key")
                .setRequired(true)
        )
        .addStringOption(o =>
            o.setName("subscription")
                .setDescription("New subscription name")
                .setRequired(true)
        ),

    async execute(interaction) {

        const sellerKey = getSellerKey();
        const BASE_URL = process.env.BASE_URL;

        if (!sellerKey) {
            return interaction.reply("❌ Seller key not set. Use `/setsellerkey` first.");
        }

        const key = interaction.options.getString("license");
        const newSub = interaction.options.getString("subscription");

        const url = `${BASE_URL}/seller_change_subscription.php?sellerkey=${sellerKey}&key=${key}&subscription=${encodeURIComponent(newSub)}`;

        try {
            const res = await axios.get(url);

            if (typeof res.data === "object") {

                if (!res.data.success) {
                    return interaction.reply("❌ " + (res.data.msg || "Failed to update subscription"));
                }

                return interaction.reply(
                    `🔄 **Subscription Updated**\nLicense: \`${key}\`\nNew Subscription: **${newSub}**`
                );
            }

            // TEXT fallback
            return interaction.reply("🔄 " + res.data);

        } catch (err) {
            console.error(err);
            return interaction.reply("❌ API Request failed. Check console.");
        }
    }
};
