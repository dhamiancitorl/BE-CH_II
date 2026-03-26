import { hashPassword } from "../../utils.js";

export class UserDTO {
    sessionData(user){
        return {
            first_name: user.first_name,
            email: user.email,
            role: user.role,
            
        }
    }


saveUser(user){
    return {
        _id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        password: hashPassword(user.password),
        email: user.email,
        age: user.age,
        role: user.role,
    }
}
}
