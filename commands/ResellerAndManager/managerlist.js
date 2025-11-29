const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const axios = require("axios");
const { getSellerKey } = require("../../utils/config");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("managerlist")
        .setDescription("📜 Retrieve all manager accounts registered under your seller"),

    async execute(interaction) {

        const sellerKey = getSellerKey();
        const BASE_URL = process.env.BASE_URL;

        if (!sellerKey)
            return interaction.reply("❌ Seller key not configured. Use `/setsellerkey` first!");

        await interaction.reply("📥 Retrieving manager list...");

        try {
            const url = `${BASE_URL}/seller_manager_list.php?sellerkey=${sellerKey}`;
            const res = await axios.get(url);

            if (!res.data.success)
                return interaction.editReply(`❌ ${res.data.msg}`);

            const managers = res.data.managers;
            if (managers.length === 0)
                return interaction.editReply("⚠ No managers found!");

            const embed = new EmbedBuilder()
                .setTitle("🧾 Manager Accounts")
                .setColor("Random")
                .setDescription(
                    managers.map((m, i) => `**${i+1}. ${m.username}**\n📧 Email: ${m.email ?? "None"}\n📅 Created: ${m.created_at}`).join("\n\n")
                )
                .setFooter({ text: `Total Managers: ${managers.length}` })
                .setTimestamp();

            return interaction.editReply({ embeds: [embed] });

        } catch (err) {
            console.error(err);
            return interaction.editReply("⚠ API request failed — check console.");
        }
    }
};
