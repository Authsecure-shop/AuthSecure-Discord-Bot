const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");
const { getSellerKey } = require("../../utils/config");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("addhwid")
        .setDescription("Add HWID to an existing user")
        .addStringOption(o =>
            o.setName("username")
                .setDescription("Username to update")
                .setRequired(true)
        )
        .addStringOption(o =>
            o.setName("hwid")
                .setDescription("New HWID to assign")
                .setRequired(true)
        ),

    async execute(interaction) {

        const sellerKey = getSellerKey();
        const BASE_URL = process.env.BASE_URL;

        if (!sellerKey) return interaction.reply("❌ Seller key not set — Use `/setsellerkey` first.");

        const username = interaction.options.getString("username");
        const hwid = interaction.options.getString("hwid");

        const url = `${BASE_URL}/add_hwid.php?sellerkey=${sellerKey}&username=${encodeURIComponent(username)}&hwid=${encodeURIComponent(hwid)}`;

        try {
            const res = await axios.get(url);

            if (res.data.success) {
                return interaction.reply(`🔐 HWID added to user: **${username}**\n🆔 HWID: \`${hwid}\``);
            } else {
                return interaction.reply(`❌ Failed — ${res.data.msg}`);
            }

        } catch (err) {
            console.log(err);
            return interaction.reply("❌ API Request Failed — Check console.");
        }
    }
};
