const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");
const { getSellerKey } = require("../../utils/config");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("getusernames")
        .setDescription("📜 Fetch all usernames from the app (text list)"),

    async execute(interaction) {
        const sellerKey = getSellerKey();
        const BASE_URL = process.env.BASE_URL;

        if (!sellerKey) {
            return interaction.reply("❌ Seller key not set. Use `/setsellerkey` first.");
        }

        const url = `${BASE_URL}/get_usernames.php?sellerkey=${sellerKey}&format=text`;

        await interaction.reply("⏳ Fetching usernames...");

        try {
            const res = await axios.get(url);

            if (!res.data || typeof res.data !== "string") {
                return interaction.editReply("⚠ No usernames found OR API returned structured JSON instead of text.");
            }

            return interaction.editReply(
                `📜 **Usernames List:**\n\`\`\`${res.data}\`\`\``
            );

        } catch (error) {
            console.error(error);
            return interaction.editReply("❌ Failed to connect to API. Check server or BASE_URL.");
        }
    }
};
