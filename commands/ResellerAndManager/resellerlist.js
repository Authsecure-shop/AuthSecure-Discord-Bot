const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");
const { getSellerKey } = require("../../utils/config");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("resellerlist")
        .setDescription("📄 Retrieve all registered resellers"),

    async execute(interaction) {
        
        const sellerKey = getSellerKey();
        const BASE_URL = process.env.BASE_URL;

        if (!sellerKey)
            return interaction.reply("❌ Seller key not set! Use `/setsellerkey` first.");
        
        const url = `${BASE_URL}/seller_reseller_get_all.php?sellerkey=${sellerKey}`;

        await interaction.reply("⏳ Fetching reseller list...");

        try {
            const res = await axios.get(url);

            if (!res.data.success)
                return interaction.editReply("❌ " + res.data.msg);

            const list = res.data.resellers;

            if (list.length === 0)
                return interaction.editReply("⚠ No resellers found!");

            let msg = `🟦 **Total Resellers: ${list.length}**\n\n`;

            list.forEach((r, i) => {
                msg += `\`${i+1}\` • **${r.username}** 🕒 *${r.created_at}*\n`;
            });

            return interaction.editReply(msg);

        } catch (err) {
            console.log(err);
            return interaction.editReply("⚠ API request failed — Check console.");
        }
    }
};
