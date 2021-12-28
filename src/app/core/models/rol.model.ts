export class Rol {
    id: number;
    name: string;
    description: string;
    modules: any[];
    constructor(){
        this.name=null;
        this.description=null;
        this.modules=[]
    }
}