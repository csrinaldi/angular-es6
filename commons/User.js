class User{

    constructor(){
        this.name = null;
        this.lastName = null;
    }


    setName(name){
        this.name = name;
    }

    setLastname(lastName){
        this.lastName = lastName;
    }

    getName(){
        return this.name;
    }

    getLastname(){
        return this.lastName;
    }
}

export default User;
