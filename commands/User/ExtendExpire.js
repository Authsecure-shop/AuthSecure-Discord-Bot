const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");
const { getSellerKey } = require("../../utils/config");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("extenduserexpiry")
        .setDescription("Extend a user's subscription expiry date")
        .addStringOption(o => 
            o.setName("username")
             .setDescription("Username to extend")
             .setRequired(true)
        )
        .addIntegerOption(o => 
            o.setName("days")
             .setDescription("Days to extend")
             .setRequired(true)
        ),

    async execute(interaction) {

        const sellerKey = getSellerKey();
        const BASE_URL = process.env.BASE_URL;

        if (!sellerKey)
            return interaction.reply("❌ Seller key not set — Use `/setsellerkey` first.");

        const user = interaction.options.getString("username");
        const days = interaction.options.getInteger("days");

        const url = `${BASE_URL}/extend_user_expiry.php?sellerkey=${sellerKey}&username=${user}&days=${days}`;

        try {
            const res = await axios.get(url);

            if (!res.data.success)
                return interaction.reply(`❌ ${res.data.msg}`);

            return interaction.reply(
                `⏳ **Expiry Extended Successfully**\n👤 User: \`${user}\`\n➕ Days Added: **${days}**`
            );

        } catch (err) {
            console.error(err);
            return interaction.reply("❌ API Request Failed — Check console.");
        }
    }
};
