
import 'package:flutter/material.dart';
import 'login_screen.dart';
import 'data_service.dart';
import 'dart:convert';

// Data model for a Subject
class Subject {
  String name;
  int attendedHours;
  int totalHours;

  Subject({required this.name, this.attendedHours = 0, this.totalHours = 0});

  // Convert a Subject object into a map
  Map<String, dynamic> toJson() => {
        'name': name,
        'attendedHours': attendedHours,
        'totalHours': totalHours,
      };

  // Create a Subject object from a map
  factory Subject.fromJson(Map<String, dynamic> json) {
    return Subject(
      name: json['name'],
      attendedHours: json['attendedHours'],
      totalHours: json['totalHours'],
    );
  }
}

class HomeScreen extends StatefulWidget {
  final String studentName;
  final String rollNumber;

  HomeScreen({required this.studentName, required this.rollNumber});

  @override
  _HomeScreenState createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  List<Subject> _subjects = [];
  final _subjectNameController = TextEditingController();

  int _overallAttendedHours = 0;
  int _overallTotalHours = 0;
  double _overallPercentage = 0.0;

  @override
  void initState() {
    super.initState();
    _loadSubjects();
  }

  Future<void> _loadSubjects() async {
    final subjects = await DataService.loadSubjects(widget.rollNumber);
    setState(() {
      _subjects = subjects;
      _calculateOverallSummary();
    });
  }

  Future<void> _saveSubjects() async {
    await DataService.saveSubjects(widget.rollNumber, _subjects);
  }

  void _calculateOverallSummary() {
    int totalAttended = 0;
    int total = 0;
    for (var subject in _subjects) {
      totalAttended += subject.attendedHours;
      total += subject.totalHours;
    }

    setState(() {
      _overallAttendedHours = totalAttended;
      _overallTotalHours = total;
      _overallPercentage = total > 0 ? (totalAttended / total) : 0.0;
    });
  }

  void _showAddSubjectDialog() {
    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: Text('Add New Subject'),
          content: TextField(
            controller: _subjectNameController,
            decoration: InputDecoration(hintText: "Enter subject name"),
          ),
          actions: <Widget>[
            TextButton(
              child: Text('Cancel'),
              onPressed: () {
                Navigator.of(context).pop();
              },
            ),
            TextButton(
              child: Text('Add'),
              onPressed: () {
                if (_subjectNameController.text.isNotEmpty) {
                  setState(() {
                    _subjects.add(Subject(name: _subjectNameController.text));
                    _calculateOverallSummary();
                    _saveSubjects();
                  });
                  _subjectNameController.clear();
                  Navigator.of(context).pop();
                }
              },
            ),
          ],
        );
      },
    );
  }

  void _showEditAttendanceDialog(Subject subject) {
    final _attendedHoursController =
        TextEditingController(text: subject.attendedHours.toString());
    final _totalHoursController =
        TextEditingController(text: subject.totalHours.toString());

    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: Text('Edit Attendance'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: <Widget>[
              TextField(
                controller: _attendedHoursController,
                decoration: InputDecoration(labelText: 'Attended Hours'),
                keyboardType: TextInputType.number,
              ),
              TextField(
                controller: _totalHoursController,
                decoration: InputDecoration(labelText: 'Total Hours'),
                keyboardType: TextInputType.number,
              ),
            ],
          ),
          actions: <Widget>[
            TextButton(
              child: Text('Cancel'),
              onPressed: () {
                Navigator.of(context).pop();
              },
            ),
            TextButton(
              child: Text('Save'),
              onPressed: () {
                setState(() {
                  subject.attendedHours =
                      int.tryParse(_attendedHoursController.text) ??
                          subject.attendedHours;
                  subject.totalHours =
                      int.tryParse(_totalHoursController.text) ??
                          subject.totalHours;
                  _calculateOverallSummary();
                  _saveSubjects();
                });
                Navigator.of(context).pop();
              },
            ),
          ],
        );
      },
    );
  }

  void _deleteSubject(Subject subject) {
    setState(() {
      _subjects.remove(subject);
      _calculateOverallSummary();
      _saveSubjects();
    });
  }

  void _showDeleteConfirmationDialog(Subject subject) {
    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: Text('Delete Subject'),
          content: Text('Are you sure you want to delete ${subject.name}?'),
          actions: <Widget>[
            TextButton(
              child: Text('Cancel'),
              onPressed: () {
                Navigator.of(context).pop();
              },
            ),
            TextButton(
              child: Text('Delete'),
              onPressed: () {
                _deleteSubject(subject);
                Navigator.of(context).pop();
              },
            ),
          ],
        );
      },
    );
  }

  void _logout() async {
    await DataService.clearLastLoggedInUser();
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(builder: (context) => LoginScreen()),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Attendance Tracker'),
        actions: [
          IconButton(
            icon: Icon(Icons.logout),
            onPressed: _logout,
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: <Widget>[
            // Student Info Card
            Card(
              elevation: 4.0,
              child: Padding(
                padding: const EdgeInsets.all(20.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Name: ${widget.studentName}',
                      style:
                          TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                    ),
                    SizedBox(height: 10),
                    Text(
                      'Roll Number: ${widget.rollNumber}',
                      style: TextStyle(fontSize: 16),
                    ),
                  ],
                ),
              ),
            ),
            SizedBox(height: 20),
            // Overall Summary Card
            Card(
              elevation: 4.0,
              child: Padding(
                padding: const EdgeInsets.all(20.0),
                child: Column(
                  children: [
                    Text(
                      'Overall Attendance',
                      style:
                          TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                    ),
                    SizedBox(height: 20),
                    LinearProgressIndicator(
                      value: _overallPercentage,
                      minHeight: 10,
                    ),
                    SizedBox(height: 10),
                    Text(
                        '${(_overallPercentage * 100).toStringAsFixed(0)}%'),
                    SizedBox(height: 10),
                    Text(
                        'Hours: $_overallAttendedHours / $_overallTotalHours'),
                  ],
                ),
              ),
            ),
            SizedBox(height: 30),
            Text(
              'Subjects',
              style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
            ),
            _subjects.isEmpty
                ? Padding(
                    padding: const EdgeInsets.all(20.0),
                    child: Center(child: Text('No subjects added yet.')),
                  )
                : ListView.builder(
                    shrinkWrap: true,
                    physics: NeverScrollableScrollPhysics(),
                    itemCount: _subjects.length,
                    itemBuilder: (context, index) {
                      final subject = _subjects[index];
                      double percentage = subject.totalHours > 0
                          ? (subject.attendedHours / subject.totalHours)
                          : 0;
                      return Card(
                        elevation: 2.0,
                        margin: EdgeInsets.symmetric(vertical: 10.0),
                        child: ListTile(
                          title: Text(subject.name),
                          subtitle: Text(
                              'Attended: ${subject.attendedHours} / ${subject.totalHours} hours'),
                          trailing: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: <Widget>[
                              Text(
                                  '${(percentage * 100).toStringAsFixed(0)}%'),
                              IconButton(
                                icon: Icon(Icons.edit),
                                onPressed: () =>
                                    _showEditAttendanceDialog(subject),
                              ),
                              IconButton(
                                icon: Icon(Icons.delete),
                                onPressed: () =>
                                    _showDeleteConfirmationDialog(subject),
                              ),
                            ],
                          ),
                        ),
                      );
                    },
                  ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: _showAddSubjectDialog,
        child: Icon(Icons.add),
        tooltip: 'Add Subject',
      ),
    );
  }
}
