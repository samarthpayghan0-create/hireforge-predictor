export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  category: string;
}

export const quizQuestions: QuizQuestion[] = [
  // Aptitude
  { id: 1, question: "If a train travels 360 km in 4 hours, what is its speed?", options: ["80 km/h", "90 km/h", "100 km/h", "70 km/h"], correctAnswer: 1, category: "Aptitude" },
  { id: 2, question: "What is 25% of 480?", options: ["100", "120", "140", "110"], correctAnswer: 1, category: "Aptitude" },
  { id: 3, question: "A man buys an item for ₹500 and sells for ₹600. What is the profit %?", options: ["10%", "15%", "20%", "25%"], correctAnswer: 2, category: "Aptitude" },
  // Programming
  { id: 4, question: "Which keyword is used to define a function in Python?", options: ["func", "def", "function", "define"], correctAnswer: 1, category: "Programming" },
  { id: 5, question: "What does 'DOM' stand for?", options: ["Data Object Model", "Document Object Model", "Digital Object Model", "Document Oriented Model"], correctAnswer: 1, category: "Programming" },
  { id: 6, question: "Which of the following is not a JavaScript data type?", options: ["Boolean", "String", "Float", "Symbol"], correctAnswer: 2, category: "Programming" },
  // Data Structures
  { id: 7, question: "What is the time complexity of binary search?", options: ["O(n)", "O(log n)", "O(n²)", "O(1)"], correctAnswer: 1, category: "Data Structures" },
  { id: 8, question: "Which data structure uses FIFO?", options: ["Stack", "Queue", "Tree", "Graph"], correctAnswer: 1, category: "Data Structures" },
  { id: 9, question: "A balanced BST with n nodes has height:", options: ["O(n)", "O(log n)", "O(n²)", "O(1)"], correctAnswer: 1, category: "Data Structures" },
  // DBMS
  { id: 10, question: "Which normal form removes transitive dependency?", options: ["1NF", "2NF", "3NF", "BCNF"], correctAnswer: 2, category: "DBMS" },
  { id: 11, question: "SQL stands for:", options: ["Structured Query Language", "Simple Query Language", "Standard Query Language", "System Query Language"], correctAnswer: 0, category: "DBMS" },
  { id: 12, question: "Which SQL command is used to remove a table?", options: ["DELETE", "REMOVE", "DROP", "TRUNCATE"], correctAnswer: 2, category: "DBMS" },
  // OS
  { id: 13, question: "Which scheduling algorithm may cause starvation?", options: ["FCFS", "SJF", "Round Robin", "FIFO"], correctAnswer: 1, category: "Operating Systems" },
  { id: 14, question: "What is a deadlock?", options: ["Process running too long", "Circular wait among processes", "CPU overheating", "Memory overflow"], correctAnswer: 1, category: "Operating Systems" },
  { id: 15, question: "Virtual memory uses:", options: ["RAM only", "Disk only", "RAM + Disk", "Cache"], correctAnswer: 2, category: "Operating Systems" },
];
