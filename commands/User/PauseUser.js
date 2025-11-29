const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");
const { getSellerKey } = require("../../utils/config");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("pauseuser")
        .setDescription("Pause a user account")
        .addStringOption(o =>
            o.setName("username")
                .setDescription("Username to pause")
                .setRequired(true)
        ),

    async execute(interaction) {

        const sellerKey = getSellerKey();
        const BASE_URL = process.env.BASE_URL;

        if (!sellerKey) {
            return interaction.reply("❌ Seller key not set. Use **/setsellerkey** first.");
        }

        const username = interaction.options.getString("username");

        const url = `${BASE_URL}/pause_user.php?sellerkey=${sellerKey}&username=${encodeURIComponent(username)}`;

        try {
            const res = await axios.get(url);

            if (typeof res.data === "object") {
                if (!res.data.success)
                    return interaction.reply("❌ " + (res.data.msg || "Error pausing user"));

                return interaction.reply(`⏸️ **User Paused Successfully**\nUser: \`${username}\``);
            }

            // Fallback text response
            return interaction.reply("⏸️ " + res.data);

        } catch (err) {
            console.log(err);
            return interaction.reply("❌ API Request Failed. Check console.");
        }
    }
};
