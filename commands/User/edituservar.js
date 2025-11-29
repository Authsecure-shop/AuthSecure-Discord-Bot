const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");
const { getSellerKey } = require("../../utils/config");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("edituservar")
        .setDescription("Edit or update a user variable value")
        .addStringOption(o => 
            o.setName("username")
             .setDescription("Target username")
             .setRequired(true)
        )
        .addStringOption(o => 
            o.setName("variable")
             .setDescription("Variable name to update")
             .setRequired(true)
        )
        .addStringOption(o => 
            o.setName("newdata")
             .setDescription("New value to set")
             .setRequired(true)
        ),

    async execute(interaction) {

        const sellerKey = getSellerKey();
        const BASE_URL = process.env.BASE_URL;

        if (!sellerKey) return interaction.reply("❌ Seller key not set. Use `/setsellerkey` first.");

        const username = interaction.options.getString("username");
        const variable = interaction.options.getString("variable");
        const newdata  = interaction.options.getString("newdata");

        const url = `${BASE_URL}/seller_edit_user_variable.php?sellerkey=${sellerKey}&username=${username}&var=${variable}&newdata=${encodeURIComponent(newdata)}`;

        try {
            const res = await axios.get(url);

            if (res.data?.success) {
                return interaction.reply(`📝 **User Variable Updated Successfully**\n👤 User: \`${username}\`\n🔧 Variable: \`${variable}\`\n📌 New Value: \`${newdata}\``);
            } else {
                return interaction.reply("❌ " + (res.data.msg || "Failed to update variable"));
            }

        } catch (err) {
            console.error(err);
            return interaction.reply("❌ API Request Failed — Check Console.");
        }
    }
};
