const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");
const { getSellerKey } = require("../../utils/config");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("addvar")
        .setDescription("Create a new global variable")
        .addStringOption(opt =>
            opt.setName("key")
                .setDescription("Variable name")
                .setRequired(true)
        )
        .addStringOption(opt =>
            opt.setName("value")
                .setDescription("Variable value")
                .setRequired(true)
        ),

    async execute(interaction) {
        const sellerKey = getSellerKey();
        const BASE_URL = process.env.BASE_URL;

        if (!sellerKey)
            return interaction.reply("❌ Seller key not set — use `/setsellerkey` first.");

        const key = interaction.options.getString("key");
        const value = interaction.options.getString("value");

        try {
            const res = await axios.get(
                `${BASE_URL}/seller_global_create.php?sellerkey=${sellerKey}&key=${encodeURIComponent(key)}&value=${encodeURIComponent(value)}`
            );

            if (!res.data.success)
                return interaction.reply("❌ " + res.data.msg);

            interaction.reply(`🆕 Global Variable Created\n**${key}** = \`${value}\``);

        } catch (err) {
            console.log(err);
            interaction.reply("❌ API request failed.");
        }
    }
};
