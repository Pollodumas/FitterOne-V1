import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../models/exercise.dart';
import '../widgets/exercise_dialog.dart';
import '../widgets/exercise_list.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  _HomePageState createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  final Map<String, List<Exercise>> _weeklyExercises = {
    'Monday': [
      Exercise(
        name: 'Neutral Grip Pulldown',
        series: 2,
        reps: '10-12',
        pause: '60',
      ),
      Exercise(
        name: 'Strict Chin-up',
        series: 1,
        reps: '4',
        pause: '90',
      ),
    ],
    'Tuesday': [],
    'Wednesday': [],
    'Thursday': [],
    'Friday': [],
    'Saturday': [],
    'Sunday': [],
  };

  String _selectedDay = 'Monday';
  final List<Map<String, dynamic>> _completedDays = [];

  void _addExercise(Exercise exercise) {
    setState(() {
      _weeklyExercises[_selectedDay]?.add(exercise);
    });
  }

  void _editExercise(int index, Exercise exercise) {
    setState(() {
      _weeklyExercises[_selectedDay]![index] = exercise;
    });
  }

  void _saveDay() {
    if (_weeklyExercises[_selectedDay]?.isNotEmpty ?? false) {
      bool alreadySaved = _completedDays.any((day) => day['day'] == _selectedDay);
      if (!alreadySaved) {
        setState(() {
          String now = DateFormat('yyyy-MM-dd – kk:mm').format(DateTime.now());
          _completedDays.add({
            'day': _selectedDay,
            'datetime': now,
            'exercises': _weeklyExercises[_selectedDay]!.map((e) => e.toMap()).toList(),
          });
          for (var exercise in _weeklyExercises[_selectedDay]!) {
            exercise.weight = 0;
          }
        });
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('This day has already been saved.')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('CutiFit'),
        actions: [
          IconButton(
            icon: const Icon(Icons.save),
            onPressed: _saveDay,
          ),
        ],
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: DropdownButton<String>(
              value: _selectedDay,
              isExpanded: true,
              items: _weeklyExercises.keys.map((String day) {
                return DropdownMenuItem<String>(
                  value: day,
                  child: Text(day),
                );
              }).toList(),
              onChanged: (String? newValue) {
                setState(() {
                  _selectedDay = newValue!;
                });
              },
            ),
          ),
          Expanded(
            child: ExerciseList(
              exercises: _weeklyExercises[_selectedDay]!,
              onEdit: (index) => _showExerciseDialog(index: index),
            ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => _showExerciseDialog(),
        child: const Icon(Icons.add),
      ),
    );
  }

  void _showExerciseDialog({int? index}) {
    showDialog(
      context: context,
      builder: (context) => ExerciseDialog(
        exercise: index != null ? _weeklyExercises[_selectedDay]![index] : null,
        onSave: (exercise) {
          if (index != null) {
            _editExercise(index, exercise);
          } else {
            _addExercise(exercise);
          }
        },
      ),
    );
  }
}