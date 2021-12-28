export class User {
    id: number;
    name: string;
    email: string;
    password:string;
    password_confirmation: string;
    rol:any;
    constructor(){
        this.name=null;
        this.email=null;
        this.password=null;
        this.password_confirmation=null;
        this.rol=null;
    }
}