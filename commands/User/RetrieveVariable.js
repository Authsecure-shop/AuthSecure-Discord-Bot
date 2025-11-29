const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const axios = require("axios");
const { getSellerKey } = require("../../utils/config");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("fetchauservars")
        .setDescription("Retrieve all user variables for a specific user")
        .addStringOption(o =>
            o.setName("username")
                .setDescription("Username to retrieve variables for")
                .setRequired(true)
        ),

    async execute(interaction) {

        const sellerKey = getSellerKey();
        const BASE_URL = process.env.BASE_URL;

        if (!sellerKey)
            return interaction.reply("❌ Seller key not set. Use `/setsellerkey` first.");

        const username = interaction.options.getString("username");

        const url = `${BASE_URL}/seller_retrieve_all_user_variables.php?sellerkey=${sellerKey}&username=${username}`;

        try {
            const res = await axios.get(url);

            if (!res.data.success)
                return interaction.reply(`❌ Failed — ${res.data.msg}`);

            const vars = res.data.variables;

            if (vars.length === 0)
                return interaction.reply(`⚠ No variables found for user: **${username}**`);

            // Pretty Embed Output
            const embed = new EmbedBuilder()
                .setTitle(`📂 Variables for ${username}`)
                .setColor("Blue")
                .setDescription(vars.map(v =>
                    `🔑 **${v.variable_name}** → \`${v.variable_data}\`\n📅 *${v.created_at}*`
                ).join("\n\n"))
                .setTimestamp();

            return interaction.reply({ embeds: [embed] });

        } catch (err) {
            console.log(err);
            return interaction.reply("❌ API request failed — Check console.");
        }
    }
};
