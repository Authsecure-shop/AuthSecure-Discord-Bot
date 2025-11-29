const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");
const { getSellerKey } = require("../../utils/config");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("reselleredit")
        .setDescription("✏ Edit a reseller username/password")
        .addStringOption(o =>
            o.setName("username")
             .setDescription("Old reseller username")
             .setRequired(true)
        )
        .addStringOption(o =>
            o.setName("new_username")
             .setDescription("New username to update")
             .setRequired(true)
        )
        .addStringOption(o =>
            o.setName("new_password")
             .setDescription("New password (optional)")
             .setRequired(false)
        ),

    async execute(interaction) {

        const sellerKey = getSellerKey();
        const BASE_URL = process.env.BASE_URL;

        if (!sellerKey) 
            return interaction.reply("❌ Seller key not configured. Use `/setsellerkey` first!");

        const oldUser = interaction.options.getString("username");
        const newUser = interaction.options.getString("new_username");
        const newPass = interaction.options.getString("new_password") ?? ""; // optional

        const url = `${BASE_URL}/seller_reseller_edit.php?sellerkey=${sellerKey}&username=${oldUser}&new_username=${newUser}&new_password=${newPass}`;

        await interaction.reply(`✏ Updating reseller **${oldUser} → ${newUser}**...`);

        try {
            const res = await axios.get(url);

            if (!res.data.success)
                return interaction.editReply("❌ " + res.data.msg);

            return interaction.editReply(
                `🟩 **Reseller Updated Successfully**\n` +
                `👤 Old: **${oldUser}**\n` +
                `🆕 New: **${newUser}**\n` +
                `🔐 Password Changed: **${res.data.updated.password_changed ? "YES" : "NO"}**`
            );

        } catch (err) {
            console.error(err);
            return interaction.editReply("⚠ API Request Error — Check console.");
        }
    }
};
