import { userModel} from "../userModel.js";

export class UserDAO {

    async findByEmail(email){
        return await userModel.findOne({email}).lean();
    }

    async create(userData){
        return await userModel.create(userData);
    }

    async updatePassword(email, newPassword){
        return await userModel.updateOne({email}, {password: newPassword});
    }

}