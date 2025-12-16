/**
 * Ein Blogkommentar als Typ
 */
export type BlogComment = {
    blogpostId: number;
    author: string;
    author_id: number;
    votes: number;
    text: string;
}

/**
 * Ein Blogpost als Typ
 */
export type Blogpost = {
    id: number;
    meta: {
        author: string;
        authorID: number;
        date: string;
    };
    title: string;
    body: {
        subtitle: string;
        text: string;
        image: string;
        layout: string;
    }[]
    comments: BlogComment[];
};
/**
 * Das Layout eines Blogposts
 */
export type BlogpostLayout = {
    showAuthor: boolean;
    showDate: boolean;
    showComments: boolean;
    theme: "light" | "dark" | "modern" | "classic";
}

/**
 * Ein Nutzertyp
 */
export type User = {
    id: number;
    author: string;
    firstname: string;
    lastname: string;
    avatar: URL;
    skills: string[];
    passwordHash: string;
};
