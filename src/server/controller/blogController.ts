import { Blogpost } from "@shared/types"

const DEFAULT_MAX_AMOUNT = parseInt(process.env.DEFAULT_MAX_AMOUNT!)

/**
*   Steuerung des gesamten Blogs
*/
export class BlogController {
    /**
    *   Die Posts die in dem Blog enthalten sind
    */
    private posts: Blogpost[];

    /**
    *   Konstruiert einen gesamten Blog
    *
    *   @param posts - übergebende Blogposts zur weiteren Verarbeitung
    */
    constructor(posts: Blogpost[]) {
        this.posts = posts;
    }

    /** 
    *   Sucht nach Blogposts anhand einer übergebenen Seitennummer und Seitengröße
    *
    *   @param page - die Zielseite
    *   @param pageSize - die Größe der Seiten
    */
    getBlogpostsByPage(page: number, pageSize: number): Blogpost[] {
        const start = page * pageSize;
        return this.posts.slice(start, start + pageSize);
    }

    /**
    *   Holt sich eine bestimmte Anzahl an neuen/ aktuellen Blogposts
    *
    *   @param maxAmount - wieviele aktuelle Blogposts rückgegeben werden
    */
    getRecentBlogPosts(maxAmount: number = DEFAULT_MAX_AMOUNT): Blogpost[] {
        return this.posts.slice(0, maxAmount);
    }

    /**
    *   Sucht nach einen einzelnen Blogpost anhand einer ID
    *
    *   @param page - die zu suchende Blog-ID
    */
    findBlogPostById(id: number): Blogpost {
        const post = this.posts.find(post => post.id == id);
        if (!post) {
            throw new Error(`Blogpost with ID ${id} not found`);
        }
        return post;
    }

    /**
    *   Sucht nach mehreren Blogposts anhand der Author-ID
    *
    *   @param authorId - Author-ID
    */
    findManyBlogpostsByAuthorId(authorId: number): Blogpost[] {
        return this.posts.filter(post => post.meta.authorID === authorId)
    }

    /**
    *   Sucht nach mehreren Blogposts anhand derer Namen/ Titel
    *
    *   @param query - Titel der Posts
    */
    findManyBlogposts(query: string): Blogpost[] {
        query.toLowerCase();

        return this.posts.filter(post =>
            post.title.toLowerCase().includes(query) ||
            post.meta.author.toLowerCase().includes(query) ||
            post.body.map(val => val.text).join(" ").toLowerCase().includes(query) ||
            post.body.map(val => val.subtitle).join(" ").toLowerCase().includes(query)
        );
    }

}
