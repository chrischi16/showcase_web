import { beforeEach, describe, it, expect } from "vitest"
import { UserController } from "../../../src/server/controller/userController";
import { jsonManager } from "../../../src/server/database/jsonManager";

let testUsers: any[];
let testUserController: UserController;
let comparatorUserController: UserController;

describe("Login", () => {

    beforeEach(async () => {
        testUsers = await jsonManager.readJSONFile("./tests/data/users.json");
        testUserController = new UserController(testUsers);
    })
    it("Korrekte Ausführung, Anmeldung ist erfolgreich", async () => {
        await expect(testUserController.login("Grinse Greta", "fhwedel")).resolves.toBe(3);
    })

    it("Falsche Eingabe bzw. User nicht vorhanden", async () => {
        await expect(testUserController.login("Grinse Greta", "Halloween")).resolves.toBeNull();
    })

    it("Kein Username", async () => {
        await expect(testUserController.login("", "fhwedel")).resolves.toBeNull();
    })
})

describe("FindOneUserByID", () => {

    beforeEach(async () => {

        testUsers = await jsonManager.readJSONFile("./tests/data/users.json");
        testUserController = new UserController(testUsers);
    })

    it("User wird gefunden", async () => {
        let resUser = await testUserController.findOneUserById(3);
        expect(resUser).not.toBeNull();
        expect(resUser?.author).toBe("Grinse Greta");
    })

    it("User nicht vorhanden", async () => {
        await expect(testUserController.findOneUserById(111)).resolves.toBeNull();
    })
})

describe("UpdateUser", () => {

    beforeEach(async () => {
        testUsers = await jsonManager.readJSONFile("./tests/data/users.json");
        testUserController = new UserController(testUsers);
        comparatorUserController = new UserController(JSON.parse(JSON.stringify(testUsers)));
    })

    it("Der User in der Datenbank wurde erfolgreich aktualisiert mit den übergebenen Daten", async () => {
        await testUserController.updateUser(3, "Nicht Grinse Greta", "Celia", "Pidwell", new URL("https://robohash.org/etassumendaomnis.png?size=200x200&set=set1"))
        const comparableUser = await comparatorUserController.findOneUserById(3);
        const resUser = await testUserController.findOneUserById(3);
        expect(resUser).not.toStrictEqual(comparableUser);
        expect(resUser?.author).toBe("Nicht Grinse Greta");
    })

    it("Fehlerhafte Angaben in den übergabe Parametern", async () => {
        await expect(testUserController.updateUser(99, "Hans", "Peter", "Sigfried", 
            new URL("https://robohash.org/etassumendaomnis.png?size=200x200&set=set1"))).resolves.toBe(false);
    })

    it("UpdateUser mit leerem Author", async () => {
        await expect(testUserController.updateUser(3, "", "Celia", "Pidwell", new URL("https://robohash.org/etassumendaomnis.png?size=200x200&set=set1"))).resolves.toBe(false);
    })
})

describe("UpdateSkill", () => {
    beforeEach(async () => {
        testUsers = await jsonManager.readJSONFile("./tests/data/users.json");
        testUserController = new UserController(testUsers);
        comparatorUserController = new UserController(JSON.parse(JSON.stringify(testUsers)));
    })

    it("Die Skills des Users in der Datenbank wurde erfolgreich aktualisiert mit den übergebenen Daten", async () => {
        await testUserController.updateSkill(3, "TPD", "LCD");
        const comparableUser = await comparatorUserController.findOneUserById(3);
        const resUser = await testUserController.findOneUserById(3);
        expect(resUser).not.toStrictEqual(comparableUser);
        expect(resUser?.skills).toContain("LCD");
        expect(resUser?.skills).not.toContain("TPD");
    });

    it("Fehlerhafte Angaben in den übergabe Parametern", async () => {
        await expect(testUserController.updateSkill(999, "Bowling", "Golfing")).resolves.toBe(false);
    })

    it("UpdateSkill mit nicht vorhandenem Skill", async () => {
        await expect(testUserController.updateSkill(3, "NichtVorhanden", "Golfing")).resolves.toBe(false);
    })
})

describe("DeleteSkill", () => {
    beforeEach(async () => {
        testUsers = await jsonManager.readJSONFile("./tests/data/users.json");
        testUserController = new UserController(testUsers);
        comparatorUserController = new UserController(JSON.parse(JSON.stringify(testUsers)));
    })

    it("Der User in der Datenbank wurde erfolgreich aktualisiert mit den übergebenen Daten", async () => {
        await testUserController.deleteSkill(3, "TPD");
        const comparableUser = await comparatorUserController.findOneUserById(3);
        const resUser = await testUserController.findOneUserById(3);
        expect(resUser).not.toStrictEqual(comparableUser);
        expect(resUser?.skills).not.toContain("TPD");
    })

    it("Leere Eingabe bzw. Parameter übergeben", async () => {
        await expect(testUserController.deleteSkill(999, "Bowling")).resolves.toBe(false);
    })

    it("Skill existiert nicht beim User", async () => {
        await expect(testUserController.deleteSkill(3, "NichtVorhanden")).resolves.toBe(false);
    })
})

describe("AddSkill", () => {
    beforeEach(async () => {
        testUsers = await jsonManager.readJSONFile("./tests/data/users.json");
        testUserController = new UserController(testUsers);
        comparatorUserController = new UserController(JSON.parse(JSON.stringify(testUsers)));
    })

    it("Der User hat nun einen Skill hinzugefügt bekommen", async () => {
        await testUserController.addSkill(3, "Office");
        const resUser = await testUserController.findOneUserById(3);
        expect(resUser?.skills).toContain("Office");
    })

    it("Leere Parameter bzw. Eingabe", async () => {
        await expect(testUserController.addSkill(999, "Bowling")).resolves.toBe(false);
    })

    it("Skill wird doppelt hinzugefügt", async () => {
        await testUserController.addSkill(3, "Office");
        await testUserController.addSkill(3, "Office");
        const resUser = await testUserController.findOneUserById(3);
        const count = resUser?.skills.filter((s: string) => s === "Office").length;
        expect(count).toBe(2);
    })
})