

const jwt = require('jsonwebtoken')
const { userDetailsModel } = require('../models/usersSchema')


const authUserDetails = (expectedRole) => {
    return async (req, res, next) => {
        //console.log('in middleware expected role', expectedRole)

        const { authorization } = req.headers
        if (!authorization) {
            res.status(401).json({ error: "Auth token is required" })
        }

        const token = authorization.split(" ")[1]
        if (!token) {
            return res.status(401).json({ error: "Invalid token format" });
        }
        try {

            // checking token entered by user and generated at time of login is same or not 
            const { _id, role } = jwt.verify(token, process.env.JWT_TOKEN)
            if (!_id || !role) {
                return res.status(401).json({ error: "Invalid token" });
            }

            if (role !== expectedRole) {
                return res.status(401).json({ error: `Not authorized as ${expectedRole}` });
            }


            //checking id is present in db or not- only checking id     
            req.user = await userDetailsModel.findById(_id);
            if (!req.user) {
                return res.status(401).json({ error: `${expectedRole} Id not found` });
            }

            //after checking move to next operations
            next()
        }
        catch (err) {
            res.status(401).json({ error: 'Request is not authorized' })
        }
    }
}


// email
const authUser = async (req, res, next) => {
    const { authorization } = req.headers
    if (!authorization) {
        res.status(401).json({ error: "Auth token is required" })
    }

    const token = authorization.split(" ")[1]
    if (!token) {
        return res.status(401).json({ error: "Invalid token format" });
    }

    try {

        // checking token entered by user and generated at time of login is same or not 
        const { _id, role, email } = jwt.verify(token, process.env.JWT_TOKEN)
        if (!_id || !role || !email) {
            return res.status(401).json({ error: "Invalid token" });
        }

        //checking id is present in db or not- only checking id     
        req.userDetails = await userDetailsModel.findById(_id);
        if (!req.userDetails) {
            return res.status(401).json({ error: `${role} Id not found` });
        }

        //after checking move to next operations
        next()
    }
    catch (err) {
        res.status(401).json({ error: 'Request is not authorized' })
    }
}

module.exports = {
    authUserDetails,
    authUser
}