/** Route zur Website eines Blgoposts */
import { BlogComment, Blogpost, User } from '@shared/types';
import express from 'express'
import { blog, blogpostController, blogposts, userController } from 'src/server/app';

const router = express.Router();

// GET /blogpost/#nummer#
router.get('/:inputBlog_id', async (request, response) => {

    const inputBlog_id = parseInt(request.params.inputBlog_id)
    const output_blogpostID = blog.findBlogPostById(inputBlog_id)
    const currentBlogpost : Blogpost | null = await blog.findBlogPostById(inputBlog_id)

    const currentUser: User | null = request.session.userId ? await userController.findOneUserById(request.session.userId) : null


    if (output_blogpostID == null) {
        response.status(404).send('Blog not found')
        return
    }

    const data = {
        currentBlogpost: currentBlogpost,
        authorId: currentBlogpost.meta.authorID,
        user: currentUser,
        isHomepage: false
    }
    
    response.status(200).render('pages/blogpost.pug', data)
})

// POST requests
router.post('/:inputBlog_id/comment/:comment_id/upvote', (request, response) => {

    const comment_id = parseInt(request.params.comment_id)

    // todo: Route schützen

    if (comment_id == null) {
        response.status(406).send('Comment not found')
        return
    }

    response.status(302).send(
        blogpostController.upvoteComment(comment_id)
    )
})

router.post('/:inputBlog_id/comment/:comment_id/downvote', (request, response) => {

    const comment_id = parseInt(request.params.comment_id)
    const blogId = request.params.inputBlog_id

    // todo: Route schützen

    if (comment_id == null) {
        response.status(406).send('Comment not found')
        return
    }

    blogpostController.upvoteComment(comment_id)
    response.status(302).redirect(`/blogpost/${blogId}`)
})

router.post('/:inputBlog_id/:inputText', (request, response) => {

    const inputBlog_id = parseInt(request.params.inputBlog_id)
    const inputText = request.params.inputText

    // todo: Wer soll als Autor genommen werden???
    const inputAuthor = '';
    const inputAuthor_id = 404;
    
    const resultComment: BlogComment = {
        blogpostId: inputBlog_id,
        author: inputAuthor,
        author_id: inputAuthor_id,
        votes: 0,
        text: inputText
    }

    // todo: Route schützen

    response.status(302).send(
        blogpostController.createComment(resultComment)
    )
})

export default router