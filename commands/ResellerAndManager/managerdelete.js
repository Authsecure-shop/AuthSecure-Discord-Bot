const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");
const { getSellerKey } = require("../../utils/config");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("managerdelete")
        .setDescription("🗑 Delete a manager account")
        .addStringOption(o =>
            o.setName("username")
             .setDescription("Manager username to delete")
             .setRequired(true)
        ),

    async execute(interaction) {

        const sellerKey = getSellerKey();
        const BASE_URL = process.env.BASE_URL;

        if (!sellerKey) 
            return interaction.reply("❌ Seller key not configured. Use `/setsellerkey` first!");

        const username = interaction.options.getString("username");

        await interaction.reply(`🗑 Deleting manager **${username}**...`);

        try {
            const url = `${BASE_URL}/seller_manager_delete.php?sellerkey=${sellerKey}&username=${username}`;
            const res = await axios.get(url);

            if (!res.data.success)
                return interaction.editReply("❌ " + res.data.msg);

            if (res.data.deleted > 0)
                return interaction.editReply(`✔ Manager **${username}** deleted successfully!`);
            else
                return interaction.editReply(`⚠ Manager **${username}** not found.`);

        } catch (err) {
            console.error(err);
            return interaction.editReply("⚠ API request failed — check console.");
        }
    }
};
