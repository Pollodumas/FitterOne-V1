import { prompt } from '@nativescript/core/ui/dialogs';
import { Exercise } from '../models/exercise';

export async function showExerciseDialog(exercise?: Exercise): Promise<Exercise | null> {
    try {
        const result = await prompt({
            title: exercise ? 'Edit Exercise' : 'Add Exercise',
            message: 'Enter exercise details',
            okButtonText: 'Save',
            cancelButtonText: 'Cancel',
            defaultText: exercise?.name || '',
            inputType: 'text',
            textFieldProperties: {
                hint: 'Exercise name'
            }
        });

        if (result.result) {
            const name = result.text.trim();
            if (name) {
                return new Exercise(
                    name,
                    exercise?.series || 1,
                    exercise?.reps || '10',
                    exercise?.pause || '60',
                    exercise?.weight || 0
                );
            }
        }
    } catch (error) {
        console.error('Error in exercise dialog:', error);
    }
    
    return null;
}