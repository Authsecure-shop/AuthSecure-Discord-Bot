const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");
const { getSellerKey } = require("../../utils/config");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("delkey")
        .setDescription("Delete a license key")
        .addStringOption(o =>
            o.setName("license")
                .setDescription("License key to delete")
                .setRequired(true)
        ),

    async execute(interaction) {
        const sellerKey = getSellerKey();
        const BASE_URL = process.env.BASE_URL;

        if (!sellerKey) {
            return interaction.reply("❌ Seller key not set. Use `/setsellerkey` first.");
        }

        const license = interaction.options.getString("license");

        const url = `${BASE_URL}/seller_delete_license.php?sellerkey=${sellerKey}&type=delete&license=${license}`;

        try {
            const res = await axios.get(url);

            // API returns JSON
            if (typeof res.data === "object") {
                if (!res.data.success) {
                    return interaction.reply("❌ " + (res.data.msg || "Delete failed."));
                }

                if (!res.data.deleted || res.data.deleted.length === 0) {
                    return interaction.reply("⚠️ No license deleted.");
                }

                return interaction.reply(
                    `🗑️ **Deleted License:**\n\`\`\`\n${res.data.deleted.join("\n")}\n\`\`\``
                );
            }

            // Text fallback
            return interaction.reply("🗑️ " + res.data);

        } catch (err) {
            console.error(err);
            return interaction.reply("❌ API request failed.");
        }
    }
};
