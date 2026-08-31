const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

const ssAtivos = new Map();

function gerarId() {
    return `${Date.now()}-${Math.floor(Math.random() * 9999)}`;
}

async function criarSS(interaction, tipo) {
    const id = gerarId();

    const tipoTexto = tipo === "mob"
        ? "📱 SS MOB"
        : "💻 SS EMU";

    const tipoNome = tipo === "mob"
        ? "Celular"
        : "PC / Emulador";

    const ss = {
        id,
        tipo,
        usuarioId: interaction.user.id,
        usuarioTag: interaction.user.tag,
        teladorId: null,
        status: "aguardando",
        criadoEm: new Date()
    };

    ssAtivos.set(id, ss);

    const embed = new EmbedBuilder()
        .setTitle(`🔎 ${tipoTexto}`)
        .setDescription(
            `**Nova solicitação de SS**\n\n` +
            `👤 **Jogador:** ${interaction.user}\n` +
            `🖥️ **Tipo:** ${tipoNome}\n` +
            `🆔 **ID:** \`${id}\`\n\n` +
            `📊 **Status:** 🟡 Aguardando telador`
        )
        .setTimestamp();

    const botoes = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`ss_assumir:${id}`)
                .setLabel("Assumir SS")
                .setEmoji("👨‍💻")
                .setStyle(ButtonStyle.Primary),

            new ButtonBuilder()
                .setCustomId(`ss_cancelar:${id}`)
                .setLabel("Cancelar")
                .setEmoji("❌")
                .setStyle(ButtonStyle.Danger)
        );

    const mensagem = await interaction.channel.send({
        embeds: [embed],
        components: [botoes]
    });

    ss.mensagemId = mensagem.id;
    ss.canalId = interaction.channel.id;

    return id;
}

function obterSS(id) {
    return ssAtivos.get(id);
}

function assumirSS(id, teladorId) {
    const ss = ssAtivos.get(id);

    if (!ss) {
        return {
            sucesso: false,
            mensagem: "❌ Essa solicitação não existe."
        };
    }

    if (ss.status !== "aguardando") {
        return {
            sucesso: false,
            mensagem: "❌ Essa solicitação já foi assumida ou finalizada."
        };
    }

    ss.teladorId = teladorId;
    ss.status = "em_analise";
    ss.assumidoEm = new Date();

    return {
        sucesso: true,
        ss
    };
}

function cancelarSS(id) {
    const ss = ssAtivos.get(id);

    if (!ss) return null;

    ss.status = "cancelado";
    ss.canceladoEm = new Date();

    return ss;
}

function finalizarSS(id, resultado) {
    const ss = ssAtivos.get(id);

    if (!ss) return null;

    ss.status = "finalizado";
    ss.resultado = resultado;
    ss.finalizadoEm = new Date();

    return ss;
}

module.exports = {
    criarSS,
    obterSS,
    assumirSS,
    cancelarSS,
    finalizarSS
};
