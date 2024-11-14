import 'package:flutter/material.dart';
import '../models/exercise.dart';

class ExerciseDialog extends StatefulWidget {
  final Exercise? exercise;
  final Function(Exercise) onSave;

  const ExerciseDialog({
    super.key,
    this.exercise,
    required this.onSave,
  });

  @override
  _ExerciseDialogState createState() => _ExerciseDialogState();
}

class _ExerciseDialogState extends State<ExerciseDialog> {
  late TextEditingController _nameController;
  late TextEditingController _seriesController;
  late TextEditingController _repsController;
  late TextEditingController _pauseController;
  late TextEditingController _weightController;

  @override
  void initState() {
    super.initState();
    _nameController = TextEditingController(text: widget.exercise?.name ?? '');
    _seriesController = TextEditingController(text: widget.exercise?.series.toString() ?? '1');
    _repsController = TextEditingController(text: widget.exercise?.reps ?? '');
    _pauseController = TextEditingController(text: widget.exercise?.pause ?? '');
    _weightController = TextEditingController(text: widget.exercise?.weight.toString() ?? '0');
  }

  @override
  void dispose() {
    _nameController.dispose();
    _seriesController.dispose();
    _repsController.dispose();
    _pauseController.dispose();
    _weightController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: Text(widget.exercise == null ? 'Add Exercise' : 'Edit Exercise'),
      content: SingleChildScrollView(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              controller: _nameController,
              decoration: const InputDecoration(labelText: 'Exercise name'),
            ),
            TextField(
              controller: _seriesController,
              decoration: const InputDecoration(labelText: 'Sets (must be greater than 0)'),
              keyboardType: TextInputType.number,
            ),
            TextField(
              controller: _repsController,
              decoration: const InputDecoration(labelText: 'Reps'),
            ),
            TextField(
              controller: _pauseController,
              decoration: const InputDecoration(labelText: 'Rest (seconds)'),
              keyboardType: TextInputType.number,
            ),
            TextField(
              controller: _weightController,
              decoration: const InputDecoration(labelText: 'Weight'),
              keyboardType: TextInputType.number,
            ),
          ],
        ),
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.of(context).pop(),
          child: const Text('Cancel'),
        ),
        TextButton(
          onPressed: () {
            final name = _nameController.text;
            final series = int.tryParse(_seriesController.text) ?? 1;
            
            if (name.isEmpty || series <= 0) {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Exercise name cannot be empty and sets must be greater than 0'),
                ),
              );
              return;
            }

            final exercise = Exercise(
              name: name,
              series: series,
              reps: _repsController.text,
              pause: _pauseController.text,
              weight: double.tryParse(_weightController.text) ?? 0,
            );

            widget.onSave(exercise);
            Navigator.of(context).pop();
          },
          child: Text(widget.exercise == null ? 'Add' : 'Save'),
        ),
      ],
    );
  }
}