const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");
const { getSellerKey } = require("../../utils/config");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("editvar")
        .setDescription("Edit an existing global variable")
        .addStringOption(opt =>
            opt.setName("key")
                .setDescription("Variable name")
                .setRequired(true)
        )
        .addStringOption(opt =>
            opt.setName("value")
                .setDescription("New variable value")
                .setRequired(true)
        ),

    async execute(interaction) {

        const sellerKey = getSellerKey();
        const BASE_URL = process.env.BASE_URL;
        if (!sellerKey) return interaction.reply("❌ Seller key not set — use `/setsellerkey` first.");

        const key = interaction.options.getString("key");
        const value = interaction.options.getString("value");

        try {
            const res = await axios.get(
                `${BASE_URL}/seller_global_edit.php?sellerkey=${sellerKey}&key=${encodeURIComponent(key)}&value=${encodeURIComponent(value)}`
            );

            if (!res.data.success)
                return interaction.reply("❌ " + res.data.msg);

            interaction.reply(`✏ Updated Global Variable\n**${key}** → \`${value}\``);

        } catch (err) {
            console.log(err);
            interaction.reply("❌ API Request Failed");
        }
    }
};
