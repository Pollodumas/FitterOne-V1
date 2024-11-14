import { EventData, Page, NavigatedData } from '@nativescript/core';
import { HomeViewModel } from '../view-models/home-view-model';
import { Exercise } from '../models/exercise';
import { showExerciseDialog } from './exercise-dialog';

let viewModel: HomeViewModel;

export function onNavigatingTo(args: NavigatedData) {
    const page = <Page>args.object;
    viewModel = new HomeViewModel();
    page.bindingContext = viewModel;
}

export function onAddExercise(args: EventData) {
    showExerciseDialog().then((exercise: Exercise) => {
        if (exercise) {
            viewModel.addExercise(exercise);
        }
    });
}

export function onEditExercise(args: EventData) {
    const index = args.object.bindingContext.index;
    const exercise = viewModel.currentExercises.getItem(index);
    
    showExerciseDialog(exercise).then((updatedExercise: Exercise) => {
        if (updatedExercise) {
            viewModel.editExercise(index, updatedExercise);
        }
    });
}

export function onSaveDay() {
    const saved = viewModel.saveDay();
    if (!saved) {
        alert('This day has already been saved or has no exercises.');
    }
}