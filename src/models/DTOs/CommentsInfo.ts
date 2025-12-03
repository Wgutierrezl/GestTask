import { CommentUpdateDTO } from "./CommentUpdateDTO";

export class CommentsInfo extends CommentUpdateDTO{
    estado!: string;
    fechaCreacion!: Date
}