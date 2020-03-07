import HttpException from "./http-exception";

class UserWithThatEmailAlreadyExistsException extends HttpException{
    constructor(email: String){
        super(404, `User already exists with email ${email}`)
    }
}

export default UserWithThatEmailAlreadyExistsException;