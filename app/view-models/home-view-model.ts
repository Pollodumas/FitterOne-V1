import { Observable, ObservableArray } from '@nativescript/core';
import { Exercise } from '../models/exercise';

export class HomeViewModel extends Observable {
    private _selectedDay: string = 'Monday';
    private _weeklyExercises: { [key: string]: ObservableArray<Exercise> } = {
        'Monday': new ObservableArray([
            new Exercise('Neutral Grip Pulldown', 2, '10-12', '60'),
            new Exercise('Strict Chin-up', 1, '4', '90')
        ]),
        'Tuesday': new ObservableArray([]),
        'Wednesday': new ObservableArray([]),
        'Thursday': new ObservableArray([]),
        'Friday': new ObservableArray([]),
        'Saturday': new ObservableArray([]),
        'Sunday': new ObservableArray([])
    };
    private _completedDays: Array<any> = [];

    get selectedDay(): string {
        return this._selectedDay;
    }

    set selectedDay(value: string) {
        if (this._selectedDay !== value) {
            this._selectedDay = value;
            this.notifyPropertyChange('selectedDay', value);
            this.notifyPropertyChange('currentExercises', this.currentExercises);
        }
    }

    get currentExercises(): ObservableArray<Exercise> {
        return this._weeklyExercises[this._selectedDay];
    }

    get days(): string[] {
        return Object.keys(this._weeklyExercises);
    }

    addExercise(exercise: Exercise): void {
        this._weeklyExercises[this._selectedDay].push(exercise);
    }

    editExercise(index: number, exercise: Exercise): void {
        this._weeklyExercises[this._selectedDay].setItem(index, exercise);
    }

    saveDay(): boolean {
        if (this.currentExercises.length === 0) return false;
        
        const alreadySaved = this._completedDays.some(day => day.day === this._selectedDay);
        if (alreadySaved) return false;

        this._completedDays.push({
            day: this._selectedDay,
            datetime: new Date().toISOString(),
            exercises: this.currentExercises.map(e => e.toJSON())
        });

        this.currentExercises.forEach(exercise => exercise.weight = 0);
        return true;
    }
}