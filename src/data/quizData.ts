export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  category: string;
  difficulty: "medium" | "hard";
}

export const quizQuestions: QuizQuestion[] = [
  // ============ APTITUDE - MEDIUM ============
  { id: 1, question: "A train 150m long passes a pole in 15 seconds. What is its speed in km/h?", options: ["36 km/h", "40 km/h", "30 km/h", "45 km/h"], correctAnswer: 0, category: "Aptitude", difficulty: "medium" },
  { id: 2, question: "What is 35% of 1200?", options: ["420", "380", "450", "400"], correctAnswer: 0, category: "Aptitude", difficulty: "medium" },
  { id: 3, question: "If a product is sold at 20% profit and its cost is ₹800, what is the selling price?", options: ["₹960", "₹900", "₹1000", "₹880"], correctAnswer: 0, category: "Aptitude", difficulty: "medium" },
  { id: 4, question: "A can do a work in 12 days, B in 18 days. Together they finish in?", options: ["7.2 days", "6 days", "8 days", "9 days"], correctAnswer: 0, category: "Aptitude", difficulty: "medium" },
  { id: 5, question: "The ratio of boys to girls is 3:5. If there are 120 girls, how many boys?", options: ["72", "60", "80", "90"], correctAnswer: 0, category: "Aptitude", difficulty: "medium" },
  { id: 6, question: "Simple interest on ₹5000 at 8% for 3 years is?", options: ["₹1200", "₹1000", "₹1500", "₹1100"], correctAnswer: 0, category: "Aptitude", difficulty: "medium" },
  { id: 7, question: "If the average of 5 numbers is 20, what is their sum?", options: ["100", "80", "120", "90"], correctAnswer: 0, category: "Aptitude", difficulty: "medium" },
  { id: 8, question: "A clock shows 3:15. What is the angle between hour and minute hand?", options: ["7.5°", "0°", "15°", "22.5°"], correctAnswer: 0, category: "Aptitude", difficulty: "medium" },
  { id: 9, question: "Two pipes can fill a tank in 10 and 15 hours. Together they fill it in?", options: ["6 hours", "5 hours", "8 hours", "7 hours"], correctAnswer: 0, category: "Aptitude", difficulty: "medium" },
  { id: 10, question: "What comes next: 2, 6, 12, 20, 30, ?", options: ["42", "40", "44", "38"], correctAnswer: 0, category: "Aptitude", difficulty: "medium" },
  { id: 11, question: "A car travels 240 km in 4 hours. How long to travel 360 km at the same speed?", options: ["6 hours", "5 hours", "7 hours", "8 hours"], correctAnswer: 0, category: "Aptitude", difficulty: "medium" },
  { id: 12, question: "If x + y = 10 and xy = 21, find x² + y².", options: ["58", "50", "62", "48"], correctAnswer: 0, category: "Aptitude", difficulty: "medium" },

  // ============ APTITUDE - HARD ============
  { id: 13, question: "A man rows upstream at 6 km/h and downstream at 10 km/h. What is the speed of the stream?", options: ["2 km/h", "3 km/h", "4 km/h", "1 km/h"], correctAnswer: 0, category: "Aptitude", difficulty: "hard" },
  { id: 14, question: "The compound interest on ₹10000 at 10% for 2 years compounded annually is?", options: ["₹2100", "₹2000", "₹2200", "₹1900"], correctAnswer: 0, category: "Aptitude", difficulty: "hard" },
  { id: 15, question: "In how many ways can 5 people sit around a circular table?", options: ["24", "120", "60", "12"], correctAnswer: 0, category: "Aptitude", difficulty: "hard" },
  { id: 16, question: "A and B invest in ratio 3:5. A invests for 8 months, B for 6 months. Profit sharing ratio?", options: ["4:5", "3:5", "8:10", "24:30"], correctAnswer: 0, category: "Aptitude", difficulty: "hard" },
  { id: 17, question: "A mixture of 40 litres has milk and water in 3:1. How much water to add for 2:1 ratio?", options: ["5 litres", "10 litres", "8 litres", "6 litres"], correctAnswer: 0, category: "Aptitude", difficulty: "hard" },
  { id: 18, question: "The probability of drawing 2 red balls from a bag of 5 red and 3 blue balls?", options: ["10/28", "5/14", "15/28", "5/28"], correctAnswer: 0, category: "Aptitude", difficulty: "hard" },
  { id: 19, question: "If log₂(x) + log₂(x-2) = 3, find x.", options: ["4", "2", "8", "6"], correctAnswer: 0, category: "Aptitude", difficulty: "hard" },
  { id: 20, question: "Three taps A, B, C can fill a tank in 12, 15, 20 hours. All open together, tank fills in?", options: ["5 hours", "6 hours", "4 hours", "7 hours"], correctAnswer: 0, category: "Aptitude", difficulty: "hard" },
  { id: 21, question: "A boat goes 30 km upstream and 44 km downstream in 10 hours. 40 km upstream and 55 km downstream in 13 hours. Speed of boat in still water?", options: ["8 km/h", "10 km/h", "6 km/h", "12 km/h"], correctAnswer: 0, category: "Aptitude", difficulty: "hard" },
  { id: 22, question: "How many 3-digit numbers are divisible by 7?", options: ["128", "127", "129", "130"], correctAnswer: 0, category: "Aptitude", difficulty: "hard" },

  // ============ PROGRAMMING - MEDIUM ============
  { id: 23, question: "Which keyword is used to define a function in Python?", options: ["def", "func", "function", "define"], correctAnswer: 0, category: "Programming", difficulty: "medium" },
  { id: 24, question: "What does DOM stand for?", options: ["Document Object Model", "Data Object Model", "Digital Object Model", "Document Oriented Model"], correctAnswer: 0, category: "Programming", difficulty: "medium" },
  { id: 25, question: "Which is NOT a JavaScript data type?", options: ["Float", "Boolean", "String", "Symbol"], correctAnswer: 0, category: "Programming", difficulty: "medium" },
  { id: 26, question: "What is the output of print(type([]))  in Python?", options: ["<class 'list'>", "<class 'tuple'>", "<class 'dict'>", "<class 'set'>"], correctAnswer: 0, category: "Programming", difficulty: "medium" },
  { id: 27, question: "Which HTTP method is used to update a resource?", options: ["PUT", "GET", "POST", "DELETE"], correctAnswer: 0, category: "Programming", difficulty: "medium" },
  { id: 28, question: "In Java, which keyword prevents a class from being inherited?", options: ["final", "static", "abstract", "private"], correctAnswer: 0, category: "Programming", difficulty: "medium" },
  { id: 29, question: "What does CSS stand for?", options: ["Cascading Style Sheets", "Creative Style Sheets", "Computer Style Sheets", "Colorful Style Sheets"], correctAnswer: 0, category: "Programming", difficulty: "medium" },
  { id: 30, question: "Which operator is used for strict equality in JavaScript?", options: ["===", "==", "!=", ">="], correctAnswer: 0, category: "Programming", difficulty: "medium" },
  { id: 31, question: "What is the default return type of main() in C?", options: ["int", "void", "float", "char"], correctAnswer: 0, category: "Programming", difficulty: "medium" },
  { id: 32, question: "Which Python library is used for data manipulation?", options: ["Pandas", "Matplotlib", "Flask", "Django"], correctAnswer: 0, category: "Programming", difficulty: "medium" },

  // ============ PROGRAMMING - HARD ============
  { id: 33, question: "What is the time complexity of Python's sort() method (Timsort)?", options: ["O(n log n)", "O(n²)", "O(n)", "O(log n)"], correctAnswer: 0, category: "Programming", difficulty: "hard" },
  { id: 34, question: "In JavaScript, what does 'event bubbling' mean?", options: ["Event propagates from child to parent", "Event propagates from parent to child", "Event stays at target", "Event is cancelled"], correctAnswer: 0, category: "Programming", difficulty: "hard" },
  { id: 35, question: "What is a closure in JavaScript?", options: ["Function with access to outer scope variables", "A class constructor", "A loop structure", "An error handler"], correctAnswer: 0, category: "Programming", difficulty: "hard" },
  { id: 36, question: "Which design pattern ensures only one instance of a class?", options: ["Singleton", "Factory", "Observer", "Strategy"], correctAnswer: 0, category: "Programming", difficulty: "hard" },
  { id: 37, question: "What is the GIL in Python?", options: ["Global Interpreter Lock", "General Input Lock", "Global Instance Loader", "General Interpreter Layer"], correctAnswer: 0, category: "Programming", difficulty: "hard" },
  { id: 38, question: "What is the difference between process and thread?", options: ["Process has own memory, thread shares memory", "Thread has own memory, process shares", "Both are same", "Process is faster"], correctAnswer: 0, category: "Programming", difficulty: "hard" },
  { id: 39, question: "In C++, what is RAII?", options: ["Resource Acquisition Is Initialization", "Run-time Allocation In Interface", "Rapid Application Integration", "Resource And Interface Integration"], correctAnswer: 0, category: "Programming", difficulty: "hard" },
  { id: 40, question: "What does SOLID's 'L' stand for?", options: ["Liskov Substitution Principle", "Loose Coupling", "Lazy Loading", "Linear Dependency"], correctAnswer: 0, category: "Programming", difficulty: "hard" },

  // ============ DATA STRUCTURES - MEDIUM ============
  { id: 41, question: "What is the time complexity of binary search?", options: ["O(log n)", "O(n)", "O(n²)", "O(1)"], correctAnswer: 0, category: "Data Structures", difficulty: "medium" },
  { id: 42, question: "Which data structure uses FIFO?", options: ["Queue", "Stack", "Tree", "Graph"], correctAnswer: 0, category: "Data Structures", difficulty: "medium" },
  { id: 43, question: "What is the worst-case time complexity of quicksort?", options: ["O(n²)", "O(n log n)", "O(n)", "O(log n)"], correctAnswer: 0, category: "Data Structures", difficulty: "medium" },
  { id: 44, question: "Which traversal of BST gives sorted order?", options: ["Inorder", "Preorder", "Postorder", "Level order"], correctAnswer: 0, category: "Data Structures", difficulty: "medium" },
  { id: 45, question: "A stack is used in which of the following?", options: ["Function call management", "BFS traversal", "Dijkstra's algorithm", "Level-order traversal"], correctAnswer: 0, category: "Data Structures", difficulty: "medium" },
  { id: 46, question: "What is the space complexity of merge sort?", options: ["O(n)", "O(1)", "O(log n)", "O(n²)"], correctAnswer: 0, category: "Data Structures", difficulty: "medium" },
  { id: 47, question: "Which data structure is best for implementing LRU cache?", options: ["HashMap + Doubly Linked List", "Array", "Stack", "Queue"], correctAnswer: 0, category: "Data Structures", difficulty: "medium" },
  { id: 48, question: "Maximum number of nodes in a binary tree of height h?", options: ["2^(h+1) - 1", "2^h", "2h+1", "h²"], correctAnswer: 0, category: "Data Structures", difficulty: "medium" },
  { id: 49, question: "Which sorting algorithm is stable?", options: ["Merge Sort", "Quick Sort", "Heap Sort", "Selection Sort"], correctAnswer: 0, category: "Data Structures", difficulty: "medium" },
  { id: 50, question: "Time complexity of inserting at the beginning of a linked list?", options: ["O(1)", "O(n)", "O(log n)", "O(n²)"], correctAnswer: 0, category: "Data Structures", difficulty: "medium" },

  // ============ DATA STRUCTURES - HARD ============
  { id: 51, question: "What is the amortized time complexity of dynamic array insertion?", options: ["O(1)", "O(n)", "O(log n)", "O(n²)"], correctAnswer: 0, category: "Data Structures", difficulty: "hard" },
  { id: 52, question: "In a Red-Black tree, what is the maximum height for n nodes?", options: ["2 log₂(n+1)", "log₂(n)", "n/2", "n"], correctAnswer: 0, category: "Data Structures", difficulty: "hard" },
  { id: 53, question: "Which data structure is used in Dijkstra's algorithm for optimal performance?", options: ["Min-Heap (Priority Queue)", "Stack", "Queue", "Linked List"], correctAnswer: 0, category: "Data Structures", difficulty: "hard" },
  { id: 54, question: "Time complexity of building a heap from an unsorted array?", options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"], correctAnswer: 0, category: "Data Structures", difficulty: "hard" },
  { id: 55, question: "What is the worst-case lookup time in a hash table?", options: ["O(n)", "O(1)", "O(log n)", "O(n²)"], correctAnswer: 0, category: "Data Structures", difficulty: "hard" },
  { id: 56, question: "Which algorithm detects a cycle in a linked list in O(1) space?", options: ["Floyd's Tortoise and Hare", "BFS", "DFS", "Kruskal's"], correctAnswer: 0, category: "Data Structures", difficulty: "hard" },
  { id: 57, question: "In AVL tree, what is the balance factor range?", options: ["-1 to 1", "0 to 2", "-2 to 2", "0 to 1"], correctAnswer: 0, category: "Data Structures", difficulty: "hard" },
  { id: 58, question: "What is a Trie used for?", options: ["Prefix-based string searching", "Sorting numbers", "Graph traversal", "Matrix operations"], correctAnswer: 0, category: "Data Structures", difficulty: "hard" },

  // ============ DBMS - MEDIUM ============
  { id: 59, question: "SQL stands for?", options: ["Structured Query Language", "Simple Query Language", "Standard Query Language", "System Query Language"], correctAnswer: 0, category: "DBMS", difficulty: "medium" },
  { id: 60, question: "Which SQL command removes a table entirely?", options: ["DROP", "DELETE", "TRUNCATE", "REMOVE"], correctAnswer: 0, category: "DBMS", difficulty: "medium" },
  { id: 61, question: "Which normal form removes partial dependency?", options: ["2NF", "1NF", "3NF", "BCNF"], correctAnswer: 0, category: "DBMS", difficulty: "medium" },
  { id: 62, question: "Which key uniquely identifies a row in a table?", options: ["Primary Key", "Foreign Key", "Candidate Key", "Super Key"], correctAnswer: 0, category: "DBMS", difficulty: "medium" },
  { id: 63, question: "What does ACID stand for in databases?", options: ["Atomicity, Consistency, Isolation, Durability", "Access, Control, Integrity, Data", "Atomicity, Control, Isolation, Data", "Access, Consistency, Integrity, Durability"], correctAnswer: 0, category: "DBMS", difficulty: "medium" },
  { id: 64, question: "Which join returns all rows from both tables?", options: ["FULL OUTER JOIN", "INNER JOIN", "LEFT JOIN", "CROSS JOIN"], correctAnswer: 0, category: "DBMS", difficulty: "medium" },
  { id: 65, question: "Which clause is used to filter groups in SQL?", options: ["HAVING", "WHERE", "GROUP BY", "ORDER BY"], correctAnswer: 0, category: "DBMS", difficulty: "medium" },
  { id: 66, question: "What is a view in SQL?", options: ["Virtual table based on a query", "Physical table", "Index", "Trigger"], correctAnswer: 0, category: "DBMS", difficulty: "medium" },
  { id: 67, question: "Which command is used to add a new column to a table?", options: ["ALTER TABLE", "UPDATE TABLE", "INSERT INTO", "CREATE TABLE"], correctAnswer: 0, category: "DBMS", difficulty: "medium" },
  { id: 68, question: "What is the purpose of an INDEX in a database?", options: ["Speed up data retrieval", "Delete data", "Create tables", "Insert data"], correctAnswer: 0, category: "DBMS", difficulty: "medium" },

  // ============ DBMS - HARD ============
  { id: 69, question: "Which normal form removes transitive dependency?", options: ["3NF", "1NF", "2NF", "4NF"], correctAnswer: 0, category: "DBMS", difficulty: "hard" },
  { id: 70, question: "What is a phantom read in database transactions?", options: ["New rows appear in repeated query within same transaction", "Data is lost", "Deadlock occurs", "Table is dropped"], correctAnswer: 0, category: "DBMS", difficulty: "hard" },
  { id: 71, question: "Which concurrency control protocol uses timestamps?", options: ["Timestamp Ordering", "Two-Phase Locking", "Optimistic CC", "Wound-Wait"], correctAnswer: 0, category: "DBMS", difficulty: "hard" },
  { id: 72, question: "In B+ tree, data pointers are stored in?", options: ["Leaf nodes only", "All nodes", "Root only", "Internal nodes only"], correctAnswer: 0, category: "DBMS", difficulty: "hard" },
  { id: 73, question: "What is the difference between DELETE and TRUNCATE?", options: ["DELETE is DML and can rollback, TRUNCATE is DDL", "Both are same", "TRUNCATE can rollback, DELETE cannot", "DELETE is DDL"], correctAnswer: 0, category: "DBMS", difficulty: "hard" },
  { id: 74, question: "Which isolation level prevents dirty reads but allows non-repeatable reads?", options: ["READ COMMITTED", "READ UNCOMMITTED", "SERIALIZABLE", "REPEATABLE READ"], correctAnswer: 0, category: "DBMS", difficulty: "hard" },
  { id: 75, question: "What is a deadlock in DBMS?", options: ["Circular wait among transactions for resources", "Data corruption", "Network failure", "Query timeout"], correctAnswer: 0, category: "DBMS", difficulty: "hard" },
  { id: 76, question: "BCNF is stricter than which normal form?", options: ["3NF", "2NF", "1NF", "4NF"], correctAnswer: 0, category: "DBMS", difficulty: "hard" },

  // ============ OPERATING SYSTEMS - MEDIUM ============
  { id: 77, question: "Which scheduling algorithm may cause starvation?", options: ["SJF", "FCFS", "Round Robin", "FIFO"], correctAnswer: 0, category: "Operating Systems", difficulty: "medium" },
  { id: 78, question: "Virtual memory uses?", options: ["RAM + Disk", "RAM only", "Disk only", "Cache"], correctAnswer: 0, category: "Operating Systems", difficulty: "medium" },
  { id: 79, question: "What is a deadlock?", options: ["Circular wait among processes", "Process running too long", "CPU overheating", "Memory overflow"], correctAnswer: 0, category: "Operating Systems", difficulty: "medium" },
  { id: 80, question: "Which memory allocation strategy causes external fragmentation?", options: ["First Fit", "Paging", "Segmentation with paging", "Buddy System"], correctAnswer: 0, category: "Operating Systems", difficulty: "medium" },
  { id: 81, question: "What does a semaphore do?", options: ["Controls access to shared resources", "Allocates memory", "Schedules processes", "Manages files"], correctAnswer: 0, category: "Operating Systems", difficulty: "medium" },
  { id: 82, question: "Which page replacement algorithm is optimal?", options: ["OPT (Optimal)", "FIFO", "LRU", "MRU"], correctAnswer: 0, category: "Operating Systems", difficulty: "medium" },
  { id: 83, question: "What is thrashing?", options: ["Excessive page faults reducing performance", "CPU overheating", "Disk failure", "Network congestion"], correctAnswer: 0, category: "Operating Systems", difficulty: "medium" },
  { id: 84, question: "Which system call creates a new process in Unix?", options: ["fork()", "exec()", "wait()", "exit()"], correctAnswer: 0, category: "Operating Systems", difficulty: "medium" },
  { id: 85, question: "Round Robin scheduling uses which data structure?", options: ["Queue", "Stack", "Tree", "Heap"], correctAnswer: 0, category: "Operating Systems", difficulty: "medium" },
  { id: 86, question: "What is the role of MMU?", options: ["Translate virtual to physical address", "Manage CPU", "Handle I/O", "Run processes"], correctAnswer: 0, category: "Operating Systems", difficulty: "medium" },

  // ============ OPERATING SYSTEMS - HARD ============
  { id: 87, question: "Belady's anomaly occurs in which page replacement algorithm?", options: ["FIFO", "LRU", "OPT", "Clock"], correctAnswer: 0, category: "Operating Systems", difficulty: "hard" },
  { id: 88, question: "Which condition is NOT necessary for deadlock?", options: ["Preemption", "Mutual Exclusion", "Hold and Wait", "Circular Wait"], correctAnswer: 0, category: "Operating Systems", difficulty: "hard" },
  { id: 89, question: "What is the Banker's algorithm used for?", options: ["Deadlock avoidance", "Deadlock detection", "Memory allocation", "Process scheduling"], correctAnswer: 0, category: "Operating Systems", difficulty: "hard" },
  { id: 90, question: "In a multi-level feedback queue, what happens to CPU-bound processes?", options: ["Move to lower priority queues", "Stay in highest priority", "Get terminated", "Move to highest priority"], correctAnswer: 0, category: "Operating Systems", difficulty: "hard" },
  { id: 91, question: "What is the difference between preemptive and non-preemptive scheduling?", options: ["Preemptive can interrupt running process", "Non-preemptive can interrupt", "Both are same", "Preemptive waits for completion"], correctAnswer: 0, category: "Operating Systems", difficulty: "hard" },
  { id: 92, question: "What is a race condition?", options: ["Output depends on order of process execution", "A type of deadlock", "Memory leak", "Buffer overflow"], correctAnswer: 0, category: "Operating Systems", difficulty: "hard" },
  { id: 93, question: "Peterson's solution solves which problem?", options: ["Critical section for 2 processes", "Deadlock", "Starvation", "Memory management"], correctAnswer: 0, category: "Operating Systems", difficulty: "hard" },
  { id: 94, question: "What is the working set model used for?", options: ["Controlling thrashing", "Scheduling", "File management", "Network I/O"], correctAnswer: 0, category: "Operating Systems", difficulty: "hard" },
];

// Shuffle using Fisher-Yates and seed for rotation
export function getShuffledQuestions(
  difficulty: "medium" | "hard" | "mixed",
  count: number,
  seed?: number
): QuizQuestion[] {
  let pool = [...quizQuestions];

  if (difficulty === "medium") {
    pool = pool.filter((q) => q.difficulty === "medium");
  } else if (difficulty === "hard") {
    pool = pool.filter((q) => q.difficulty === "hard");
  }

  // Fisher-Yates shuffle with optional seed for rotation
  const rng = seed !== undefined ? seededRandom(seed) : Math.random;
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  // Also shuffle options for each question
  return pool.slice(0, Math.min(count, pool.length)).map((q) => {
    const optionIndices = [0, 1, 2, 3];
    for (let i = 3; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [optionIndices[i], optionIndices[j]] = [optionIndices[j], optionIndices[i]];
    }
    const newOptions = optionIndices.map((idx) => q.options[idx]);
    const newCorrect = optionIndices.indexOf(q.correctAnswer);
    return { ...q, options: newOptions, correctAnswer: newCorrect };
  });
}

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}
