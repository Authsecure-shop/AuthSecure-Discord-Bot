const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");
const { getSellerKey } = require("../../utils/config");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("licenseinfo")
        .setDescription("Get full info of a license key")
        .addStringOption(o =>
            o.setName("key")
                .setDescription("License key to check")
                .setRequired(true)
        ),

    async execute(interaction) {

        const sellerKey = getSellerKey();
        const BASE_URL = process.env.BASE_URL;

        if (!sellerKey) {
            return interaction.reply("❌ Seller key not set. Use `/setsellerkey` first.");
        }

        const key = interaction.options.getString("key");

        const url = `${BASE_URL}/seller_license_info.php?sellerkey=${sellerKey}&key=${key}`;

        try {
            const res = await axios.get(url);

            if (!res.data.success) {
                return interaction.reply("❌ " + (res.data.msg || "License not found"));
            }

            const d = res.data.info;
            //Subscription ID: ${d.subscription_id}
            const replyText = 
`🔍 **License Info**
\`\`\`
Key: ${d.license_key}
Used: ${d.used}
Used At: ${d.used_at || "Never"}
Note: ${d.note || "None"}
Created: ${d.created_at}
Expiry: ${d.expiry ? new Date(d.expiry * 1000).toLocaleString() : "Never"}
\`\`\``;

            return interaction.reply(replyText);

        } catch (err) {
            console.log(err);
            return interaction.reply("❌ API request failed.");
        }
    },
};
