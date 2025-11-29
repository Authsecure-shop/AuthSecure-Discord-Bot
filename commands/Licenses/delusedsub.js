const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");
const { getSellerKey } = require("../../utils/config");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("delusedsub")
        .setDescription("Delete used license keys by subscription")
        .addStringOption(o =>
            o.setName("subscription")
                .setDescription("Subscription name")
                .setRequired(true)
        )
        .addIntegerOption(o =>
            o.setName("amount")
                .setDescription("How many used keys to delete (default = ALL)")
                .setRequired(false)
        ),

    async execute(interaction) {
        const sellerKey = getSellerKey();
        const BASE_URL = process.env.BASE_URL;

        if (!sellerKey) {
            return interaction.reply("❌ Seller key not set. Use `/setsellerkey`.");
        }

        const subscription = interaction.options.getString("subscription");
        const amount = interaction.options.getInteger("amount") ?? 0;

        const url =
            `${BASE_URL}/seller_delete_used.php?sellerkey=${sellerKey}` +
            `&type=delete_used&subscription=${encodeURIComponent(subscription)}` +
            `&amount=${amount}`;

        try {
            const res = await axios.get(url);

            if (!res.data.success) {
                return interaction.reply("❌ " + (res.data.msg || "Failed deleting used keys."));
            }

            if (res.data.deleted.length === 0)
                return interaction.reply(`⚠️ No used licenses found for subscription **${subscription}**.`);

            return interaction.reply(
                `🗑️ **Deleted Used Keys for Subscription:** ${subscription}\n\`\`\`\n${res.data.deleted.join("\n")}\n\`\`\``
            );

        } catch (err) {
            console.log(err);
            return interaction.reply("❌ API request failed.");
        }
    }
};
