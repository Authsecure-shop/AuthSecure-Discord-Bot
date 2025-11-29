const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");
const { getSellerKey } = require("../../utils/config");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("resethwidall")
        .setDescription("Reset HWID of ALL users (cannot be undone)"),

    async execute(interaction) {
        const sellerKey = getSellerKey();
        const BASE_URL = process.env.BASE_URL;

        if (!sellerKey) {
            return interaction.reply("❌ Seller key not set. Use `/setsellerkey` first.");
        }

        const url = `${BASE_URL}/reset_all_hwid.php?sellerkey=${sellerKey}`;

        await interaction.reply("⏳ Processing HWID Reset for all users...");

        try {
            const res = await axios.get(url);

            if (!res.data.success)
                return interaction.editReply(`❌ Error: ${res.data.msg}`);

            return interaction.editReply(
                `🧨 **All HWIDs Reset Successfully**\n` +
                `Total Users Updated: **${res.data.reset_count}**`
            );

        } catch (err) {
            console.error(err);
            return interaction.editReply("❌ API Request Failed — Check Server URL / Seller Key.");
        }
    }
};
