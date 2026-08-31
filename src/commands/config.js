const {
    SlashCommandBuilder,
    PermissionFlagsBits
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("config")
        .setDescription("Mostra a configuração atual da SS.")
        .setDefaultMemberPermissions(
            PermissionFlagsBits.Administrator
        ),

    async execute(interaction) {

        const category = process.env.SS_CATEGORY_ID || "Não configurado";
        const logs = process.env.SS_LOG_CHANNEL_ID || "Não configurado";
        const telador = process.env.TELADOR_ROLE_ID || "Não configurado";

        await interaction.reply({
            content:
                `⚙️ **CONFIGURAÇÃO SS**\n\n` +
                `📁 Categoria: \`${category}\`\n` +
                `📋 Logs: \`${logs}\`\n` +
                `👨‍💻 Cargo Telador: \`${telador}\``,
            ephemeral: true
        });
    }
};
