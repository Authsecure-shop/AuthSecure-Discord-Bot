const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");
const { getSellerKey } = require("../../utils/config");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("delvar")
        .setDescription("Delete a global variable by name")
        .addStringOption(o =>
            o.setName("key")
                .setDescription("Variable key to delete")
                .setRequired(true)
        ),

    async execute(interaction) {

        const sellerKey = getSellerKey();
        const BASE_URL = process.env.BASE_URL;

        if (!sellerKey) return interaction.reply("❌ Seller key not set — use `/setsellerkey` first.");

        const variable = interaction.options.getString("key");

        try {
            const res = await axios.get(
                `${BASE_URL}/seller_global_delete.php?sellerkey=${sellerKey}&key=${encodeURIComponent(variable)}`
            );

            if (!res.data.success)
                return interaction.reply("❌ " + res.data.msg);

            interaction.reply(`🗑 Deleted Global Variable: **${variable}**`);

        } catch (err) {
            console.log(err);
            interaction.reply("❌ API Request Failed");
        }
    }
};
