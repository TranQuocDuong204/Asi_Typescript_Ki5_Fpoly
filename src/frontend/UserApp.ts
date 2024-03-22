import { UserController } from "./controller/UserController";

const appElement : HTMLElement = document.querySelector('#app') as HTMLElement;

console.log("Login form");

if(appElement) {
    let userController: UserController = new UserController(appElement);
}