const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");
const { getSellerKey } = require("../../utils/config");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("resellerdelete")
        .setDescription("🗑 Delete an existing reseller")
        .addStringOption(o =>
            o.setName("username")
             .setDescription("Enter reseller username to delete")
             .setRequired(true)
        ),

    async execute(interaction) {

        const sellerKey = getSellerKey();
        const BASE_URL = process.env.BASE_URL;

        if (!sellerKey) 
            return interaction.reply("❌ Seller key not set! Use `/setsellerkey` first.");

        const username = interaction.options.getString("username");
        const url = `${BASE_URL}/seller_reseller_delete.php?sellerkey=${sellerKey}&username=${username}`;

        await interaction.reply(`⏳ Deleting reseller **${username}**...`);

        try {
            const res = await axios.get(url);

            if (!res.data.success)
                return interaction.editReply(`❌ ${res.data.msg}`);

            return interaction.editReply(`🟢 Reseller **${username}** Deleted Successfully`);

        } catch (err) {
            console.log(err);
            return interaction.editReply("⚠ API request failed — Check console.");
        }
    }
};
