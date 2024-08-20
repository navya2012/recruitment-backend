
const jwt = require("jsonwebtoken")

const createToken = ({_id, role, email}) => {
   // console.log('token', _id, role, email)
    return jwt.sign({_id, role, email}, process.env.JWT_TOKEN ,{
        expiresIn:"7d"
    })
}

module.exports = createToken