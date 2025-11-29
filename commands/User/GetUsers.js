const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const axios = require("axios");
const { getSellerKey } = require("../../utils/config");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("getusers")
        .setDescription("Retrieve all users"),

    async execute(interaction) {

        const sellerKey = getSellerKey();
        const BASE_URL = process.env.BASE_URL;

        if (!sellerKey) {
            return interaction.reply("❌ Seller key not set. Use `/setsellerkey` first.");
        }

        const url = `${BASE_URL}/retrieve_users.php?sellerkey=${sellerKey}`;

        try {
            const res = await axios.get(url);

            if (!res.data.success) {
                return interaction.reply("❌ " + (res.data.msg || "Failed retrieving users"));
            }

            const users = res.data.users;
            if (!users.length) return interaction.reply("📭 No Users Found.");

            let list = users
                .slice(0, 50) // avoid huge spam (show only first 50)
                .map(u => `🔹 **${u.username}** | Sub: **${u.subscription}** | Exp: **${u.expiry}** | Paused: **${u.is_paused ? 'Yes' : 'No'}**`)
                .join("\n");

            const embed = new EmbedBuilder()
                .setTitle("📜 User List")
                .setDescription(list)
                .setColor("Blue")
                .setFooter({ text: `Total Users: ${users.length}` });

            return interaction.reply({ embeds: [embed] });

        } catch (err) {
            console.log(err);
            return interaction.reply("❌ API Request Failed. Check console.");
        }
    }
};
