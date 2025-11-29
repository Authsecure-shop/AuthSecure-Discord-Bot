const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");
const { getSellerKey } = require("../../utils/config");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("delusedkey")
        .setDescription("Delete a used license key")
        .addStringOption(o =>
            o.setName("license")
                .setDescription("Used license key to delete")
                .setRequired(true)
        ),

    async execute(interaction) {
        const sellerKey = getSellerKey();
        const BASE_URL = process.env.BASE_URL;

        if (!sellerKey) {
            return interaction.reply("❌ Seller key not set. Use `/setsellerkey`.");
        }

        const license = interaction.options.getString("license");

        const url = `${BASE_URL}/seller_delete_used.php?sellerkey=${sellerKey}&type=delete_used&license=${license}`;

        try {
            const res = await axios.get(url);

            if (!res.data.success) {
                return interaction.reply("❌ " + (res.data.msg || "Failed deleting used key."));
            }

            if (res.data.deleted.length === 0)
                return interaction.reply("⚠️ No used license found for this key.");

            return interaction.reply(`🗑️ **Deleted Used License:**\n\`\`\`\n${res.data.deleted.join("\n")}\n\`\`\``);

        } catch (err) {
            console.log(err);
            return interaction.reply("❌ API request failed.");
        }
    }
};
