const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");
const { getSellerKey } = require("../../utils/config");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("deleteallusers")
        .setDescription("⚠ Delete ALL users from your application (IRREVERSIBLE)"),

    async execute(interaction) {
        const sellerKey = getSellerKey();
        const BASE_URL = process.env.BASE_URL;

        if (!sellerKey) {
            return interaction.reply("❌ Seller key not set. Use `/setsellerkey` first.");
        }

        const url = `${BASE_URL}/delete_all_users.php?sellerkey=${sellerKey}`;

        await interaction.reply("⏳ Deleting ALL users... This cannot be undone!");

        try {
            const res = await axios.get(url);

            if (!res.data.success) {
                return interaction.editReply(`❌ Failed: ${res.data.msg}`);
            }

            return interaction.editReply(
                `🗑 **All Users Deleted Successfully**\n` +
                `📍 Total Removed: **${res.data.deleted_users}**`
            );

        } catch (err) {
            console.error(err);
            return interaction.editReply("❌ API Request Failed — Check server / seller key.");
        }
    }
};
