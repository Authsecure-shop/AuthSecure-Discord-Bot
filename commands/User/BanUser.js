const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");
const { getSellerKey } = require("../../utils/config");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("banuser")
        .setDescription("Ban a user from the system")
        .addStringOption(o =>
            o.setName("username")
                .setDescription("User you want to ban")
                .setRequired(true)
        )
        .addStringOption(o =>
            o.setName("reason")
                .setDescription("Reason for ban (optional)")
                .setRequired(false)
        ),

    async execute(interaction) {

        const sellerKey = getSellerKey();
        const BASE_URL = process.env.BASE_URL;

        if (!sellerKey) 
            return interaction.reply("❌ Seller key not set. Use `/setsellerkey` first.");

        const username = interaction.options.getString("username");
        const reason = interaction.options.getString("reason") || "No reason";

        const url = `${BASE_URL}/ban_user.php?sellerkey=${sellerKey}&username=${encodeURIComponent(username)}&reason=${encodeURIComponent(reason)}`;

        try {
            const res = await axios.get(url);

            if (res.data.success) {
                return interaction.reply(`🚫 **User Banned Successfully**\n👤 User: \`${username}\`\n📌 Reason: **${reason}**`);
            } else {
                return interaction.reply(`❌ Failed — ${res.data.msg}`);
            }

        } catch (err) {
            console.error(err);
            return interaction.reply("❌ API Request failed — Check console.");
        }
    }
};
