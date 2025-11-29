const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");
const { getSellerKey } = require("../../utils/config");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("clearlogsip")
        .setDescription("Delete logs by specific IP address")
        .addStringOption(o =>
            o.setName("ip")
                .setDescription("Enter IP to delete logs")
                .setRequired(true)
        ),

    async execute(interaction) {
        const sellerKey = getSellerKey();
        const BASE_URL = process.env.BASE_URL;

        if (!sellerKey) return interaction.reply("❌ Seller key not set. Use `/setsellerkey` first.");

        const ip = interaction.options.getString("ip");

        const url = `${BASE_URL}/logs_delete_ip.php?sellerkey=${sellerKey}&ip=${ip}&format=json`;

        try {
            const res = await axios.get(url);

            if (res.data.success) {
                return interaction.reply(
                    `🗑 Logs deleted for IP: **${ip}**\n📌 Removed: **${res.data.deleted_rows} entries**`
                );
            }

            return interaction.reply(`❌ Failed — ${res.data.message || "Error"}`);

        } catch (error) {
            console.log(error);
            return interaction.reply("❌ API request failed.");
        }
    }
};
