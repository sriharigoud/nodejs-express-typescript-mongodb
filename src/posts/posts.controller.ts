import * as express from 'express';
import Post from './post.interface';
import postModel from './posts.model';
import PostNotFoundException from '../exceptions/PostNotFoundException';
import validationMiddleware from '../middleware/validation.middleware';
import CreatePostDto from './post.dto';

class PostsController {
  public path = '/posts';
  public router = express.Router();
  private post = postModel;
 
  constructor() {
    this.intializeRoutes();
  }
 
  public intializeRoutes() {
    this.router.post(this.path, validationMiddleware(CreatePostDto), this.createPost);
    this.router.patch(`${this.path}/:id`, validationMiddleware(CreatePostDto, true), this.modifyPost);
    this.router.get(this.path, this.getAllPosts.bind(this));
    this.router.get(`${this.path}/:id`, this.getPostById.bind(this));
    this.router.delete(`${this.path}/:id`, this.deletePost.bind(this));
  }
 
  getAllPosts = async(request: express.Request, response: express.Response) => {
    const posts = await this.post.find().exec();
    response.send(posts);
  }
 
  private getPostById = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    const id = request.params.id;
    this.post.findById(id)
      .then((post) => {
        if (post) {
          response.send(post);
        } else {
          next(new PostNotFoundException(id));
        }
      });
  }
   
  private modifyPost = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    const id = request.params.id;
    const postData: Post = request.body;
    this.post.findByIdAndUpdate(id, postData, { new: true })
      .then((post) => {
        if(post) {
          response.send(post);
        } else {
          next(new PostNotFoundException(id));
        }
      });
  }
   
  private deletePost = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    const id = request.params.id;
    this.post.findByIdAndDelete(id)
      .then((successResponse) => {
        if (successResponse) {
          response.send(200);
        } else {
          next(new PostNotFoundException(id));
        }
      });
  }
   
  private createPost = (request: express.Request, response: express.Response) => {
    const postData: Post = request.body;
    const createdPost = new this.post(postData);
    createdPost.save()
      .then((savedPost) => {
        response.send(savedPost);
      });
  }

}
 
export default PostsController;