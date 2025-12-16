import { User } from "@shared/types";
import crypto from 'crypto';

/**
* Steuerung für Blognutzer-Operationen
*/
export class UserController {
    /**
     * Eine Liste von Nutzern
     */
    users: User[]

    /**
     * Konstruktor
     * 
     * @param users übergebene Nutzer 
     */
    constructor(users: User[]) {
        this.users = users;
    }

    /**
     * Überprüft übergebenen Klartext-Username && Klartext-Password auf Übereinstimmigkeit
     * mit dem Nutzerobjekt
     * 
     * @param username Nutzername
     * @param password Nutzer-Passwort
     * @returns Nutzer-ID
     */
    async login(username: string, password: string): Promise<number | null> {
        const user = this.users.find(user => user.author === username)
        if (user && user.passwordHash === this.hashPassword(password)) {
            return user.id;
        };
        return null;
    }

    /**
     * Sucht einen einzelnen Nutzer anhand der ID
     * 
     * @param userId zu suchende Nutzer-ID
     * @returns der hinter der ID befindliche Nutzer
     */
    async findOneUserById(userId: number): Promise<User | null> {
        return this.users.find(user => user.id === userId) ?? null;
    }

    /**
     * Aktualisiert die Nutzerdaten eines Nutzers. Es können bearbeitet werden:
     * {Nutzer-ID, AuthorName, Vor-/Nachname, Nutzeravatar}
     * 
     * @param userId neue Nutzer-ID
     * @param author neuer Authorenbezeichnung
     * @param firstname neuer Vorname
     * @param lastname neuer Nachname
     * @param avatar neuer Avatar
     * @returns Erfolg der Operation
     */
    async updateUser(userId: number, author: string, firstname: string, lastname: string, avatar: URL): Promise<boolean> {
        let user = await this.findOneUserById(userId);
        if(user) {
            user.author = author;
            user.firstname = firstname;
            user.lastname = lastname;
            user.avatar = avatar;
        }
        return false;
    }

    /**
     * Ermöglicht es die Fähigkeiten/Kenntnisse eines Nutzers zu bearbeiten.
     * 
     * @param userId angesprochener Nutzer
     * @param oldSkill die angesprochene Fähigkeit
     * @param newSkill übergebender Eintrag zum Überschreiben der alten Fähigkeiten
     * @returns Erfolg der Operation
     */
    async updateSkill(userId: number, oldSkill: string, newSkill: string): Promise<boolean> {
        let user = await this.findOneUserById(userId);
        if(user) {
            const idx = user.skills.indexOf(oldSkill);
            if(idx === -1) return false;
            user.skills[idx] = newSkill;
        }
        return false;
    }

    /**
     * Löschen eines Nutzerskills
     * 
     * @param userId der betroffene Nutzer
     * @param skill der betroffene Skill
     * @returns Erfolg der Operation
     */
    async deleteSkill(userId: number, skill: string): Promise<boolean> {
        let user = await this.findOneUserById(userId);
        if(user) {
            const idx  = user.skills.indexOf(skill);
            if(idx === -1) return false;
            user.skills.splice(idx, 1);
            return true;
        }
        return false;
    }

    /**
     * Fügt dem Nutzer eine Fähigkeit/ Kompetenz hinzu.
     * 
     * @param userId der betroffene Nutzer
     * @param skill der betroffene Skill
     * @returns Erfolg der Operation
     */
    async addSkill(userId: number, skill: string): Promise<boolean> {
        let user = await this.findOneUserById(userId);
        if(user) {
            user.skills.push(skill);
            return true;
        }
        return false;
    }

    /**
     * Generiert ein ge-hash-tes Passwort
     * 
     * @param passwd zu konvertierendes Passwort
     * @returns ge-hash-tes Passwort
     */
    hashPassword(passwd: string): string {
        if(!process.env.AUTH_SALT) {
            throw new Error("AUTH_SALT is not defined in .env file");
        }

        const salt = process.env.AUTH_SALT;
        const iterations = 10000;
        const keylen = 64;
        const digest = 'sha512';

        return crypto.pbkdf2Sync(passwd, salt, iterations, keylen, digest).toString('hex');
    }

} 