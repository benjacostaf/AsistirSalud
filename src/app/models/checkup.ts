export class Checkup{
    constructor(
        public id_benefit:number,
        public id_lender: number,
        public description: string,
        public time_at: string,
        public geo_lat: string,
        public geo_long: string,
        public id?:number
    ){}
}