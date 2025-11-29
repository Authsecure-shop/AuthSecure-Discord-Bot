const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");
const { getSellerKey } = require("../../utils/config");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("deletealluservars")
        .setDescription("Delete all user variables from the database for this app"),

    async execute(interaction) {

        const sellerKey = getSellerKey();
        const BASE_URL = process.env.BASE_URL;

        if (!sellerKey)
            return interaction.reply("❌ Seller key not set. Use `/setsellerkey` first.");

        const url = `${BASE_URL}/seller_delete_all_user_variables.php?sellerkey=${sellerKey}`;

        try {
            const res = await axios.get(url);

            if (res.data.success) {
                return interaction.reply(`🗑️ **All User Variables Deleted**\n🔻 Total Removed: **${res.data.deleted}**`);
            } else {
                return interaction.reply("❌ " + (res.data.msg || "Failed to delete variables"));
            }

        } catch (err) {
            console.error(err);
            return interaction.reply("❌ API Request Failed — Check Console.");
        }
    }
};
