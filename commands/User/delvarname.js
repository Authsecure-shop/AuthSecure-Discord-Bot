const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");
const { getSellerKey } = require("../../utils/config");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("delvarname")
        .setDescription("Delete all user variables by using just the user variable name")
        .addStringOption(o =>
            o.setName("var")
                .setDescription("Variable name to delete (case-sensitive)")
                .setRequired(true)
        ),

    async execute(interaction) {

        const sellerKey = getSellerKey();
        const BASE_URL = process.env.BASE_URL;

        if (!sellerKey)
            return interaction.reply("❌ Seller key not set. Use `/setsellerkey` first.");

        const variable = interaction.options.getString("var");

        const url = `${BASE_URL}/seller_delete_variables_by_name.php?sellerkey=${sellerKey}&var=${variable}`;

        try {
            const res = await axios.get(url);

            if (res.data.success) {
                return interaction.reply(`🗑 **All Variables Deleted**\n🔑 Variable Name: \`${variable}\`\n📌 Deleted Count: **${res.data.deleted}**`);
            } else {
                return interaction.reply(`❌ Failed — ${res.data.msg || "Unknown error"}`);
            }

        } catch (err) {
            console.error(err);
            return interaction.reply("❌ API request failed — check console.");
        }
    }
};
