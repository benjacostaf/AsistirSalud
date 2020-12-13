export class User{
    constructor(
        public id: number,
        public id_user_login: number,
        public role: number,
        public surname: string,
        public name: string,
        public address: string,
        public location: string,
        public email: string,
        public phone: number
    ) {}
}