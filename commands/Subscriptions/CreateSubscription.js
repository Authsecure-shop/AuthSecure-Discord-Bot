const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");
const { getSellerKey } = require("../../utils/config");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("createsub")
        .setDescription("Create a new subscription")
        .addStringOption(o =>
            o.setName("name")
                .setDescription("Subscription name")
                .setRequired(true)
        )
        .addIntegerOption(o =>
            o.setName("level")
                .setDescription("Subscription level (default: 1)")
                .setRequired(false)
        ),

    async execute(interaction) {

        const sellerKey = getSellerKey();
        const BASE_URL = process.env.BASE_URL;

        if (!sellerKey) {
            return interaction.reply("❌ Seller key not set. Use `/setsellerkey` first.");
        }

        const name  = interaction.options.getString("name");
        const level = interaction.options.getInteger("level") ?? 1;

        const url = `${BASE_URL}/seller_create_subscription.php` +
            `?sellerkey=${sellerKey}` +
            `&name=${encodeURIComponent(name)}` +
            `&level=${level}`;

        try {
            const res = await axios.get(url);

            // JSON Response
            if (typeof res.data === "object") {

                if (!res.data.success) {
                    return interaction.reply("❌ " + (res.data.message || "Failed to create subscription"));
                }

                return interaction.reply(
                    `**Subscription Created**\n` +
                    `Name: **${name}**\n` +
                    `⭐ Level: **${level}**`
                );
            }

            // TEXT fallback (format=text)
            return interaction.reply("🆕 " + res.data);

        } catch (err) {
            console.error(err);
            return interaction.reply("❌ API Request failed. Check console.");
        }
    }
};
