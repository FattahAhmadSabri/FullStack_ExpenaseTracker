const User = require("../model/userSchema")

const createUserService=async(name,email,password)=>{
    const result = await User.create({name,email,password})
    const data = result.toJSON()
        delete data.password
    return data
}

module.exports ={createUserService}