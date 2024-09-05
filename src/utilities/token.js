
const jwt = require("jsonwebtoken")

const createToken = ({_id, role, email}) => {
    return jwt.sign({_id, role, email}, process.env.JWT_TOKEN ,{
        expiresIn:"1d"
    })
}

module.exports = createToken