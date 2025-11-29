const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");
const { getSellerKey } = require("../../utils/config");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("getlogs")
        .setDescription("Retrieve all logs"),

    async execute(interaction) {

        const sellerKey = getSellerKey();
        const BASE_URL  = process.env.BASE_URL;

        if (!sellerKey)
            return interaction.reply("❌ Seller key not set. Use **/setsellerkey** first.");

        const url = `${BASE_URL}/logs_get.php?sellerkey=${sellerKey}&format=json`;

        try {
            const res = await axios.get(url);

            if (!res.data.success)
                return interaction.reply("❌ Failed to fetch logs.");

            const logs = res.data.logs;

            if (logs.length === 0)
                return interaction.reply("⚠ No logs found.");

            // format logs for Discord message
            let msg = "";
            logs.slice(0, 25).forEach(l => {
                msg += `📝 ID: ${l.id} | User: ${l.user_id} | IP: ${l.ip_address} | PC: ${l.pcuser} | Date: ${l.logdate}\n`;
            });

            if (logs.length > 25) msg += `\n📌 Showing 25 of ${logs.length}+ logs`;

            return interaction.reply("**📄 Logs:**\n```\n" + msg + "\n```");

        } catch (error) {
            console.error(error);
            return interaction.reply("❌ API request failed.");
        }
    }
};
