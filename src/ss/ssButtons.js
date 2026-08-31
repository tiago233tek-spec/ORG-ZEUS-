const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

const {
    obterSS,
    assumirSS,
    cancelarSS,
    finalizarSS
} = require("./ssManager");

const {
    isTelador,
    isAdmin
} = require("../utils/permissions");

async function processarBotao(interaction) {

    const [acao, id] = interaction.customId.split(":");

    if (!acao.startsWith("ss_")) {
        return false;
    }

    const ss = obterSS(id);

    if (!ss) {
        await interaction.reply({
            content: "❌ Essa solicitação de SS não existe mais.",
            ephemeral: true
        });

        return true;
    }

    // =========================
    // ASSUMIR SS
    // =========================

    if (acao === "ss_assumir") {

        if (
            !isTelador(interaction.member) &&
            !isAdmin(interaction.member)
        ) {
            await interaction.reply({
                content: "❌ Você não é um telador autorizado.",
                ephemeral: true
            });

            return true;
        }

        const resultado = assumirSS(
            id,
            interaction.user.id
        );

        if (!resultado.sucesso) {
            await interaction.reply({
                content: resultado.mensagem,
                ephemeral: true
            });

            return true;
        }

        const embed = new EmbedBuilder()
            .setTitle(
                ss.tipo === "mob"
                    ? "📱 SS MOB"
                    : "💻 SS EMU"
            )
            .setDescription(
                `👤 **Jogador:** <@${ss.usuarioId}>\n` +
                `👨‍💻 **Telador:** ${interaction.user}\n` +
                `🆔 **ID:** \`${ss.id}\`\n\n` +
                `📊 **Status:** 🟠 Em análise`
            )
            .setTimestamp();

        const botoes = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`ss_finalizar:${id}`)
                    .setLabel("Finalizar")
                    .setEmoji("✅")
                    .setStyle(ButtonStyle.Success),

                new ButtonBuilder()
                    .setCustomId(`ss_cancelar:${id}`)
                    .setLabel("Cancelar")
                    .setEmoji("❌")
                    .setStyle(ButtonStyle.Danger)
            );

        await interaction.update({
            embeds: [embed],
            components: [botoes]
        });

        return true;
    }

    // =========================
    // FINALIZAR SS
    // =========================

    if (acao === "ss_finalizar") {

        if (
            interaction.user.id !== ss.teladorId &&
            !isAdmin(interaction.member)
        ) {
            await interaction.reply({
                content:
                    "❌ Apenas o telador responsável pode finalizar este SS.",
                ephemeral: true
            });

            return true;
        }

        finalizarSS(id, "finalizado");

        const embed = new EmbedBuilder()
            .setTitle(
                ss.tipo === "mob"
                    ? "📱 SS MOB — FINALIZADO"
                    : "💻 SS EMU — FINALIZADO"
            )
            .setDescription(
                `👤 **Jogador:** <@${ss.usuarioId}>\n` +
                `👨‍💻 **Telador:** <@${ss.teladorId}>\n` +
                `🆔 **ID:** \`${ss.id}\`\n\n` +
                `📊 **Status:** 🟢 Finalizado`
            )
            .setTimestamp();

        await interaction.update({
            embeds: [embed],
            components: []
        });

        return true;
    }

    // =========================
    // CANCELAR SS
    // =========================

    if (acao === "ss_cancelar") {

        if (
            interaction.user.id !== ss.usuarioId &&
            !isAdmin(interaction.member)
        ) {
            await interaction.reply({
                content:
                    "❌ Você não pode cancelar esta solicitação.",
                ephemeral: true
            });

            return true;
        }

        cancelarSS(id);

        const embed = new EmbedBuilder()
            .setTitle("❌ SS CANCELADO")
            .setDescription(
                `👤 **Jogador:** <@${ss.usuarioId}>\n` +
                `🆔 **ID:** \`${ss.id}\`\n\n` +
                `📊 **Status:** 🔴 Cancelado`
            )
            .setTimestamp();

        await interaction.update({
            embeds: [embed],
            components: []
        });

        return true;
    }

    return false;
}

module.exports = {
    processarBotao
};
