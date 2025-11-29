const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");
const { getSellerKey } = require("../../utils/config");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("delsubkeys")
        .setDescription("Delete license keys by subscription name + amount")
        .addStringOption(o =>
            o.setName("subscription")
                .setDescription("Subscription name")
                .setRequired(true)
        )
        .addIntegerOption(o =>
            o.setName("amount")
                .setDescription("How many keys to delete (default ALL)")
                .setRequired(false)
        ),

    async execute(interaction) {

        const sellerKey = getSellerKey();
        const BASE_URL = process.env.BASE_URL;

        if (!sellerKey) {
            return interaction.reply("❌ Seller key not set. Use `/setsellerkey` first.");
        }

        const sub = interaction.options.getString("subscription");
        const amount = interaction.options.getInteger("amount") ?? 0;

        const url =
            `${BASE_URL}/seller_delete_license.php` +
            `?sellerkey=${sellerKey}` +
            `&type=delete` +
            `&subscription=${encodeURIComponent(sub)}` +
            `&amount=${amount}`;

        try {
            const res = await axios.get(url);

            if (typeof res.data === "object") {

                if (!res.data.success)
                    return interaction.reply("❌ " + res.data.msg);

                if (res.data.deleted.length === 0)
                    return interaction.reply("⚠️ No keys deleted.");

                return interaction.reply(
                    `🗑️ **Deleted Keys for subscription: ${sub}**\n\`\`\`\n${res.data.deleted.join("\n")}\n\`\`\``
                );
            }

            // TEXT fallback
            await interaction.reply("🗑️ " + res.data);

        } catch (err) {
            console.error(err);
            await interaction.reply("❌ API request failed. Check console.");
        }
    }
};
