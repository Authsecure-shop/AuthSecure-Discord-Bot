const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");
const { getSellerKey } = require("../../utils/config");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("delexpired")
        .setDescription("Delete all expired users"),

    async execute(interaction) {
        const sellerKey = getSellerKey();
        const BASE_URL = process.env.BASE_URL;

        if (!sellerKey) 
            return interaction.reply("❌ Seller key is not set. Use `/setsellerkey` first.");

        const url = `${BASE_URL}/delete_expired_users.php?sellerkey=${sellerKey}`;

        try {
            const res = await axios.get(url);

            if (!res.data.success)
                return interaction.reply(`❌ ${res.data.msg}`);

            return interaction.reply(
                `🗑 **Expired Users Deleted**\n⛔ Removed: **${res.data.deleted} users**`
            );

        } catch (err) {
            console.error(err);
            return interaction.reply("❌ API Request failed — Check console.");
        }
    }
};
