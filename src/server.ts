import App from './app';
import 'dotenv/config';
import PostsController from './posts/posts.controller';
import AuthenticationController from './authentication/authentication.controller';
import UserController from './users/user.controller';

const app = new App(
    [new PostsController(), new AuthenticationController(), new UserController()],
    process.env.PORT,
);

app.listen();