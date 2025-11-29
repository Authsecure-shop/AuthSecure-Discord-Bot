const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");
const { getSellerKey } = require("../../utils/config");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("delusedall")
        .setDescription("Delete ALL used licenses of a subscription")
        .addStringOption(o =>
            o.setName("subscription")
                .setDescription("Subscription name")
                .setRequired(true)
        ),

    async execute(interaction) {
        const sellerKey = getSellerKey();
        const BASE_URL = process.env.BASE_URL;

        if (!sellerKey) {
            return interaction.reply("❌ Seller key not set. Use `/setsellerkey` first.");
        }

        const subscription = interaction.options.getString("subscription");

        // Delete unlimited (ALL)
        const url =
            `${BASE_URL}/seller_delete_used.php?sellerkey=${sellerKey}` +
            `&type=delete_used&subscription=${encodeURIComponent(subscription)}` +
            `&amount=999999`;

        try {
            const res = await axios.get(url);

            if (!res.data.success) {
                return interaction.reply("❌ " + (res.data.msg || "Failed deleting used keys."));
            }

            if (res.data.deleted.length === 0) {
                return interaction.reply(`⚠️ No used licenses found for **${subscription}**.`);
            }

            return interaction.reply(
                `🗑️ **Deleted ALL Used Keys for Subscription:** ${subscription}\n\`\`\`\n${res.data.deleted.join("\n")}\n\`\`\``
            );

        } catch (err) {
            console.log(err);
            return interaction.reply("❌ API request failed.");
        }
    }
};
