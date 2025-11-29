const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");
const { getSellerKey } = require("../../utils/config");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("exportunused")
        .setDescription("Export all unused license keys"),

    async execute(interaction) {

        const sellerKey = getSellerKey();
        const BASE_URL = process.env.BASE_URL;

        if (!sellerKey) {
            return interaction.reply("❌ Seller key not set. Use `/setsellerkey` first.");
        }

        const url = `${BASE_URL}/seller_export_unused.php?sellerkey=${sellerKey}`;

        try {
            const res = await axios.get(url, { responseType: "text" });

            let output = res.data.trim();

            if (output.length === 0 || output.includes("No unused licenses")) {
                return interaction.reply("⚠️ No unused licenses found.");
            }

            // Prevent Discord message overflow
            if (output.length > 1900) {
                output = output.substring(0, 1900) + "\n... (truncated)";
            }

            return interaction.reply(`📤 **EXPORTED UNUSED LICENSES:**\n\`\`\`\n${output}\n\`\`\``);

        } catch (err) {
            console.error(err);
            return interaction.reply("❌ Failed to export unused keys (API Error).");
        }
    }
};
