const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");
const { getSellerKey } = require("../../utils/config");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("changeusername")
        .setDescription("Change user's username")
        .addStringOption(o =>
            o.setName("old")
                .setDescription("Old username")
                .setRequired(true)
        )
        .addStringOption(o =>
            o.setName("new")
                .setDescription("New username")
                .setRequired(true)
        ),

    async execute(interaction) {

        const sellerKey = getSellerKey();
        const BASE_URL = process.env.BASE_URL;

        if (!sellerKey) return interaction.reply("❌ Seller key not set. Use `/setsellerkey` first.");

        const oldName = interaction.options.getString("old");
        const newName = interaction.options.getString("new");

        const url = `${BASE_URL}/change_username.php?sellerkey=${sellerKey}&old=${encodeURIComponent(oldName)}&new=${encodeURIComponent(newName)}`;

        try {
            const res = await axios.get(url);

            if (!res.data.success)
                return interaction.reply(`❌ ${res.data.msg}`);

            return interaction.reply(
                `📝 **Username Updated Successfully**\n👤 Old → \`${oldName}\`\n➡ New → **${newName}**`
            );

        } catch (err) {
            console.error(err);
            return interaction.reply("❌ API Request Failed — Check Console.");
        }
    }
};
