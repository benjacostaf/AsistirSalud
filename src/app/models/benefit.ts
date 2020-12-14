export class Benefit{
    constructor(
        public id_patient: number,
        public diagnosis: string,
        public start_at: string,
        public finish_at: string,
        public status: number,
        public id?: number
    ){}
}
