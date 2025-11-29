const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");
const { getSellerKey } = require("../../utils/config");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("setlicensenote")
        .setDescription("Update the note of a license key")
        .addStringOption(o =>
            o.setName("license")
                .setDescription("License key")
                .setRequired(true)
        )
        .addStringOption(o =>
            o.setName("note")
                .setDescription("Note to save")
                .setRequired(true)
        ),

    async execute(interaction) {

        const sellerKey = getSellerKey();
        const BASE_URL = process.env.BASE_URL;

        if (!sellerKey) {
            return interaction.reply("❌ Seller key not set. Use `/setsellerkey` first.");
        }

        const license = interaction.options.getString("license");
        const note = interaction.options.getString("note");

        const url =
            `${BASE_URL}/seller_set_note.php?sellerkey=${sellerKey}` +
            `&license=${encodeURIComponent(license)}` +
            `&note=${encodeURIComponent(note)}`;

        try {
            const res = await axios.get(url);

            if (typeof res.data === "object") {
                if (!res.data.success) {
                    return interaction.reply("❌ " + (res.data.msg || "Failed updating note."));
                }
                return interaction.reply("📝 **Note updated successfully!**");
            }

            return interaction.reply("📝 " + res.data);

        } catch (err) {
            console.log(err);
            return interaction.reply("❌ API request failed.");
        }
    }
};
