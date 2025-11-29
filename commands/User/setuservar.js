const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");
const { getSellerKey } = require("../../utils/config");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("setvar")
        .setDescription("Create or modify a user variable")
        .addStringOption(o => o.setName("username").setDescription("User").setRequired(true))
        .addStringOption(o => o.setName("key").setDescription("Variable name").setRequired(true))
        .addStringOption(o => o.setName("value").setDescription("New data").setRequired(true)),

    async execute(interaction) {

        const sellerKey = getSellerKey();
        const BASE_URL = process.env.BASE_URL;

        if (!sellerKey) return interaction.reply("❌ Set seller key first — `/setsellerkey`");

        const user = interaction.options.getString("username");
        const key = interaction.options.getString("key");
        const val = interaction.options.getString("value");

        const url = `${BASE_URL}/seller_set_user_variable.php?sellerkey=${sellerKey}&username=${user}&var=${key}&newdata=${encodeURIComponent(val)}`;

        try {
            const r = await axios.get(url);

            if (!r.data.success) return interaction.reply("❌ " + r.data.msg);

            return interaction.reply(`🟩 **Variable Saved**\n👤 User: \`${user}\`\n🔑 Key: ${key}\n✏ Value: \`${val}\``);

        } catch (e) {
            console.error(e);
            return interaction.reply("⚠ API Request Failed");
        }
    }
};
