export class Exercise {
    constructor(
        public name: string,
        public series: number,
        public reps: string,
        public pause: string,
        public weight: number = 0
    ) {}

    toJSON() {
        return {
            name: this.name,
            series: this.series,
            reps: this.reps,
            pause: this.pause,
            weight: this.weight
        };
    }

    static fromJSON(json: any): Exercise {
        return new Exercise(
            json.name,
            json.series,
            json.reps,
            json.pause,
            json.weight
        );
    }
}