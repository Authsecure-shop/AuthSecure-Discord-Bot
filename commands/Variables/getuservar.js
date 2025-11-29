const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");
const { getSellerKey } = require("../../utils/config");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("retrvvar")
        .setDescription("Retrieve a specific global variable")
        .addStringOption(o =>
            o.setName("key")
                .setDescription("Variable name")
                .setRequired(true)
        ),

    async execute(interaction) {

        const sellerKey = getSellerKey();
        const BASE_URL = process.env.BASE_URL;

        if (!sellerKey)
            return interaction.reply("❌ Seller key not set — `/setsellerkey` first");

        const key = interaction.options.getString("key");

        try {
            const res = await axios.get(`${BASE_URL}/seller_global_get.php?sellerkey=${sellerKey}&key=${encodeURIComponent(key)}`);

            if (!res.data.success)
                return interaction.reply("❌ " + res.data.msg);

            return interaction.reply(`🔍 **Variable:** ${key}\n📌 Value: \`${res.data.variable.setting_value}\``);

        } catch (err) {
            console.error(err);
            interaction.reply("❌ API request failed");
        }
    }
};
