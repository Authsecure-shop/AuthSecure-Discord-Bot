const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");
const { getSellerKey } = require("../../utils/config");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("delallvars")
        .setDescription("Delete ALL global variable settings"), 

    async execute(interaction) {

        const sellerKey = getSellerKey();
        const BASE_URL = process.env.BASE_URL;

        if (!sellerKey) 
            return interaction.reply("❌ Seller key not set — use `/setsellerkey` first.");

        try {
            const res = await axios.get(`${BASE_URL}/seller_global_delete_all.php?sellerkey=${sellerKey}`);

            if (!res.data.success) 
                return interaction.reply("❌ " + res.data.msg);

            interaction.reply(`🗑 Deleted **${res.data.deleted_count}** global variables`);

        } catch (err) {
            console.log(err);
            interaction.reply("❌ API Request Failed");
        }
    }
};
