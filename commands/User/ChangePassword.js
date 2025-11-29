const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");
const { getSellerKey } = require("../../utils/config");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("changepassword")
        .setDescription("Change password of an existing user")
        .addStringOption(o =>
            o.setName("username")
                .setDescription("Enter the username")
                .setRequired(true)
        )
        .addStringOption(o =>
            o.setName("newpass")
                .setDescription("New password for user")
                .setRequired(true)
        ),

    async execute(interaction) {

        const sellerKey = getSellerKey();
        const BASE_URL = process.env.BASE_URL;

        if (!sellerKey) 
            return interaction.reply("❌ Seller key not set. Use `/setsellerkey` first.");

        const username = interaction.options.getString("username");
        const newpass = interaction.options.getString("newpass");

        const url = `${BASE_URL}/change_password.php?sellerkey=${sellerKey}&username=${encodeURIComponent(username)}&newpass=${encodeURIComponent(newpass)}`;

        try {
            const res = await axios.get(url);

            if (!res.data.success)
                return interaction.reply(`❌ Failed — ${res.data.msg}`);

            return interaction.reply(
                `🔑 **Password Updated Successfully**\n👤 User: \`${username}\`\n🔄 New Password Set`
            );

        } catch (err) {
            console.error(err);
            return interaction.reply("❌ API request failed — Check console.");
        }
    }
};
