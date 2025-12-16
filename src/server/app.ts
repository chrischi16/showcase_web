/** Enthält und konfiguriert den Express Server ## */
import { jsonManager } from './database/jsonManager';

export let users: User[] = [];
export let blogposts: Blogpost[] = [];
export let blogtitle: string = '';

export let userController: UserController;
export let blogpostController: BlogpostController;
export let blog: BlogController;

export async function initData() {
  type Title = {
    title: string
  }

  users = await jsonManager.readJSONFile<User[]>('data/users.json');
  blogposts = (await jsonManager.readJSONFile<Blogpost[]>('data/blogposts.json'))
  blogtitle = (await jsonManager.readJSONFile<Title>('data/globals.json')).title;

  userController = new UserController(users);
  blogpostController = new BlogpostController(blogposts[0]);
  blog = new BlogController(blogposts);
}

initData();

// Routerimports
import blogpostPageRouter from './routes/pages/blogpostPageRouter'
import indexPageRouter from './routes/pages/indexPageRouter'
import loginPageRouter from './routes/pages/loginPageRouter'
import profilePageRouter from './routes/pages/profilePageRouter'
import impressumPageRouter from './routes/pages/impressumPageRouter'

// 1) .env-Dateien einlesen
import dotenv from 'dotenv'
dotenv.config({
  // Versucht zuerst, .env zu laden, dann .env.<NODE_ENV> (z.B. .env.test)
  path: ['.env', `.env.${process.env.NODE_ENV}`],
  // Falls dieselbe Variable in beiden Dateien steht, gilt die letzte
  override: true
})

// 2) Express & weitere Middleware-Pakete importieren
import express, { type Request, type Response, type Express } from 'express'
import bodyParser from 'body-parser'
import session from 'express-session'
import { UserController } from './controller/userController';
import { BlogController } from './controller/blogController';
import { Blogpost, User } from '@shared/types';
import { BlogpostController } from './controller/blogpostController';
// - - middleware imports
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import { join } from 'path';
import fs from 'fs'


// 3) Sicherstellen, dass alle nötigen Umgebungs­variablen gesetzt sind
if (!process.env.SESSION_SECRET) {
  console.error('Environment Variable "SESSION_SECRET" is not defined.')
  process.exit(1)  // bricht das Programm sofort ab
}
const sessionSecret = process.env.SESSION_SECRET

if (!process.env.SERVER_PORT) {
  console.error('Environment Variable "SERVER_PORT" is not defined.')
  process.exit(1)
}
const port = parseInt(process.env.SERVER_PORT, 10)

// 4) Typdefinition für optionale Einstellungen
export type AppOptions = {
  logging: boolean  // legt fest, ob der Server beim Start in die Konsole schreibt
}


const pug = require('pug')

  function renderStaticPage(pugFile: string, htmlFile: string) {
    const pugPath = join(__dirname, '..', 'shared', 'views', pugFile);
    const basedir = join(__dirname, '..', 'shared', 'views');          
    const compiled = pug.compileFile(pugPath, { basedir, pretty: true });
    const html = compiled();
    const output = join(__dirname, '..','..', 'public', htmlFile);
    fs.writeFileSync(output, html, 'utf8');
  }


renderStaticPage('pages/imprint.pug', 'impressum.html');

// 5) Factory-Funktion: Wir erzeugen hier unsere Express-App
/**
 * Funktion, mit der ein Express-Server konfiguriert und gestartet wird.
 * @param {AppOtions} options - Konfiguration des Webservers
 * @returns {Express} ausgeführte Express-Anwendung (Webserver)
 */
export const createApp = ( options?: Partial<AppOptions>) => {
  // a) Logging-Flag aus den Optionen (default: false)
  const loggingActive = options?.logging ?? false
  // b) Neue Express-Instanz
  const app: Express = express()
  
  // Templating mit Pug
  app.set('view engine', 'pug')
  app.set('views', join('src', 'shared', 'views'))
  
  // Statische Dateien aus einem public-Ordner bereitstellen
  app.use(express.static('public'))
  // 6) Body-Parser konfigurieren
  // → form-data (urlencoded) parsen, wie es HTML-Formulare senden
  app.use(bodyParser.urlencoded({ extended: true }))
  // → JSON-Daten parsen (für API Requests)
  app.use(bodyParser.json())

  // 7) Session-Middleware einrichten und...
  const sessionMiddleware = session({
    name: 'session',             // Name des Cookies
    secret: sessionSecret,       // Schlüssel zum Signieren des Cookies
    resave: false,               // speichert Session nur, wenn sie sich geändert hat
    saveUninitialized: false,    // speichert keine leeren Sessions (→ DSGVO)
    cookie: {
      secure: process.env.NODE_ENV === 'production', // nur HTTPS im Produktivbetrieb
      maxAge: 24 * 60 * 60 * 1000,  // Ablaufzeit: 24 Stunden (in ms)
      httpOnly: true,               // kein Zugriff via client-seitigem JavaScript
      sameSite: 'lax'               // schützt vor CSRF-Angriffen
    }
  })
  app.use(sessionMiddleware)     // ...aktivieren

  // 8) An dieser Stelle fügst du später deine Routen ein
  // Beispiel: app.use('/blogpost', blogpostRouter)

  // use berücksichtigt alle requests, während get nur get requests handled

  app.use('/', (indexPageRouter))

  app.use('/blogpost', blogpostPageRouter)
  app.use('/login', loginPageRouter)
  app.use('/profile', profilePageRouter)
  app.use('/impressum', impressumPageRouter)


  // 9) Fallback für alle nicht definierten Pfade → 404 Seite
    app.use(
    (request: Request, response: Response) => {
        response
            .status(404)
            .send('<h1>oh-oh!</h1><p>page not found</p>')
    }
  )

  // 10) Server starten und auf Anfragen lauschen
  app.listen(port, () => {
    if (loggingActive) {
      console.log(`Server running: http://localhost:${port}`)

      app.use(cookieParser())
      app.use(morgan('dev'))
    }
  })

  // 11) Gib die App zurück, damit man sie z.B. in Tests verwenden kann
  return app
}