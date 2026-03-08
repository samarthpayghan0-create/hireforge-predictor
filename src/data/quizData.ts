export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  category: string;
  difficulty: "medium" | "hard";
}

export const quizQuestions: QuizQuestion[] = [
  // ============ APTITUDE - MEDIUM (TCS NQT / Infosys / Wipro Style) ============
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
  { id: 101, question: "A shopkeeper marks a product 40% above cost and gives 20% discount. His profit %?", options: ["12%", "20%", "8%", "16%"], correctAnswer: 0, category: "Aptitude", difficulty: "medium" },
  { id: 102, question: "The HCF and LCM of two numbers are 12 and 360. If one number is 60, the other is?", options: ["72", "48", "84", "96"], correctAnswer: 0, category: "Aptitude", difficulty: "medium" },
  { id: 103, question: "A person walks 5 km towards North then turns right and walks 3 km. Direction from start?", options: ["North-East", "North-West", "South-East", "East"], correctAnswer: 0, category: "Aptitude", difficulty: "medium" },
  { id: 104, question: "If 6 men can complete a job in 10 days, how many days will 15 men take?", options: ["4 days", "5 days", "6 days", "3 days"], correctAnswer: 0, category: "Aptitude", difficulty: "medium" },
  { id: 105, question: "The sum of first 20 natural numbers is?", options: ["210", "200", "190", "220"], correctAnswer: 0, category: "Aptitude", difficulty: "medium" },
  { id: 106, question: "A number when divided by 5 gives remainder 3. What is the remainder when the square of that number is divided by 5?", options: ["4", "3", "1", "2"], correctAnswer: 0, category: "Aptitude", difficulty: "medium" },
  { id: 107, question: "The cost price of 15 articles is equal to the selling price of 12 articles. Profit %?", options: ["25%", "20%", "15%", "30%"], correctAnswer: 0, category: "Aptitude", difficulty: "medium" },
  { id: 108, question: "A tank is filled by pipe A in 20 min, emptied by pipe B in 30 min. If both are open, tank fills in?", options: ["60 min", "50 min", "45 min", "40 min"], correctAnswer: 0, category: "Aptitude", difficulty: "medium" },
  { id: 109, question: "What is the smallest number divisible by both 12 and 18?", options: ["36", "24", "48", "72"], correctAnswer: 0, category: "Aptitude", difficulty: "medium" },
  { id: 110, question: "In how many ways can 3 books be arranged on a shelf?", options: ["6", "3", "9", "12"], correctAnswer: 0, category: "Aptitude", difficulty: "medium" },
  { id: 111, question: "A man buys an article for ₹450 and sells for ₹540. Find profit %.", options: ["20%", "15%", "25%", "18%"], correctAnswer: 0, category: "Aptitude", difficulty: "medium" },
  { id: 112, question: "The speed of a boat in still water is 10 km/h. If river flows at 2 km/h, upstream speed?", options: ["8 km/h", "12 km/h", "6 km/h", "10 km/h"], correctAnswer: 0, category: "Aptitude", difficulty: "medium" },
  { id: 113, question: "If A:B = 2:3 and B:C = 4:5, then A:B:C is?", options: ["8:12:15", "2:3:5", "4:6:5", "8:12:10"], correctAnswer: 0, category: "Aptitude", difficulty: "medium" },
  { id: 114, question: "A dice is thrown. What is the probability of getting a number greater than 4?", options: ["1/3", "1/2", "2/3", "1/6"], correctAnswer: 0, category: "Aptitude", difficulty: "medium" },
  { id: 115, question: "Two numbers are in ratio 3:5. If their difference is 18, find the larger number.", options: ["45", "27", "36", "54"], correctAnswer: 0, category: "Aptitude", difficulty: "medium" },
  { id: 116, question: "The perimeter of a square field is 80m. Find its area.", options: ["400 m²", "320 m²", "640 m²", "200 m²"], correctAnswer: 0, category: "Aptitude", difficulty: "medium" },
  { id: 117, question: "If the price of an item increases by 25%, by what % must consumption decrease to keep expenditure same?", options: ["20%", "25%", "15%", "30%"], correctAnswer: 0, category: "Aptitude", difficulty: "medium" },
  { id: 118, question: "What is the next term in the series: 1, 4, 9, 16, 25, ?", options: ["36", "30", "35", "49"], correctAnswer: 0, category: "Aptitude", difficulty: "medium" },

  // ============ APTITUDE - HARD (Google / Amazon / TCS Digital Style) ============
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
  { id: 119, question: "A sum doubles in 5 years at CI. In how many years will it become 8 times?", options: ["15 years", "10 years", "20 years", "25 years"], correctAnswer: 0, category: "Aptitude", difficulty: "hard" },
  { id: 120, question: "In a class, 60% students pass in English, 70% in Maths. If 30% pass in both, what % fail in both?", options: ["0%", "10%", "20%", "5%"], correctAnswer: 0, category: "Aptitude", difficulty: "hard" },
  { id: 121, question: "A 240m train crosses a 160m platform in 20 sec. Speed of train?", options: ["72 km/h", "60 km/h", "80 km/h", "54 km/h"], correctAnswer: 0, category: "Aptitude", difficulty: "hard" },
  { id: 122, question: "How many words can be formed from EDUCATION using all letters?", options: ["362880", "40320", "5040", "3628800"], correctAnswer: 0, category: "Aptitude", difficulty: "hard" },
  { id: 123, question: "Two trains 150m and 200m long run at 40 km/h and 32 km/h in opposite directions. Time to cross each other?", options: ["17.5 sec", "15 sec", "20 sec", "25 sec"], correctAnswer: 0, category: "Aptitude", difficulty: "hard" },
  { id: 124, question: "A committee of 5 is to be formed from 6 men and 4 women with at least 3 women. Number of ways?", options: ["60", "120", "90", "30"], correctAnswer: 0, category: "Aptitude", difficulty: "hard" },
  { id: 125, question: "If a number is increased by 20% and then decreased by 20%, net change is?", options: ["4% decrease", "No change", "4% increase", "2% decrease"], correctAnswer: 0, category: "Aptitude", difficulty: "hard" },
  { id: 126, question: "The diagonal of a cube is 6√3 cm. Find its volume.", options: ["216 cm³", "125 cm³", "343 cm³", "512 cm³"], correctAnswer: 0, category: "Aptitude", difficulty: "hard" },
  { id: 127, question: "A cistern can be filled by A in 4 hrs, B in 6 hrs. An outlet pipe empties it in 8 hrs. All three open, time to fill?", options: ["4.8 hours", "5 hours", "6 hours", "3.5 hours"], correctAnswer: 0, category: "Aptitude", difficulty: "hard" },
  { id: 128, question: "Find the remainder when 2^256 is divided by 17.", options: ["1", "2", "16", "0"], correctAnswer: 0, category: "Aptitude", difficulty: "hard" },
  { id: 129, question: "In a GP, the 3rd term is 24 and the 6th term is 192. Find the first term.", options: ["6", "3", "8", "12"], correctAnswer: 0, category: "Aptitude", difficulty: "hard" },
  { id: 130, question: "A bag contains 3 white, 4 black, 2 red balls. Two balls drawn. Probability both are black?", options: ["1/6", "2/9", "1/3", "4/9"], correctAnswer: 0, category: "Aptitude", difficulty: "hard" },
  { id: 131, question: "A works twice as fast as B. Together they finish in 14 days. A alone finishes in?", options: ["21 days", "14 days", "28 days", "42 days"], correctAnswer: 0, category: "Aptitude", difficulty: "hard" },
  { id: 132, question: "If the sides of a triangle are 13, 14, 15, find its area.", options: ["84", "91", "78", "105"], correctAnswer: 0, category: "Aptitude", difficulty: "hard" },
  { id: 133, question: "The product of two numbers is 1680 and HCF is 12. How many such pairs exist?", options: ["2", "1", "3", "4"], correctAnswer: 0, category: "Aptitude", difficulty: "hard" },
  { id: 134, question: "A man invested ₹1000 at 5% CI. Amount after 3 years?", options: ["₹1157.63", "₹1150", "₹1200", "₹1100"], correctAnswer: 0, category: "Aptitude", difficulty: "hard" },
  { id: 135, question: "How many zeros at the end of 50!?", options: ["12", "10", "15", "8"], correctAnswer: 0, category: "Aptitude", difficulty: "hard" },
  { id: 136, question: "In an AP, 5th term is 20 and 10th term is 35. Sum of first 15 terms?", options: ["375", "350", "400", "300"], correctAnswer: 0, category: "Aptitude", difficulty: "hard" },
  { id: 137, question: "Two dice thrown simultaneously. Probability sum is 9?", options: ["1/9", "1/6", "1/12", "2/9"], correctAnswer: 0, category: "Aptitude", difficulty: "hard" },
  { id: 138, question: "A cylindrical tank of radius 7m and height 10m. Volume in litres?", options: ["1540000", "1000000", "2200000", "770000"], correctAnswer: 0, category: "Aptitude", difficulty: "hard" },

  // ============ PROGRAMMING - MEDIUM (TCS / Infosys / Cognizant Style) ============
  { id: 23, question: "Which keyword is used to define a function in Python?", options: ["def", "func", "function", "define"], correctAnswer: 0, category: "Programming", difficulty: "medium" },
  { id: 24, question: "What does DOM stand for?", options: ["Document Object Model", "Data Object Model", "Digital Object Model", "Document Oriented Model"], correctAnswer: 0, category: "Programming", difficulty: "medium" },
  { id: 25, question: "Which is NOT a JavaScript data type?", options: ["Float", "Boolean", "String", "Symbol"], correctAnswer: 0, category: "Programming", difficulty: "medium" },
  { id: 26, question: "What is the output of print(type([])) in Python?", options: ["<class 'list'>", "<class 'tuple'>", "<class 'dict'>", "<class 'set'>"], correctAnswer: 0, category: "Programming", difficulty: "medium" },
  { id: 27, question: "Which HTTP method is used to update a resource?", options: ["PUT", "GET", "POST", "DELETE"], correctAnswer: 0, category: "Programming", difficulty: "medium" },
  { id: 28, question: "In Java, which keyword prevents a class from being inherited?", options: ["final", "static", "abstract", "private"], correctAnswer: 0, category: "Programming", difficulty: "medium" },
  { id: 29, question: "What does CSS stand for?", options: ["Cascading Style Sheets", "Creative Style Sheets", "Computer Style Sheets", "Colorful Style Sheets"], correctAnswer: 0, category: "Programming", difficulty: "medium" },
  { id: 30, question: "Which operator is used for strict equality in JavaScript?", options: ["===", "==", "!=", ">="], correctAnswer: 0, category: "Programming", difficulty: "medium" },
  { id: 31, question: "What is the default return type of main() in C?", options: ["int", "void", "float", "char"], correctAnswer: 0, category: "Programming", difficulty: "medium" },
  { id: 32, question: "Which Python library is used for data manipulation?", options: ["Pandas", "Matplotlib", "Flask", "Django"], correctAnswer: 0, category: "Programming", difficulty: "medium" },
  { id: 200, question: "What is the output of 'Hello'[1] in Python?", options: ["e", "H", "l", "o"], correctAnswer: 0, category: "Programming", difficulty: "medium" },
  { id: 201, question: "Which SQL command is used to retrieve data?", options: ["SELECT", "GET", "FETCH", "RETRIEVE"], correctAnswer: 0, category: "Programming", difficulty: "medium" },
  { id: 202, question: "In C, what does malloc() return?", options: ["Pointer to allocated memory", "Size of memory", "An integer", "Nothing"], correctAnswer: 0, category: "Programming", difficulty: "medium" },
  { id: 203, question: "What is the size of int in C on a 32-bit system?", options: ["4 bytes", "2 bytes", "8 bytes", "1 byte"], correctAnswer: 0, category: "Programming", difficulty: "medium" },
  { id: 204, question: "Which of the following is an immutable data type in Python?", options: ["Tuple", "List", "Dictionary", "Set"], correctAnswer: 0, category: "Programming", difficulty: "medium" },
  { id: 205, question: "What does OOP stand for?", options: ["Object Oriented Programming", "Object Ordered Programming", "Operator Oriented Programming", "Output Oriented Programming"], correctAnswer: 0, category: "Programming", difficulty: "medium" },
  { id: 206, question: "Which tag is used for the largest heading in HTML?", options: ["<h1>", "<h6>", "<head>", "<header>"], correctAnswer: 0, category: "Programming", difficulty: "medium" },
  { id: 207, question: "In Java, which method is the entry point of a program?", options: ["main()", "start()", "init()", "run()"], correctAnswer: 0, category: "Programming", difficulty: "medium" },
  { id: 208, question: "What does JSON stand for?", options: ["JavaScript Object Notation", "Java Standard Object Notation", "JavaScript Oriented Naming", "Java Syntax Object Notation"], correctAnswer: 0, category: "Programming", difficulty: "medium" },
  { id: 209, question: "Which of these is a version control system?", options: ["Git", "Python", "Docker", "Kubernetes"], correctAnswer: 0, category: "Programming", difficulty: "medium" },
  { id: 210, question: "In Python, which keyword is used to handle exceptions?", options: ["try", "catch", "handle", "error"], correctAnswer: 0, category: "Programming", difficulty: "medium" },
  { id: 211, question: "What is the purpose of the 'this' keyword in Java?", options: ["Refers to current object", "Creates new object", "Destroys object", "Imports a class"], correctAnswer: 0, category: "Programming", difficulty: "medium" },
  { id: 212, question: "Which protocol is used for secure web communication?", options: ["HTTPS", "HTTP", "FTP", "SMTP"], correctAnswer: 0, category: "Programming", difficulty: "medium" },
  { id: 213, question: "What is the output of 2**3 in Python?", options: ["8", "6", "9", "5"], correctAnswer: 0, category: "Programming", difficulty: "medium" },
  { id: 214, question: "Which data structure uses key-value pairs?", options: ["Dictionary/HashMap", "Array", "Stack", "Queue"], correctAnswer: 0, category: "Programming", difficulty: "medium" },
  { id: 215, question: "In C++, which operator is used for dynamic memory allocation?", options: ["new", "malloc", "alloc", "create"], correctAnswer: 0, category: "Programming", difficulty: "medium" },
  { id: 216, question: "What is a constructor in OOP?", options: ["Method called when object is created", "Method to destroy objects", "A static method", "An abstract method"], correctAnswer: 0, category: "Programming", difficulty: "medium" },
  { id: 217, question: "Which loop is guaranteed to execute at least once?", options: ["do-while", "for", "while", "foreach"], correctAnswer: 0, category: "Programming", difficulty: "medium" },
  { id: 218, question: "What is the file extension for Python files?", options: [".py", ".pt", ".pn", ".ph"], correctAnswer: 0, category: "Programming", difficulty: "medium" },
  { id: 219, question: "Which of these is NOT a pillar of OOP?", options: ["Compilation", "Encapsulation", "Inheritance", "Polymorphism"], correctAnswer: 0, category: "Programming", difficulty: "medium" },

  // ============ PROGRAMMING - HARD (Google / Amazon / Microsoft Style) ============
  { id: 33, question: "What is the time complexity of Python's sort() method (Timsort)?", options: ["O(n log n)", "O(n²)", "O(n)", "O(log n)"], correctAnswer: 0, category: "Programming", difficulty: "hard" },
  { id: 34, question: "In JavaScript, what does 'event bubbling' mean?", options: ["Event propagates from child to parent", "Event propagates from parent to child", "Event stays at target", "Event is cancelled"], correctAnswer: 0, category: "Programming", difficulty: "hard" },
  { id: 35, question: "What is a closure in JavaScript?", options: ["Function with access to outer scope variables", "A class constructor", "A loop structure", "An error handler"], correctAnswer: 0, category: "Programming", difficulty: "hard" },
  { id: 36, question: "Which design pattern ensures only one instance of a class?", options: ["Singleton", "Factory", "Observer", "Strategy"], correctAnswer: 0, category: "Programming", difficulty: "hard" },
  { id: 37, question: "What is the GIL in Python?", options: ["Global Interpreter Lock", "General Input Lock", "Global Instance Loader", "General Interpreter Layer"], correctAnswer: 0, category: "Programming", difficulty: "hard" },
  { id: 38, question: "What is the difference between process and thread?", options: ["Process has own memory, thread shares memory", "Thread has own memory, process shares", "Both are same", "Process is faster"], correctAnswer: 0, category: "Programming", difficulty: "hard" },
  { id: 39, question: "In C++, what is RAII?", options: ["Resource Acquisition Is Initialization", "Run-time Allocation In Interface", "Rapid Application Integration", "Resource And Interface Integration"], correctAnswer: 0, category: "Programming", difficulty: "hard" },
  { id: 40, question: "What does SOLID's 'L' stand for?", options: ["Liskov Substitution Principle", "Loose Coupling", "Lazy Loading", "Linear Dependency"], correctAnswer: 0, category: "Programming", difficulty: "hard" },
  { id: 220, question: "What is the output of typeof NaN in JavaScript?", options: ["number", "NaN", "undefined", "object"], correctAnswer: 0, category: "Programming", difficulty: "hard" },
  { id: 221, question: "In Python, what is a decorator?", options: ["Function that modifies another function", "A class attribute", "A loop modifier", "A variable type"], correctAnswer: 0, category: "Programming", difficulty: "hard" },
  { id: 222, question: "What is method overloading vs overriding?", options: ["Overloading: same name different params; Overriding: redefine parent method", "They are the same thing", "Overriding: different params; Overloading: redefine parent", "Neither exists in OOP"], correctAnswer: 0, category: "Programming", difficulty: "hard" },
  { id: 223, question: "What is the purpose of virtual functions in C++?", options: ["Enable runtime polymorphism", "Allocate memory", "Create static methods", "Handle exceptions"], correctAnswer: 0, category: "Programming", difficulty: "hard" },
  { id: 224, question: "In Java, what is the difference between == and .equals()?", options: ["== compares reference, .equals() compares value", "They are identical", "== compares value, .equals() compares reference", ".equals() is faster"], correctAnswer: 0, category: "Programming", difficulty: "hard" },
  { id: 225, question: "What is a memory leak?", options: ["Allocated memory not freed after use", "Memory overflow", "Stack overflow", "Buffer underflow"], correctAnswer: 0, category: "Programming", difficulty: "hard" },
  { id: 226, question: "What is the Observer design pattern?", options: ["One-to-many dependency where dependents are notified of changes", "Creates objects without specifying class", "Ensures single instance", "Wraps an object to add behavior"], correctAnswer: 0, category: "Programming", difficulty: "hard" },
  { id: 227, question: "In Python, what is the difference between deepcopy and shallow copy?", options: ["Deepcopy copies nested objects recursively, shallow copy doesn't", "They are the same", "Shallow copy copies recursively", "Deepcopy only copies top level"], correctAnswer: 0, category: "Programming", difficulty: "hard" },
  { id: 228, question: "What is tail recursion?", options: ["Recursive call is the last operation in the function", "Recursion with multiple base cases", "Recursion without base case", "Iterative loop"], correctAnswer: 0, category: "Programming", difficulty: "hard" },
  { id: 229, question: "What is dependency injection?", options: ["Providing dependencies from outside rather than creating inside", "Injecting code at runtime", "A type of memory allocation", "Loading modules dynamically"], correctAnswer: 0, category: "Programming", difficulty: "hard" },
  { id: 230, question: "What is the difference between stack and heap memory?", options: ["Stack: automatic/local, Heap: dynamic/manual allocation", "They are the same", "Stack is slower than heap", "Heap is for local variables"], correctAnswer: 0, category: "Programming", difficulty: "hard" },
  { id: 231, question: "In JavaScript, what is the event loop?", options: ["Mechanism that handles async callbacks from the callback queue", "A type of for loop", "A recursive function", "A DOM event"], correctAnswer: 0, category: "Programming", difficulty: "hard" },
  { id: 232, question: "What is the CAP theorem?", options: ["Distributed system can have at most 2 of: Consistency, Availability, Partition tolerance", "A sorting algorithm", "A data structure theorem", "A compiler optimization"], correctAnswer: 0, category: "Programming", difficulty: "hard" },
  { id: 233, question: "What is memoization?", options: ["Caching results of expensive function calls", "Memorizing code patterns", "A sorting technique", "A compiler optimization"], correctAnswer: 0, category: "Programming", difficulty: "hard" },
  { id: 234, question: "What is the difference between abstraction and encapsulation?", options: ["Abstraction hides complexity, encapsulation bundles data and methods", "They are identical", "Encapsulation hides complexity", "Abstraction bundles data"], correctAnswer: 0, category: "Programming", difficulty: "hard" },
  { id: 235, question: "In multithreading, what is a mutex?", options: ["Mutual exclusion lock for thread synchronization", "A data type", "A memory allocator", "An exception handler"], correctAnswer: 0, category: "Programming", difficulty: "hard" },
  { id: 236, question: "What are generics in Java/TypeScript?", options: ["Type parameters that allow code to work with different types", "A type of loop", "Special variables", "Database queries"], correctAnswer: 0, category: "Programming", difficulty: "hard" },
  { id: 237, question: "What is the Strategy design pattern?", options: ["Defines a family of algorithms, encapsulates each one, and makes them interchangeable", "Creates a single instance", "Observes state changes", "Builds complex objects step by step"], correctAnswer: 0, category: "Programming", difficulty: "hard" },
  { id: 238, question: "What is garbage collection?", options: ["Automatic memory management that reclaims unused objects", "Deleting files", "Clearing cache", "Defragmenting disk"], correctAnswer: 0, category: "Programming", difficulty: "hard" },
  { id: 239, question: "What is the difference between compiled and interpreted languages?", options: ["Compiled: translated to machine code before execution; Interpreted: executed line by line", "They are the same", "Interpreted is faster", "Compiled runs line by line"], correctAnswer: 0, category: "Programming", difficulty: "hard" },

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
  { id: 300, question: "What is the time complexity of accessing an element in an array by index?", options: ["O(1)", "O(n)", "O(log n)", "O(n²)"], correctAnswer: 0, category: "Data Structures", difficulty: "medium" },
  { id: 301, question: "Which data structure is used for BFS traversal?", options: ["Queue", "Stack", "Heap", "Array"], correctAnswer: 0, category: "Data Structures", difficulty: "medium" },
  { id: 302, question: "What is the maximum number of edges in a simple undirected graph with n vertices?", options: ["n(n-1)/2", "n²", "n-1", "2n"], correctAnswer: 0, category: "Data Structures", difficulty: "medium" },
  { id: 303, question: "Which of the following is NOT a linear data structure?", options: ["Tree", "Array", "Stack", "Queue"], correctAnswer: 0, category: "Data Structures", difficulty: "medium" },
  { id: 304, question: "In a singly linked list, what is the time complexity of deletion at the end?", options: ["O(n)", "O(1)", "O(log n)", "O(n²)"], correctAnswer: 0, category: "Data Structures", difficulty: "medium" },
  { id: 305, question: "What is a complete binary tree?", options: ["All levels filled except possibly last, filled left to right", "Every node has exactly 2 children", "All leaves at same level", "Only root has children"], correctAnswer: 0, category: "Data Structures", difficulty: "medium" },
  { id: 306, question: "Which sorting algorithm has the best average case?", options: ["Quick Sort - O(n log n)", "Bubble Sort - O(n²)", "Insertion Sort - O(n²)", "Selection Sort - O(n²)"], correctAnswer: 0, category: "Data Structures", difficulty: "medium" },
  { id: 307, question: "What is a circular queue?", options: ["Queue where last position connects to first", "Queue with priority", "Double-ended queue", "Queue using linked list"], correctAnswer: 0, category: "Data Structures", difficulty: "medium" },
  { id: 308, question: "Time complexity of searching in an unsorted array?", options: ["O(n)", "O(1)", "O(log n)", "O(n log n)"], correctAnswer: 0, category: "Data Structures", difficulty: "medium" },
  { id: 309, question: "What is a deque?", options: ["Double-ended queue", "Distributed queue", "Delayed queue", "Dynamic queue"], correctAnswer: 0, category: "Data Structures", difficulty: "medium" },
  { id: 310, question: "Which data structure is used for DFS traversal?", options: ["Stack", "Queue", "Heap", "Array"], correctAnswer: 0, category: "Data Structures", difficulty: "medium" },
  { id: 311, question: "What is the height of a balanced BST with n nodes?", options: ["O(log n)", "O(n)", "O(n²)", "O(1)"], correctAnswer: 0, category: "Data Structures", difficulty: "medium" },
  { id: 312, question: "In a min-heap, the root contains?", options: ["Minimum element", "Maximum element", "Median element", "Random element"], correctAnswer: 0, category: "Data Structures", difficulty: "medium" },
  { id: 313, question: "What is the time complexity of insertion in a BST (average)?", options: ["O(log n)", "O(n)", "O(1)", "O(n²)"], correctAnswer: 0, category: "Data Structures", difficulty: "medium" },
  { id: 314, question: "Which algorithm finds shortest path in an unweighted graph?", options: ["BFS", "DFS", "Dijkstra", "Bellman-Ford"], correctAnswer: 0, category: "Data Structures", difficulty: "medium" },
  { id: 315, question: "What is the best case time complexity of bubble sort?", options: ["O(n)", "O(n²)", "O(n log n)", "O(1)"], correctAnswer: 0, category: "Data Structures", difficulty: "medium" },
  { id: 316, question: "A priority queue is typically implemented using?", options: ["Heap", "Array", "Linked List", "Stack"], correctAnswer: 0, category: "Data Structures", difficulty: "medium" },
  { id: 317, question: "What is the number of leaf nodes in a full binary tree with n internal nodes?", options: ["n + 1", "n", "n - 1", "2n"], correctAnswer: 0, category: "Data Structures", difficulty: "medium" },
  { id: 318, question: "Which data structure is used to check balanced parentheses?", options: ["Stack", "Queue", "Tree", "Graph"], correctAnswer: 0, category: "Data Structures", difficulty: "medium" },
  { id: 319, question: "What is hashing?", options: ["Mapping data to fixed-size values for fast lookup", "Sorting data", "Encrypting data", "Compressing data"], correctAnswer: 0, category: "Data Structures", difficulty: "medium" },

  // ============ DATA STRUCTURES - HARD ============
  { id: 51, question: "What is the amortized time complexity of dynamic array insertion?", options: ["O(1)", "O(n)", "O(log n)", "O(n²)"], correctAnswer: 0, category: "Data Structures", difficulty: "hard" },
  { id: 52, question: "In a Red-Black tree, what is the maximum height for n nodes?", options: ["2 log₂(n+1)", "log₂(n)", "n/2", "n"], correctAnswer: 0, category: "Data Structures", difficulty: "hard" },
  { id: 53, question: "Which data structure is used in Dijkstra's algorithm for optimal performance?", options: ["Min-Heap (Priority Queue)", "Stack", "Queue", "Linked List"], correctAnswer: 0, category: "Data Structures", difficulty: "hard" },
  { id: 54, question: "Time complexity of building a heap from an unsorted array?", options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"], correctAnswer: 0, category: "Data Structures", difficulty: "hard" },
  { id: 55, question: "What is the worst-case lookup time in a hash table?", options: ["O(n)", "O(1)", "O(log n)", "O(n²)"], correctAnswer: 0, category: "Data Structures", difficulty: "hard" },
  { id: 56, question: "Which algorithm detects a cycle in a linked list in O(1) space?", options: ["Floyd's Tortoise and Hare", "BFS", "DFS", "Kruskal's"], correctAnswer: 0, category: "Data Structures", difficulty: "hard" },
  { id: 57, question: "In AVL tree, what is the balance factor range?", options: ["-1 to 1", "0 to 2", "-2 to 2", "0 to 1"], correctAnswer: 0, category: "Data Structures", difficulty: "hard" },
  { id: 58, question: "What is a Trie used for?", options: ["Prefix-based string searching", "Sorting numbers", "Graph traversal", "Matrix operations"], correctAnswer: 0, category: "Data Structures", difficulty: "hard" },
  { id: 320, question: "What is the time complexity of Kruskal's algorithm?", options: ["O(E log E)", "O(V²)", "O(V + E)", "O(E²)"], correctAnswer: 0, category: "Data Structures", difficulty: "hard" },
  { id: 321, question: "In a B-tree of order m, maximum number of children a node can have?", options: ["m", "m-1", "m+1", "2m"], correctAnswer: 0, category: "Data Structures", difficulty: "hard" },
  { id: 322, question: "What is topological sorting used for?", options: ["Ordering tasks with dependencies (DAG)", "Finding shortest path", "Detecting cycles", "Balancing trees"], correctAnswer: 0, category: "Data Structures", difficulty: "hard" },
  { id: 323, question: "Time complexity of finding the kth smallest element using a min-heap?", options: ["O(n + k log n)", "O(n log n)", "O(k)", "O(n)"], correctAnswer: 0, category: "Data Structures", difficulty: "hard" },
  { id: 324, question: "What is a segment tree used for?", options: ["Range query and update operations", "Sorting", "Graph traversal", "String matching"], correctAnswer: 0, category: "Data Structures", difficulty: "hard" },
  { id: 325, question: "What is the space complexity of an adjacency matrix for a graph?", options: ["O(V²)", "O(V + E)", "O(V)", "O(E)"], correctAnswer: 0, category: "Data Structures", difficulty: "hard" },
  { id: 326, question: "Which algorithm finds strongly connected components in a directed graph?", options: ["Kosaraju's / Tarjan's", "Dijkstra's", "Prim's", "Floyd-Warshall"], correctAnswer: 0, category: "Data Structures", difficulty: "hard" },
  { id: 327, question: "What is the time complexity of the Floyd-Warshall algorithm?", options: ["O(V³)", "O(V²)", "O(V + E)", "O(E log V)"], correctAnswer: 0, category: "Data Structures", difficulty: "hard" },
  { id: 328, question: "What is a skip list?", options: ["Probabilistic data structure with multiple levels for O(log n) search", "A linked list that skips nodes", "A sorted array", "A type of queue"], correctAnswer: 0, category: "Data Structures", difficulty: "hard" },
  { id: 329, question: "What is the difference between Prim's and Kruskal's algorithm?", options: ["Prim's grows MST from a vertex, Kruskal's picks minimum edges globally", "They are identical", "Kruskal's uses BFS, Prim's uses DFS", "Prim's is for directed graphs"], correctAnswer: 0, category: "Data Structures", difficulty: "hard" },
  { id: 330, question: "Time complexity of counting sort?", options: ["O(n + k) where k is range", "O(n log n)", "O(n²)", "O(n)"], correctAnswer: 0, category: "Data Structures", difficulty: "hard" },
  { id: 331, question: "What is a Fenwick tree (Binary Indexed Tree) used for?", options: ["Prefix sum queries and point updates in O(log n)", "Graph traversal", "String matching", "Sorting"], correctAnswer: 0, category: "Data Structures", difficulty: "hard" },
  { id: 332, question: "What is the master theorem used for?", options: ["Solving divide-and-conquer recurrences", "Sorting arrays", "Graph algorithms", "Dynamic programming"], correctAnswer: 0, category: "Data Structures", difficulty: "hard" },
  { id: 333, question: "What is the time complexity of Bellman-Ford algorithm?", options: ["O(VE)", "O(V²)", "O(E log V)", "O(V + E)"], correctAnswer: 0, category: "Data Structures", difficulty: "hard" },
  { id: 334, question: "What is an Euler path in a graph?", options: ["Path that visits every edge exactly once", "Path that visits every vertex once", "Shortest path", "Longest path"], correctAnswer: 0, category: "Data Structures", difficulty: "hard" },
  { id: 335, question: "What is the worst-case time for insertion in a Red-Black tree?", options: ["O(log n)", "O(n)", "O(1)", "O(n log n)"], correctAnswer: 0, category: "Data Structures", difficulty: "hard" },
  { id: 336, question: "Which problem is solved using dynamic programming's longest common subsequence?", options: ["Finding longest common subsequence of two strings", "Shortest path", "Sorting", "Graph coloring"], correctAnswer: 0, category: "Data Structures", difficulty: "hard" },
  { id: 337, question: "What is a bloom filter?", options: ["Probabilistic data structure for set membership testing", "A sorting algorithm", "A graph algorithm", "A compression technique"], correctAnswer: 0, category: "Data Structures", difficulty: "hard" },
  { id: 338, question: "Time complexity of matrix chain multiplication using DP?", options: ["O(n³)", "O(n²)", "O(n log n)", "O(2^n)"], correctAnswer: 0, category: "Data Structures", difficulty: "hard" },
  { id: 339, question: "What is the time complexity of the KMP string matching algorithm?", options: ["O(n + m)", "O(nm)", "O(n²)", "O(n log n)"], correctAnswer: 0, category: "Data Structures", difficulty: "hard" },
  { id: 340, question: "What is an AA tree?", options: ["A simplified Red-Black tree with right-leaning nodes only", "A type of B-tree", "A balanced BST", "An unbalanced tree"], correctAnswer: 0, category: "Data Structures", difficulty: "hard" },

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
  { id: 400, question: "Which SQL keyword is used to prevent duplicate rows?", options: ["DISTINCT", "UNIQUE", "DIFFERENT", "SINGLE"], correctAnswer: 0, category: "DBMS", difficulty: "medium" },
  { id: 401, question: "What is a foreign key?", options: ["A key that references primary key of another table", "A unique key", "A primary key", "An index"], correctAnswer: 0, category: "DBMS", difficulty: "medium" },
  { id: 402, question: "Which SQL function returns the number of rows?", options: ["COUNT()", "SUM()", "TOTAL()", "NUM()"], correctAnswer: 0, category: "DBMS", difficulty: "medium" },
  { id: 403, question: "What is a stored procedure?", options: ["Precompiled SQL statements stored in database", "A temporary table", "A view", "An index"], correctAnswer: 0, category: "DBMS", difficulty: "medium" },
  { id: 404, question: "Which type of key can have NULL values?", options: ["Foreign Key", "Primary Key", "Super Key with PK", "Composite Key with PK"], correctAnswer: 0, category: "DBMS", difficulty: "medium" },
  { id: 405, question: "What does the GROUP BY clause do?", options: ["Groups rows with same values in specified columns", "Sorts data", "Filters data", "Joins tables"], correctAnswer: 0, category: "DBMS", difficulty: "medium" },
  { id: 406, question: "Which SQL command is used to modify existing data?", options: ["UPDATE", "ALTER", "MODIFY", "CHANGE"], correctAnswer: 0, category: "DBMS", difficulty: "medium" },
  { id: 407, question: "What is a trigger in SQL?", options: ["Automatic action executed on table events", "A stored procedure", "A view", "An index"], correctAnswer: 0, category: "DBMS", difficulty: "medium" },
  { id: 408, question: "What is the difference between WHERE and HAVING?", options: ["WHERE filters rows before grouping, HAVING filters after grouping", "They are the same", "HAVING comes before WHERE", "WHERE works on groups"], correctAnswer: 0, category: "DBMS", difficulty: "medium" },
  { id: 409, question: "What is a composite key?", options: ["Primary key made of two or more columns", "A foreign key", "An index", "A single column key"], correctAnswer: 0, category: "DBMS", difficulty: "medium" },
  { id: 410, question: "Which SQL command removes all rows but keeps table structure?", options: ["TRUNCATE", "DROP", "DELETE without WHERE", "REMOVE"], correctAnswer: 0, category: "DBMS", difficulty: "medium" },
  { id: 411, question: "What is a subquery?", options: ["A query nested inside another query", "A view", "A stored procedure", "A trigger"], correctAnswer: 0, category: "DBMS", difficulty: "medium" },
  { id: 412, question: "Which constraint ensures all values in a column are unique?", options: ["UNIQUE", "PRIMARY KEY", "NOT NULL", "CHECK"], correctAnswer: 0, category: "DBMS", difficulty: "medium" },
  { id: 413, question: "What is a self-join?", options: ["Joining a table with itself", "Joining two different tables", "Cross join", "Natural join"], correctAnswer: 0, category: "DBMS", difficulty: "medium" },
  { id: 414, question: "What does LIKE operator do in SQL?", options: ["Pattern matching in strings", "Exact matching", "Numeric comparison", "Date comparison"], correctAnswer: 0, category: "DBMS", difficulty: "medium" },
  { id: 415, question: "Which SQL clause is used for sorting?", options: ["ORDER BY", "SORT BY", "ARRANGE BY", "GROUP BY"], correctAnswer: 0, category: "DBMS", difficulty: "medium" },
  { id: 416, question: "What is normalization in DBMS?", options: ["Organizing data to reduce redundancy", "Adding redundant data", "Deleting tables", "Creating indexes"], correctAnswer: 0, category: "DBMS", difficulty: "medium" },
  { id: 417, question: "What is a cursor in SQL?", options: ["A database object to retrieve rows one at a time", "A pointer to a table", "A type of index", "A join type"], correctAnswer: 0, category: "DBMS", difficulty: "medium" },
  { id: 418, question: "Which SQL keyword is used to combine results of two SELECT statements?", options: ["UNION", "JOIN", "MERGE", "COMBINE"], correctAnswer: 0, category: "DBMS", difficulty: "medium" },

  // ============ DBMS - HARD ============
  { id: 69, question: "Which normal form removes transitive dependency?", options: ["3NF", "1NF", "2NF", "4NF"], correctAnswer: 0, category: "DBMS", difficulty: "hard" },
  { id: 70, question: "What is a phantom read in database transactions?", options: ["New rows appear in repeated query within same transaction", "Data is lost", "Deadlock occurs", "Table is dropped"], correctAnswer: 0, category: "DBMS", difficulty: "hard" },
  { id: 71, question: "Which concurrency control protocol uses timestamps?", options: ["Timestamp Ordering", "Two-Phase Locking", "Optimistic CC", "Wound-Wait"], correctAnswer: 0, category: "DBMS", difficulty: "hard" },
  { id: 72, question: "In B+ tree, data pointers are stored in?", options: ["Leaf nodes only", "All nodes", "Root only", "Internal nodes only"], correctAnswer: 0, category: "DBMS", difficulty: "hard" },
  { id: 73, question: "What is the difference between DELETE and TRUNCATE?", options: ["DELETE is DML and can rollback, TRUNCATE is DDL", "Both are same", "TRUNCATE can rollback, DELETE cannot", "DELETE is DDL"], correctAnswer: 0, category: "DBMS", difficulty: "hard" },
  { id: 74, question: "Which isolation level prevents dirty reads but allows non-repeatable reads?", options: ["READ COMMITTED", "READ UNCOMMITTED", "SERIALIZABLE", "REPEATABLE READ"], correctAnswer: 0, category: "DBMS", difficulty: "hard" },
  { id: 75, question: "What is a deadlock in DBMS?", options: ["Circular wait among transactions for resources", "Data corruption", "Network failure", "Query timeout"], correctAnswer: 0, category: "DBMS", difficulty: "hard" },
  { id: 76, question: "BCNF is stricter than which normal form?", options: ["3NF", "2NF", "1NF", "4NF"], correctAnswer: 0, category: "DBMS", difficulty: "hard" },
  { id: 420, question: "What is a write-ahead log (WAL)?", options: ["Log changes before writing to database for recovery", "A type of index", "A backup method", "A query optimization"], correctAnswer: 0, category: "DBMS", difficulty: "hard" },
  { id: 421, question: "What is the difference between OLTP and OLAP?", options: ["OLTP for transactions, OLAP for analytics", "They are the same", "OLAP for transactions", "OLTP for analytics"], correctAnswer: 0, category: "DBMS", difficulty: "hard" },
  { id: 422, question: "What is a materialized view?", options: ["A view that stores query results physically", "A virtual view", "A temporary table", "An index"], correctAnswer: 0, category: "DBMS", difficulty: "hard" },
  { id: 423, question: "What is sharding in databases?", options: ["Horizontal partitioning of data across multiple servers", "Vertical partitioning", "Creating indexes", "Normalizing data"], correctAnswer: 0, category: "DBMS", difficulty: "hard" },
  { id: 424, question: "What is a covering index?", options: ["An index that contains all columns needed by a query", "An index on primary key", "A composite index", "A clustered index"], correctAnswer: 0, category: "DBMS", difficulty: "hard" },
  { id: 425, question: "What is the two-phase locking protocol?", options: ["Growing phase (acquire locks) then shrinking phase (release locks)", "Two types of locks", "Locking two tables", "Two transactions locking"], correctAnswer: 0, category: "DBMS", difficulty: "hard" },
  { id: 426, question: "What is denormalization?", options: ["Adding redundancy intentionally to improve read performance", "Removing all redundancy", "Creating new tables", "Dropping indexes"], correctAnswer: 0, category: "DBMS", difficulty: "hard" },
  { id: 427, question: "What is MVCC (Multi-Version Concurrency Control)?", options: ["Each transaction sees a snapshot of data, allowing concurrent reads", "Multiple versions of database", "Multiple value checking", "Multi-variable control"], correctAnswer: 0, category: "DBMS", difficulty: "hard" },
  { id: 428, question: "What is the difference between clustered and non-clustered index?", options: ["Clustered changes physical order of data, non-clustered doesn't", "They are the same", "Non-clustered changes physical order", "Clustered is slower"], correctAnswer: 0, category: "DBMS", difficulty: "hard" },
  { id: 429, question: "What is 4NF?", options: ["Removes multi-valued dependencies", "Removes partial dependencies", "Removes transitive dependencies", "Same as BCNF"], correctAnswer: 0, category: "DBMS", difficulty: "hard" },
  { id: 430, question: "What is a conflict-serializable schedule?", options: ["Schedule equivalent to some serial schedule by swapping non-conflicting operations", "Any schedule with no conflicts", "A schedule that runs serially", "A schedule with deadlocks"], correctAnswer: 0, category: "DBMS", difficulty: "hard" },
  { id: 431, question: "What is the purpose of a checkpoint in DBMS?", options: ["Mark a point where all changes are flushed to disk for recovery", "Delete old data", "Create backup", "Optimize queries"], correctAnswer: 0, category: "DBMS", difficulty: "hard" },
  { id: 432, question: "What is the difference between a lossless and lossy join decomposition?", options: ["Lossless preserves all data on rejoin, lossy may lose data", "They are the same", "Lossy preserves data", "Lossless loses data"], correctAnswer: 0, category: "DBMS", difficulty: "hard" },
  { id: 433, question: "What is query optimization?", options: ["Finding the most efficient execution plan for a query", "Writing shorter queries", "Adding indexes", "Normalizing tables"], correctAnswer: 0, category: "DBMS", difficulty: "hard" },
  { id: 434, question: "What is a distributed database?", options: ["Database spread across multiple physical locations", "A cloud database", "A replicated database", "A backup database"], correctAnswer: 0, category: "DBMS", difficulty: "hard" },
  { id: 435, question: "What is the ARIES recovery algorithm?", options: ["Analysis, Redo, Undo phases for crash recovery", "A sorting algorithm", "A join algorithm", "An indexing method"], correctAnswer: 0, category: "DBMS", difficulty: "hard" },
  { id: 436, question: "What is a hash join?", options: ["Join using hash table on smaller relation for O(n+m) performance", "Join using sorting", "Nested loop join", "Cross join"], correctAnswer: 0, category: "DBMS", difficulty: "hard" },

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
  { id: 500, question: "What is a context switch?", options: ["Saving state of one process and loading another", "Switching between users", "Changing CPU speed", "Rebooting the system"], correctAnswer: 0, category: "Operating Systems", difficulty: "medium" },
  { id: 501, question: "What is the difference between internal and external fragmentation?", options: ["Internal: wasted space within allocated block; External: free space scattered", "They are the same", "External is within blocks", "Internal is scattered free space"], correctAnswer: 0, category: "Operating Systems", difficulty: "medium" },
  { id: 502, question: "What is a page table?", options: ["Maps virtual page numbers to physical frame numbers", "A list of processes", "CPU register", "Disk partition table"], correctAnswer: 0, category: "Operating Systems", difficulty: "medium" },
  { id: 503, question: "What is the difference between multiprogramming and multitasking?", options: ["Multiprogramming: multiple programs in memory; Multitasking: time-sharing CPU among tasks", "They are identical", "Multitasking uses multiple CPUs", "Multiprogramming is time-sharing"], correctAnswer: 0, category: "Operating Systems", difficulty: "medium" },
  { id: 504, question: "What is spooling?", options: ["Putting data in a buffer for a slow device", "A type of scheduling", "Memory allocation", "CPU optimization"], correctAnswer: 0, category: "Operating Systems", difficulty: "medium" },
  { id: 505, question: "Which of the following is a non-preemptive scheduling algorithm?", options: ["FCFS", "Round Robin", "SRTF", "Preemptive Priority"], correctAnswer: 0, category: "Operating Systems", difficulty: "medium" },
  { id: 506, question: "What is the purpose of the TLB?", options: ["Cache for page table entries for faster address translation", "A type of CPU register", "Disk cache", "Network buffer"], correctAnswer: 0, category: "Operating Systems", difficulty: "medium" },
  { id: 507, question: "What is a kernel?", options: ["Core of OS managing hardware and system resources", "A user application", "A shell command", "A file system"], correctAnswer: 0, category: "Operating Systems", difficulty: "medium" },
  { id: 508, question: "What is a zombie process?", options: ["Process that has finished but still has an entry in process table", "A killed process", "An orphan process", "A running process"], correctAnswer: 0, category: "Operating Systems", difficulty: "medium" },
  { id: 509, question: "What is the difference between process and program?", options: ["Process is a program in execution; program is passive code", "They are the same", "Program is active", "Process is passive"], correctAnswer: 0, category: "Operating Systems", difficulty: "medium" },
  { id: 510, question: "What is demand paging?", options: ["Loading pages into memory only when needed", "Loading all pages at once", "Removing pages from memory", "Sorting pages"], correctAnswer: 0, category: "Operating Systems", difficulty: "medium" },
  { id: 511, question: "What are the states of a process?", options: ["New, Ready, Running, Waiting, Terminated", "Start, Stop", "Active, Inactive", "Open, Closed"], correctAnswer: 0, category: "Operating Systems", difficulty: "medium" },
  { id: 512, question: "What is a file system?", options: ["Method of organizing and storing files on disk", "A type of RAM", "A CPU component", "A network protocol"], correctAnswer: 0, category: "Operating Systems", difficulty: "medium" },
  { id: 513, question: "What is IPC (Inter-Process Communication)?", options: ["Mechanisms for processes to communicate and share data", "Internet Protocol Control", "Internal Process Counter", "Input Process Controller"], correctAnswer: 0, category: "Operating Systems", difficulty: "medium" },
  { id: 514, question: "What is the difference between user mode and kernel mode?", options: ["Kernel mode has full hardware access, user mode is restricted", "They are the same", "User mode has full access", "Kernel mode is restricted"], correctAnswer: 0, category: "Operating Systems", difficulty: "medium" },
  { id: 515, question: "What is a PCB (Process Control Block)?", options: ["Data structure storing process information", "A circuit board", "A memory block", "A disk partition"], correctAnswer: 0, category: "Operating Systems", difficulty: "medium" },
  { id: 516, question: "What is the purpose of a system call?", options: ["Interface between user programs and the OS kernel", "A function call", "A network request", "A disk operation"], correctAnswer: 0, category: "Operating Systems", difficulty: "medium" },
  { id: 517, question: "What is paging in OS?", options: ["Dividing memory into fixed-size pages/frames", "Sorting memory", "Compressing memory", "Encrypting memory"], correctAnswer: 0, category: "Operating Systems", difficulty: "medium" },

  // ============ OPERATING SYSTEMS - HARD ============
  { id: 87, question: "Belady's anomaly occurs in which page replacement algorithm?", options: ["FIFO", "LRU", "OPT", "Clock"], correctAnswer: 0, category: "Operating Systems", difficulty: "hard" },
  { id: 88, question: "Which condition is NOT necessary for deadlock?", options: ["Preemption", "Mutual Exclusion", "Hold and Wait", "Circular Wait"], correctAnswer: 0, category: "Operating Systems", difficulty: "hard" },
  { id: 89, question: "What is the Banker's algorithm used for?", options: ["Deadlock avoidance", "Deadlock detection", "Memory allocation", "Process scheduling"], correctAnswer: 0, category: "Operating Systems", difficulty: "hard" },
  { id: 90, question: "In a multi-level feedback queue, what happens to CPU-bound processes?", options: ["Move to lower priority queues", "Stay in highest priority", "Get terminated", "Move to highest priority"], correctAnswer: 0, category: "Operating Systems", difficulty: "hard" },
  { id: 91, question: "What is the difference between preemptive and non-preemptive scheduling?", options: ["Preemptive can interrupt running process", "Non-preemptive can interrupt", "Both are same", "Preemptive waits for completion"], correctAnswer: 0, category: "Operating Systems", difficulty: "hard" },
  { id: 92, question: "What is a race condition?", options: ["Output depends on order of process execution", "A type of deadlock", "Memory leak", "Buffer overflow"], correctAnswer: 0, category: "Operating Systems", difficulty: "hard" },
  { id: 93, question: "Peterson's solution solves which problem?", options: ["Critical section for 2 processes", "Deadlock", "Starvation", "Memory management"], correctAnswer: 0, category: "Operating Systems", difficulty: "hard" },
  { id: 94, question: "What is the working set model used for?", options: ["Controlling thrashing", "Scheduling", "File management", "Network I/O"], correctAnswer: 0, category: "Operating Systems", difficulty: "hard" },
  { id: 520, question: "What is priority inversion?", options: ["Low priority task holds resource needed by high priority task", "High priority task waits for CPU", "Priority changes randomly", "Two tasks have same priority"], correctAnswer: 0, category: "Operating Systems", difficulty: "hard" },
  { id: 521, question: "What is the difference between monolithic and microkernel?", options: ["Monolithic: all services in kernel space; Microkernel: minimal kernel, services in user space", "They are the same", "Microkernel is larger", "Monolithic runs in user space"], correctAnswer: 0, category: "Operating Systems", difficulty: "hard" },
  { id: 522, question: "What is a spinlock?", options: ["Lock where thread busy-waits until lock is available", "A type of semaphore", "A scheduling algorithm", "A memory allocator"], correctAnswer: 0, category: "Operating Systems", difficulty: "hard" },
  { id: 523, question: "What is copy-on-write (COW)?", options: ["Shared pages copied only when a process tries to modify them", "Copying all pages on fork", "Writing to disk", "A file system feature"], correctAnswer: 0, category: "Operating Systems", difficulty: "hard" },
  { id: 524, question: "What is the difference between hard and soft real-time systems?", options: ["Hard: missing deadline is catastrophic; Soft: degraded but acceptable", "They are the same", "Soft is stricter", "Hard allows missed deadlines"], correctAnswer: 0, category: "Operating Systems", difficulty: "hard" },
  { id: 525, question: "What is the dining philosophers problem?", options: ["Classic concurrency problem illustrating deadlock and resource contention", "A sorting problem", "A memory allocation issue", "A scheduling problem"], correctAnswer: 0, category: "Operating Systems", difficulty: "hard" },
  { id: 526, question: "What is the difference between logical and physical address?", options: ["Logical is generated by CPU, physical is actual RAM address", "They are the same", "Physical is generated by CPU", "Logical is the RAM address"], correctAnswer: 0, category: "Operating Systems", difficulty: "hard" },
  { id: 527, question: "What is the readers-writers problem?", options: ["Concurrency problem: multiple readers allowed, writers need exclusive access", "A file I/O problem", "A memory issue", "A network problem"], correctAnswer: 0, category: "Operating Systems", difficulty: "hard" },
  { id: 528, question: "What is a page fault?", options: ["Requested page is not in physical memory, needs to be loaded from disk", "Page is corrupted", "Memory overflow", "CPU error"], correctAnswer: 0, category: "Operating Systems", difficulty: "hard" },
  { id: 529, question: "What is the convoy effect in FCFS scheduling?", options: ["Short processes wait behind long process, reducing throughput", "Processes run in parallel", "Priority inversion", "Deadlock"], correctAnswer: 0, category: "Operating Systems", difficulty: "hard" },
  { id: 530, question: "What is memory-mapped I/O?", options: ["I/O devices mapped to memory addresses, accessed like memory", "Using disk as RAM", "Mapping files to memory", "Network I/O"], correctAnswer: 0, category: "Operating Systems", difficulty: "hard" },
  { id: 531, question: "What is the difference between threads in user space vs kernel space?", options: ["User threads managed by library (fast but no true parallelism), kernel threads managed by OS", "They are identical", "Kernel threads are faster", "User threads allow parallelism"], correctAnswer: 0, category: "Operating Systems", difficulty: "hard" },
  { id: 532, question: "What is the Second Chance (Clock) page replacement algorithm?", options: ["Modified FIFO using a reference bit to give pages a second chance", "Random replacement", "LRU variant", "Optimal replacement"], correctAnswer: 0, category: "Operating Systems", difficulty: "hard" },
  { id: 533, question: "What is the purpose of the inverted page table?", options: ["One entry per physical frame instead of per virtual page, saving memory", "Faster page lookup", "Replacing TLB", "A type of cache"], correctAnswer: 0, category: "Operating Systems", difficulty: "hard" },
  { id: 534, question: "What is the producer-consumer problem?", options: ["Synchronization problem: producer adds to buffer, consumer removes, both must coordinate", "A scheduling problem", "A memory issue", "A file system problem"], correctAnswer: 0, category: "Operating Systems", difficulty: "hard" },
  { id: 535, question: "What is the difference between segmentation and paging?", options: ["Segmentation: variable-size logical divisions; Paging: fixed-size physical divisions", "They are the same", "Paging uses variable sizes", "Segmentation uses fixed sizes"], correctAnswer: 0, category: "Operating Systems", difficulty: "hard" },
  { id: 536, question: "What is a monitor in OS?", options: ["High-level synchronization construct with mutual exclusion built in", "A display device", "A system monitor tool", "A type of semaphore"], correctAnswer: 0, category: "Operating Systems", difficulty: "hard" },
];

// Get questions for a specific section with shuffling
export function getShuffledQuestionsForSection(
  categories: string[],
  difficulty: "medium" | "hard" | "mixed",
  count: number,
  seed?: number
): QuizQuestion[] {
  let pool = quizQuestions.filter(q => categories.includes(q.category));

  if (difficulty === "medium") {
    pool = pool.filter(q => q.difficulty === "medium");
  } else if (difficulty === "hard") {
    pool = pool.filter(q => q.difficulty === "hard");
  }

  const rng = seed !== undefined ? seededRandom(seed) : Math.random;
  const shuffled = [...pool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.slice(0, Math.min(count, shuffled.length)).map((q) => {
    const optionIndices = [0, 1, 2, 3];
    for (let i = 3; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [optionIndices[i], optionIndices[j]] = [optionIndices[j], optionIndices[i]];
    }
    const newOptions = optionIndices.map(idx => q.options[idx]);
    const newCorrect = optionIndices.indexOf(q.correctAnswer);
    return { ...q, options: newOptions, correctAnswer: newCorrect };
  });
}

// Legacy support
export function getShuffledQuestions(
  difficulty: "medium" | "hard" | "mixed",
  count: number,
  seed?: number
): QuizQuestion[] {
  return getShuffledQuestionsForSection(
    ["Aptitude", "Programming", "Data Structures", "DBMS", "Operating Systems"],
    difficulty, count, seed
  );
}

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}
