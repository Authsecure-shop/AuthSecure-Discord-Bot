const { SlashCommandBuilder } = require("discord.js");
const { setSellerKey } = require("../../utils/config");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("setsellerkey")
        .setDescription("Set a new seller API key")
        .addStringOption(o =>
            o.setName("key")
            .setDescription("Your seller key")
            .setRequired(true)
        ),

    async execute(interaction) {
        const key = interaction.options.getString("key");

        setSellerKey(key);

        await interaction.reply(`✅ Seller key has been saved.`);
    }
};
