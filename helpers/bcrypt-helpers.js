const bcrypt = require("bcrypt");

async function checkPassword(password, hash) {
    return bcrypt.compare(password, hash);
}

function hashPassword(password) {
    const salt = bcrypt.genSaltSync();
    console.log(salt)
    return bcrypt.hashSync(password, salt);
}

module.exports = {
    checkPassword,
    hashPassword,
}