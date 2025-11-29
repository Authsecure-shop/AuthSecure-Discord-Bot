const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");
const { getSellerKey } = require("../../utils/config");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("userdata")
        .setDescription("Get complete user details")
        .addStringOption(opt =>
            opt.setName("username")
                .setDescription("Enter username")
                .setRequired(true)
        ),

    async execute(interaction) {
        const sellerKey = getSellerKey();
        const BASE_URL = process.env.BASE_URL;

        if (!sellerKey)
            return interaction.reply("❌ Seller key not set — use `/setsellerkey` first");

        const username = interaction.options.getString("username");

        try {
            const res = await axios.get(`${BASE_URL}/retrieve_user_data.php?sellerkey=${sellerKey}&username=${username}`);

            if (!res.data.success)
                return interaction.reply("❌ " + res.data.msg);

            const u = res.data.user;

            const embed = {
                title: `👤 User Info: ${u.username}`,
                color: 0x00bfff,
                fields: [
                    { name: "Subscription", value: u.subscription || "None", inline: true },
                    { name: "Expiry", value: u.expiry ? `<t:${u.expiry}:R>` : "Lifetime", inline: true },
                    { name: "HWID", value: u.hwid || "None", inline: false },
                    { name: "IP", value: u.ip_address || "Unknown", inline: true },
                    { name: "Banned", value: u.is_banned ? "🚫 Yes" : "✔ No", inline: true },
                    { name: "Paused", value: u.is_paused ? "⏸ Yes" : "▶ No", inline: true },
                    { name: "Created", value: u.created_at, inline: false },
                    { name: "Last Login", value: u.last_login || "Never", inline: false },
                ],
                timestamp: new Date()
            };

            interaction.reply({ embeds: [embed] });

        } catch (err) {
            console.log(err);
            interaction.reply("❌ API request failed.");
        }
    }
};
