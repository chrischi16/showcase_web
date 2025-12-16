/**
 * types/ -> erweitert globale TypeScript-Typendefinitionen
 * 
 * express-session.d.ts -> hier: Typendefinition für Session-Daten
 */

// Datei: src/server/types/express-session.d.ts
import 'express-session';

declare module 'express-session' {
    interface SessionData {
        name?: any;
        userId?: any;
        blogTitle?: any;
    }
}