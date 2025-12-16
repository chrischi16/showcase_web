/** Enthält alle Testkonfigurationen */
import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        setupFiles: './tests/server/vitest.setup.ts',
    }
})

import { beforeEach, describe, it, expect } from 'vitest'
import request from 'supertest'
import TestAgent from 'supertest/lib/agent'
// ??? Error ???
import createApp from 'src/data/server/app'

describe('indexPageRouter', () => {
    let app: ReturnType<typeof createApp>

    beforeEach(() => {
        app = createApp()
    })

    it('sollte Status 200 und den Blogtitel enthalten', async () => {
        const response = await request(app).get('/')
        expect(response.status).toBe(200)
        expect(response.text).toContain('<h1>') // checkt, dass der Titel da ist
    })

    it('sollte Anzahl Blogartikel anzeigen', async () => {
        const response = await request(app).get('/')
        expect(response.text).toMatch(/Anzahl Blogartikel: \d+/)
    })

    it('sollte das Datum des neuesten Beitrags anzeigen, wenn vorhanden', async () => {
        const response = await request(app).get('/')
        expect(response.text).toMatch(/Datum des neuesten Beitrags: .*/)
    })

    it('sollte die Stimmenanzahl des beliebtesten Kommentars anzeigen', async () => {
        const response = await request(app).get('/')
        expect(response.text).toMatch(/Anzahl Stimmen des beliebtesten Kommentars: \d+/)
    })
})

describe('blogpostPageRouter', () => {
    let app: ReturnType<typeof createApp>

    beforeEach(() => {
        app = createApp()
    })

    it('Blogpost Textausgabe erwartet', async () => {
        const response = await request(app).get('/blogpost/1')
        expect(response.status).toBe(200)
        expect(response.text).toContain('<h1>Blogpost</h1>')
    })

    it('Blogpost nicht gefunden', async () => {
        const response = await request(app).get('/blogpost/99999')
        expect(response.status).toBe(404)
        expect(response.text).toContain('Blog not found')
    })

    it('Upvote auf Kommentar', async () => {
        const response = await request(app).post('/blogpost/1/comment/1/upvote')
        expect(response.status).toBe(302)
    })

    it('Downvote auf Kommentar', async () => {
        const response = await request(app).post('/blogpost/1/comment/1/downvote')
        expect(response.status).toBe(302)
    })

    it('Kommentar posten', async () => {
        const response = await request(app).post('/blogpost/1/Test-Kommentar')
        expect(response.status).toBe(302)
    })
})

describe('loginPageRouter', () => {
    let app: ReturnType<typeof createApp>

    beforeEach(() => {
        app = createApp()
    })

    it('Login fehlgeschlagen (falsche Daten)', async () => {
        const response = await request(app).post('/login?username=falsch&password=123')
        expect(response.status).toBe(405)
        expect(response.text).toContain('Fehler: Einlogdaten inkorrekt')
    })

    it('Logout sollte zur Startseite weiterleiten', async () => {
        const agent = request.agent(app)
        const response = await agent.post('/logout')
        expect(response.status).toBe(302)
    })
})

describe('profilePageRouter', () => {
    let app: ReturnType<typeof createApp>

    beforeEach(() => {
        app = createApp()
    })

    it('Profil nicht gefunden', async () => {
        const response = await request(app).get('/profile/99999')
        expect(response.status).toBe(404)
        expect(response.text).toContain('Fehler - Nutzer nicht gefunden')
    })

    it('Fehlerhafte Avatar-URL beim POST /profile/:id', async () => {
        const response = await request(app).post('/profile/1?avatar=keine_url')
        expect(response.status).toBe(406)
        expect(response.text).toContain('Fehler - Avatar_URL ungültig.')
    })

    it('Ungültige Methode beim Skill-Update', async () => {
        const response = await request(app).post('/profile/1/skill?method=unknown')
        expect(response.status).toBe(407)
        expect(response.text).toContain('Fehler - Ungültige Methodeneingabe')
    })

    it('Skill ändern ohne Login-Session', async () => {
        const response = await request(app).post('/profile/1/skill?method=post&skill=JS')
        expect(response.status).toBe(302)
        expect(response.text).toContain('Nicht eingeloggt')
    })
})