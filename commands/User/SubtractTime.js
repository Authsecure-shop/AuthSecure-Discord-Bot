const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");
const { getSellerKey } = require("../../utils/config");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("subtime")
        .setDescription("⏳ Subtract days from a user's expiry date")
        .addStringOption(o => 
            o.setName("username")
                .setDescription("Username to update")
                .setRequired(true)
        )
        .addIntegerOption(o =>
            o.setName("days")
                .setDescription("Days to subtract")
                .setRequired(true)
        ),

    async execute(interaction) {

        const sellerKey = getSellerKey();
        const BASE_URL = process.env.BASE_URL;

        if (!sellerKey) {
            return interaction.reply("❌ Seller key not set. Use `/setsellerkey` first.");
        }

        const username = interaction.options.getString("username");
        const days = interaction.options.getInteger("days");

        const url = `${BASE_URL}/subtract_time.php?sellerkey=${sellerKey}&username=${username}&days=${days}`;

        await interaction.reply(`🔄 Subtracting **${days} days** from **${username}**...`);

        try {
            const res = await axios.get(url);

            if (typeof res.data === "object") {

                if (!res.data.success) {
                    return interaction.editReply(`❌ ${res.data.msg}`);
                }

                return interaction.editReply(`🟢 **${days} days removed** from user: \`${username}\``);
            }

            // fallback text
            return interaction.editReply(`🟢 ${res.data}`);

        } catch (err) {
            console.error(err);
            return interaction.editReply("❌ API request failed — check console.");
        }
    }
};
