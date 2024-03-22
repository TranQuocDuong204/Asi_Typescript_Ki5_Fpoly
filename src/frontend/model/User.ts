import {IsNotEmpty, Length} from "class-validator";

export class User {
    @IsNotEmpty()
    @Length(3)
    username: string;
    constructor(username: string) {
        this.username = username;
    }
}

