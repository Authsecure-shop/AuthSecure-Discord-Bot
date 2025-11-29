const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");
const { getSellerKey } = require("../../utils/config");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("fetchallvars")
        .setDescription("Retrieve all global variables"),

    async execute(interaction) {

        const sellerKey = getSellerKey();
        const BASE_URL = process.env.BASE_URL;

        if (!sellerKey)
            return interaction.reply("❌ Seller key not set — `/setsellerkey` first");

        try {
            const res = await axios.get(`${BASE_URL}/seller_global_get_all.php?sellerkey=${sellerKey}`);

            if (!res.data.success)
                return interaction.reply("❌ " + res.data.msg);

            if (res.data.variables.length === 0)
                return interaction.reply("⚠ No global variables found");

            let msg = `🌍 **Global Variables:**\n\n`;
            res.data.variables.forEach(v => {
                msg += `**${v.setting_key}** → \`${v.setting_value}\`\n`;
            });

            interaction.reply(msg);

        } catch (err) {
            console.error(err);
            interaction.reply("❌ API request failed");
        }
    }
};
