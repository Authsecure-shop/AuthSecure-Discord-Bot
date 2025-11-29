const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");
const { getSellerKey } = require("../../utils/config");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("usersubs")
        .setDescription("📄 Get all user subscriptions"),

    async execute(interaction) {

        const sellerKey = getSellerKey();
        const BASE_URL  = process.env.BASE_URL;

        if (!sellerKey)
            return interaction.reply("❌ Seller key not set — use `/setsellerkey` first!");

        await interaction.reply("⏳ Fetching user subscription list...");

        try {
            const res = await axios.get(`${BASE_URL}/retrieve_user_subscriptions.php?sellerkey=${sellerKey}`);

            if (!res.data.success)
                return interaction.editReply("❌ " + (res.data.msg || "Failed to retrieve"));

            let list = res.data.subscriptions;

            if (list.length === 0)
                return interaction.editReply("⚠ No users found!");

            let msg = `📄 **Total Users:** ${list.length}\n\n`;

            list.slice(0,20).forEach(u => {
                msg += `👤 **${u.username}** — ${u.subscription}\n`;
            });

            interaction.editReply(msg.length > 1900 ? msg.slice(0,1900)+"..." : msg);

        } catch (err) {
            console.log(err);
            return interaction.editReply("❌ Failed API request.");
        }
    }
};
