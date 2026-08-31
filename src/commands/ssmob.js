const { SlashCommandBuilder } = require("discord.js");
const { criarSS } = require("../ss/ssManager");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ssmob")
        .setDescription("Solicita uma análise SS pelo celular."),

    async execute(interaction) {
        try {
            await interaction.deferReply({ ephemeral: true });

            const id = await criarSS(interaction, "mob");

            await interaction.editReply({
                content: `✅ Seu **SS MOB** foi solicitado!\n🆔 ID: \`${id}\`\n\nAguarde um telador assumir sua solicitação.`
            });

        } catch (error) {
            console.error("Erro no /ssmob:", error);

            if (interaction.deferred || interaction.replied) {
                await interaction.editReply({
                    content: "❌ Não foi possível criar sua solicitação de SS."
                });
            } else {
                await interaction.reply({
                    content: "❌ Não foi possível criar sua solicitação de SS.",
                    ephemeral: true
                });
            }
        }
    }
};
