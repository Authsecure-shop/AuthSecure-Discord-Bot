const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");
const { getSellerKey } = require("../../utils/config");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("resellerinfo")
        .setDescription("📄 Retrieve reseller information by username")
        .addStringOption(option =>
            option.setName("username")
            .setDescription("Reseller username to fetch")
            .setRequired(true)
        ),

    async execute(interaction) {

        const sellerKey = getSellerKey();
        const BASE_URL = process.env.BASE_URL;

        if (!sellerKey)
            return interaction.reply("❌ Seller key not set! Use `/setsellerkey` first.");

        const username = interaction.options.getString("username");
        const url = `${BASE_URL}/seller_reseller_get.php?sellerkey=${sellerKey}&username=${username}`;

        await interaction.reply(`🔍 Fetching reseller **${username}**...`);

        try {
            const res = await axios.get(url);

            if (!res.data.success)
                return interaction.editReply("❌ " + res.data.msg);

            const r = res.data.reseller;

            return interaction.editReply(
                `🟦 **Reseller Found**\n` +
                `👤 Username: **${r.username}**\n` +
                `🆔 ID: **${r.id}**\n` +
                `📆 Created: **${r.created_at}**`
            );

        } catch (err) {
            console.error(err);
            return interaction.editReply("⚠ API Request Failed — Check console.");
        }
    }
};
