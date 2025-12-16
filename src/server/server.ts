/** Startet den Express-Server */
import dotenv from 'dotenv'

dotenv.config({
    path: ['.env', `.env.${process.env.NODE_ENV}`], // mehrere Konfigurationsdateien einlesen
    override: true // mehrfach vorkommende Konfigurationen sollen durch die letztgenannte überschrieben werden
});

import { join } from 'path' // Zusammenstellen von Pfaden (Achtung: Windows- und Unix-Systeme nutzen unterschiedliche Pfad-Schrägstriche)
import { readFile } from 'fs/promises' // Öffnen und Lesen von Dateien
import { createApp, AppOptions } from 'src/server/app' // Express server erstellen

if (!process.env.PATH_TO_DATA) {
    throw new Error('PATH_TO_DATA is not defined in .env file')
}
if (!process.env.DATAFILE_GLOBALS) {
    throw new Error('DATAFILE_GLOBALS is not defined in .env file')
}
const pathToData = join(process.cwd(), process.env.PATH_TO_DATA)
const pathToGlobals = join(pathToData, process.env.DATAFILE_GLOBALS)

// Datenstruktur für die globals.json
type Globals = {
  title: string
}
let globals: Globals = {
    title: ''
}

export const readGlobals = async (): Promise<Globals> => {
    try {
        const raw = await readFile(pathToGlobals, 'utf-8')
        globals = JSON.parse(raw) as Globals
    } catch { /* nothing to do */ }

    return globals
}

const appOptions: AppOptions = {
    logging: true
};

const app = createApp(appOptions)