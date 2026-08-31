const { Events } = require("discord.js");

const {
    processarBotao
} = require("../ss/ssButtons");

module.exports = {
    name: Events.InteractionCreate,

    async execute(interaction) {

        // =========================
        // BOTÕES
        // =========================

        if (interaction.isButton()) {

            if (interaction.customId.startsWith("ss_")) {
                await processarBotao(interaction);
                return;
            }

            return;
        }

        // =========================
        // COMANDOS /
        // =========================

        if (!interaction.isChatInputCommand()) {
            return;
        }

        const command = interaction.client.commands.get(
            interaction.commandName
        );

        if (!command) {
            return;
        }

        try {

            await command.execute(interaction);

        } catch (error) {

            console.error(
                `Erro no comando /${interaction.commandName}:`,
                error
            );

            const resposta = {
                content: "❌ Ocorreu um erro ao executar este comando.",
                ephemeral: true
            };

            if (
                interaction.replied ||
                interaction.deferred
            ) {

                await interaction.followUp(resposta);

            } else {

                await interaction.reply(resposta);

            }
        }
    }
};
