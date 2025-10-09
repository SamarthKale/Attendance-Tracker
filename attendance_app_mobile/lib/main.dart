
import 'package:flutter/material.dart';
import 'login_screen.dart';
import 'home_screen.dart';
import 'data_service.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Check for the last logged-in user
  final rollNumber = await DataService.getLastLoggedInUser();
  String? studentName;

  if (rollNumber != null) {
    studentName = await DataService.loadStudentName(rollNumber);
  }

  runApp(MyApp(rollNumber: rollNumber, studentName: studentName));
}

class MyApp extends StatelessWidget {
  final String? rollNumber;
  final String? studentName;

  const MyApp({super.key, this.rollNumber, this.studentName});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Attendance Tracker',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: rollNumber != null && studentName != null
          ? HomeScreen(studentName: studentName!, rollNumber: rollNumber!)
          : LoginScreen(),
    );
  }
}
