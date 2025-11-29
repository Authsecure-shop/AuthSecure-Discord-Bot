const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");
const { getSellerKey } = require("../../utils/config");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("clearlogs")
        .setDescription("⚠ Delete ALL logs permanently"),

    async execute(interaction) {

        const sellerKey = getSellerKey();
        const BASE_URL = process.env.BASE_URL;

        if (!sellerKey)
            return interaction.reply("❌ Seller key not set. Use `/setsellerkey` first.");

        // Safety confirmation step
        await interaction.reply("⚠ **Are you sure?** This will delete *all logs permanently*! Reply with **yes** within 10 seconds.");

        const filter = m => m.author.id === interaction.user.id;
        const collector = interaction.channel.createMessageCollector({ filter, time: 10000, max: 1 });

        collector.on("collect", async msg => {
            if (msg.content.toLowerCase() !== "yes")
                return msg.reply("❌ Cancelled. No logs deleted.");

            const url = `${BASE_URL}/logs_delete_all.php?sellerkey=${sellerKey}`;

            try {
                const res = await axios.get(url);

                if (res.data.success)
                    return msg.reply(`🗑️ **All logs deleted successfully.**`);

                return msg.reply("❌ Failed to delete logs.");

            } catch (error) {
                console.error(error);
                return msg.reply("❌ API request failed.");
            }
        });

        collector.on("end", collected => {
            if (collected.size === 0)
                interaction.followUp("⌛ No response — **deletion cancelled**.");
        });
    }
};
