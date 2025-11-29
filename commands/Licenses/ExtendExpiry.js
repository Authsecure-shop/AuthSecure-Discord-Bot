const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");
const { getSellerKey } = require("../../utils/config");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("extendexpiry")
        .setDescription("Extend a license expiry by days")
        .addStringOption(o =>
            o.setName("license")
                .setDescription("License key")
                .setRequired(true)
        )
        .addIntegerOption(o =>
            o.setName("days")
                .setDescription("Days to extend")
                .setRequired(true)
        )
        .addStringOption(o =>
            o.setName("note")
                .setDescription("Optional note")
                .setRequired(false)
        ),

    async execute(interaction) {
        const sellerKey = getSellerKey();
        const BASE_URL = process.env.BASE_URL;

        if (!sellerKey) {
            return interaction.reply("❌ Seller key not set. Use `/setsellerkey` first.");
        }

        const license = interaction.options.getString("license");
        const days = interaction.options.getInteger("days");
        const note = interaction.options.getString("note") || "";

        const url = `${BASE_URL}/seller_extend_expiry.php?sellerkey=${sellerKey}`
            + `&key=${encodeURIComponent(license)}`
            + `&days=${days}`
            + `&note=${encodeURIComponent(note)}`;

        try {
            const res = await axios.get(url);

            // JSON Response
            if (typeof res.data === "object") {

                if (!res.data.success) {
                    return interaction.reply("❌ " + (res.data.message || "Failed"));
                }

                return interaction.reply(
                    `⏳ **Expiry Extended Successfully**\n` +
                    `License: \`${license}\`\n` +
                    `➕ Days Added: **${days}**`
                    
                );
            }

            // TEXT fallback
            return interaction.reply("⏳ " + res.data);

        } catch (err) {
            console.error(err);
            return interaction.reply("❌ API Request Failed.");
        }
    }
};
