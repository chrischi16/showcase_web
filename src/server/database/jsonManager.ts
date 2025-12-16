import fs from 'node:fs';

/**
*   Verarbeitet JSON-Formate
*/
export const jsonManager = {
    /** 
    *   Dateipfad
    */
    dataPath: process.env.PATH_TO_DATA!,

    /**
     * Asynchronously writes a JSON string to a .json file
     *
     * @async
     * @param {Object} object the object that should be written to a file as JSON
     * @param {string} path the path of the file this json should be written to
     */
    saveJSONFile: (object: Object, path: string) => {
        fs.writeFile(path, JSON.stringify(object), err => {
            console.error("Could not write object to file", err);
        })
    },

    /**
     * Asynchronously reads the contents of a file and parses it into an object
     *
     * @async
     * @param {string} path the path to the file that should be read
     * @returns {Promise<T>} the object parsed from the file
     */
    readJSONFile: async <T>(path: string): Promise<T> => {
        const json = await fs.promises.readFile(path, 'utf-8')
            .catch(e => console.error("Could not read file", e));
        return JSON.parse(json ?? "") as T
    }
} as const;