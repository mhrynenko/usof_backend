const jwt = require('jsonwebtoken');

const generateAccessToken = (login, status) => {
    const payload = { 
        status,
        login
    }

    return jwt.sign(payload, process.env.JWT_SECRET_KEY, {expiresIn: '6h'});
};

const verify = () => {

};

module.exports = {
    generateAccessToken,
}