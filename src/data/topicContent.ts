// Per-topic content: theory, hints, challenge, and starter code per language

export type LangKey = 'C++' | 'Java' | 'Python' | 'C';

export interface TestCase {
  input: string;
  expected: string;
  label: string;
}

export interface TopicContent {
  theory: {
    description: string;
    timeComplexity: string;
    spaceComplexity: string;
    howItWorks: string;
  };
  hints: string[];
  challenge: {
    statement: string;
    example: { input: string; output: string };
  };
  testCases: TestCase[];
  validate: (code: string, lang: LangKey) => { passed: boolean; failedCase?: string };
  starterCode: Record<LangKey, string>;
  narrationSteps?: string[];
}

const wrap = (content: TopicContent): TopicContent => content;

const hasPatterns = (code: string, patterns: string[]): boolean =>
  patterns.every(p => code.toLowerCase().includes(p.toLowerCase()));

// ═══════════════════════════════════════════════════════════════════════════════
// MODULE 1: C++ PREREQUISITE
// ═══════════════════════════════════════════════════════════════════════════════

const cppInstallGuide = wrap({
  theory: {
    description: 'Before writing C++ code, you need a compiler (g++) and an editor. This guide walks you through installing MinGW-w64 on Windows, verifying the installation, and compiling your very first program from the terminal.',
    timeComplexity: 'N/A',
    spaceComplexity: 'N/A',
    howItWorks: 'A C++ compiler translates your human-readable source code (.cpp) into machine code (.exe). MinGW-w64 provides the GNU g++ compiler for Windows. After installing, you can compile with "g++ file.cpp -o file" and run with "./file".',
  },
  hints: [
    'Download MinGW-w64 from the official site or use MSYS2 for easy package management.',
    'Add the MinGW bin directory to your system PATH so you can run g++ from any terminal.',
    'Verify your installation by running "g++ --version" in the command prompt.',
  ],
  challenge: {
    statement: 'Write a C++ program that prints "Setup Complete!" to the console. Compile and run it.',
    example: { input: '(none)', output: 'Setup Complete!' },
  },
  testCases: [
    { input: '(none)', expected: 'Setup Complete!', label: 'Prints Setup Complete!' },
  ],
  validate: (code) => {
    const ok = code.includes('Setup Complete') || code.includes('cout') || code.includes('printf');
    return { passed: ok, failedCase: ok ? undefined : 'Your program should print "Setup Complete!"' };
  },
  starterCode: {
    'C++': `#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Setup Complete!" << endl;\n    return 0;\n}`,
    Java: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Setup Complete!");\n    }\n}`,
    Python: `print("Setup Complete!")`,
    C: `#include <stdio.h>\n\nint main() {\n    printf("Setup Complete!\\n");\n    return 0;\n}`,
  },
  narrationSteps: [
    'Welcome! Let us set up your C++ development environment.',
    'Step 1: Download the MinGW-w64 compiler. This provides the g++ command to compile C++ code.',
    'Step 2: Install MinGW and add its bin folder to your system PATH environment variable.',
    'Step 3: Open a terminal and type g++ --version. You should see the compiler version printed.',
    'Step 4: Create a file called hello.cpp with a simple program that prints Hello World.',
    'Step 5: Compile it by running g++ hello.cpp -o hello in the terminal.',
    'Step 6: Run the program with ./hello. You should see Hello World printed. Congratulations, your setup is complete!',
  ],
});

const variables = wrap({
  theory: {
    description: 'A variable is a named container that stores a value in memory. In C++, you must declare a variable with its type before using it. The type determines how much memory is allocated and what operations are valid.',
    timeComplexity: 'N/A',
    spaceComplexity: 'O(1) per variable',
    howItWorks: 'When you write "int x = 5;", the compiler allocates 4 bytes of memory, labels it "x", and stores the binary representation of 5 there. The variable name is just a human-readable alias for a memory address.',
  },
  hints: [
    'Variable names must start with a letter or underscore, not a digit.',
    'Use meaningful names: "studentAge" is better than "x".',
    'Uninitialized variables in C++ contain garbage values — always initialize!',
  ],
  challenge: {
    statement: 'Declare three variables: an integer age (25), a float height (5.9), and a string name ("Alice"). Print each with a label.',
    example: { input: '(none)', output: 'age: 25\nheight: 5.9\nname: Alice' },
  },
  testCases: [
    { input: '(none)', expected: 'age: 25', label: 'Prints age' },
    { input: '(none)', expected: 'name: Alice', label: 'Prints name' },
  ],
  validate: (code) => {
    const ok = code.includes('age') && code.includes('25') && code.includes('Alice');
    return { passed: ok, failedCase: ok ? undefined : 'Declare age=25, height=5.9, name="Alice" and print them' };
  },
  starterCode: {
    'C++': `#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n    int age = 25;\n    float height = 5.9f;\n    string name = "Alice";\n    cout << "age: " << age << endl;\n    cout << "height: " << height << endl;\n    cout << "name: " << name << endl;\n    return 0;\n}`,
    Java: `public class Main {\n    public static void main(String[] args) {\n        int age = 25;\n        float height = 5.9f;\n        String name = "Alice";\n        System.out.println("age: " + age);\n        System.out.println("height: " + height);\n        System.out.println("name: " + name);\n    }\n}`,
    Python: `age = 25\nheight = 5.9\nname = "Alice"\nprint(f"age: {age}")\nprint(f"height: {height}")\nprint(f"name: {name}")`,
    C: `#include <stdio.h>\n\nint main() {\n    int age = 25;\n    float height = 5.9f;\n    char name[] = "Alice";\n    printf("age: %d\\n", age);\n    printf("height: %.1f\\n", height);\n    printf("name: %s\\n", name);\n    return 0;\n}`,
  },
  narrationSteps: [
    'A variable is like a labeled box in memory that holds a value.',
    'We declare an integer variable called age and store the value 25. This takes 4 bytes of memory.',
    'Next, a float called height stores 5.9. Floats use 4 bytes and store decimal numbers.',
    'Finally, a string called name stores the text Alice. Strings can hold any sequence of characters.',
    'Now we print each variable with its label using cout. The values are read from their memory locations.',
    'Each variable has a name, a type, a value, and an address in memory. This is the foundation of all programming.',
  ],
});

const dataTypes = wrap({
  theory: {
    description: 'Data types define the kind of data a variable can hold and how much memory it uses. C++ has fundamental types: int (4 bytes), float (4 bytes), double (8 bytes), char (1 byte), bool (1 byte), and string.',
    timeComplexity: 'N/A',
    spaceComplexity: 'Varies: char=1B, int=4B, double=8B',
    howItWorks: 'The compiler uses the data type to determine: (1) how many bytes to allocate, (2) how to interpret the bits in memory, and (3) what operations are valid. For example, int uses two\'s complement encoding while float uses IEEE 754.',
  },
  hints: [
    'Use sizeof() to check the actual byte size of any type on your system.',
    'float has ~7 decimal digits of precision; double has ~15.',
    'bool stores true (1) or false (0) but actually takes 1 full byte.',
  ],
  challenge: {
    statement: 'Declare one variable of each fundamental type (int, float, double, char, bool) and print each with its sizeof().',
    example: { input: '(none)', output: 'int: 4 bytes\nfloat: 4 bytes\ndouble: 8 bytes\nchar: 1 byte\nbool: 1 byte' },
  },
  testCases: [
    { input: '(none)', expected: 'int:', label: 'Shows int size' },
    { input: '(none)', expected: 'double:', label: 'Shows double size' },
  ],
  validate: (code) => {
    const ok = code.includes('sizeof') && code.includes('int') && code.includes('double');
    return { passed: ok, failedCase: ok ? undefined : 'Use sizeof() for each fundamental type' };
  },
  starterCode: {
    'C++': `#include <iostream>\nusing namespace std;\n\nint main() {\n    int a = 42;\n    float b = 3.14f;\n    double c = 2.71828;\n    char d = 'Z';\n    bool e = true;\n\n    cout << "int: " << sizeof(a) << " bytes" << endl;\n    cout << "float: " << sizeof(b) << " bytes" << endl;\n    cout << "double: " << sizeof(c) << " bytes" << endl;\n    cout << "char: " << sizeof(d) << " byte" << endl;\n    cout << "bool: " << sizeof(e) << " byte" << endl;\n    return 0;\n}`,
    Java: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("int: " + Integer.BYTES + " bytes");\n        System.out.println("float: " + Float.BYTES + " bytes");\n        System.out.println("double: " + Double.BYTES + " bytes");\n        System.out.println("char: " + Character.BYTES + " bytes");\n        System.out.println("boolean: 1 byte (JVM dependent)");\n    }\n}`,
    Python: `import sys\na = 42\nb = 3.14\nc = 'Z'\nd = True\nprint(f"int: {sys.getsizeof(a)} bytes")\nprint(f"float: {sys.getsizeof(b)} bytes")\nprint(f"str: {sys.getsizeof(c)} bytes")\nprint(f"bool: {sys.getsizeof(d)} bytes")`,
    C: `#include <stdio.h>\n#include <stdbool.h>\n\nint main() {\n    printf("int: %zu bytes\\n", sizeof(int));\n    printf("float: %zu bytes\\n", sizeof(float));\n    printf("double: %zu bytes\\n", sizeof(double));\n    printf("char: %zu byte\\n", sizeof(char));\n    printf("bool: %zu byte\\n", sizeof(bool));\n    return 0;\n}`,
  },
  narrationSteps: [
    'Data types tell the compiler how to interpret the bits stored in memory.',
    'An int uses 4 bytes and stores whole numbers. It can hold values up to about 2 billion.',
    'A float also uses 4 bytes but stores decimal numbers using IEEE 754 floating-point format.',
    'A double uses 8 bytes — double the precision of float, with about 15 decimal digits of accuracy.',
    'A char uses just 1 byte and stores a single character using ASCII encoding.',
    'A bool uses 1 byte and stores either true or false. Zero means false, anything else means true.',
    'The sizeof operator lets you check exactly how many bytes each type occupies on your system.',
  ],
});

const inputOutput = wrap({
  theory: {
    description: 'Input/Output (I/O) is how programs communicate with users. In C++, cin reads from the keyboard (standard input) and cout writes to the screen (standard output). These are defined in the <iostream> header.',
    timeComplexity: 'O(n) for n characters',
    spaceComplexity: 'O(n) buffer',
    howItWorks: 'cout uses the insertion operator (<<) to send data to the output stream. cin uses the extraction operator (>>) to read data from the input stream. Data flows like water through a pipe — hence the name "stream".',
  },
  hints: [
    'cin >> stops reading at whitespace. Use getline() to read entire lines.',
    'endl flushes the buffer and adds a newline. \\n is faster if you do not need flushing.',
    'Always validate user input — cin fails silently on type mismatches.',
  ],
  challenge: {
    statement: 'Read two integers from input and print their sum.',
    example: { input: '3 7', output: '10' },
  },
  testCases: [
    { input: '3 7', expected: '10', label: '3 + 7 = 10' },
    { input: '0 0', expected: '0', label: '0 + 0 = 0' },
  ],
  validate: (code) => {
    const hasInput = code.includes('cin') || code.includes('scanf') || code.includes('input') || code.includes('Scanner');
    const hasAdd = code.includes('+');
    const ok = hasInput && hasAdd;
    return { passed: ok, failedCase: ok ? undefined : 'Read two integers and print their sum' };
  },
  starterCode: {
    'C++': `#include <iostream>\nusing namespace std;\n\nint main() {\n    int a, b;\n    cin >> a >> b;\n    cout << a + b << endl;\n    return 0;\n}`,
    Java: `import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int a = sc.nextInt(), b = sc.nextInt();\n        System.out.println(a + b);\n    }\n}`,
    Python: `a, b = map(int, input().split())\nprint(a + b)`,
    C: `#include <stdio.h>\n\nint main() {\n    int a, b;\n    scanf("%d %d", &a, &b);\n    printf("%d\\n", a + b);\n    return 0;\n}`,
  },
  narrationSteps: [
    'Input and Output let your program talk to the user.',
    'We include iostream to access cin and cout — the standard input and output streams.',
    'cin with the extraction operator reads data from the keyboard into variables.',
    'The user types 3 and 7. cin reads them and stores them in variables a and b.',
    'We add a plus b to compute the sum, which equals 10.',
    'cout with the insertion operator sends the result to the screen. The user sees 10.',
    'Data flows through streams like water through a pipe — in from the keyboard, out to the screen.',
  ],
});

const cppSyntax = wrap({
  theory: {
    description: 'C++ syntax is the set of rules that define how programs are written. Key elements include: #include directives for headers, the main() function as the entry point, semicolons to end statements, curly braces for blocks, and comments for documentation.',
    timeComplexity: 'N/A',
    spaceComplexity: 'N/A',
    howItWorks: 'The preprocessor handles #include directives first, copying header file contents. Then the compiler parses statements separated by semicolons, grouped into blocks by braces. main() is the starting point of execution.',
  },
  hints: [
    'Every C++ statement must end with a semicolon (;).',
    'Use // for single-line comments and /* */ for multi-line comments.',
    'Indentation is not required but makes code readable — use consistent spacing.',
  ],
  challenge: {
    statement: 'Write a well-structured C++ program with comments, proper indentation, that prints your name and favorite language.',
    example: { input: '(none)', output: 'Name: Soham\nFavorite: C++' },
  },
  testCases: [
    { input: '(none)', expected: 'Name:', label: 'Prints name' },
  ],
  validate: (code) => {
    const hasInclude = code.includes('#include');
    const hasMain = code.includes('main');
    const hasComment = code.includes('//') || code.includes('/*');
    const ok = hasInclude && hasMain && hasComment;
    return { passed: ok, failedCase: ok ? undefined : 'Include a header, main function, and at least one comment' };
  },
  starterCode: {
    'C++': `// My first well-structured C++ program\n#include <iostream>\nusing namespace std;\n\nint main() {\n    // Print personal info\n    cout << "Name: Soham" << endl;\n    cout << "Favorite: C++" << endl;\n    return 0;  // Exit successfully\n}`,
    Java: `// My first Java program\npublic class Main {\n    public static void main(String[] args) {\n        // Print personal info\n        System.out.println("Name: Soham");\n        System.out.println("Favorite: Java");\n    }\n}`,
    Python: `# My first Python program\n# Print personal info\nprint("Name: Soham")\nprint("Favorite: Python")`,
    C: `/* My first C program */\n#include <stdio.h>\n\nint main() {\n    // Print personal info\n    printf("Name: Soham\\n");\n    printf("Favorite: C\\n");\n    return 0;\n}`,
  },
  narrationSteps: [
    'Let us break down the anatomy of a C++ program.',
    'First, the hash-include directive. This tells the preprocessor to copy the contents of the iostream header file into our program.',
    'Using namespace std allows us to use cout and cin without the std:: prefix.',
    'int main is the entry point — every C++ program starts executing from here.',
    'Curly braces define blocks of code. Everything inside the braces belongs to main.',
    'Each statement ends with a semicolon — this tells the compiler where one instruction ends.',
    'Double-slash creates a comment. Comments are ignored by the compiler but help humans understand the code.',
    'Return 0 tells the operating system that our program finished successfully.',
  ],
});

export const operators = wrap({
  theory: {
    description: 'Operators perform operations on operands. C++ has arithmetic (+, -, *, /, %), relational (==, !=, <, >), logical (&&, ||, !), assignment (=, +=, -=), and bitwise (&, |, ^, ~) operators.',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(1)',
    howItWorks: 'Operators follow precedence rules (like PEMDAS in math). Arithmetic happens before comparison, comparison before logical. Use parentheses to make intent explicit and avoid bugs.',
  },
  hints: [
    'Integer division truncates: 7/2 = 3, not 3.5. Cast to float for decimal results.',
    'Modulo (%) gives the remainder: 10 % 3 = 1.',
    'Short-circuit: in (a && b), if a is false, b is never evaluated.',
  ],
  challenge: {
    statement: 'Given two integers a=10 and b=3, print their sum, difference, product, quotient, and remainder.',
    example: { input: 'a=10, b=3', output: 'Sum: 13\nDiff: 7\nProduct: 30\nQuotient: 3\nRemainder: 1' },
  },
  testCases: [
    { input: 'a=10, b=3', expected: 'Sum: 13', label: 'Sum is 13' },
    { input: 'a=10, b=3', expected: 'Remainder: 1', label: 'Remainder is 1' },
  ],
  validate: (code) => {
    const ok = hasPatterns(code, ['+', '-', '*', '/', '%']);
    return { passed: ok, failedCase: ok ? undefined : 'Use all 5 arithmetic operators' };
  },
  starterCode: {
    'C++': `#include <iostream>\nusing namespace std;\n\nint main() {\n    int a = 10, b = 3;\n    cout << "Sum: " << a + b << endl;\n    cout << "Diff: " << a - b << endl;\n    cout << "Product: " << a * b << endl;\n    cout << "Quotient: " << a / b << endl;\n    cout << "Remainder: " << a % b << endl;\n    return 0;\n}`,
    Java: `public class Main {\n    public static void main(String[] args) {\n        int a = 10, b = 3;\n        System.out.println("Sum: " + (a + b));\n        System.out.println("Diff: " + (a - b));\n        System.out.println("Product: " + (a * b));\n        System.out.println("Quotient: " + (a / b));\n        System.out.println("Remainder: " + (a % b));\n    }\n}`,
    Python: `a, b = 10, 3\nprint(f"Sum: {a+b}")\nprint(f"Diff: {a-b}")\nprint(f"Product: {a*b}")\nprint(f"Quotient: {a//b}")\nprint(f"Remainder: {a%b}")`,
    C: `#include <stdio.h>\n\nint main() {\n    int a = 10, b = 3;\n    printf("Sum: %d\\n", a + b);\n    printf("Diff: %d\\n", a - b);\n    printf("Product: %d\\n", a * b);\n    printf("Quotient: %d\\n", a / b);\n    printf("Remainder: %d\\n", a % b);\n    return 0;\n}`,
  },
  narrationSteps: [
    'Operators are symbols that perform operations on values.',
    'Plus adds two numbers: 10 plus 3 equals 13.',
    'Minus subtracts: 10 minus 3 equals 7.',
    'Asterisk multiplies: 10 times 3 equals 30.',
    'Forward slash divides: 10 divided by 3 equals 3. Notice integer division truncates the decimal!',
    'Percent gives the remainder: 10 modulo 3 equals 1. This is called the modulus operator.',
    'Operators follow precedence rules. Multiplication and division happen before addition and subtraction, just like in math.',
  ],
});

export const typeCasting = wrap({
  theory: {
    description: 'Type casting converts a value from one data type to another. Implicit casting happens automatically (int to float). Explicit casting requires the programmer to specify the conversion using static_cast or C-style casts.',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(1)',
    howItWorks: 'The compiler copies the value and reinterprets it in the new type\'s format. Widening conversions (int→double) are safe. Narrowing conversions (double→int) may lose data — the decimal part is truncated.',
  },
  hints: [
    'Prefer static_cast<type>(value) over C-style (type)value casts in C++.',
    'Implicit conversion follows a hierarchy: char → int → float → double.',
    'Be careful with narrowing: (int)3.99 gives 3, not 4.',
  ],
  challenge: {
    statement: 'Demonstrate implicit and explicit type casting. Convert an int to double, and a double to int, showing the value change.',
    example: { input: '(none)', output: 'int 7 -> double 7.0\ndouble 3.99 -> int 3' },
  },
  testCases: [
    { input: '(none)', expected: '7', label: 'Shows int to double' },
    { input: '(none)', expected: '3', label: 'Shows double to int truncation' },
  ],
  validate: (code) => {
    const ok = (code.includes('static_cast') || code.includes('(int)') || code.includes('(double)') || code.includes('int(') || code.includes('float('));
    return { passed: ok, failedCase: ok ? undefined : 'Use explicit type casting (static_cast or C-style cast)' };
  },
  starterCode: {
    'C++': `#include <iostream>\nusing namespace std;\n\nint main() {\n    // Implicit: int -> double (widening, safe)\n    int a = 7;\n    double b = a;  // automatic\n    cout << "int " << a << " -> double " << b << endl;\n\n    // Explicit: double -> int (narrowing, loses decimal)\n    double c = 3.99;\n    int d = static_cast<int>(c);\n    cout << "double " << c << " -> int " << d << endl;\n    return 0;\n}`,
    Java: `public class Main {\n    public static void main(String[] args) {\n        int a = 7;\n        double b = a;  // implicit widening\n        System.out.println("int " + a + " -> double " + b);\n\n        double c = 3.99;\n        int d = (int) c;  // explicit narrowing\n        System.out.println("double " + c + " -> int " + d);\n    }\n}`,
    Python: `# Python is dynamically typed\na = 7\nb = float(a)\nprint(f"int {a} -> float {b}")\n\nc = 3.99\nd = int(c)\nprint(f"float {c} -> int {d}")`,
    C: `#include <stdio.h>\n\nint main() {\n    int a = 7;\n    double b = a;  /* implicit */\n    printf("int %d -> double %.1f\\n", a, b);\n\n    double c = 3.99;\n    int d = (int)c;  /* explicit */\n    printf("double %.2f -> int %d\\n", c, d);\n    return 0;\n}`,
  },
  narrationSteps: [
    'Type casting converts a value from one type to another.',
    'Implicit casting happens automatically when the conversion is safe. Here, integer 7 becomes double 7.0.',
    'This is called widening — we go from a smaller type to a larger one, so no data is lost.',
    'Explicit casting requires us to tell the compiler. We use static_cast to convert double 3.99 to int.',
    'This is narrowing — the decimal part is truncated. 3.99 becomes 3, not 4. Data is lost!',
    'In C++, prefer static_cast over C-style casts because it is safer and more readable.',
  ],
});

// ═══════════════════════════════════════════════════════════════════════════════
// MODULE 2: BEGINNER DSA
// ═══════════════════════════════════════════════════════════════════════════════

const whatIsDS = wrap({
  theory: {
    description: 'A Data Structure is a way of organizing and storing data so it can be accessed and modified efficiently. Data structures are classified as Linear (Array, Linked List, Stack, Queue) or Non-Linear (Tree, Graph), and as Static (fixed size) or Dynamic (grows/shrinks).',
    timeComplexity: 'Varies by structure',
    spaceComplexity: 'Varies by structure',
    howItWorks: 'Choosing the right data structure depends on the operations you need: fast search? Use a hash table. Fast insert/delete? Use a linked list. LIFO access? Use a stack. The right choice can make your algorithm orders of magnitude faster.',
  },
  hints: [
    'Arrays are static — their size is fixed at creation. Vectors/ArrayLists are dynamic.',
    'Linear structures store data in sequence. Non-linear structures have hierarchical or networked relationships.',
    'Every data structure is a trade-off between time and space complexity.',
  ],
  challenge: {
    statement: 'Create examples of both a static (array) and dynamic (vector) data structure. Add elements and print them.',
    example: { input: '(none)', output: 'Static: [1, 2, 3]\nDynamic: [10, 20, 30, 40]' },
  },
  testCases: [
    { input: '(none)', expected: 'Static:', label: 'Shows static array' },
    { input: '(none)', expected: 'Dynamic:', label: 'Shows dynamic structure' },
  ],
  validate: (code) => {
    const hasStatic = code.includes('int arr') || code.includes('int[]') || code.includes('array');
    const hasDynamic = code.includes('vector') || code.includes('ArrayList') || code.includes('list') || code.includes('append') || code.includes('push_back');
    const ok = hasStatic && hasDynamic;
    return { passed: ok, failedCase: ok ? undefined : 'Show both a static array and a dynamic container' };
  },
  starterCode: {
    'C++': `#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    // Static: fixed-size array\n    int arr[3] = {1, 2, 3};\n    cout << "Static: [";\n    for (int i = 0; i < 3; i++)\n        cout << arr[i] << (i < 2 ? ", " : "");\n    cout << "]" << endl;\n\n    // Dynamic: vector grows as needed\n    vector<int> vec;\n    vec.push_back(10);\n    vec.push_back(20);\n    vec.push_back(30);\n    vec.push_back(40);\n    cout << "Dynamic: [";\n    for (int i = 0; i < vec.size(); i++)\n        cout << vec[i] << (i < vec.size()-1 ? ", " : "");\n    cout << "]" << endl;\n    return 0;\n}`,
    Java: `import java.util.ArrayList;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Static array\n        int[] arr = {1, 2, 3};\n        System.out.print("Static: [");\n        for (int i = 0; i < arr.length; i++)\n            System.out.print(arr[i] + (i < 2 ? ", " : ""));\n        System.out.println("]");\n\n        // Dynamic ArrayList\n        ArrayList<Integer> list = new ArrayList<>();\n        list.add(10); list.add(20); list.add(30); list.add(40);\n        System.out.println("Dynamic: " + list);\n    }\n}`,
    Python: `# Static-like: tuple (immutable)\narr = (1, 2, 3)\nprint(f"Static: {list(arr)}")\n\n# Dynamic: list\nvec = []\nvec.append(10)\nvec.append(20)\nvec.append(30)\nvec.append(40)\nprint(f"Dynamic: {vec}")`,
    C: `#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n    /* Static array */\n    int arr[3] = {1, 2, 3};\n    printf("Static: [%d, %d, %d]\\n", arr[0], arr[1], arr[2]);\n\n    /* Dynamic: malloc */\n    int* vec = (int*)malloc(4 * sizeof(int));\n    vec[0]=10; vec[1]=20; vec[2]=30; vec[3]=40;\n    printf("Dynamic: [%d, %d, %d, %d]\\n", vec[0], vec[1], vec[2], vec[3]);\n    free(vec);\n    return 0;\n}`,
  },
  narrationSteps: [
    'A data structure is a way to organize data in memory for efficient access.',
    'Data structures are classified into two main categories: Linear and Non-Linear.',
    'Linear structures store data in sequence: Arrays, Linked Lists, Stacks, and Queues.',
    'Non-Linear structures have hierarchical or networked relationships: Trees and Graphs.',
    'Static data structures like arrays have a fixed size decided at creation time.',
    'Dynamic data structures like vectors can grow and shrink as elements are added or removed.',
    'Choosing the right data structure is one of the most important decisions in programming. It determines how fast your program runs.',
  ],
});

const controlStatements = wrap({
  theory: {
    description: 'Control statements alter the flow of execution. if/else chooses between paths based on conditions. switch-case handles multiple discrete values. The ternary operator (? :) is a compact if/else for expressions.',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(1)',
    howItWorks: 'The CPU evaluates the boolean condition. If true, it jumps to the if-block. If false, it jumps to the else-block (or skips). Switch uses a jump table for O(1) dispatch to the matching case.',
  },
  hints: [
    'Always use braces {} even for single-statement blocks to prevent bugs.',
    'switch requires break after each case to prevent fall-through.',
    'Nested ifs can often be simplified with logical operators (&&, ||).',
  ],
  challenge: {
    statement: 'Given an integer, classify it as "Positive", "Negative", or "Zero".',
    example: { input: '-5', output: 'Negative' },
  },
  testCases: [
    { input: '7', expected: 'Positive', label: '7 → Positive' },
    { input: '-3', expected: 'Negative', label: '-3 → Negative' },
    { input: '0', expected: 'Zero', label: '0 → Zero' },
  ],
  validate: (code) => {
    const ok = code.includes('if') && code.includes('Positive') && code.includes('Negative') && code.includes('Zero');
    return { passed: ok, failedCase: ok ? undefined : 'Handle all 3 cases: Positive, Negative, Zero' };
  },
  starterCode: {
    'C++': `#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    if (n > 0) {\n        cout << "Positive" << endl;\n    } else if (n < 0) {\n        cout << "Negative" << endl;\n    } else {\n        cout << "Zero" << endl;\n    }\n    return 0;\n}`,
    Java: `import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        if (n > 0) System.out.println("Positive");\n        else if (n < 0) System.out.println("Negative");\n        else System.out.println("Zero");\n    }\n}`,
    Python: `n = int(input())\nif n > 0:\n    print("Positive")\nelif n < 0:\n    print("Negative")\nelse:\n    print("Zero")`,
    C: `#include <stdio.h>\n\nint main() {\n    int n;\n    scanf("%d", &n);\n    if (n > 0) printf("Positive\\n");\n    else if (n < 0) printf("Negative\\n");\n    else printf("Zero\\n");\n    return 0;\n}`,
  },
  narrationSteps: [
    'Control statements let your program make decisions.',
    'We read an integer from the user. Let us say they enter negative 5.',
    'The if statement checks: is n greater than 0? Negative 5 is not, so we skip this block.',
    'The else-if checks: is n less than 0? Yes! Negative 5 is less than 0, so we enter this block.',
    'We print Negative and skip the else block entirely.',
    'The program follows exactly one path through the branches — like choosing a fork in the road.',
  ],
});

const loops = wrap({
  theory: {
    description: 'Loops repeat a block of code multiple times. for loops iterate a known number of times. while loops continue while a condition is true. do-while executes at least once. break exits early; continue skips to the next iteration.',
    timeComplexity: 'O(n) for n iterations',
    spaceComplexity: 'O(1)',
    howItWorks: 'The loop has three parts: initialization (start), condition (continue?), and update (step). Each cycle: check condition → execute body → update. When condition is false, the loop ends.',
  },
  hints: [
    'Off-by-one errors are the most common loop bug — carefully check your bounds.',
    'An infinite loop happens when the condition never becomes false.',
    'Nested loops multiply iterations: two O(n) loops nested = O(n²).',
  ],
  challenge: {
    statement: 'Print all even numbers from 2 to n (inclusive).',
    example: { input: '10', output: '2 4 6 8 10' },
  },
  testCases: [
    { input: '10', expected: '2 4 6 8 10', label: 'Even numbers 1-10' },
    { input: '6', expected: '2 4 6', label: 'Even numbers 1-6' },
  ],
  validate: (code) => {
    const hasLoop = code.includes('for') || code.includes('while');
    const hasEven = code.includes('% 2') || code.includes('+= 2') || code.includes('range(2');
    const ok = hasLoop && hasEven;
    return { passed: ok, failedCase: ok ? undefined : 'Use a loop to print even numbers' };
  },
  starterCode: {
    'C++': `#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    for (int i = 2; i <= n; i += 2) {\n        cout << i << " ";\n    }\n    cout << endl;\n    return 0;\n}`,
    Java: `import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        for (int i = 2; i <= n; i += 2)\n            System.out.print(i + " ");\n        System.out.println();\n    }\n}`,
    Python: `n = int(input())\nprint(*range(2, n+1, 2))`,
    C: `#include <stdio.h>\n\nint main() {\n    int n;\n    scanf("%d", &n);\n    for (int i = 2; i <= n; i += 2)\n        printf("%d ", i);\n    printf("\\n");\n    return 0;\n}`,
  },
  narrationSteps: [
    'Loops let us repeat code without writing it multiple times.',
    'A for loop has three parts: initialization, condition, and update.',
    'We start with i equals 2. This is our initialization.',
    'The condition checks: is i less than or equal to n? If yes, we enter the loop body.',
    'We print the value of i, which is 2.',
    'The update step adds 2 to i. Now i is 4.',
    'We check again: is 4 less than or equal to 10? Yes! Print 4. Update: i becomes 6.',
    'This continues: 6, 8, 10. When i becomes 12, the condition is false and the loop ends.',
    'The loop ran 5 times, printing all even numbers from 2 to 10.',
  ],
});

const arraysContent = wrap({
  theory: {
    description: 'An array is a collection of elements of the same type stored in contiguous memory locations. Elements are accessed by their index (starting from 0). Arrays provide O(1) random access but O(n) insertion and deletion.',
    timeComplexity: 'Access O(1), Search O(n), Insert/Delete O(n)',
    spaceComplexity: 'O(n)',
    howItWorks: 'When you declare int arr[5], the compiler allocates 5×4=20 bytes of contiguous memory. arr[i] accesses the element at address: base + i × sizeof(int). This formula gives O(1) access.',
  },
  hints: [
    'Array indices start at 0 and end at size-1. arr[5] has valid indices 0-4.',
    'Accessing out-of-bounds is undefined behavior in C/C++ — no error, just garbage or crash.',
    'For 2D arrays, think of them as an array of arrays: arr[row][col].',
  ],
  challenge: {
    statement: 'Given an array of n integers, find and print the maximum element.',
    example: { input: '5\n3 1 4 1 5', output: '5' },
  },
  testCases: [
    { input: '5\n3 1 4 1 5', expected: '5', label: 'Max of [3,1,4,1,5]' },
    { input: '3\n-1 -5 -2', expected: '-1', label: 'Max of negatives' },
  ],
  validate: (code) => {
    const ok = (code.includes('arr') || code.includes('array') || code.includes('vector')) && (code.includes('max') || code.includes('>'));
    return { passed: ok, failedCase: ok ? undefined : 'Use an array and find the maximum' };
  },
  starterCode: {
    'C++': `#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    int arr[100];\n    for (int i = 0; i < n; i++) cin >> arr[i];\n\n    int maxVal = arr[0];\n    for (int i = 1; i < n; i++) {\n        if (arr[i] > maxVal) maxVal = arr[i];\n    }\n    cout << maxVal << endl;\n    return 0;\n}`,
    Java: `import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] arr = new int[n];\n        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();\n        int max = arr[0];\n        for (int i = 1; i < n; i++) if (arr[i] > max) max = arr[i];\n        System.out.println(max);\n    }\n}`,
    Python: `n = int(input())\narr = list(map(int, input().split()))\nprint(max(arr))`,
    C: `#include <stdio.h>\n\nint main() {\n    int n; scanf("%d", &n);\n    int arr[100];\n    for (int i = 0; i < n; i++) scanf("%d", &arr[i]);\n    int max = arr[0];\n    for (int i = 1; i < n; i++) if (arr[i] > max) max = arr[i];\n    printf("%d\\n", max);\n    return 0;\n}`,
  },
  narrationSteps: [
    'An array stores multiple values of the same type in consecutive memory locations.',
    'We declare an array of integers. Each element lives next to the other in memory.',
    'We read 5 values: 3, 1, 4, 1, 5. They go into indices 0 through 4.',
    'To find the maximum, we start by assuming the first element is the largest.',
    'We compare each element with our current maximum. Is 1 greater than 3? No. Is 4 greater than 3? Yes! Update max to 4.',
    'Continue: is 1 greater than 4? No. Is 5 greater than 4? Yes! Update max to 5.',
    'We have scanned the entire array. The maximum value is 5.',
    'Array access by index is O(1) — constant time. But finding the max requires O(n) — we must check every element.',
  ],
});

const arraysAndStrings = wrap({
  theory: {
    description: 'Strings in C++ can be represented as C-style char arrays (null-terminated) or std::string objects. std::string provides methods like length(), substr(), find(), and operator+ for concatenation.',
    timeComplexity: 'Access O(1), Concat O(n+m), Search O(n×m)',
    spaceComplexity: 'O(n)',
    howItWorks: 'C-strings are char arrays ending with \'\\0\'. std::string manages memory automatically and provides safe operations. String methods iterate over characters internally.',
  },
  hints: [
    'C-strings need +1 byte for the null terminator. "hello" uses 6 bytes.',
    'Use std::string in C++ instead of char arrays for safety and convenience.',
    'string::find returns string::npos if the substring is not found.',
  ],
  challenge: {
    statement: 'Check if a string is a palindrome.',
    example: { input: 'racecar', output: 'true' },
  },
  testCases: [
    { input: 'racecar', expected: 'true', label: '"racecar" palindrome' },
    { input: 'hello', expected: 'false', label: '"hello" not palindrome' },
  ],
  validate: (code) => {
    const ok = (code.includes('reverse') || code.includes('[::-1]') || code.includes('i < n/2') || code.includes('left') || code.includes('right'));
    return { passed: ok, failedCase: ok ? undefined : 'Reverse and compare or use two pointers' };
  },
  starterCode: {
    'C++': `#include <iostream>\n#include <string>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    string s;\n    cin >> s;\n    string rev = s;\n    reverse(rev.begin(), rev.end());\n    cout << (s == rev ? "true" : "false") << endl;\n    return 0;\n}`,
    Java: `import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        String s = new Scanner(System.in).next();\n        String rev = new StringBuilder(s).reverse().toString();\n        System.out.println(s.equals(rev));\n    }\n}`,
    Python: `s = input()\nprint(str(s == s[::-1]).lower())`,
    C: `#include <stdio.h>\n#include <string.h>\n\nint main() {\n    char s[1000];\n    scanf("%s", s);\n    int n = strlen(s), ok = 1;\n    for (int i = 0; i < n/2; i++)\n        if (s[i] != s[n-1-i]) { ok = 0; break; }\n    printf("%s\\n", ok ? "true" : "false");\n    return 0;\n}`,
  },
  narrationSteps: [
    'Strings are sequences of characters. Let us check if "racecar" is a palindrome.',
    'A palindrome reads the same forwards and backwards.',
    'We store the original string and create a reversed copy.',
    'The reverse function swaps characters from both ends toward the middle.',
    'r-a-c-e-c-a-r reversed is still r-a-c-e-c-a-r. They match!',
    'Since the original equals the reversed version, this is a palindrome. We print true.',
  ],
});

const pointers = wrap({
  theory: {
    description: 'A pointer is a variable that stores the memory address of another variable. The address-of operator (&) gets an address. The dereference operator (*) accesses the value at an address. nullptr represents a pointer that points to nothing.',
    timeComplexity: 'O(1) for pointer operations',
    spaceComplexity: 'O(1) per pointer (8 bytes on 64-bit)',
    howItWorks: 'When you write int* p = &x, p stores the memory address of x. *p reads/writes the value at that address. Pointer arithmetic moves by sizeof(type) bytes.',
  },
  hints: [
    'Always initialize pointers. Uninitialized pointers point to random memory.',
    'Check for nullptr before dereferencing to avoid segmentation faults.',
    'Pointer arithmetic: (p + 1) moves to the next element, not the next byte.',
  ],
  challenge: {
    statement: 'Create an integer, a pointer to it, modify the value through the pointer, and print both.',
    example: { input: '(none)', output: 'Before: 5\nAfter: 10' },
  },
  testCases: [
    { input: '(none)', expected: 'Before: 5', label: 'Original value' },
    { input: '(none)', expected: 'After: 10', label: 'Modified via pointer' },
  ],
  validate: (code) => {
    const ok = code.includes('*') && code.includes('&');
    return { passed: ok, failedCase: ok ? undefined : 'Use * to dereference and & to get address' };
  },
  starterCode: {
    'C++': `#include <iostream>\nusing namespace std;\n\nint main() {\n    int x = 5;\n    int* p = &x;  // p points to x\n\n    cout << "Before: " << x << endl;\n    *p = 10;  // modify x through the pointer\n    cout << "After: " << x << endl;\n    cout << "Address: " << p << endl;\n    return 0;\n}`,
    Java: `// Java doesn't have pointers — uses references instead\npublic class Main {\n    static int[] wrapper = {5};\n    public static void main(String[] args) {\n        System.out.println("Before: " + wrapper[0]);\n        modify(wrapper);\n        System.out.println("After: " + wrapper[0]);\n    }\n    static void modify(int[] w) { w[0] = 10; }\n}`,
    Python: `# Python uses references, not pointers\nx = [5]  # mutable container\nprint(f"Before: {x[0]}")\nx[0] = 10\nprint(f"After: {x[0]}")`,
    C: `#include <stdio.h>\n\nint main() {\n    int x = 5;\n    int* p = &x;\n    printf("Before: %d\\n", x);\n    *p = 10;\n    printf("After: %d\\n", x);\n    printf("Address: %p\\n", (void*)p);\n    return 0;\n}`,
  },
  narrationSteps: [
    'A pointer is a variable that holds a memory address instead of a regular value.',
    'We create integer x with value 5. It lives at some address in memory, say 0x7fff.',
    'We create pointer p using int-star. The ampersand operator gets the address of x.',
    'Now p contains 0x7fff — it points to x. Think of it as an arrow from p to x.',
    'The asterisk operator dereferences p — it follows the arrow and accesses the value at that address.',
    'We write star-p equals 10. This changes the value at the address p points to. Since p points to x, x becomes 10.',
    'We print x again and it shows 10. We modified x indirectly through the pointer!',
  ],
});

const byRefByVal = wrap({
  theory: {
    description: 'Pass-by-value copies the argument\'s value into the function parameter — changes inside the function do not affect the original. Pass-by-reference passes the actual variable (via pointer or reference) — changes inside affect the original.',
    timeComplexity: 'O(1) for primitive types',
    spaceComplexity: 'By value: O(size of copy), By reference: O(1)',
    howItWorks: 'By value: the function gets its own copy on the stack. By reference (int& or int*): the function gets the address of the original variable and can modify it directly.',
  },
  hints: [
    'Use pass-by-reference for large objects to avoid expensive copying.',
    'Use const reference (const int&) when you want efficiency but don\'t need to modify.',
    'In C, pass-by-reference is simulated using pointers.',
  ],
  challenge: {
    statement: 'Write two swap functions: one by value (fails) and one by reference (works). Show the difference.',
    example: { input: 'a=3, b=7', output: 'By value: a=3, b=7 (unchanged)\nBy reference: a=7, b=3 (swapped)' },
  },
  testCases: [
    { input: 'a=3, b=7', expected: 'unchanged', label: 'By value fails' },
    { input: 'a=3, b=7', expected: 'swapped', label: 'By reference works' },
  ],
  validate: (code) => {
    const ok = code.includes('swap') && (code.includes('&') || code.includes('*'));
    return { passed: ok, failedCase: ok ? undefined : 'Implement both by-value and by-reference swap' };
  },
  starterCode: {
    'C++': `#include <iostream>\nusing namespace std;\n\n// By value — copies, original unchanged\nvoid swapByValue(int a, int b) {\n    int tmp = a; a = b; b = tmp;\n}\n\n// By reference — aliases, original changes\nvoid swapByRef(int& a, int& b) {\n    int tmp = a; a = b; b = tmp;\n}\n\nint main() {\n    int a = 3, b = 7;\n\n    swapByValue(a, b);\n    cout << "By value: a=" << a << ", b=" << b << " (unchanged)" << endl;\n\n    swapByRef(a, b);\n    cout << "By reference: a=" << a << ", b=" << b << " (swapped)" << endl;\n    return 0;\n}`,
    Java: `public class Main {\n    // Java is always pass-by-value for primitives\n    static void swapFail(int a, int b) {\n        int t = a; a = b; b = t;\n    }\n    static int[] swapArray(int[] arr) {\n        int t = arr[0]; arr[0] = arr[1]; arr[1] = t;\n        return arr;\n    }\n    public static void main(String[] args) {\n        int a = 3, b = 7;\n        swapFail(a, b);\n        System.out.println("By value: a=" + a + ", b=" + b + " (unchanged)");\n        int[] arr = {a, b};\n        swapArray(arr);\n        System.out.println("By reference: a=" + arr[0] + ", b=" + arr[1] + " (swapped)");\n    }\n}`,
    Python: `# Python passes object references by value\ndef swap_fail(a, b):\n    a, b = b, a  # local swap only\n\ndef swap_list(lst):\n    lst[0], lst[1] = lst[1], lst[0]\n\na, b = 3, 7\nswap_fail(a, b)\nprint(f"By value: a={a}, b={b} (unchanged)")\nlst = [a, b]\nswap_list(lst)\nprint(f"By reference: a={lst[0]}, b={lst[1]} (swapped)")`,
    C: `#include <stdio.h>\n\nvoid swapByValue(int a, int b) {\n    int t = a; a = b; b = t;\n}\nvoid swapByRef(int* a, int* b) {\n    int t = *a; *a = *b; *b = t;\n}\nint main() {\n    int a = 3, b = 7;\n    swapByValue(a, b);\n    printf("By value: a=%d, b=%d (unchanged)\\n", a, b);\n    swapByRef(&a, &b);\n    printf("By reference: a=%d, b=%d (swapped)\\n", a, b);\n    return 0;\n}`,
  },
  narrationSteps: [
    'There are two ways to pass arguments to a function: by value and by reference.',
    'By value: the function receives a COPY. We call swapByValue with a=3 and b=7.',
    'Inside the function, the copies are swapped. But the originals are untouched.',
    'Back in main, a is still 3 and b is still 7. The swap failed!',
    'By reference: the function receives the ORIGINAL variable using the ampersand. We call swapByRef.',
    'Inside the function, we are working with the actual a and b, not copies.',
    'The swap succeeds! Back in main, a is now 7 and b is now 3.',
    'Use pass-by-reference when you need the function to modify the original variables.',
  ],
});

const structures = wrap({
  theory: {
    description: 'A struct (structure) groups related variables of different types under one name. Members are accessed with the dot operator. Structs let you create custom data types that model real-world entities.',
    timeComplexity: 'O(1) member access',
    spaceComplexity: 'O(sum of member sizes) + padding',
    howItWorks: 'When you define a struct, the compiler calculates the total size (with alignment padding). Creating a struct variable allocates that many bytes. Members are at fixed offsets from the struct\'s base address.',
  },
  hints: [
    'In C++, struct members are public by default (unlike class which defaults to private).',
    'Use structs for Plain Old Data (POD) — just data, minimal behavior.',
    'You can create arrays of structs to store collections of records.',
  ],
  challenge: {
    statement: 'Define a Student struct with name, age, and grade. Create a student, set fields, and print them.',
    example: { input: '(none)', output: 'Name: Alice\nAge: 20\nGrade: A' },
  },
  testCases: [
    { input: '(none)', expected: 'Name: Alice', label: 'Shows name' },
    { input: '(none)', expected: 'Grade: A', label: 'Shows grade' },
  ],
  validate: (code) => {
    const ok = code.includes('struct') && (code.includes('name') || code.includes('Name')) && (code.includes('age') || code.includes('Age'));
    return { passed: ok, failedCase: ok ? undefined : 'Define a struct with name, age, and grade fields' };
  },
  starterCode: {
    'C++': `#include <iostream>\n#include <string>\nusing namespace std;\n\nstruct Student {\n    string name;\n    int age;\n    char grade;\n};\n\nint main() {\n    Student s;\n    s.name = "Alice";\n    s.age = 20;\n    s.grade = 'A';\n\n    cout << "Name: " << s.name << endl;\n    cout << "Age: " << s.age << endl;\n    cout << "Grade: " << s.grade << endl;\n    return 0;\n}`,
    Java: `public class Main {\n    static class Student {\n        String name;\n        int age;\n        char grade;\n    }\n    public static void main(String[] args) {\n        Student s = new Student();\n        s.name = "Alice";\n        s.age = 20;\n        s.grade = 'A';\n        System.out.println("Name: " + s.name);\n        System.out.println("Age: " + s.age);\n        System.out.println("Grade: " + s.grade);\n    }\n}`,
    Python: `class Student:\n    def __init__(self, name, age, grade):\n        self.name = name\n        self.age = age\n        self.grade = grade\n\ns = Student("Alice", 20, "A")\nprint(f"Name: {s.name}")\nprint(f"Age: {s.age}")\nprint(f"Grade: {s.grade}")`,
    C: `#include <stdio.h>\n#include <string.h>\n\nstruct Student {\n    char name[50];\n    int age;\n    char grade;\n};\n\nint main() {\n    struct Student s;\n    strcpy(s.name, "Alice");\n    s.age = 20;\n    s.grade = 'A';\n    printf("Name: %s\\nAge: %d\\nGrade: %c\\n", s.name, s.age, s.grade);\n    return 0;\n}`,
  },
  narrationSteps: [
    'A struct groups related variables together into a single custom type.',
    'We define a Student struct with three members: name (string), age (int), and grade (char).',
    'Think of a struct as a blueprint. It describes what data a Student has, but does not create one yet.',
    'We create a variable s of type Student. The compiler allocates memory for all three members together.',
    'We use the dot operator to access each member and assign values.',
    'The dot operator reads the member at its fixed offset from the struct base address.',
    'Structs are the foundation for building complex data types. Classes in C++ are just structs with extra features.',
  ],
});

const stlIntro = wrap({
  theory: {
    description: 'The Standard Template Library (STL) provides ready-made data structures and algorithms. Key containers: vector (dynamic array), stack (LIFO), queue (FIFO), map (key-value), and set (unique sorted elements).',
    timeComplexity: 'vector: access O(1), push_back amortized O(1) | map/set: O(log n) | unordered_map: O(1) average',
    spaceComplexity: 'O(n) for all containers',
    howItWorks: 'STL containers are template classes that manage memory automatically. vector uses a dynamic array that doubles in size when full. map uses a red-black tree. unordered_map uses a hash table.',
  },
  hints: [
    'Use vector instead of raw arrays — it manages memory for you.',
    'map is sorted by key (O(log n)); unordered_map is faster (O(1)) but unordered.',
    'Use .size(), .empty(), .begin(), .end() — they work on ALL STL containers.',
  ],
  challenge: {
    statement: 'Demonstrate vector (push_back, iterate), and map (insert, lookup). Print contents and sizes.',
    example: { input: '(none)', output: 'Vector: [10, 20, 30] size=3\nMap: {a:1, b:2}' },
  },
  testCases: [
    { input: '(none)', expected: 'Vector:', label: 'Shows vector' },
    { input: '(none)', expected: 'Map:', label: 'Shows map' },
  ],
  validate: (code) => {
    const ok = code.includes('vector') && (code.includes('map') || code.includes('Map') || code.includes('dict'));
    return { passed: ok, failedCase: ok ? undefined : 'Use both vector and map containers' };
  },
  starterCode: {
    'C++': `#include <iostream>\n#include <vector>\n#include <map>\nusing namespace std;\n\nint main() {\n    // Vector — dynamic array\n    vector<int> v;\n    v.push_back(10);\n    v.push_back(20);\n    v.push_back(30);\n    cout << "Vector: [";\n    for (int i = 0; i < v.size(); i++)\n        cout << v[i] << (i < v.size()-1 ? ", " : "");\n    cout << "] size=" << v.size() << endl;\n\n    // Map — key-value pairs\n    map<string, int> m;\n    m["a"] = 1;\n    m["b"] = 2;\n    cout << "Map: {";\n    for (auto it = m.begin(); it != m.end(); ++it)\n        cout << it->first << ":" << it->second << (next(it) != m.end() ? ", " : "");\n    cout << "}" << endl;\n    return 0;\n}`,
    Java: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        ArrayList<Integer> v = new ArrayList<>();\n        v.add(10); v.add(20); v.add(30);\n        System.out.println("Vector: " + v + " size=" + v.size());\n\n        TreeMap<String, Integer> m = new TreeMap<>();\n        m.put("a", 1); m.put("b", 2);\n        System.out.println("Map: " + m);\n    }\n}`,
    Python: `# List — dynamic array\nv = []\nv.append(10)\nv.append(20)\nv.append(30)\nprint(f"Vector: {v} size={len(v)}")\n\n# Dict — key-value pairs\nm = {"a": 1, "b": 2}\nprint(f"Map: {m}")`,
    C: `#include <stdio.h>\n/* C has no STL — manual implementation needed */\nint main() {\n    int v[100], vSize = 0;\n    v[vSize++] = 10;\n    v[vSize++] = 20;\n    v[vSize++] = 30;\n    printf("Vector: [");\n    for (int i = 0; i < vSize; i++)\n        printf("%d%s", v[i], i < vSize-1 ? ", " : "");\n    printf("] size=%d\\n", vSize);\n    printf("Map: C has no built-in map\\n");\n    return 0;\n}`,
  },
  narrationSteps: [
    'The STL provides ready-made containers so you do not need to build them from scratch.',
    'A vector is a dynamic array. We push_back 10, 20, and 30. It grows automatically.',
    'Vector access by index is O(1), and push_back is amortized O(1). Very efficient!',
    'A map stores key-value pairs sorted by key. We insert a maps to 1, b maps to 2.',
    'Map operations like insert and lookup take O(log n) because it uses a balanced tree internally.',
    'For faster lookups, use unordered_map which uses hashing for O(1) average time.',
    'STL containers all share common methods: size, empty, begin, end. Learn one, and the patterns apply to all.',
  ],
});

export const complexityAnalysis = wrap({
  theory: {
    description: 'Time complexity measures how the running time grows with input size. Space complexity measures memory usage. Big-O notation describes the upper bound: O(1) constant, O(log n) logarithmic, O(n) linear, O(n log n) linearithmic, O(n²) quadratic.',
    timeComplexity: 'N/A — this IS the topic',
    spaceComplexity: 'N/A — this IS the topic',
    howItWorks: 'Count the dominant operations as a function of n. Drop constants and lower-order terms. O(3n+5) = O(n). Nested loops multiply: O(n)×O(n) = O(n²). Binary halving gives O(log n).',
  },
  hints: [
    'Focus on the worst case — that is what Big-O measures.',
    'A single loop over n elements is O(n). Two nested loops are O(n²).',
    'Halving the search space each step (like binary search) gives O(log n).',
  ],
  challenge: {
    statement: 'Write three functions demonstrating O(1), O(n), and O(n²) time complexity. Print how many operations each performs for n=5.',
    example: { input: '5', output: 'O(1): 1 op\nO(n): 5 ops\nO(n²): 25 ops' },
  },
  testCases: [
    { input: '5', expected: 'O(1):', label: 'Shows constant' },
    { input: '5', expected: 'O(n²):', label: 'Shows quadratic' },
  ],
  validate: (code) => {
    const ok = code.includes('for') && (code.includes('O(1)') || code.includes('o(1)') || code.includes('constant'));
    return { passed: ok, failedCase: ok ? undefined : 'Demonstrate O(1), O(n), and O(n²) with operation counts' };
  },
  starterCode: {
    'C++': `#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    int ops;\n\n    // O(1) — constant\n    ops = 1;\n    cout << "O(1): " << ops << " op" << endl;\n\n    // O(n) — linear\n    ops = 0;\n    for (int i = 0; i < n; i++) ops++;\n    cout << "O(n): " << ops << " ops" << endl;\n\n    // O(n²) — quadratic\n    ops = 0;\n    for (int i = 0; i < n; i++)\n        for (int j = 0; j < n; j++)\n            ops++;\n    cout << "O(n²): " << ops << " ops" << endl;\n    return 0;\n}`,
    Java: `import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        int n = new Scanner(System.in).nextInt();\n        System.out.println("O(1): 1 op");\n        int ops = 0;\n        for (int i = 0; i < n; i++) ops++;\n        System.out.println("O(n): " + ops + " ops");\n        ops = 0;\n        for (int i = 0; i < n; i++)\n            for (int j = 0; j < n; j++) ops++;\n        System.out.println("O(n²): " + ops + " ops");\n    }\n}`,
    Python: `n = int(input())\nprint(f"O(1): 1 op")\nops = sum(1 for _ in range(n))\nprint(f"O(n): {ops} ops")\nops = sum(1 for _ in range(n) for _ in range(n))\nprint(f"O(n²): {ops} ops")`,
    C: `#include <stdio.h>\n\nint main() {\n    int n; scanf("%d", &n);\n    printf("O(1): 1 op\\n");\n    int ops = 0;\n    for (int i = 0; i < n; i++) ops++;\n    printf("O(n): %d ops\\n", ops);\n    ops = 0;\n    for (int i = 0; i < n; i++)\n        for (int j = 0; j < n; j++) ops++;\n    printf("O(n²): %d ops\\n", ops);\n    return 0;\n}`,
  },
  narrationSteps: [
    'Time complexity tells us how an algorithm scales as the input grows.',
    'O of 1 means constant time. No matter how big n is, it always does the same work.',
    'O of n means linear time. Double the input, double the work. One loop over n elements.',
    'O of n-squared means quadratic time. Double the input, quadruple the work! Two nested loops.',
    'For n equals 5: O(1) does 1 operation, O(n) does 5, and O(n²) does 25.',
    'Now imagine n equals 1000: O(1) is still 1, O(n) is 1000, but O(n²) is 1 million operations!',
    'Big-O notation ignores constants and lower terms. O(3n plus 5) simplifies to O(n).',
    'Choosing the right algorithm can mean the difference between seconds and hours of running time.',
  ],
});

// ═══════════════════════════════════════════════════════════════════════════════
// OOP (kept from original)
// ═══════════════════════════════════════════════════════════════════════════════

const classesObjects = wrap({
  theory: {
    description: 'A class is a blueprint for creating objects. Objects are instances of classes that bundle data (fields) and behavior (methods) together.',
    timeComplexity: 'O(1) for object creation',
    spaceComplexity: 'O(fields) per instance',
    howItWorks: 'Define a class with fields and methods. Instantiate with new (C++/Java) or calling the class (Python). Each object has its own copy of instance fields.',
  },
  hints: [
    'Use access modifiers (private/public/protected) to control visibility.',
    'this refers to the current object instance.',
    'Separate interface (what) from implementation (how).',
  ],
  challenge: {
    statement: 'Create a Rectangle class with width and height fields and an area() method.',
    example: { input: 'width=4, height=5', output: 'Area: 20' },
  },
  testCases: [
    { input: 'width=4, height=5', expected: 'Area: 20', label: '4×5 = 20' },
  ],
  validate: (code) => {
    const ok = code.includes('class') && (code.includes('area') || code.includes('Area'));
    return { passed: ok, failedCase: ok ? undefined : 'Define a class with an area() method' };
  },
  starterCode: {
    'C++': `#include <iostream>\nusing namespace std;\n\nclass Rectangle {\npublic:\n    int width, height;\n    Rectangle(int w, int h) : width(w), height(h) {}\n    int area() { return width * height; }\n};\n\nint main() {\n    Rectangle r(4, 5);\n    cout << "Area: " << r.area() << endl;\n    return 0;\n}`,
    Java: `public class Main {\n    static class Rectangle {\n        int width, height;\n        Rectangle(int w, int h) { width = w; height = h; }\n        int area() { return width * height; }\n    }\n    public static void main(String[] args) {\n        Rectangle r = new Rectangle(4, 5);\n        System.out.println("Area: " + r.area());\n    }\n}`,
    Python: `class Rectangle:\n    def __init__(self, width, height):\n        self.width = width\n        self.height = height\n    def area(self):\n        return self.width * self.height\n\nr = Rectangle(4, 5)\nprint(f"Area: {r.area()}")`,
    C: `#include <stdio.h>\n\ntypedef struct { int width, height; } Rectangle;\nint area(Rectangle* r) { return r->width * r->height; }\n\nint main() {\n    Rectangle r = {4, 5};\n    printf("Area: %d\\n", area(&r));\n    return 0;\n}`,
  },
});

const inheritance = wrap({
  theory: {
    description: 'Inheritance allows a class to inherit fields and methods from another class, enabling code reuse and hierarchical relationships.',
    timeComplexity: 'O(1) for method dispatch',
    spaceComplexity: 'O(parent + child fields)',
    howItWorks: 'The child class extends the parent, inheriting all non-private members. The child can override methods to provide specialized behavior.',
  },
  hints: [
    'Prefer composition over inheritance when the relationship is not truly "is-a".',
    'Use super() to call the parent class constructor.',
    'Multiple inheritance (C++) can cause the diamond problem.',
  ],
  challenge: {
    statement: 'Create Animal base class with speak(). Dog and Cat override it.',
    example: { input: '(none)', output: 'Woof!\nMeow!' },
  },
  testCases: [
    { input: '(none)', expected: 'Woof!', label: 'Dog says Woof!' },
    { input: '(none)', expected: 'Meow!', label: 'Cat says Meow!' },
  ],
  validate: (code) => {
    const ok = code.includes('Woof') && code.includes('Meow') && (code.includes('extends') || code.includes(':') || code.includes('Animal'));
    return { passed: ok, failedCase: ok ? undefined : 'Extend Animal in Dog and Cat, override speak()' };
  },
  starterCode: {
    'C++': `#include <iostream>\nusing namespace std;\n\nclass Animal {\npublic:\n    virtual void speak() { cout << "..." << endl; }\n};\nclass Dog : public Animal {\npublic:\n    void speak() override { cout << "Woof!" << endl; }\n};\nclass Cat : public Animal {\npublic:\n    void speak() override { cout << "Meow!" << endl; }\n};\n\nint main() {\n    Dog d; Cat c;\n    d.speak(); c.speak();\n    return 0;\n}`,
    Java: `public class Main {\n    static class Animal { void speak() { System.out.println("..."); } }\n    static class Dog extends Animal { void speak() { System.out.println("Woof!"); } }\n    static class Cat extends Animal { void speak() { System.out.println("Meow!"); } }\n    public static void main(String[] args) { new Dog().speak(); new Cat().speak(); }\n}`,
    Python: `class Animal:\n    def speak(self): print("...")\nclass Dog(Animal):\n    def speak(self): print("Woof!")\nclass Cat(Animal):\n    def speak(self): print("Meow!")\n\nDog().speak()\nCat().speak()`,
    C: `#include <stdio.h>\ntypedef struct { void (*speak)(); } Animal;\nvoid dog_speak() { printf("Woof!\\n"); }\nvoid cat_speak() { printf("Meow!\\n"); }\nint main() {\n    Animal dog = {dog_speak}, cat = {cat_speak};\n    dog.speak(); cat.speak();\n    return 0;\n}`,
  },
});

// ═══════════════════════════════════════════════════════════════════════════════
// DATA STRUCTURES (kept from original)
// ═══════════════════════════════════════════════════════════════════════════════

const linkedLists = wrap({
  theory: {
    description: 'A linked list is a linear data structure where each node contains data and a pointer to the next node.',
    timeComplexity: 'Access O(n), Insert/Delete head O(1), tail O(n)',
    spaceComplexity: 'O(n)',
    howItWorks: 'Each node holds a value and a next pointer. Traversal follows next pointers until null.',
  },
  hints: ['Update next pointer before moving current.', 'Use a dummy head to simplify edge cases.', 'Floyd\'s algorithm detects cycles.'],
  challenge: { statement: 'Implement insert and print for a singly linked list.', example: { input: 'insert 1,2,3', output: '1 -> 2 -> 3 -> null' } },
  testCases: [{ input: 'insert 1,2,3', expected: '1 -> 2 -> 3 -> null', label: 'LL 1→2→3' }],
  validate: (code) => {
    const ok = code.includes('Node') && code.includes('next');
    return { passed: ok, failedCase: ok ? undefined : 'Define a Node with next pointer' };
  },
  starterCode: {
    'C++': `#include <iostream>\nusing namespace std;\nstruct Node { int val; Node* next; Node(int v):val(v),next(nullptr){} };\nint main() {\n    Node* head = new Node(1);\n    head->next = new Node(2);\n    head->next->next = new Node(3);\n    for (Node* c = head; c; c = c->next) cout << c->val << " -> ";\n    cout << "null" << endl;\n    return 0;\n}`,
    Java: `public class Main {\n    static class Node { int val; Node next; Node(int v){val=v;} }\n    public static void main(String[] args) {\n        Node h = new Node(1); h.next = new Node(2); h.next.next = new Node(3);\n        for (Node c=h; c!=null; c=c.next) System.out.print(c.val+" -> ");\n        System.out.println("null");\n    }\n}`,
    Python: `class Node:\n    def __init__(self, val): self.val = val; self.next = None\nh = Node(1); h.next = Node(2); h.next.next = Node(3)\nc = h\nwhile c:\n    print(c.val, "->", end=" ")\n    c = c.next\nprint("null")`,
    C: `#include <stdio.h>\n#include <stdlib.h>\ntypedef struct Node { int val; struct Node* next; } Node;\nNode* newN(int v) { Node* n=malloc(sizeof(Node)); n->val=v; n->next=NULL; return n; }\nint main() {\n    Node* h=newN(1); h->next=newN(2); h->next->next=newN(3);\n    for (Node* c=h;c;c=c->next) printf("%d -> ",c->val);\n    printf("null\\n"); return 0;\n}`,
  },
});

const stack = wrap({
  theory: {
    description: 'A stack is a LIFO (Last In, First Out) data structure. Push adds to top, Pop removes from top.',
    timeComplexity: 'Push/Pop/Peek O(1)',
    spaceComplexity: 'O(n)',
    howItWorks: 'Maintain a top pointer. Push stores at top and increments. Pop reads top and decrements.',
  },
  hints: ['Check overflow/underflow.', 'Balanced brackets is a classic stack problem.', 'Function calls use a stack internally.'],
  challenge: { statement: 'Check if brackets are balanced: (), [], {}.', example: { input: '{[()]}', output: 'true' } },
  testCases: [{ input: '{[()]}', expected: 'true', label: 'Balanced' }, { input: '([)]', expected: 'false', label: 'Not balanced' }],
  validate: (code) => {
    const ok = (code.includes('stack') || code.includes('Stack') || code.includes('push')) && code.includes('pop');
    return { passed: ok, failedCase: ok ? undefined : 'Use stack push/pop for bracket matching' };
  },
  starterCode: {
    'C++': `#include <iostream>\n#include <stack>\nusing namespace std;\nbool isBalanced(string s) {\n    stack<char> st;\n    for (char c : s) {\n        if (c=='('||c=='['||c=='{') st.push(c);\n        else { if (st.empty()) return false; char t=st.top(); st.pop();\n            if ((c==')'&&t!='(')||(c==']'&&t!='[')||(c=='}'&&t!='{')) return false; }\n    } return st.empty();\n}\nint main() { string s; cin>>s; cout<<(isBalanced(s)?"true":"false")<<endl; }`,
    Java: `import java.util.*;\npublic class Main {\n    static boolean isBalanced(String s) {\n        Deque<Character> st=new ArrayDeque<>();\n        for (char c:s.toCharArray()) {\n            if ("([{".indexOf(c)>=0) st.push(c);\n            else { if (st.isEmpty()) return false; char t=st.pop();\n                if ((c==')'&&t!='(')||(c==']'&&t!='[')||(c=='}'&&t!='{')) return false; }\n        } return st.isEmpty();\n    }\n    public static void main(String[] a) { System.out.println(isBalanced(new Scanner(System.in).next())); }\n}`,
    Python: `def is_balanced(s):\n    st=[]; pairs={')':'(',']':'[','}':'{'}\n    for c in s:\n        if c in '([{': st.append(c)\n        elif c in ')]}':\n            if not st or st[-1]!=pairs[c]: return False\n            st.pop()\n    return len(st)==0\nprint(str(is_balanced(input())).lower())`,
    C: `#include <stdio.h>\n#include <string.h>\nint main() {\n    char s[1000],st[1000]; int top=-1;\n    scanf("%s",s);\n    for (int i=0;s[i];i++) {\n        char c=s[i];\n        if (c=='('||c=='['||c=='{') st[++top]=c;\n        else { if (top<0){printf("false\\n");return 0;}\n            char t=st[top--];\n            if ((c==')'&&t!='(')||(c==']'&&t!='[')||(c=='}'&&t!='{')){printf("false\\n");return 0;}\n        }\n    } printf("%s\\n",top<0?"true":"false"); return 0;\n}`,
  },
});

const binarySearchTree = wrap({
  theory: {
    description: 'A BST is a binary tree where left subtree values < node < right subtree values. This enables O(log n) search.',
    timeComplexity: 'Average O(log n), Worst O(n)',
    spaceComplexity: 'O(n)',
    howItWorks: 'Insert compares with root, goes left if smaller, right if larger. Search follows the same path.',
  },
  hints: ['Inorder traversal of BST gives sorted output.', 'Balanced BSTs guarantee O(log n).', 'Deletion has 3 cases: leaf, one child, two children.'],
  challenge: { statement: 'Insert values into a BST and print inorder traversal.', example: { input: '5 3 7 1 4', output: '1 3 4 5 7' } },
  testCases: [{ input: '5 3 7 1 4', expected: '1 3 4 5 7', label: 'Inorder sorted' }],
  validate: (code) => {
    const ok = code.includes('insert') && (code.includes('left') || code.includes('right'));
    return { passed: ok, failedCase: ok ? undefined : 'Implement BST insert with left/right comparison' };
  },
  starterCode: {
    'C++': `#include <iostream>\nusing namespace std;\nstruct Node { int val; Node *left,*right; Node(int v):val(v),left(nullptr),right(nullptr){} };\nNode* insert(Node* r,int v) { if(!r) return new Node(v); if(v<r->val) r->left=insert(r->left,v); else if(v>r->val) r->right=insert(r->right,v); return r; }\nvoid inorder(Node* r) { if(!r) return; inorder(r->left); cout<<r->val<<" "; inorder(r->right); }\nint main() { Node* r=nullptr; for(int v:{5,3,7,1,4}) r=insert(r,v); inorder(r); cout<<endl; }`,
    Java: `public class Main {\n    static class Node { int v; Node l,r; Node(int v){this.v=v;} }\n    static Node insert(Node r,int v) { if(r==null) return new Node(v); if(v<r.v) r.l=insert(r.l,v); else if(v>r.v) r.r=insert(r.r,v); return r; }\n    static void inorder(Node r) { if(r==null) return; inorder(r.l); System.out.print(r.v+" "); inorder(r.r); }\n    public static void main(String[] a) { Node r=null; for(int v:new int[]{5,3,7,1,4}) r=insert(r,v); inorder(r); System.out.println(); }\n}`,
    Python: `class Node:\n    def __init__(s,v): s.val=v; s.left=s.right=None\ndef insert(r,v):\n    if not r: return Node(v)\n    if v<r.val: r.left=insert(r.left,v)\n    elif v>r.val: r.right=insert(r.right,v)\n    return r\ndef inorder(r):\n    if not r: return\n    inorder(r.left); print(r.val,end=' '); inorder(r.right)\nr=None\nfor v in [5,3,7,1,4]: r=insert(r,v)\ninorder(r); print()`,
    C: `#include <stdio.h>\n#include <stdlib.h>\ntypedef struct N { int v; struct N *l,*r; } N;\nN* newN(int v){N* n=malloc(sizeof(N));n->v=v;n->l=n->r=NULL;return n;}\nN* ins(N* r,int v){if(!r)return newN(v);if(v<r->v)r->l=ins(r->l,v);else if(v>r->v)r->r=ins(r->r,v);return r;}\nvoid io(N* r){if(!r)return;io(r->l);printf("%d ",r->v);io(r->r);}\nint main(){N* r=NULL;int a[]={5,3,7,1,4};for(int i=0;i<5;i++)r=ins(r,a[i]);io(r);printf("\\n");}`,
  },
});

const sortingAlgorithms = wrap({
  theory: {
    description: 'Sorting arranges elements in order. Bubble sort: O(n²) simple. Merge sort: O(n log n) divide-and-conquer. Quick sort: O(n log n) average.',
    timeComplexity: 'Bubble O(n²), Merge O(n log n)',
    spaceComplexity: 'Bubble O(1), Merge O(n)',
    howItWorks: 'Bubble repeatedly swaps adjacent out-of-order elements. Merge divides, sorts halves, then merges.',
  },
  hints: ['Merge sort is stable, quick sort is not.', 'For small arrays, insertion sort can be faster.', 'std::sort uses introsort (quicksort + heapsort).'],
  challenge: { statement: 'Implement merge sort.', example: { input: '5\n5 3 1 4 2', output: '1 2 3 4 5' } },
  testCases: [{ input: '5\n5 3 1 4 2', expected: '1 2 3 4 5', label: 'Sorted ascending' }],
  validate: (code) => {
    const ok = (code.includes('merge') || code.includes('sort')) && code.includes('mid');
    return { passed: ok, failedCase: ok ? undefined : 'Implement merge sort with divide and merge' };
  },
  starterCode: {
    'C++': `#include <iostream>\n#include <vector>\nusing namespace std;\nvoid merge(vector<int>&a,int l,int m,int r){vector<int>L(a.begin()+l,a.begin()+m+1),R(a.begin()+m+1,a.begin()+r+1);int i=0,j=0,k=l;while(i<L.size()&&j<R.size())a[k++]=L[i]<=R[j]?L[i++]:R[j++];while(i<L.size())a[k++]=L[i++];while(j<R.size())a[k++]=R[j++];}\nvoid mergeSort(vector<int>&a,int l,int r){if(l>=r)return;int m=(l+r)/2;mergeSort(a,l,m);mergeSort(a,m+1,r);merge(a,l,m,r);}\nint main(){int n;cin>>n;vector<int>a(n);for(int&x:a)cin>>x;mergeSort(a,0,n-1);for(int x:a)cout<<x<<" ";cout<<endl;}`,
    Java: `import java.util.*;\npublic class Main {\n    static void ms(int[]a,int l,int r){if(l>=r)return;int m=(l+r)/2;ms(a,l,m);ms(a,m+1,r);int[]t=Arrays.copyOfRange(a,l,r+1);int i=0,j=m-l+1,k=l;while(i<=m-l&&j<=r-l)a[k++]=t[i]<=t[j]?t[i++]:t[j++];while(i<=m-l)a[k++]=t[i++];while(j<=r-l)a[k++]=t[j++];}\n    public static void main(String[]args){Scanner sc=new Scanner(System.in);int n=sc.nextInt();int[]a=new int[n];for(int i=0;i<n;i++)a[i]=sc.nextInt();ms(a,0,n-1);for(int x:a)System.out.print(x+" ");System.out.println();}\n}`,
    Python: `def merge_sort(a):\n    if len(a)<=1: return a\n    m=len(a)//2\n    l,r=merge_sort(a[:m]),merge_sort(a[m:])\n    res=[]; i=j=0\n    while i<len(l) and j<len(r): res.append(l[i] if l[i]<=r[j] else r[j]); i+=l[i]<=r[j]; j+=l[i-1 if l[i-1:i] else 0]>r[j-1 if r[j-1:j] else 0] if False else (not (l[i-1]<=r[j-1] if i and j else True))\n    return res+l[i:]+r[j:]\nn=int(input()); a=list(map(int,input().split())); print(*merge_sort(a))`,
    C: `#include <stdio.h>\nvoid merge(int*a,int l,int m,int r){int n=r-l+1,t[n],i=l,j=m+1,k=0;while(i<=m&&j<=r)t[k++]=a[i]<=a[j]?a[i++]:a[j++];while(i<=m)t[k++]=a[i++];while(j<=r)t[k++]=a[j++];for(int x=0;x<n;x++)a[l+x]=t[x];}\nvoid ms(int*a,int l,int r){if(l>=r)return;int m=(l+r)/2;ms(a,l,m);ms(a,m+1,r);merge(a,l,m,r);}\nint main(){int n;scanf("%d",&n);int a[n];for(int i=0;i<n;i++)scanf("%d",&a[i]);ms(a,0,n-1);for(int i=0;i<n;i++)printf("%d ",a[i]);printf("\\n");}`,
  },
});

const searchingAlgorithms = wrap({
  theory: {
    description: 'Binary search finds a target in a sorted array in O(log n) by halving the search space each step.',
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(1) iterative, O(log n) recursive',
    howItWorks: 'Compare target with middle element. If equal, found. If target < mid, search left half. If target > mid, search right half.',
  },
  hints: ['Array MUST be sorted for binary search.', 'Use left + (right-left)/2 to avoid integer overflow.', 'Off-by-one: use <= in while condition.'],
  challenge: { statement: 'Implement binary search on a sorted array.', example: { input: 'arr=[-1,0,3,5,9,12] target=9', output: '4' } },
  testCases: [{ input: 'target=9', expected: '4', label: 'Found at index 4' }],
  validate: (code) => {
    const ok = code.includes('mid') && (code.includes('left') || code.includes('lo') || code.includes('low'));
    return { passed: ok, failedCase: ok ? undefined : 'Implement binary search with left/right/mid pointers' };
  },
  starterCode: {
    'C++': `#include <iostream>\n#include <vector>\nusing namespace std;\nint binarySearch(vector<int>&a,int t){int l=0,r=a.size()-1;while(l<=r){int m=l+(r-l)/2;if(a[m]==t)return m;else if(a[m]<t)l=m+1;else r=m-1;}return -1;}\nint main(){vector<int>a={-1,0,3,5,9,12};cout<<binarySearch(a,9)<<endl;}`,
    Java: `public class Main {\n    static int bs(int[]a,int t){int l=0,r=a.length-1;while(l<=r){int m=l+(r-l)/2;if(a[m]==t)return m;if(a[m]<t)l=m+1;else r=m-1;}return -1;}\n    public static void main(String[]args){System.out.println(bs(new int[]{-1,0,3,5,9,12},9));}\n}`,
    Python: `def bs(a,t):\n    l,r=0,len(a)-1\n    while l<=r:\n        m=(l+r)//2\n        if a[m]==t: return m\n        elif a[m]<t: l=m+1\n        else: r=m-1\n    return -1\nprint(bs([-1,0,3,5,9,12],9))`,
    C: `#include <stdio.h>\nint bs(int*a,int n,int t){int l=0,r=n-1;while(l<=r){int m=l+(r-l)/2;if(a[m]==t)return m;if(a[m]<t)l=m+1;else r=m-1;}return -1;}\nint main(){int a[]={-1,0,3,5,9,12};printf("%d\\n",bs(a,6,9));}`,
  },
});

// ═══════════════════════════════════════════════════════════════════════════════
// TOPIC CONTENT MAP
// ═══════════════════════════════════════════════════════════════════════════════

const topicContentMap: Record<string, TopicContent> = {
  // ── Prerequisite ──
  'c-install-guide': cppInstallGuide,
  'variables': variables,
  'data-types': dataTypes,
  'input-output': inputOutput,
  'syntax': cppSyntax,
  
  // ── Beginner DSA ──
  'what-is-data-structure-static-dynamic': whatIsDS,
  'control-statements': controlStatements,
  'loops': loops,
  'arrays': arraysContent,
  'arrays-strings': arraysAndStrings,
  'pointers': pointers,
  'by-value-vs-by-reference': byRefByVal,
  'structures': structures,
  'stl-complexity': stlIntro,
  
  // ── OOP ──
  'classes-objects': classesObjects,
  'inheritance': inheritance,
  // ── Data Structures ──
  'linked-lists': linkedLists,
  'stack': stack,
  'binary-search-tree': binarySearchTree,
  'sorting-algorithms': sortingAlgorithms,
  'searching-algorithms': searchingAlgorithms,
};

const defaultContent: TopicContent = {
  theory: {
    description: 'This topic covers fundamental concepts that are essential for building strong programming foundations.',
    timeComplexity: 'Varies by implementation',
    spaceComplexity: 'Varies by implementation',
    howItWorks: 'Study the theory, implement the code in your preferred language, and test with the challenge below.',
  },
  hints: [
    'Break the problem into smaller sub-problems.',
    'Think about edge cases: empty input, single element, maximum values.',
    'Test your solution with the provided examples before submitting.',
  ],
  challenge: {
    statement: 'Implement the core concept of this topic and demonstrate it with a working example.',
    example: { input: 'See topic description', output: 'Correct output for given input' },
  },
  testCases: [
    { input: 'any', expected: 'any', label: 'Solution compiles and runs' },
  ],
  validate: (code) => {
    const lines = code.split('\n').filter(l => l.trim() && !l.trim().startsWith('//') && !l.trim().startsWith('#'));
    const ok = lines.length >= 3;
    return { passed: ok, failedCase: ok ? undefined : 'Write a complete solution with at least a few lines of code' };
  },
  starterCode: {
    'C++': `#include <iostream>\nusing namespace std;\n\nint main() {\n    // Your solution here\n    cout << "Hello from C++!" << endl;\n    return 0;\n}`,
    Java: `public class Main {\n    public static void main(String[] args) {\n        // Your solution here\n        System.out.println("Hello from Java!");\n    }\n}`,
    Python: `# Your solution here\nprint("Hello from Python!")`,
    C: `#include <stdio.h>\n\nint main() {\n    // Your solution here\n    printf("Hello from C!\\n");\n    return 0;\n}`,
  },
};

export const getTopicContent = (topicId: string): TopicContent =>
  topicContentMap[topicId] ?? defaultContent;
