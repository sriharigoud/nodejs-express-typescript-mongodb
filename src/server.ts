import App from './app';
import 'dotenv/config';
import PostsController from './posts/posts.controller';
import AuthenticationController from './authentication/authentication.controller';

const app = new App(
    [new PostsController(), new AuthenticationController(),],
    process.env.PORT,
);

app.listen();