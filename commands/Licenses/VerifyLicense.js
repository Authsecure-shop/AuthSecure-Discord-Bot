const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");
const { getSellerKey } = require("../../utils/config");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("verifylicense")
        .setDescription("Check if a license exists and get its details")
        .addStringOption(o =>
            o.setName("license")
                .setDescription("License key")
                .setRequired(true)
        ),

    async execute(interaction) {

        const sellerKey = getSellerKey();
        const BASE_URL = process.env.BASE_URL;

        if (!sellerKey) {
            return interaction.reply("❌ Seller key not set. Use `/setsellerkey` first.");
        }

        const license = interaction.options.getString("license");

        const url = `${BASE_URL}/seller_verify_license.php?sellerkey=${sellerKey}&license=${encodeURIComponent(license)}`;

        try {
            const res = await axios.get(url);

            // ❌ Not found
           // Subscription ID: ${info.subscription_id}
            if (!res.data.success) {
                return interaction.reply("❌ License not found.");
            }

            const info = res.data.license;

            const out = `
🔍 **License Details**
\`\`\`
Key: ${info.license_key}
Used: ${info.used}
Note: ${info.note || "None"}
Expiry: ${info.expiry_human}
Created: ${info.created_at}
\`\`\`
            `;

            return interaction.reply(out);

        } catch (err) {
            console.log(err);
            return interaction.reply("❌ API request failed.");
        }
    }
};
