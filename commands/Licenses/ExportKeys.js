const { SlashCommandBuilder, AttachmentBuilder } = require("discord.js");
const axios = require("axios");
const { getSellerKey } = require("../../utils/config");
const fs = require("fs");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("exportkeys")
        .setDescription("Export all licenses (text or CSV)")
        .addStringOption(o =>
            o.setName("format")
                .setDescription("Select export format")
                .addChoices(
                    { name: "text", value: "text" },
                    { name: "csv", value: "csv" }
                )
                .setRequired(true)
        ),

    async execute(interaction) {
        const sellerKey = getSellerKey();
        const BASE_URL = process.env.BASE_URL;

        if (!sellerKey) {
            return interaction.reply("❌ Seller key not set. Use `/setsellerkey` first.");
        }

        const format = interaction.options.getString("format");

        const url = `${BASE_URL}/seller_export_keys.php?sellerkey=${sellerKey}&format=${format}`;

        try {

            const res = await axios.get(url, {
                responseType: format === "csv" ? "text" : "text"
            });

            // ========== CSV EXPORT ==========
            if (format === "csv") {
                const csvData = res.data;

                // Save temporary CSV file
                const filePath = "./export.csv";
                fs.writeFileSync(filePath, csvData);

                const file = new AttachmentBuilder(filePath);

                await interaction.reply({
                    content: "📤 **CSV Export Ready:**",
                    files: [file]
                });

                fs.unlinkSync(filePath); // delete temp file
                return;
            }

            // ========== TEXT EXPORT ==========
            const text = res.data || "No keys found.";

            await interaction.reply(`📄 **License Export:**\n\`\`\`\n${text}\n\`\`\``);

        } catch (err) {
            console.error(err);
            return interaction.reply("❌ Export failed.");
        }
    }
};
