const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");
const { getSellerKey } = require("../../utils/config");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("deluser")
        .setDescription("Delete an existing user")
        .addStringOption(o =>
            o.setName("username")
                .setDescription("Username to delete")
                .setRequired(true)
        ),

    async execute(interaction) {

        const sellerKey = getSellerKey();
        const BASE_URL = process.env.BASE_URL;

        if (!sellerKey) return interaction.reply("❌ Seller key not set. Use `/setsellerkey` first.");

        const username = interaction.options.getString("username");
        const url = `${BASE_URL}/delete_user.php?sellerkey=${sellerKey}&username=${encodeURIComponent(username)}`;

        try {
            const res = await axios.get(url);

            if (!res.data.success)
                return interaction.reply(`❌ ${res.data.msg}`);

            return interaction.reply(`🗑 **User Deleted Successfully**\n👤 Username → \`${username}\``);

        } catch (err) {
            console.error(err);
            return interaction.reply("❌ API Request Failed — Check Console.");
        }
    }
};
