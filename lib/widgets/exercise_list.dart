import 'package:flutter/material.dart';
import '../models/exercise.dart';

class ExerciseList extends StatelessWidget {
  final List<Exercise> exercises;
  final Function(int) onEdit;

  const ExerciseList({
    super.key,
    required this.exercises,
    required this.onEdit,
  });

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      itemCount: exercises.length,
      itemBuilder: (context, index) {
        final exercise = exercises[index];
        return Card(
          margin: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
          child: ListTile(
            title: Text(exercise.name),
            subtitle: Text(
              'Sets: ${exercise.series} | Reps: ${exercise.reps} | Rest: ${exercise.pause}s | Weight: ${exercise.weight}kg',
            ),
            trailing: IconButton(
              icon: const Icon(Icons.edit),
              onPressed: () => onEdit(index),
            ),
          ),
        );
      },
    );
  }
}