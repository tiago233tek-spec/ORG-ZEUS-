function isAdmin(member) {
    return member?.permissions?.has("Administrator") ?? false;
}

function isTelador(member) {
    const roleId = process.env.TELADOR_ROLE_ID;

    if (!roleId || !member) {
        return false;
    }

    return member.roles?.cache?.has(roleId) ?? false;
}

module.exports = {
    isAdmin,
    isTelador
};
