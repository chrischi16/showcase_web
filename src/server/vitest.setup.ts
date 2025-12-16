import { beforeAll, vi } from 'vitest'
// Importiert das Modul, dessen Funktionen wir später mocken möchten
import * as jsonManagerModule from '../../src/server/database/jsonManager'


// Holt sich eine *nicht gemockte*, originale Version der echten Funktion `readBlogposts`
// Das ist nötig, da wir gleich die "offizielle" Funktion mocken, aber weiterhin 
// einmalig auf das echte Verhalten zugreifen wollen (für das initiale Laden).
const {
    jsonManager: realJsonManager
} = await vi.importActual<typeof jsonManagerModule>('../../src/server/database/jsonManager')

// Hier wird ein Cache für die Blogposts vorbereitet.
// Er enthält entweder:
// - null (noch kein Cache vorhanden) oder
// - die geladenen Blogposts (Typ: was auch immer `readBlogposts()` zurückgibt)
let cachedBlogposts:
    | Awaited<ReturnType<typeof jsonManagerModule.jsonManager.readJSONFile>>
    | null = null
    
// beforeAll wird ausgeführt, bevor alle Tests starten
beforeAll(() => {
    // Wir ersetzen die Funktion `readBlogposts` durch eine eigene Implementierung.
    //   Die neue Funktion liest beim ersten Aufruf die echten Daten aus der Datei
    //   und speichert sie im Arbeitsspeicher (RAM). Danach werden nur noch diese verwendet.
    vi.spyOn(jsonManagerModule.jsonManager, 'readJSONFile').mockImplementation(async (path) => {
        if (cachedBlogposts !== null) {
            return cachedBlogposts
        }

        // Falls noch nicht im RAM, rufe die echte Funktion auf
        cachedBlogposts = await realJsonManager.readJSONFile(path)
        return cachedBlogposts
    })

    // Auch `writeBlogposts` wird ersetzt:
    //   Statt die Daten in eine Datei zu schreiben, speichern wir sie nur im RAM.
    //   Das macht die Tests schneller und verhindert unerwünschte Dateiänderungen.
    vi.spyOn(jsonManagerModule.jsonManager, 'saveJSONFile').mockImplementation(
        async (blogposts, path) => {
            cachedBlogposts = blogposts
        }
    )
})