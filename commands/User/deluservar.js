const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");
const { getSellerKey } = require("../../utils/config");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("deluservar")
        .setDescription("Delete a specific variable from a user")
        .addStringOption(o =>
            o.setName("username")
                .setDescription("User to target")
                .setRequired(true)
        )
        .addStringOption(o =>
            o.setName("variable")
                .setDescription("Variable name to delete")
                .setRequired(true)
        ),

    async execute(interaction) {

        const sellerKey = getSellerKey();
        const BASE_URL = process.env.BASE_URL;

        if (!sellerKey)
            return interaction.reply("❌ Seller key not set. Use `/setsellerkey` first.");

        const username = interaction.options.getString("username");
        const variable = interaction.options.getString("variable");

        const url = `${BASE_URL}/seller_delete_user_variable.php?sellerkey=${sellerKey}&username=${username}&var=${variable}`;

        try {
            const res = await axios.get(url);

            if (res.data.success) {
                return interaction.reply(`🗑 **Deleted Variable**\n👤 User: \`${username}\`\n🔑 Variable: \`${variable}\``);
            } else {
                return interaction.reply("❌ " + (res.data.msg || "Failed to delete variable"));
            }

        } catch (err) {
            console.error(err);
            return interaction.reply("❌ API request failed — check console.");
        }
    }
};
