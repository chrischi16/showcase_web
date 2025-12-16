import express from 'express'
const router = express.Router();


router.get('/', (request, response) => {
    response.status(200).redirect('/impressum.html')
})

export default router