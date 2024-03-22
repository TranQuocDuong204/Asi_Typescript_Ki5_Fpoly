import { validate } from "class-validator";
import autobind from "autobind-decorator";
import { User } from "../model/User";
export class UserController {
    constructor(public element: HTMLElement) {
        const button = element.querySelector('#play');
        console.log("usercontroller constructor");
    
        button?.addEventListener('click', (event) => this.processPlayButtonClick(event));
    }
    @autobind
    processPlayButtonClick(event: Event) {
        event.preventDefault();

        console.log("event ...");

        const form = this.element.querySelector('form');
        const usernameElement = this.element.querySelector('#username') as HTMLInputElement;
        const helpId = this.element.querySelector('#UsernameHelpId');

        if(usernameElement) {
            let user: User = new User(usernameElement.value);
            validate(user).then(error => {
                if(error.length > 0) {
                    if(helpId) {
                        helpId.className = 'form-text text-muted visible'
                    }
                }else {
                    form?.submit();
                }
            })
        }
    }
}