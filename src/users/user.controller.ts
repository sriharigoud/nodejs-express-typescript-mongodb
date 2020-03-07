import * as express from 'express'
import userModel from './user.model';
import postModel from '../posts/posts.model';
import authMiddleware from '../middleware/auth.middleware';
import RequestWithUser from '../interfaces/requestWithUser.interface';
import NotAuthorizedException from '../exceptions/AuthenticationTokenMissingException';

class UserController{
    public path = "/users";
    public user = userModel;
    public post = postModel;
    public router = express.Router();
    constructor(){
        this.initializeRoutes();
    }

    initializeRoutes(){
        this.router.get(`${this.path}/:id/posts`, authMiddleware, this.getUserPosts.bind(this));
    }

    async getUserPosts(request: RequestWithUser, response: express.Response, next: express.NextFunction){
        const userId = request.params.id;
        if (userId === request.user._id.toString()) {
          const posts = await this.post.find({ author: userId });
          response.send(posts);
        }
        next(new NotAuthorizedException());
    }
}

export default UserController