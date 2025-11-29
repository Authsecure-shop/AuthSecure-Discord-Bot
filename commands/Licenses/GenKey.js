const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");
const { getSellerKey } = require("../../utils/config");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("genkey")
        .setDescription("Generate a license key")
        .addStringOption(o => o.setName("subscription").setDescription("Subscription name").setRequired(true))
        .addIntegerOption(o => o.setName("expiry").setDescription("Expiry days").setRequired(true))
        .addIntegerOption(o => o.setName("amount").setDescription("How many keys?").setRequired(true)),

    async execute(interaction) {

        const sellerKey = getSellerKey(); // 🔥 NOW correctly inside execute()

        if (!sellerKey) {
            return interaction.reply("❌ Seller key not set. Use `/setsellerkey`");
        }

        const BASE_URL = process.env.BASE_URL;

        const sub = interaction.options.getString("subscription");
        const expiry = interaction.options.getInteger("expiry");
        const amount = interaction.options.getInteger("amount");

        const url =
            `${BASE_URL}/seller_create_license.php?sellerkey=${sellerKey}` +
            `&type=add&subscription=${sub}&expiry=${expiry}&amount=${amount}` +
            `&mask=******-******-******&format=text`;

        try {
            const res = await axios.get(url);
            await interaction.reply("🎉 **Generated Keys:**\n```\n" + res.data + "\n```");
        } catch (err) {
            await interaction.reply("❌ API error.");
        }
    }
};
