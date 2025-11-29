const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");
const { getSellerKey } = require("../../utils/config");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("userexists")
        .setDescription("🔍 Verify if a user exists in the database")
        .addStringOption(o =>
            o.setName("username")
             .setDescription("Enter username to check")
             .setRequired(true)
        ),

    async execute(interaction) {

        const sellerKey = getSellerKey();
        const BASE_URL = process.env.BASE_URL;

        if (!sellerKey) 
            return interaction.reply("❌ Seller key not set! Use `/setsellerkey` first.");

        const user = interaction.options.getString("username");
        const url = `${BASE_URL}/user_exists.php?sellerkey=${sellerKey}&username=${user}`;

        await interaction.reply(`⏳ Checking **${user}**...`);

        try {
            const res = await axios.get(url);

            if (!res.data.success) 
                return interaction.editReply(`❌ ${res.data.msg}`);

            if (res.data.exists)
                return interaction.editReply(`🟢 User **${user}** EXISTS`);
            else
                return interaction.editReply(`🔴 User **${user}** does NOT exist`);

        } catch (err) {
            console.log(err);
            return interaction.editReply("⚠ API request failed — Check console.");
        }
    }
};
