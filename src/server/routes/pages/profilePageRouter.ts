/** Route zur Webseite eines Benutzerprofils */
import express from 'express'
import { userController } from 'src/server/app'
import { User } from '@shared/types';
import { jsonManager } from 'src/server/database/jsonManager';
import { Url } from 'node:url';

const router = express.Router();

router.get('/:inputUserID', async (request, response) => {

    const inputUserID = parseInt(request.params.inputUserID)
    const sessionUserID : number = request.session.userId || null
    const currentUser : User | null = await userController.findOneUserById(inputUserID)
    let isLoggedIn : boolean = false

    if (currentUser === null) {
        response.status(404).send('Fehler - Nutzer nicht gefunden')
        return
    }

    if (sessionUserID != null || inputUserID == sessionUserID) {
        isLoggedIn = true
    }

    const data = {
        firstname: currentUser.firstname,
        lastname: currentUser.lastname,
        userid: currentUser.id,
        userauthor: currentUser.author,
        avatar: currentUser.avatar,
        userSkills: currentUser.skills,
        profileOwner: "Unknown",
        user: currentUser,
        isHomepage: false

    }

    let output_profileType : string = ''
    if (inputUserID !== sessionUserID) {
        data.profileOwner = "Fremdprofil"
    } else {
        data.profileOwner = "Eigenesprofil"
    }

    response.status(200).render('pages/profile.pug', data)
})

router.post('/:inputID', (request, response) => {
    const inputUserID = parseInt(request.params.inputID)
    const author = request.query.author ? request.query.author as string : ''
    const firstname = request.query.firstname ? request.query.firstname as string : ''
    const lastname = request.query.lastname ? request.query.lastname as string : ''
    
    const rawAvatar = request.query.avatar as string
    

    if (rawAvatar != null || typeof rawAvatar !== 'string') {
        response.status(406).send('Fehler - Avatar_URL ungültig.')
        return
    }

    
    let processedAvatar: URL
    try {
        processedAvatar = new URL(rawAvatar)
    } catch (error) {
        response.status(406).send('Fehler - Avatar_URL fehlt oder ungültig.')
        return
    }

    const success = userController.updateUser(inputUserID, author, firstname, lastname, processedAvatar)

    if (!success) {
        response.status(500).send('Fehler - beim Aktualisieren des Profils')
    }
    response.status(302).redirect('/profile/:inputUserID')
})

router.post('/:inputID/skill', (request, response) => {
    const method = request.query.method ? request.query.method as string : ''
    const skill = request.query.skill ? request.query.skill as string : ''
    const newSkill = request.query.newSkill ? request.query.newSkill as string : ''
    const sessionUserID = parseInt(request.session.userId)
    const inputUserId = parseInt(request.params.inputID)

    if (inputUserId != sessionUserID) {
        response.status(302).send('Nicht eingeloggt').redirect(`/login/${inputUserId}`)
        return
    }

    switch (method) {
        case 'post':
            userController.addSkill(sessionUserID, skill)
            break;
        case 'put':
            userController.updateSkill(sessionUserID, skill, newSkill)
            break;
        case 'delete':
            userController.deleteSkill(sessionUserID, skill)
            break;
    
        default:
            response.status(407).send('Fehler - Ungültige Methodeneingabe in profilePageRouter /profile/..')
            return
    }
    
    response.status(302).redirect('/:inputUserID')
})

export default router