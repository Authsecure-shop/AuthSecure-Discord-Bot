const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");
const { getSellerKey } = require("../../utils/config");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("createuser")
        .setDescription("Create a new user in the system")
        .addStringOption(o =>
            o.setName("username")
                .setDescription("Enter the username")
                .setRequired(true)
        )
        .addStringOption(o =>
            o.setName("password")
                .setDescription("Password for user")
                .setRequired(true)
        )
        .addStringOption(o =>
            o.setName("subscription")
                .setDescription("Subscription plan")
                .setRequired(true)
        )
        .addIntegerOption(o =>
            o.setName("expiry")
                .setDescription("Expiry in days (0 = No Expiry)")
                .setRequired(true)
        ),

    async execute(interaction) {
        const sellerKey = getSellerKey();
        const BASE_URL = process.env.BASE_URL;

        if (!sellerKey) 
            return interaction.reply("❌ Seller key not set. Use `/setsellerkey` first.");

        const username = interaction.options.getString("username");
        const password = interaction.options.getString("password");
        const subscription = interaction.options.getString("subscription");
        const expiry = interaction.options.getInteger("expiry");

        const url = `${BASE_URL}/create_user.php?sellerkey=${sellerKey}&username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}&subscription=${encodeURIComponent(subscription)}&expiry=${expiry}`;

        try {
            const res = await axios.get(url);

            if (!res.data.success)
                return interaction.reply(`❌ Failed — ${res.data.msg}`);

            return interaction.reply(
                `🆕 **User Created Successfully**\n👤 Username: \`${username}\`\n🔐 Subscription: **${subscription}**\n📅 Expiry: **${expiry} Days**`
            );

        } catch (err) {
            console.error(err);
            return interaction.reply("❌ API Request Failed — Check console.");
        }
    }
};
