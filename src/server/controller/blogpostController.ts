import { BlogComment, Blogpost } from "@shared/types";

const DEFAULT_MAX_AMOUNT = parseInt(process.env.DEFAULT_MAX_AMOUNT!)

/**
* Steuerung einzelner Posts in einem Blog
*/
export class BlogpostController {
    /**
     * Der Blogpost als Attribut
     */
    private post: Blogpost;

    /**
     * Konstruiert einen Blogpost.
     * 
     * @param post übergebener Post
     */
    constructor(post: Blogpost) {
        this.post = post;
    }

    /**
     * Holt sich die meist hochgewählten Kommentare
     * 
     * @param maxAmounts Anzahl an Kommentare die angezeigt werden sollen
     * @returns eine Folge an den hochgewähltesten Kommentaren
     */
    getPopularComments(maxAmounts: number = DEFAULT_MAX_AMOUNT): BlogComment[] {
        return this.post.comments
            .sort((a, b) => (b.votes ?? 0) - (a.votes ?? 0))
            .slice(0, maxAmounts);
    }

    /**
     * Erstellt ein Kommentar und legt ihn in den Blogpost.
     * 
     * @param comment der übergebende Kommentar
     */
    createComment(comment: BlogComment) {
        this.post.comments.push(comment);
    }

    /**
     * Wählt ein Kommentar hoch
     * 
     * @param commentIndex ID des hochzuwählenden Kommentars 
     */
    upvoteComment(commentIndex: number) {
        this.post.comments[commentIndex].votes++;
    }

    /**
     * Wählt ein Kommentar runter.
     * 
     * @param commentIndex ID des runterzuwählenden Kommentars 
     */
    downvoteComment(commentIndex: number) {
        this.post.comments[commentIndex].votes--;
    }
}