const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");
const { getSellerKey } = require("../../utils/config");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("unbanuser")
        .setDescription("🔓 Unban a banned user")
        .addStringOption(o =>
            o.setName("username")
                .setDescription("Username to unban")
                .setRequired(true)
        ),

    async execute(interaction) {
        const sellerKey = getSellerKey();
        const BASE_URL = process.env.BASE_URL;

        if (!sellerKey) {
            return interaction.reply("❌ Seller key not set. Use `/setsellerkey` first.");
        }

        const username = interaction.options.getString("username");
        const url = `${BASE_URL}/unban_user.php?sellerkey=${sellerKey}&username=${username}`;

        await interaction.reply(`🔄 Unbanning **${username}**...`);

        try {
            const res = await axios.get(url);

            if (typeof res.data === "object") {
                if (!res.data.success) {
                    return interaction.editReply(`❌ ${res.data.msg}`);
                }
                return interaction.editReply(`🟢 User **${username}** has been unbanned.`);
            }

            return interaction.editReply(`🟢 ${res.data}`);

        } catch (err) {
            console.error(err);
            return interaction.editReply("❌ API request failed. Check console.");
        }
    }
};
