const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");
const { getSellerKey } = require("../../utils/config");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("resethwid")
        .setDescription("Reset HWID of a specific user")
        .addStringOption(o =>
            o.setName("username")
                .setDescription("Username to reset HWID")
                .setRequired(true)
        ),

    async execute(interaction) {
        const sellerKey = getSellerKey();
        const BASE_URL = process.env.BASE_URL;

        if (!sellerKey) {
            return interaction.reply("❌ Seller key not set. Use `/setsellerkey` first.");
        }

        const user = interaction.options.getString("username");
        const url = `${BASE_URL}/reset_hwid.php?sellerkey=${sellerKey}&username=${encodeURIComponent(user)}`;

        try {
            const res = await axios.get(url);

            if (!res.data.success) {
                return interaction.reply(`❌ Error: ${res.data.msg}`);
            }

            return interaction.reply(`🔄 HWID Reset for **${user}** Successfully!`);
        
        } catch (err) {
            console.error(err);
            return interaction.reply("❌ Failed to connect to the API.");
        }
    }
};
