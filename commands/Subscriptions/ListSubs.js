const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");
const { getSellerKey } = require("../../utils/config");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("listsubs")
        .setDescription("Retrieve all subscriptions for your seller key"),

    async execute(interaction) {

        const sellerKey = getSellerKey();
        const BASE_URL = process.env.BASE_URL;

        if (!sellerKey) {
            return interaction.reply("❌ Seller key not set. Use `/setsellerkey` first.");
        }

        const url = `${BASE_URL}/seller_get_subscriptions.php?sellerkey=${sellerKey}&format=json`;

        try {
            const res = await axios.get(url);

            if (!res.data.success) {
                return interaction.reply("❌ " + (res.data.message || "Failed to fetch subscriptions"));
            }

            const subs = res.data.subscriptions;

            if (subs.length === 0) {
                return interaction.reply("⚠️ No subscriptions found.");
            }

            let text = "📜 **Subscriptions List**\n\n";

            for (const s of subs) {
                text += `🔹 **${s.name}** (Level: ${s.level}) — *${s.status}*\n`;
            }

            return interaction.reply(text);

        } catch (err) {
            console.error(err);
            return interaction.reply("❌ API Request failed. Check console.");
        }
    }
};
