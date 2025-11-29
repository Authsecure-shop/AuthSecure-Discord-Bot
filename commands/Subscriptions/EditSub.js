const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");
const { getSellerKey } = require("../../utils/config");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("editsub")
        .setDescription("Edit an existing subscription")
        .addStringOption(o =>
            o.setName("old")
                .setDescription("Old subscription name")
                .setRequired(true)
        )
        .addStringOption(o =>
            o.setName("new")
                .setDescription("New subscription name")
                .setRequired(true)
        )
        .addIntegerOption(o =>
            o.setName("level")
                .setDescription("New subscription level")
                .setRequired(true)
        ),

    async execute(interaction) {

        const sellerKey = getSellerKey();
        const BASE_URL = process.env.BASE_URL;

        if (!sellerKey) {
            return interaction.reply("❌ Seller key not set. Use `/setsellerkey` first.");
        }

        const oldName = interaction.options.getString("old");
        const newName = interaction.options.getString("new");
        const level = interaction.options.getInteger("level");

        const url =
            `${BASE_URL}/seller_edit_subscription.php?sellerkey=${sellerKey}` +
            `&old=${encodeURIComponent(oldName)}` +
            `&new=${encodeURIComponent(newName)}` +
            `&level=${level}`;

        try {
            const res = await axios.get(url);

            if (typeof res.data === "object") {

                if (!res.data.success) {
                    return interaction.reply("❌ " + (res.data.message || "Failed to update subscription"));
                }

                return interaction.reply(
                    `🔧 **Subscription Updated Successfully**\n` +
                    ` Old: **${oldName}**\n` +
                    ` New: **${newName}**\n` +
                    ` Level: **${level}**`
                );
            }

            // TEXT fallback
            return interaction.reply("🔧 " + res.data);

        } catch (err) {
            console.error(err);
            return interaction.reply("❌ API request failed.");
        }
    }
};
