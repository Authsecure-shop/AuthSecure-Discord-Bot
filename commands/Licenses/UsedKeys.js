const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");
const { getSellerKey } = require("../../utils/config");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("usedkeys")
        .setDescription("Retrieve all used license keys"),

    async execute(interaction) {

        const sellerKey = getSellerKey();
        const BASE_URL = process.env.BASE_URL;

        if (!sellerKey) {
            return interaction.reply("❌ Seller key not set. Use `/setsellerkey` first.");
        }

        const url = `${BASE_URL}/seller_used_keys.php?sellerkey=${sellerKey}`;

        try {
            const res = await axios.get(url);

            if (!res.data.success) {
                return interaction.reply("❌ Failed to fetch used keys.");
            }

            const keys = res.data.used_keys;

            if (keys.length === 0) {
                return interaction.reply("⚠️ No used keys found.");
            }

            let output = "";
            keys.forEach(k => {
                output += `${k.license_key} | UsedAt: ${k.used_at} | Note: ${k.note || "None"}\n`;
            });

            return interaction.reply(`🔑 **Used License Keys:**\n\`\`\`\n${output}\n\`\`\``);

        } catch (err) {
            console.log(err);
            return interaction.reply("❌ API Request failed. Check console.");
        }
    }
};
