export class HealthInsurance{
    constructor(
        public name: string,
        public location: string,
        public email: string,
        public phone: number,
        public status: number,
        public id?:number
    ){}
}