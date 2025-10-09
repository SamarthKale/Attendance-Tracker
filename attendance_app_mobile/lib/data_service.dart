
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import 'home_screen.dart';

class DataService {
  static const _lastLoggedInUserKey = 'lastLoggedInUser';

  // --- User Session ---
  static Future<void> setLastLoggedInUser(String rollNumber) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_lastLoggedInUserKey, rollNumber);
  }

  static Future<String?> getLastLoggedInUser() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_lastLoggedInUserKey);
  }

  static Future<void> clearLastLoggedInUser() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_lastLoggedInUserKey);
  }

  // --- User-specific Data ---

  // Generates a key for a user's subjects based on their roll number
  static String _subjectsKey(String rollNumber) => 'subjects_$rollNumber';
  // Generates a key for a user's name based on their roll number
  static String _studentNameKey(String rollNumber) => 'studentName_$rollNumber';

  // Save the list of subjects for a specific user
  static Future<void> saveSubjects(String rollNumber, List<Subject> subjects) async {
    final prefs = await SharedPreferences.getInstance();
    final subjectsJson = subjects.map((subject) => json.encode(subject.toJson())).toList();
    await prefs.setStringList(_subjectsKey(rollNumber), subjectsJson);
  }

  // Load the list of subjects for a specific user
  static Future<List<Subject>> loadSubjects(String rollNumber) async {
    final prefs = await SharedPreferences.getInstance();
    final subjectsJson = prefs.getStringList(_subjectsKey(rollNumber));
    if (subjectsJson == null) {
      return [];
    }
    return subjectsJson.map((jsonString) {
      final subjectMap = json.decode(jsonString);
      return Subject.fromJson(subjectMap);
    }).toList();
  }

  // Save student's info for a specific user
  static Future<void> saveStudentInfo(String name, String rollNumber) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_studentNameKey(rollNumber), name);
  }

  // Load student's name for a specific user
  static Future<String?> loadStudentName(String rollNumber) async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_studentNameKey(rollNumber));
  }
}
