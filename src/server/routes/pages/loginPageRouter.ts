/** Route zur Login-Webseite */
import { User } from '@shared/types';
import express from 'express'
import { userController, blog, blogpostController } from 'src/server/app'
const router = express.Router();

async function cookieParserLogin(
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
) {
    const inputUsrN = request.body.username as string;
    const inputPW = request.body.password as string;
    const user = await userController.login(inputUsrN, inputPW)

    const currentUser: User | null = request.session.userId ? await userController.findOneUserById(request.session.userId) : null


    console.log(`Username: ${inputUsrN}, Password: ${inputPW} >>>> user Ergebnis: ${user}`)
    
    // Wert in der Session setzen
    //      wenn session noch nicht existiert -> wird trotzdem erzeugt
    //      automatischer Cookie
    if (user == null) {
        const data = {
            info: '[i] Anmeldung nicht erfolgreich',
            user: currentUser,
            isHomepage: false
        }

        response.status(401).render('pages/loginSite.pug', data)
        return
    }
    request.session.userId = user;
    console.log(`Anmeldung erfolgreich! userID session: ${request.session.userId}`)
    response.redirect('/')
}

async function cookieParserLogout(
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
) {
    console.log('cookieParserLogout wurde gefeuert')

    request.session.destroy(() => {
        console.log(`User mit id: ${request.session.userId} wurde ausgeloggt`)

        // Aufgabe 2a: Fehlermeldung anzeigen -> kein redirect???
        response.status(302).redirect('/')
    })
}

// GET /login
router.get('/', (request, response) => {
    const data = {
        info: "Hier anmelden"
    }

    response.render('pages/loginSite.pug', data)
});

// POST requests
router.post('/', cookieParserLogin);

router.post('/logout', cookieParserLogout);

export default router