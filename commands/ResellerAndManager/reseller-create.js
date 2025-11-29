const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");
const { getSellerKey } = require("../../utils/config");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("resellercreate")
        .setDescription("🛒 Create a new reseller account")
        .addStringOption(o =>
            o.setName("username")
             .setDescription("Enter new reseller username")
             .setRequired(true)
        )
        .addStringOption(o =>
            o.setName("password")
             .setDescription("Set password for reseller")
             .setRequired(true)
        ),

    async execute(interaction) {

        const sellerKey = getSellerKey();
        const BASE_URL = process.env.BASE_URL;

        if (!sellerKey)
            return interaction.reply("❌ Seller key not set! Use `/setsellerkey` first.");

        const username = interaction.options.getString("username");
        const password = interaction.options.getString("password");

        const url = `${BASE_URL}/seller_reseller_create.php?sellerkey=${sellerKey}&username=${username}&password=${password}`;

        await interaction.reply(`⏳ Creating reseller **${username}**...`);

        try {
            const res = await axios.get(url);

            if (!res.data.success)
                return interaction.editReply(`❌ ${res.data.msg}`);

            return interaction.editReply(
                `🟢 Reseller **${username}** created successfully!\n🔗 Panel URL: **${res.data["panel_url"] ?? "https://authsecure.shop/win/resaller/"}**`
            );

        } catch (err) {
            console.log(err);
            return interaction.editReply("⚠ Request Failed — Check console.");
        }
    }
};
