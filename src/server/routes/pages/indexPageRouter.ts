/** Route zur Startseite */
import { Blogpost, User } from '@shared/types';
import express from 'express'
import { blogtitle, blogposts, blog, blogpostController, userController } from 'src/server/app';
const router = express.Router();

router.get('/', async (request, response) => {

    const start = request.query.start ? parseInt(request.query.start as string, 10) : 10;
    const limit = request.query.limit ? parseInt(request.query.limit as string, 10) : 10;
    const search = request.query.search ? request.query.search as string : '';

    const currentUser: User | null = request.session.userId ? await userController.findOneUserById(request.session.userId) : null

    let foundPosts: Blogpost[] = [];
    if (search != '') {
        foundPosts = blog.findManyBlogposts(search)
    }

    const output_blogtitle = blogtitle.toString();
    const output_dateOfRecentBlogpost = blog.getRecentBlogPosts(1).at(0)?.meta.date;
    const mostPopularComment = blogpostController.getPopularComments().at(0);
    const output_mostVotedComment = mostPopularComment ? mostPopularComment.votes : 0;
    const output_amountBlogposts = blogposts.length;

    const data = {
        foundPosts: foundPosts,
        recentPosts: blog.getRecentBlogPosts(limit),
        popularComments: blogpostController.getPopularComments(limit),
        allPosts: blog.getBlogpostsByPage(start, limit),
        user: currentUser,
        isHomepage: true
    }

    response.status(200).render('pages/indexPage.pug', data)
})

// muster get
router.get('/form', (request, response) => {
    const templateData = {
        theTitle: 'Mein Block',
        serverTime: new Date(),
        fruits: ['appel', 'und ein', 'ei']
    }

    response.render('pages/indexPage.pug', templateData)
})

router.get('/pgForward', (request, response) => {
    const newStart = parseInt(request.query.start as string) || 0
    const limit = parseInt(request.query.limit as string) || 10

    response.render(`/?start=${newStart + limit}&limit=${limit}`)
})

router.get('/pgBackward', (request, response) => {
    const newStart = parseInt(request.query.start as string) || 0
    const limit = parseInt(request.query.limit as string) || 10

    response.render(`/?start=${newStart + limit}&limit=${limit}`)
})

export default router