class Exercise {
  String name;
  int series;
  String reps;
  String pause;
  double weight;

  Exercise({
    required this.name,
    required this.series,
    required this.reps,
    required this.pause,
    this.weight = 0,
  });

  Map<String, dynamic> toMap() {
    return {
      'name': name,
      'series': series,
      'reps': reps,
      'pause': pause,
      'weight': weight,
    };
  }

  factory Exercise.fromMap(Map<String, dynamic> map) {
    return Exercise(
      name: map['name'],
      series: map['series'],
      reps: map['reps'],
      pause: map['pause'],
      weight: map['weight'].toDouble(),
    );
  }
}