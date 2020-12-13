export class Patient{
    constructor(
        public id: number,
        public surname: string,
        public name:string,
        public dni:number,
        public health_insurance:number,
        public number_health_insurance:number,
        public address:string,
        public location:string,
        public years:number,
        public email:string,
        public phone:number,
        public status:number
    ) {}
}