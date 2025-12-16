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