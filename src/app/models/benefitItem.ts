export class BenefitItem{
    constructor(
        public id_benefit:number,
        public id_lender:number,
        public requirements:string,
        public indications:string,
        public hours:number,
        public status: number,
        public id?:number,
    ){}
}