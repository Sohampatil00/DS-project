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
  // Test cases for client-side validation
  testCases: TestCase[];
  // Validate user code by checking for required patterns
  validate: (code: string, lang: LangKey) => { passed: boolean; failedCase?: string };
  starterCode: Record<LangKey, string>;
}

const wrap = (content: TopicContent): TopicContent => content;

// Helper: check if code contains all required patterns
const hasPatterns = (code: string, patterns: string[]): boolean =>
  patterns.every(p => code.toLowerCase().includes(p.toLowerCase()));

// ─── FUNDAMENTALS ────────────────────────────────────────────────────────────

const introToProgramming = wrap({
  theory: {
    description: 'Programming is the process of writing instructions for a computer to execute. A program is a sequence of statements that tell the computer what to do.',
    timeComplexity: 'N/A',
    spaceComplexity: 'N/A',
    howItWorks: 'You write source code in a high-level language, which is compiled or interpreted into machine code the CPU can execute.',
  },
  hints: [
    'Every program starts with a main entry point.',
    'Statements are executed top-to-bottom unless control flow changes that.',
    'Comments help document your code — use them liberally.',
  ],
  challenge: {
    statement: 'Write a program that prints "Hello, World!" to the console.',
    example: { input: '(none)', output: 'Hello, World!' },
  },
  testCases: [
    { input: '(none)', expected: 'Hello, World!', label: 'Prints Hello, World!' },
  ],
  validate: (code) => {
    const ok = code.includes('Hello, World!');
    return { passed: ok, failedCase: ok ? undefined : 'Output must contain "Hello, World!"' };
  },
  starterCode: {
    'C++': `#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}`,
    Java: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}`,
    Python: `print("Hello, World!")`,
    C: `#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}`,
  },
});

const variablesDataTypes = wrap({
  theory: {
    description: 'Variables are named storage locations in memory. Data types define what kind of value a variable can hold: integers, floats, characters, booleans, etc.',
    timeComplexity: 'N/A',
    spaceComplexity: 'O(1) per variable',
    howItWorks: 'Declare a variable with a type and name. The compiler allocates the right amount of memory. Strongly-typed languages enforce type rules at compile time.',
  },
  hints: [
    'Use descriptive variable names — avoid single letters except for loop counters.',
    'Integer overflow happens when a value exceeds the type\'s max range.',
    'Floating-point numbers have precision limits — avoid == comparisons.',
  ],
  challenge: {
    statement: 'Declare an integer, a float, and a string. Print each with a label.',
    example: { input: '(none)', output: 'age: 25\nheight: 5.9\nname: Alice' },
  },
  testCases: [
    { input: '(none)', expected: 'age: 25', label: 'Prints age: 25' },
    { input: '(none)', expected: 'name: Alice', label: 'Prints name: Alice' },
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
});

const operatorsExpressions = wrap({
  theory: {
    description: 'Operators perform operations on operands. Categories include arithmetic (+,-,*,/,%), relational (==,!=,<,>), logical (&&,||,!), bitwise (&,|,^,~,<<,>>), and assignment (=,+=,-=).',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(1)',
    howItWorks: 'Operators follow precedence rules (PEMDAS-like). Use parentheses to make intent explicit. Short-circuit evaluation applies to && and ||.',
  },
  hints: [
    'Integer division truncates: 7/2 = 3 in C/C++/Java.',
    'Use % (modulo) to check even/odd: n % 2 == 0 means even.',
    'Bitwise left shift << multiplies by powers of 2.',
  ],
  challenge: {
    statement: 'Given two integers a and b, print their sum, difference, product, quotient, and remainder.',
    example: { input: 'a=10, b=3', output: 'Sum: 13\nDiff: 7\nProduct: 30\nQuotient: 3\nRemainder: 1' },
  },
  testCases: [
    { input: 'a=10, b=3', expected: 'Sum: 13', label: 'Sum is 13' },
    { input: 'a=10, b=3', expected: 'Remainder: 1', label: 'Remainder is 1' },
  ],
  validate: (code) => {
    const hasArith = hasPatterns(code, ['+', '-', '*', '/', '%']);
    const hasPrint = code.includes('Sum') || code.includes('sum') || code.includes('cout') || code.includes('print') || code.includes('printf');
    const ok = hasArith && hasPrint;
    return { passed: ok, failedCase: ok ? undefined : 'Use all 5 arithmetic operators and print the results' };
  },
  starterCode: {
    'C++': `#include <iostream>\nusing namespace std;\n\nint main() {\n    int a = 10, b = 3;\n    cout << "Sum: " << a + b << endl;\n    cout << "Diff: " << a - b << endl;\n    cout << "Product: " << a * b << endl;\n    cout << "Quotient: " << a / b << endl;\n    cout << "Remainder: " << a % b << endl;\n    return 0;\n}`,
    Java: `public class Main {\n    public static void main(String[] args) {\n        int a = 10, b = 3;\n        System.out.println("Sum: " + (a + b));\n        System.out.println("Diff: " + (a - b));\n        System.out.println("Product: " + (a * b));\n        System.out.println("Quotient: " + (a / b));\n        System.out.println("Remainder: " + (a % b));\n    }\n}`,
    Python: `a, b = 10, 3\nprint(f"Sum: {a+b}")\nprint(f"Diff: {a-b}")\nprint(f"Product: {a*b}")\nprint(f"Quotient: {a//b}")\nprint(f"Remainder: {a%b}")`,
    C: `#include <stdio.h>\n\nint main() {\n    int a = 10, b = 3;\n    printf("Sum: %d\\n", a + b);\n    printf("Diff: %d\\n", a - b);\n    printf("Product: %d\\n", a * b);\n    printf("Quotient: %d\\n", a / b);\n    printf("Remainder: %d\\n", a % b);\n    return 0;\n}`,
  },
});

const inputOutput = wrap({
  theory: {
    description: 'I/O operations let programs communicate with users. Standard input reads from keyboard; standard output writes to console. Formatted I/O allows precise control over how data is displayed.',
    timeComplexity: 'O(n) for n characters',
    spaceComplexity: 'O(n) buffer',
    howItWorks: 'cin/scanf reads tokens from stdin. cout/printf writes to stdout. In Python, input() reads a line and print() writes one.',
  },
  hints: [
    'Always validate user input — never assume it\'s correct.',
    'Use format specifiers (%d, %f, %s) in C printf/scanf.',
    'Python\'s input() always returns a string — cast with int() or float() as needed.',
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
    const hasInput = code.includes('cin') || code.includes('scanf') || code.includes('input') || code.includes('Scanner') || code.includes('nextInt');
    const hasAdd = code.includes('+') || code.includes('sum') || code.includes('add');
    const ok = hasInput && hasAdd;
    return { passed: ok, failedCase: ok ? undefined : 'Read two integers from input and print their sum' };
  },
  starterCode: {
    'C++': `#include <iostream>\nusing namespace std;\n\nint main() {\n    int a, b;\n    cin >> a >> b;\n    cout << a + b << endl;\n    return 0;\n}`,
    Java: `import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int a = sc.nextInt(), b = sc.nextInt();\n        System.out.println(a + b);\n    }\n}`,
    Python: `a, b = map(int, input().split())\nprint(a + b)`,
    C: `#include <stdio.h>\n\nint main() {\n    int a, b;\n    scanf("%d %d", &a, &b);\n    printf("%d\\n", a + b);\n    return 0;\n}`,
  },
});

const controlFlowConditionals = wrap({
  theory: {
    description: 'Conditionals allow programs to make decisions. if/else/else-if chains execute different code blocks based on boolean conditions. switch/case handles multiple discrete values efficiently.',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(1)',
    howItWorks: 'The condition is evaluated. If true, the if-block runs; otherwise the else-block runs. Conditions can be chained with else-if for multiple branches.',
  },
  hints: [
    'Don\'t forget break in switch-case to prevent fall-through.',
    'Use ternary operator for simple one-liners: x > 0 ? "pos" : "neg".',
    'Nested ifs can often be flattened with logical operators.',
  ],
  challenge: {
    statement: 'Given an integer n, print "Positive", "Negative", or "Zero".',
    example: { input: '-5', output: 'Negative' },
  },
  testCases: [
    { input: '7', expected: 'Positive', label: '7 → Positive' },
    { input: '-3', expected: 'Negative', label: '-3 → Negative' },
    { input: '0', expected: 'Zero', label: '0 → Zero' },
  ],
  validate: (code) => {
    const hasIf = code.includes('if') || code.includes('elif') || code.includes('else if');
    const hasPos = code.includes('Positive') || code.includes('positive');
    const hasNeg = code.includes('Negative') || code.includes('negative');
    const hasZero = code.includes('Zero') || code.includes('zero');
    const ok = hasIf && hasPos && hasNeg && hasZero;
    return { passed: ok, failedCase: ok ? undefined : 'Handle all 3 cases: Positive, Negative, Zero' };
  },
  starterCode: {
    'C++': `#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    if (n > 0) cout << "Positive" << endl;\n    else if (n < 0) cout << "Negative" << endl;\n    else cout << "Zero" << endl;\n    return 0;\n}`,
    Java: `import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        if (n > 0) System.out.println("Positive");\n        else if (n < 0) System.out.println("Negative");\n        else System.out.println("Zero");\n    }\n}`,
    Python: `n = int(input())\nif n > 0:\n    print("Positive")\nelif n < 0:\n    print("Negative")\nelse:\n    print("Zero")`,
    C: `#include <stdio.h>\n\nint main() {\n    int n;\n    scanf("%d", &n);\n    if (n > 0) printf("Positive\\n");\n    else if (n < 0) printf("Negative\\n");\n    else printf("Zero\\n");\n    return 0;\n}`,
  },
});

const controlFlowLoops = wrap({
  theory: {
    description: 'Loops repeat a block of code. for loops iterate a known number of times. while loops run while a condition is true. do-while runs at least once. break exits a loop; continue skips to the next iteration.',
    timeComplexity: 'O(n) for n iterations',
    spaceComplexity: 'O(1)',
    howItWorks: 'The loop condition is checked before each iteration (or after for do-while). The loop variable is updated each cycle until the condition becomes false.',
  },
  hints: [
    'Off-by-one errors are common — double-check loop bounds.',
    'Infinite loops happen when the condition never becomes false.',
    'Nested loops multiply complexity: O(n²) for two nested O(n) loops.',
  ],
  challenge: {
    statement: 'Print all even numbers from 1 to n (inclusive).',
    example: { input: '10', output: '2 4 6 8 10' },
  },
  testCases: [
    { input: '10', expected: '2 4 6 8 10', label: 'Even numbers 1-10' },
    { input: '6', expected: '2 4 6', label: 'Even numbers 1-6' },
  ],
  validate: (code) => {
    const hasLoop = code.includes('for') || code.includes('while');
    const hasEven = code.includes('% 2') || code.includes('%2') || code.includes('+= 2') || code.includes('+=2') || code.includes('step 2') || code.includes('range(2');
    const ok = hasLoop && hasEven;
    return { passed: ok, failedCase: ok ? undefined : 'Use a loop and check/step by 2 to print even numbers' };
  },
  starterCode: {
    'C++': `#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    for (int i = 2; i <= n; i += 2)\n        cout << i << " ";\n    cout << endl;\n    return 0;\n}`,
    Java: `import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        for (int i = 2; i <= n; i += 2)\n            System.out.print(i + " ");\n        System.out.println();\n    }\n}`,
    Python: `n = int(input())\nprint(*range(2, n+1, 2))`,
    C: `#include <stdio.h>\n\nint main() {\n    int n;\n    scanf("%d", &n);\n    for (int i = 2; i <= n; i += 2)\n        printf("%d ", i);\n    printf("\\n");\n    return 0;\n}`,
  },
});

const functionsScope = wrap({
  theory: {
    description: 'Functions are reusable blocks of code that perform a specific task. They take parameters as input and return a value. Scope determines where a variable is accessible.',
    timeComplexity: 'O(1) call overhead',
    spaceComplexity: 'O(d) where d = call depth (stack frames)',
    howItWorks: 'When a function is called, a new stack frame is created with local variables. When it returns, the frame is popped. Global variables persist across calls.',
  },
  hints: [
    'Keep functions small and focused on one task (Single Responsibility).',
    'Avoid global variables — prefer passing parameters.',
    'Default parameter values reduce the need for overloaded functions.',
  ],
  challenge: {
    statement: 'Write a function isPrime(n) that returns true if n is prime, false otherwise.',
    example: { input: '7', output: 'true' },
  },
  testCases: [
    { input: '7', expected: 'true', label: '7 is prime' },
    { input: '4', expected: 'false', label: '4 is not prime' },
    { input: '2', expected: 'true', label: '2 is prime' },
  ],
  validate: (code) => {
    const hasFunc = code.includes('isPrime') || code.includes('is_prime') || code.includes('prime');
    const hasLoop = code.includes('for') || code.includes('while');
    const hasMod = code.includes('%') || code.includes('mod');
    const ok = hasFunc && hasLoop && hasMod;
    return { passed: ok, failedCase: ok ? undefined : 'Define a function that uses a loop and modulo to check primality' };
  },
  starterCode: {
    'C++': `#include <iostream>\nusing namespace std;\n\nbool isPrime(int n) {\n    if (n < 2) return false;\n    for (int i = 2; i * i <= n; i++)\n        if (n % i == 0) return false;\n    return true;\n}\n\nint main() {\n    int n; cin >> n;\n    cout << (isPrime(n) ? "true" : "false") << endl;\n    return 0;\n}`,
    Java: `import java.util.Scanner;\n\npublic class Main {\n    static boolean isPrime(int n) {\n        if (n < 2) return false;\n        for (int i = 2; i * i <= n; i++)\n            if (n % i == 0) return false;\n        return true;\n    }\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        System.out.println(isPrime(sc.nextInt()));\n    }\n}`,
    Python: `def is_prime(n):\n    if n < 2: return False\n    for i in range(2, int(n**0.5)+1):\n        if n % i == 0: return False\n    return True\n\nn = int(input())\nprint(str(is_prime(n)).lower())`,
    C: `#include <stdio.h>\n#include <stdbool.h>\n\nbool isPrime(int n) {\n    if (n < 2) return false;\n    for (int i = 2; i * i <= n; i++)\n        if (n % i == 0) return false;\n    return true;\n}\n\nint main() {\n    int n; scanf("%d", &n);\n    printf("%s\\n", isPrime(n) ? "true" : "false");\n    return 0;\n}`,
  },
});

const recursion = wrap({
  theory: {
    description: 'Recursion is when a function calls itself to solve a smaller version of the same problem. Every recursive function needs a base case (stopping condition) and a recursive case.',
    timeComplexity: 'Varies — O(n) for linear, O(2ⁿ) for naive Fibonacci',
    spaceComplexity: 'O(n) call stack depth',
    howItWorks: 'Each recursive call adds a frame to the call stack. When the base case is reached, the stack unwinds and results propagate back up.',
  },
  hints: [
    'Always define the base case first to prevent infinite recursion.',
    'Draw the recursion tree to understand the call pattern.',
    'Memoization converts exponential recursion to linear time.',
  ],
  challenge: {
    statement: 'Implement factorial(n) recursively. factorial(0) = 1, factorial(n) = n * factorial(n-1).',
    example: { input: '5', output: '120' },
  },
  testCases: [
    { input: '5', expected: '120', label: 'factorial(5) = 120' },
    { input: '0', expected: '1', label: 'factorial(0) = 1' },
    { input: '3', expected: '6', label: 'factorial(3) = 6' },
  ],
  validate: (code) => {
    const hasFunc = code.includes('factorial') || code.includes('fact');
    const hasRecursion = (code.match(/factorial|fact/g) || []).length >= 2;
    const hasBase = code.includes('<= 1') || code.includes('== 0') || code.includes('== 1') || code.includes('n <= 1') || code.includes('n == 0');
    const ok = hasFunc && hasRecursion && hasBase;
    return { passed: ok, failedCase: ok ? undefined : 'Implement factorial recursively with a base case (n<=1 → 1)' };
  },
  starterCode: {
    'C++': `#include <iostream>\nusing namespace std;\n\nlong long factorial(int n) {\n    if (n <= 1) return 1;\n    return n * factorial(n - 1);\n}\n\nint main() {\n    int n; cin >> n;\n    cout << factorial(n) << endl;\n    return 0;\n}`,
    Java: `import java.util.Scanner;\n\npublic class Main {\n    static long factorial(int n) {\n        if (n <= 1) return 1;\n        return n * factorial(n - 1);\n    }\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        System.out.println(factorial(sc.nextInt()));\n    }\n}`,
    Python: `def factorial(n):\n    if n <= 1: return 1\n    return n * factorial(n - 1)\n\nn = int(input())\nprint(factorial(n))`,
    C: `#include <stdio.h>\n\nlong long factorial(int n) {\n    if (n <= 1) return 1;\n    return n * factorial(n - 1);\n}\n\nint main() {\n    int n; scanf("%d", &n);\n    printf("%lld\\n", factorial(n));\n    return 0;\n}`,
  },
});

const arrays = wrap({
  theory: {
    description: 'Arrays store elements of the same type in contiguous memory. 1D arrays are linear sequences; 2D arrays are grids (matrices). Access is O(1) by index.',
    timeComplexity: 'Access O(1), Search O(n), Insert/Delete O(n)',
    spaceComplexity: 'O(n)',
    howItWorks: 'Elements are stored at consecutive memory addresses. Index i maps to base_address + i * element_size, enabling constant-time random access.',
  },
  hints: [
    'Array indices start at 0 in C/C++/Java/Python.',
    'Accessing out-of-bounds causes undefined behavior in C/C++.',
    'For 2D arrays, row-major order means row elements are contiguous in memory.',
  ],
  challenge: {
    statement: 'Given an array of n integers, find and print the maximum element.',
    example: { input: '5\n3 1 4 1 5', output: '5' },
  },
  testCases: [
    { input: '5\n3 1 4 1 5', expected: '5', label: 'Max of [3,1,4,1,5] = 5' },
    { input: '3\n-1 -5 -2', expected: '-1', label: 'Max of negatives = -1' },
  ],
  validate: (code) => {
    const hasArray = code.includes('arr') || code.includes('array') || code.includes('vector') || code.includes('list') || code.includes('[]');
    const hasMax = code.includes('max') || code.includes('MAX') || code.includes('> max') || code.includes('>max');
    const ok = hasArray && hasMax;
    return { passed: ok, failedCase: ok ? undefined : 'Use an array and track the maximum element' };
  },
  starterCode: {
    'C++': `#include <iostream>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int n; cin >> n;\n    vector<int> arr(n);\n    for (int& x : arr) cin >> x;\n    cout << *max_element(arr.begin(), arr.end()) << endl;\n    return 0;\n}`,
    Java: `import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int max = Integer.MIN_VALUE;\n        for (int i = 0; i < n; i++) {\n            int x = sc.nextInt();\n            if (x > max) max = x;\n        }\n        System.out.println(max);\n    }\n}`,
    Python: `n = int(input())\narr = list(map(int, input().split()))\nprint(max(arr))`,
    C: `#include <stdio.h>\n\nint main() {\n    int n; scanf("%d", &n);\n    int arr[1000], max;\n    for (int i = 0; i < n; i++) scanf("%d", &arr[i]);\n    max = arr[0];\n    for (int i = 1; i < n; i++) if (arr[i] > max) max = arr[i];\n    printf("%d\\n", max);\n    return 0;\n}`,
  },
});

const strings = wrap({
  theory: {
    description: 'Strings are sequences of characters. In C they are null-terminated char arrays; in C++/Java/Python they are objects with rich built-in methods for manipulation.',
    timeComplexity: 'Access O(1), Concatenation O(n), Search O(n)',
    spaceComplexity: 'O(n)',
    howItWorks: 'Characters are stored sequentially. String operations like reverse, substring, and search iterate over characters. Immutable strings (Java/Python) create new objects on modification.',
  },
  hints: [
    'In C, always allocate +1 for the null terminator \'\\0\'.',
    'String comparison uses strcmp in C, .equals() in Java, == in Python.',
    'StringBuilder/StringBuffer in Java avoids O(n²) concatenation in loops.',
  ],
  challenge: {
    statement: 'Check if a string is a palindrome (reads the same forwards and backwards).',
    example: { input: 'racecar', output: 'true' },
  },
  testCases: [
    { input: 'racecar', expected: 'true', label: '"racecar" is a palindrome' },
    { input: 'hello', expected: 'false', label: '"hello" is not a palindrome' },
    { input: 'madam', expected: 'true', label: '"madam" is a palindrome' },
  ],
  validate: (code) => {
    const hasPalin = code.includes('palindrome') || code.includes('reverse') || code.includes('rev') || code.includes('[::-1]') || code.includes('StringBuilder');
    const hasCompare = code.includes('==') || code.includes('equals') || code.includes('strcmp');
    const ok = hasPalin && hasCompare;
    return { passed: ok, failedCase: ok ? undefined : 'Reverse the string and compare it to the original' };
  },
  starterCode: {
    'C++': `#include <iostream>\n#include <string>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    string s; cin >> s;\n    string rev = s;\n    reverse(rev.begin(), rev.end());\n    cout << (s == rev ? "true" : "false") << endl;\n    return 0;\n}`,
    Java: `import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String s = sc.next();\n        String rev = new StringBuilder(s).reverse().toString();\n        System.out.println(s.equals(rev));\n    }\n}`,
    Python: `s = input()\nprint(str(s == s[::-1]).lower())`,
    C: `#include <stdio.h>\n#include <string.h>\n\nint main() {\n    char s[1000];\n    scanf("%s", s);\n    int n = strlen(s), ok = 1;\n    for (int i = 0; i < n/2; i++)\n        if (s[i] != s[n-1-i]) { ok = 0; break; }\n    printf("%s\\n", ok ? "true" : "false");\n    return 0;\n}`,
  },
});

const pointersReferences = wrap({
  theory: {
    description: 'A pointer stores the memory address of another variable. References are aliases for existing variables. Pointers enable dynamic memory, data structures, and efficient parameter passing.',
    timeComplexity: 'O(1) for pointer operations',
    spaceComplexity: 'O(1) per pointer (4 or 8 bytes)',
    howItWorks: '& gets the address of a variable. * dereferences a pointer to access the value at that address. In C++, references must be initialized and cannot be reseated.',
  },
  hints: [
    'Always initialize pointers — uninitialized pointers cause undefined behavior.',
    'NULL/nullptr check before dereferencing to avoid segfaults.',
    'Pointer arithmetic: ptr + 1 moves by sizeof(*ptr) bytes.',
  ],
  challenge: {
    statement: 'Write a swap function using pointers that swaps two integers in-place.',
    example: { input: 'a=3, b=7', output: 'a=7, b=3' },
  },
  testCases: [
    { input: 'a=3, b=7', expected: 'a=7, b=3', label: 'Swap 3 and 7' },
  ],
  validate: (code) => {
    const hasSwap = code.includes('swap') || code.includes('tmp') || code.includes('temp') || code.includes('a, b = b, a');
    const hasPtr = code.includes('*') || code.includes('&') || code.includes('pointer') || code.includes('a, b = b, a');
    const ok = hasSwap && hasPtr;
    return { passed: ok, failedCase: ok ? undefined : 'Use a temp variable and pointers/references to swap in-place' };
  },
  starterCode: {
    'C++': `#include <iostream>\nusing namespace std;\n\nvoid swap(int* a, int* b) {\n    int tmp = *a;\n    *a = *b;\n    *b = tmp;\n}\n\nint main() {\n    int a = 3, b = 7;\n    swap(&a, &b);\n    cout << "a=" << a << ", b=" << b << endl;\n    return 0;\n}`,
    Java: `// Java uses pass-by-value; swap via array wrapper\npublic class Main {\n    static void swap(int[] arr, int i, int j) {\n        int tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;\n    }\n    public static void main(String[] args) {\n        int[] arr = {3, 7};\n        swap(arr, 0, 1);\n        System.out.println("a=" + arr[0] + ", b=" + arr[1]);\n    }\n}`,
    Python: `# Python swap is trivial\na, b = 3, 7\na, b = b, a\nprint(f"a={a}, b={b}")`,
    C: `#include <stdio.h>\n\nvoid swap(int* a, int* b) {\n    int tmp = *a;\n    *a = *b;\n    *b = tmp;\n}\n\nint main() {\n    int a = 3, b = 7;\n    swap(&a, &b);\n    printf("a=%d, b=%d\\n", a, b);\n    return 0;\n}`,
  },
});

const dynamicMemory = wrap({
  theory: {
    description: 'Dynamic memory allocation lets programs request memory at runtime from the heap. This is essential when the size is unknown at compile time.',
    timeComplexity: 'O(1) amortized for malloc/new',
    spaceComplexity: 'O(n) allocated',
    howItWorks: 'malloc/new allocates bytes on the heap and returns a pointer. free/delete releases it. Memory leaks occur when allocated memory is never freed.',
  },
  hints: [
    'Every malloc/new must have a matching free/delete.',
    'Use valgrind or AddressSanitizer to detect memory leaks.',
    'Prefer smart pointers (unique_ptr, shared_ptr) in modern C++.',
  ],
  challenge: {
    statement: 'Dynamically allocate an array of n integers, fill with 1..n, print them, then free.',
    example: { input: '5', output: '1 2 3 4 5' },
  },
  testCases: [
    { input: '5', expected: '1 2 3 4 5', label: 'Array 1..5' },
  ],
  validate: (code) => {
    const hasAlloc = code.includes('malloc') || code.includes('new') || code.includes('list(range') || code.includes('new int[');
    const hasFree = code.includes('free') || code.includes('delete') || code.includes('GC') || code.includes('list(range');
    const ok = hasAlloc && (hasFree || code.includes('Python') || code.includes('Java'));
    return { passed: ok, failedCase: ok ? undefined : 'Dynamically allocate the array (malloc/new) and free it after use' };
  },
  starterCode: {
    'C++': `#include <iostream>\nusing namespace std;\n\nint main() {\n    int n; cin >> n;\n    int* arr = new int[n];\n    for (int i = 0; i < n; i++) arr[i] = i + 1;\n    for (int i = 0; i < n; i++) cout << arr[i] << " ";\n    cout << endl;\n    delete[] arr;\n    return 0;\n}`,
    Java: `import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] arr = new int[n]; // GC handles deallocation\n        for (int i = 0; i < n; i++) arr[i] = i + 1;\n        for (int x : arr) System.out.print(x + " ");\n        System.out.println();\n    }\n}`,
    Python: `n = int(input())\narr = list(range(1, n+1))  # GC handles memory\nprint(*arr)`,
    C: `#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n    int n; scanf("%d", &n);\n    int* arr = (int*)malloc(n * sizeof(int));\n    for (int i = 0; i < n; i++) arr[i] = i + 1;\n    for (int i = 0; i < n; i++) printf("%d ", arr[i]);\n    printf("\\n");\n    free(arr);\n    return 0;\n}`,
  },
});

const fileIO = wrap({
  theory: {
    description: 'File I/O allows programs to read from and write to files on disk. This enables data persistence beyond program execution.',
    timeComplexity: 'O(n) for n bytes',
    spaceComplexity: 'O(buffer size)',
    howItWorks: 'Open a file handle, perform read/write operations, then close it. Buffered I/O batches operations for efficiency. Always close files to flush buffers and release OS resources.',
  },
  hints: [
    'Always check if file open succeeded before reading/writing.',
    'Use "r", "w", "a" modes in C; ios::in, ios::out in C++.',
    'Python\'s with statement auto-closes files even on exceptions.',
  ],
  challenge: {
    statement: 'Write "Hello, File!" to a file named output.txt, then read and print it.',
    example: { input: '(none)', output: 'Hello, File!' },
  },
  testCases: [
    { input: '(none)', expected: 'Hello, File!', label: 'File write and read' },
  ],
  validate: (code) => {
    const hasWrite = code.includes('ofstream') || code.includes('fopen') || code.includes('open(') || code.includes('PrintWriter') || code.includes('FileWriter');
    const hasRead = code.includes('ifstream') || code.includes('fgets') || code.includes('read') || code.includes('BufferedReader') || code.includes('getline');
    const ok = hasWrite && hasRead;
    return { passed: ok, failedCase: ok ? undefined : 'Open a file for writing, write to it, then open for reading and print' };
  },
  starterCode: {
    'C++': `#include <iostream>\n#include <fstream>\n#include <string>\nusing namespace std;\n\nint main() {\n    ofstream out("output.txt");\n    out << "Hello, File!" << endl;\n    out.close();\n    ifstream in("output.txt");\n    string line;\n    getline(in, line);\n    cout << line << endl;\n    return 0;\n}`,
    Java: `import java.io.*;\n\npublic class Main {\n    public static void main(String[] args) throws IOException {\n        PrintWriter pw = new PrintWriter("output.txt");\n        pw.println("Hello, File!");\n        pw.close();\n        BufferedReader br = new BufferedReader(new FileReader("output.txt"));\n        System.out.println(br.readLine());\n        br.close();\n    }\n}`,
    Python: `with open("output.txt", "w") as f:\n    f.write("Hello, File!\\n")\n\nwith open("output.txt", "r") as f:\n    print(f.read().strip())`,
    C: `#include <stdio.h>\n\nint main() {\n    FILE* f = fopen("output.txt", "w");\n    fprintf(f, "Hello, File!\\n");\n    fclose(f);\n    char buf[100];\n    f = fopen("output.txt", "r");\n    fgets(buf, sizeof(buf), f);\n    fclose(f);\n    printf("%s", buf);\n    return 0;\n}`,
  },
});

// ─── OOP ─────────────────────────────────────────────────────────────────────

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
    { input: 'width=3, height=3', expected: 'Area: 9', label: '3×3 = 9' },
  ],
  validate: (code) => {
    const hasClass = code.includes('class') || code.includes('struct') || code.includes('typedef struct');
    const hasArea = code.includes('area') || code.includes('Area');
    const hasMul = code.includes('*') || code.includes('width') && code.includes('height');
    const ok = hasClass && hasArea && hasMul;
    return { passed: ok, failedCase: ok ? undefined : 'Define a class/struct with width, height fields and an area() method' };
  },
  starterCode: {
    'C++': `#include <iostream>\nusing namespace std;\n\nclass Rectangle {\npublic:\n    int width, height;\n    Rectangle(int w, int h) : width(w), height(h) {}\n    int area() { return width * height; }\n};\n\nint main() {\n    Rectangle r(4, 5);\n    cout << "Area: " << r.area() << endl;\n    return 0;\n}`,
    Java: `public class Main {\n    static class Rectangle {\n        int width, height;\n        Rectangle(int w, int h) { width = w; height = h; }\n        int area() { return width * height; }\n    }\n    public static void main(String[] args) {\n        Rectangle r = new Rectangle(4, 5);\n        System.out.println("Area: " + r.area());\n    }\n}`,
    Python: `class Rectangle:\n    def __init__(self, width, height):\n        self.width = width\n        self.height = height\n    def area(self):\n        return self.width * self.height\n\nr = Rectangle(4, 5)\nprint(f"Area: {r.area()}")`,
    C: `#include <stdio.h>\n\ntypedef struct {\n    int width, height;\n} Rectangle;\n\nint area(Rectangle* r) { return r->width * r->height; }\n\nint main() {\n    Rectangle r = {4, 5};\n    printf("Area: %d\\n", area(&r));\n    return 0;\n}`,
  },
});

const inheritance = wrap({
  theory: {
    description: 'Inheritance allows a class (child/subclass) to inherit fields and methods from another class (parent/superclass), enabling code reuse and hierarchical relationships.',
    timeComplexity: 'O(1) for method dispatch',
    spaceComplexity: 'O(parent fields + child fields)',
    howItWorks: 'The child class extends the parent. It inherits all non-private members. The child can override methods to provide specialized behavior. super() calls the parent constructor.',
  },
  hints: [
    'Prefer composition over inheritance when the relationship isn\'t truly "is-a".',
    'Use super() to call the parent class constructor or method.',
    'Multiple inheritance (C++) can cause the diamond problem — use virtual inheritance.',
  ],
  challenge: {
    statement: 'Create Animal base class with speak(). Dog and Cat subclasses override speak().',
    example: { input: '(none)', output: 'Woof!\nMeow!' },
  },
  testCases: [
    { input: '(none)', expected: 'Woof!', label: 'Dog says Woof!' },
    { input: '(none)', expected: 'Meow!', label: 'Cat says Meow!' },
  ],
  validate: (code) => {
    const hasInherit = code.includes('extends') || code.includes(':') && code.includes('Animal') || code.includes('(Animal)');
    const hasOverride = code.includes('override') || code.includes('def speak') || code.includes('void speak');
    const hasWoof = code.includes('Woof');
    const hasMeow = code.includes('Meow');
    const ok = hasInherit && hasOverride && hasWoof && hasMeow;
    return { passed: ok, failedCase: ok ? undefined : 'Extend Animal in Dog and Cat, override speak() with Woof! and Meow!' };
  },
  starterCode: {
    'C++': `#include <iostream>\nusing namespace std;\n\nclass Animal {\npublic:\n    virtual void speak() { cout << "..." << endl; }\n};\n\nclass Dog : public Animal {\npublic:\n    void speak() override { cout << "Woof!" << endl; }\n};\n\nclass Cat : public Animal {\npublic:\n    void speak() override { cout << "Meow!" << endl; }\n};\n\nint main() {\n    Dog d; Cat c;\n    d.speak(); c.speak();\n    return 0;\n}`,
    Java: `public class Main {\n    static class Animal { void speak() { System.out.println("..."); } }\n    static class Dog extends Animal { void speak() { System.out.println("Woof!"); } }\n    static class Cat extends Animal { void speak() { System.out.println("Meow!"); } }\n    public static void main(String[] args) {\n        new Dog().speak();\n        new Cat().speak();\n    }\n}`,
    Python: `class Animal:\n    def speak(self): print("...")\n\nclass Dog(Animal):\n    def speak(self): print("Woof!")\n\nclass Cat(Animal):\n    def speak(self): print("Meow!")\n\nDog().speak()\nCat().speak()`,
    C: `#include <stdio.h>\n// C uses function pointers to simulate inheritance\ntypedef struct { void (*speak)(); } Animal;\nvoid dog_speak() { printf("Woof!\\n"); }\nvoid cat_speak() { printf("Meow!\\n"); }\nint main() {\n    Animal dog = {dog_speak};\n    Animal cat = {cat_speak};\n    dog.speak(); cat.speak();\n    return 0;\n}`,
  },
});

// ─── DATA STRUCTURES ─────────────────────────────────────────────────────────

const linkedLists = wrap({
  theory: {
    description: 'A linked list is a linear data structure where each element (node) contains data and a pointer to the next node. Unlike arrays, nodes are not stored contiguously in memory.',
    timeComplexity: 'Access O(n), Insert/Delete at head O(1), at tail O(n)',
    spaceComplexity: 'O(n)',
    howItWorks: 'Each node holds a value and a next pointer. The head pointer points to the first node. Traversal follows next pointers until null. Insertion/deletion requires updating pointers.',
  },
  hints: [
    'Always update the next pointer before moving the current pointer.',
    'Use a dummy/sentinel head node to simplify edge cases.',
    'For cycle detection, use Floyd\'s two-pointer (slow/fast) algorithm.',
  ],
  challenge: {
    statement: 'Implement a singly linked list with insertHead, insertTail, and printList operations.',
    example: { input: 'insert 1,2,3', output: '1 -> 2 -> 3 -> null' },
  },
  testCases: [
    { input: 'insert 1,2,3', expected: '1 -> 2 -> 3 -> null', label: 'Linked list 1→2→3→null' },
  ],
  validate: (code) => {
    const hasNode = code.includes('Node') || code.includes('node') || code.includes('struct');
    const hasNext = code.includes('next') || code.includes('->next') || code.includes('.next');
    const hasInsert = code.includes('insert') || code.includes('head') || code.includes('tail');
    const ok = hasNode && hasNext && hasInsert;
    return { passed: ok, failedCase: ok ? undefined : 'Define a Node with a next pointer and implement insert operations' };
  },
  starterCode: {
    'C++': `#include <iostream>\nusing namespace std;\n\nstruct Node { int val; Node* next; Node(int v) : val(v), next(nullptr) {} };\n\nclass LinkedList {\n    Node* head = nullptr;\npublic:\n    void insertHead(int v) { Node* n = new Node(v); n->next = head; head = n; }\n    void insertTail(int v) {\n        Node* n = new Node(v);\n        if (!head) { head = n; return; }\n        Node* cur = head;\n        while (cur->next) cur = cur->next;\n        cur->next = n;\n    }\n    void print() {\n        for (Node* c = head; c; c = c->next) cout << c->val << " -> ";\n        cout << "null" << endl;\n    }\n};\n\nint main() {\n    LinkedList ll;\n    ll.insertTail(1); ll.insertTail(2); ll.insertTail(3);\n    ll.print();\n    return 0;\n}`,
    Java: `public class Main {\n    static class Node { int val; Node next; Node(int v) { val = v; } }\n    static Node head = null;\n    static void insertTail(int v) {\n        Node n = new Node(v);\n        if (head == null) { head = n; return; }\n        Node cur = head;\n        while (cur.next != null) cur = cur.next;\n        cur.next = n;\n    }\n    static void print() {\n        for (Node c = head; c != null; c = c.next) System.out.print(c.val + " -> ");\n        System.out.println("null");\n    }\n    public static void main(String[] args) {\n        insertTail(1); insertTail(2); insertTail(3);\n        print();\n    }\n}`,
    Python: `class Node:\n    def __init__(self, val):\n        self.val = val\n        self.next = None\n\nclass LinkedList:\n    def __init__(self): self.head = None\n    def insert_tail(self, val):\n        n = Node(val)\n        if not self.head: self.head = n; return\n        cur = self.head\n        while cur.next: cur = cur.next\n        cur.next = n\n    def print_list(self):\n        parts = []\n        cur = self.head\n        while cur: parts.append(str(cur.val)); cur = cur.next\n        print(" -> ".join(parts) + " -> null")\n\nll = LinkedList()\nll.insert_tail(1); ll.insert_tail(2); ll.insert_tail(3)\nll.print_list()`,
    C: `#include <stdio.h>\n#include <stdlib.h>\n\ntypedef struct Node { int val; struct Node* next; } Node;\n\nNode* newNode(int v) { Node* n = malloc(sizeof(Node)); n->val = v; n->next = NULL; return n; }\n\nvoid insertTail(Node** head, int v) {\n    Node* n = newNode(v);\n    if (!*head) { *head = n; return; }\n    Node* cur = *head;\n    while (cur->next) cur = cur->next;\n    cur->next = n;\n}\n\nvoid printList(Node* head) {\n    for (Node* c = head; c; c = c->next) printf("%d -> ", c->val);\n    printf("null\\n");\n}\n\nint main() {\n    Node* head = NULL;\n    insertTail(&head, 1); insertTail(&head, 2); insertTail(&head, 3);\n    printList(head);\n    return 0;\n}`,
  },
});

const stack = wrap({
  theory: {
    description: 'A stack is a LIFO (Last In, First Out) data structure. Elements are pushed onto the top and popped from the top. Used for function call stacks, undo operations, and expression parsing.',
    timeComplexity: 'Push/Pop/Peek O(1)',
    spaceComplexity: 'O(n)',
    howItWorks: 'Maintain a top pointer. Push increments top and stores the element. Pop retrieves the top element and decrements top. Peek reads without removing.',
  },
  hints: [
    'Check for stack overflow (push on full) and underflow (pop on empty).',
    'Use a stack to convert infix expressions to postfix (Shunting-yard).',
    'Balanced parentheses checking is a classic stack problem.',
  ],
  challenge: {
    statement: 'Check if a string of brackets is balanced: (), [], {}.',
    example: { input: '{[()]}', output: 'true' },
  },
  testCases: [
    { input: '{[()]}', expected: 'true', label: '{[()]} is balanced' },
    { input: '([)]', expected: 'false', label: '([)] is not balanced' },
    { input: '(()', expected: 'false', label: '(() is not balanced' },
  ],
  validate: (code) => {
    const hasStack = code.includes('stack') || code.includes('Stack') || code.includes('push') || code.includes('append') || code.includes('Deque');
    const hasPop = code.includes('pop') || code.includes('top') || code.includes('[-1]');
    const hasBrackets = code.includes('(') && code.includes('[') && code.includes('{');
    const ok = hasStack && hasPop && hasBrackets;
    return { passed: ok, failedCase: ok ? undefined : 'Use a stack: push open brackets, pop and match on close brackets' };
  },
  starterCode: {
    'C++': `#include <iostream>\n#include <stack>\n#include <string>\nusing namespace std;\n\nbool isBalanced(string s) {\n    stack<char> st;\n    for (char c : s) {\n        if (c=='(' || c=='[' || c=='{') st.push(c);\n        else {\n            if (st.empty()) return false;\n            char top = st.top(); st.pop();\n            if ((c==')' && top!='(') || (c==']' && top!='[') || (c=='}' && top!='{')) return false;\n        }\n    }\n    return st.empty();\n}\n\nint main() {\n    string s; cin >> s;\n    cout << (isBalanced(s) ? "true" : "false") << endl;\n    return 0;\n}`,
    Java: `import java.util.*;\n\npublic class Main {\n    static boolean isBalanced(String s) {\n        Deque<Character> st = new ArrayDeque<>();\n        for (char c : s.toCharArray()) {\n            if ("([{".indexOf(c) >= 0) st.push(c);\n            else {\n                if (st.isEmpty()) return false;\n                char top = st.pop();\n                if ((c==')' && top!='(') || (c==']' && top!='[') || (c=='}' && top!='{')) return false;\n            }\n        }\n        return st.isEmpty();\n    }\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        System.out.println(isBalanced(sc.next()));\n    }\n}`,
    Python: `def is_balanced(s):\n    stack = []\n    pairs = {')': '(', ']': '[', '}': '{'}\n    for c in s:\n        if c in '([{':\n            stack.append(c)\n        elif c in ')]}':\n            if not stack or stack[-1] != pairs[c]:\n                return False\n            stack.pop()\n    return len(stack) == 0\n\ns = input()\nprint(str(is_balanced(s)).lower())`,
    C: `#include <stdio.h>\n#include <string.h>\n\nint isBalanced(char* s) {\n    char st[1000]; int top = -1;\n    for (int i = 0; s[i]; i++) {\n        char c = s[i];\n        if (c=='(' || c=='[' || c=='{') st[++top] = c;\n        else {\n            if (top < 0) return 0;\n            char t = st[top--];\n            if ((c==')' && t!='(') || (c==']' && t!='[') || (c=='}' && t!='{')) return 0;\n        }\n    }\n    return top == -1;\n}\n\nint main() {\n    char s[1000]; scanf("%s", s);\n    printf("%s\\n", isBalanced(s) ? "true" : "false");\n    return 0;\n}`,
  },
});

const binarySearchTree = wrap({
  theory: {
    description: 'A Binary Search Tree (BST) is a binary tree where each node\'s left subtree contains only nodes with values less than the node, and the right subtree contains only nodes with greater values.',
    timeComplexity: 'Search/Insert/Delete O(log n) average, O(n) worst case',
    spaceComplexity: 'O(n)',
    howItWorks: 'To search: compare target with current node, go left if smaller, right if larger. To insert: find the correct null position following BST property. In-order traversal yields sorted output.',
  },
  hints: [
    'In-order traversal (left, root, right) of a BST gives sorted order.',
    'A BST degenerates to a linked list if elements are inserted in sorted order.',
    'Use AVL or Red-Black trees for guaranteed O(log n) operations.',
  ],
  challenge: {
    statement: 'Insert values [5,3,7,1,4] into a BST and print in-order traversal.',
    example: { input: '[5,3,7,1,4]', output: '1 3 4 5 7' },
  },
  testCases: [
    { input: '[5,3,7,1,4]', expected: '1 3 4 5 7', label: 'In-order: 1 3 4 5 7' },
  ],
  validate: (code) => {
    const hasInsert = code.includes('insert') || code.includes('Insert');
    const hasInorder = code.includes('inorder') || code.includes('in_order') || code.includes('left') && code.includes('right');
    const hasBSTProp = code.includes('< root') || code.includes('<root') || code.includes('val <') || code.includes('< node') || code.includes('root.val');
    const ok = hasInsert && hasInorder && hasBSTProp;
    return { passed: ok, failedCase: ok ? undefined : 'Insert using BST property (left < root < right) and traverse in-order' };
  },
  starterCode: {
    'C++': `#include <iostream>\nusing namespace std;\n\nstruct Node { int val; Node *left, *right; Node(int v) : val(v), left(nullptr), right(nullptr) {} };\n\nNode* insert(Node* root, int v) {\n    if (!root) return new Node(v);\n    if (v < root->val) root->left = insert(root->left, v);\n    else if (v > root->val) root->right = insert(root->right, v);\n    return root;\n}\n\nvoid inorder(Node* root) {\n    if (!root) return;\n    inorder(root->left);\n    cout << root->val << " ";\n    inorder(root->right);\n}\n\nint main() {\n    Node* root = nullptr;\n    for (int v : {5,3,7,1,4}) root = insert(root, v);\n    inorder(root); cout << endl;\n    return 0;\n}`,
    Java: `public class Main {\n    static class Node { int val; Node left, right; Node(int v) { val = v; } }\n    static Node insert(Node root, int v) {\n        if (root == null) return new Node(v);\n        if (v < root.val) root.left = insert(root.left, v);\n        else if (v > root.val) root.right = insert(root.right, v);\n        return root;\n    }\n    static void inorder(Node root) {\n        if (root == null) return;\n        inorder(root.left);\n        System.out.print(root.val + " ");\n        inorder(root.right);\n    }\n    public static void main(String[] args) {\n        Node root = null;\n        for (int v : new int[]{5,3,7,1,4}) root = insert(root, v);\n        inorder(root); System.out.println();\n    }\n}`,
    Python: `class Node:\n    def __init__(self, val): self.val = val; self.left = self.right = None\n\ndef insert(root, val):\n    if not root: return Node(val)\n    if val < root.val: root.left = insert(root.left, val)\n    elif val > root.val: root.right = insert(root.right, val)\n    return root\n\ndef inorder(root):\n    if not root: return\n    inorder(root.left)\n    print(root.val, end=' ')\n    inorder(root.right)\n\nroot = None\nfor v in [5,3,7,1,4]: root = insert(root, v)\ninorder(root)\nprint()`,
    C: `#include <stdio.h>\n#include <stdlib.h>\n\ntypedef struct Node { int val; struct Node *left, *right; } Node;\n\nNode* newNode(int v) { Node* n = malloc(sizeof(Node)); n->val=v; n->left=n->right=NULL; return n; }\n\nNode* insert(Node* root, int v) {\n    if (!root) return newNode(v);\n    if (v < root->val) root->left = insert(root->left, v);\n    else if (v > root->val) root->right = insert(root->right, v);\n    return root;\n}\n\nvoid inorder(Node* root) {\n    if (!root) return;\n    inorder(root->left);\n    printf("%d ", root->val);\n    inorder(root->right);\n}\n\nint main() {\n    Node* root = NULL;\n    int vals[] = {5,3,7,1,4};\n    for (int i = 0; i < 5; i++) root = insert(root, vals[i]);\n    inorder(root); printf("\\n");\n    return 0;\n}`,
  },
});

const sortingAlgorithms = wrap({
  theory: {
    description: 'Sorting algorithms arrange elements in a defined order. Common algorithms: Bubble Sort O(n²), Merge Sort O(n log n), Quick Sort O(n log n) avg, Heap Sort O(n log n).',
    timeComplexity: 'Best: O(n log n) for comparison-based sorts',
    spaceComplexity: 'O(1) in-place (Bubble/Quick/Heap), O(n) for Merge Sort',
    howItWorks: 'Comparison-based sorts compare pairs of elements and swap/merge them into order. Non-comparison sorts (Counting, Radix) exploit value ranges for linear time.',
  },
  hints: [
    'Merge Sort is stable and guarantees O(n log n) — good for linked lists.',
    'Quick Sort is fastest in practice but O(n²) worst case without randomization.',
    'Use built-in sort (std::sort, Arrays.sort, sorted()) in production code.',
  ],
  challenge: {
    statement: 'Implement merge sort and sort an array of n integers.',
    example: { input: '5\n3 1 4 1 5', output: '1 1 3 4 5' },
  },
  testCases: [
    { input: '5\n3 1 4 1 5', expected: '1 1 3 4 5', label: 'Merge sort [3,1,4,1,5]' },
  ],
  validate: (code) => {
    const hasMerge = code.includes('merge') || code.includes('Merge');
    const hasSort = code.includes('sort') || code.includes('Sort');
    const hasRecurse = (code.match(/mergeSort|merge_sort|mergesort/gi) || []).length >= 2;
    const ok = hasMerge && hasSort && hasRecurse;
    return { passed: ok, failedCase: ok ? undefined : 'Implement mergeSort recursively: split, sort halves, then merge' };
  },
  starterCode: {
    'C++': `#include <iostream>\n#include <vector>\nusing namespace std;\n\nvoid merge(vector<int>& arr, int l, int m, int r) {\n    vector<int> left(arr.begin()+l, arr.begin()+m+1);\n    vector<int> right(arr.begin()+m+1, arr.begin()+r+1);\n    int i=0, j=0, k=l;\n    while (i<left.size() && j<right.size())\n        arr[k++] = (left[i]<=right[j]) ? left[i++] : right[j++];\n    while (i<left.size()) arr[k++]=left[i++];\n    while (j<right.size()) arr[k++]=right[j++];\n}\n\nvoid mergeSort(vector<int>& arr, int l, int r) {\n    if (l >= r) return;\n    int m = (l+r)/2;\n    mergeSort(arr, l, m);\n    mergeSort(arr, m+1, r);\n    merge(arr, l, m, r);\n}\n\nint main() {\n    int n; cin >> n;\n    vector<int> arr(n);\n    for (int& x : arr) cin >> x;\n    mergeSort(arr, 0, n-1);\n    for (int x : arr) cout << x << " ";\n    cout << endl;\n    return 0;\n}`,
    Java: `import java.util.*;\n\npublic class Main {\n    static void mergeSort(int[] arr, int l, int r) {\n        if (l >= r) return;\n        int m = (l+r)/2;\n        mergeSort(arr, l, m); mergeSort(arr, m+1, r);\n        int[] tmp = Arrays.copyOfRange(arr, l, r+1);\n        int i=0, j=m-l+1, k=l;\n        while (i<=m-l && j<=r-l) arr[k++] = tmp[i]<=tmp[j] ? tmp[i++] : tmp[j++];\n        while (i<=m-l) arr[k++]=tmp[i++];\n        while (j<=r-l) arr[k++]=tmp[j++];\n    }\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] arr = new int[n];\n        for (int i=0;i<n;i++) arr[i]=sc.nextInt();\n        mergeSort(arr, 0, n-1);\n        for (int x : arr) System.out.print(x+" ");\n        System.out.println();\n    }\n}`,
    Python: `def merge_sort(arr):\n    if len(arr) <= 1: return arr\n    mid = len(arr) // 2\n    left = merge_sort(arr[:mid])\n    right = merge_sort(arr[mid:])\n    result = []\n    i = j = 0\n    while i < len(left) and j < len(right):\n        if left[i] <= right[j]: result.append(left[i]); i += 1\n        else: result.append(right[j]); j += 1\n    return result + left[i:] + right[j:]\n\nn = int(input())\narr = list(map(int, input().split()))\nprint(*merge_sort(arr))`,
    C: `#include <stdio.h>\n#include <stdlib.h>\n\nvoid merge(int* arr, int l, int m, int r) {\n    int n1=m-l+1, n2=r-m;\n    int* L=malloc(n1*sizeof(int)), *R=malloc(n2*sizeof(int));\n    for(int i=0;i<n1;i++) L[i]=arr[l+i];\n    for(int j=0;j<n2;j++) R[j]=arr[m+1+j];\n    int i=0,j=0,k=l;\n    while(i<n1&&j<n2) arr[k++]=(L[i]<=R[j])?L[i++]:R[j++];\n    while(i<n1) arr[k++]=L[i++];\n    while(j<n2) arr[k++]=R[j++];\n    free(L); free(R);\n}\n\nvoid mergeSort(int* arr, int l, int r) {\n    if(l>=r) return;\n    int m=(l+r)/2;\n    mergeSort(arr,l,m); mergeSort(arr,m+1,r);\n    merge(arr,l,m,r);\n}\n\nint main() {\n    int n; scanf("%d",&n);\n    int arr[1000];\n    for(int i=0;i<n;i++) scanf("%d",&arr[i]);\n    mergeSort(arr,0,n-1);\n    for(int i=0;i<n;i++) printf("%d ",arr[i]);\n    printf("\\n");\n    return 0;\n}`,
  },
});

const searchingAlgorithms = wrap({
  theory: {
    description: 'Searching algorithms find an element in a collection. Linear search checks every element O(n). Binary search works on sorted arrays in O(log n) by halving the search space each step.',
    timeComplexity: 'Linear O(n), Binary O(log n)',
    spaceComplexity: 'O(1) iterative, O(log n) recursive',
    howItWorks: 'Binary search maintains left and right pointers. It computes mid = (left+right)/2, compares arr[mid] with target, and eliminates half the search space each iteration.',
  },
  hints: [
    'Binary search requires a sorted array.',
    'Use left + (right-left)/2 instead of (left+right)/2 to avoid integer overflow.',
    'Binary search can find first/last occurrence with slight modifications.',
  ],
  challenge: {
    statement: 'Implement binary search. Return the index of target in sorted array, or -1 if not found.',
    example: { input: 'nums=[-1,0,3,5,9,12], target=9', output: '4' },
  },
  testCases: [
    { input: 'target=9 in [-1,0,3,5,9,12]', expected: '4', label: 'Found at index 4' },
    { input: 'target=2 in [-1,0,3,5,9,12]', expected: '-1', label: 'Not found → -1' },
  ],
  validate: (code) => {
    const hasWhile = code.includes('while') || code.includes('for');
    const hasMid = code.includes('mid') || code.includes('middle');
    const hasHalve = code.includes('left') && code.includes('right');
    const hasReturn = code.includes('return') || code.includes('-1');
    const ok = hasWhile && hasMid && hasHalve && hasReturn;
    return { passed: ok, failedCase: ok ? undefined : 'Use left/right pointers, compute mid, and halve the search space each step' };
  },
  starterCode: {
    'C++': `#include <iostream>\n#include <vector>\nusing namespace std;\n\nint binarySearch(vector<int>& arr, int target) {\n    int left = 0, right = arr.size() - 1;\n    while (left <= right) {\n        int mid = left + (right - left) / 2;\n        if (arr[mid] == target) return mid;\n        else if (arr[mid] < target) left = mid + 1;\n        else right = mid - 1;\n    }\n    return -1;\n}\n\nint main() {\n    vector<int> arr = {-1, 0, 3, 5, 9, 12};\n    cout << binarySearch(arr, 9) << endl;\n    return 0;\n}`,
    Java: `public class Main {\n    static int binarySearch(int[] arr, int target) {\n        int left = 0, right = arr.length - 1;\n        while (left <= right) {\n            int mid = left + (right - left) / 2;\n            if (arr[mid] == target) return mid;\n            else if (arr[mid] < target) left = mid + 1;\n            else right = mid - 1;\n        }\n        return -1;\n    }\n    public static void main(String[] args) {\n        int[] arr = {-1, 0, 3, 5, 9, 12};\n        System.out.println(binarySearch(arr, 9));\n    }\n}`,
    Python: `def binary_search(arr, target):\n    left, right = 0, len(arr) - 1\n    while left <= right:\n        mid = (left + right) // 2\n        if arr[mid] == target: return mid\n        elif arr[mid] < target: left = mid + 1\n        else: right = mid - 1\n    return -1\n\narr = [-1, 0, 3, 5, 9, 12]\nprint(binary_search(arr, 9))`,
    C: `#include <stdio.h>\n\nint binarySearch(int* arr, int n, int target) {\n    int left = 0, right = n - 1;\n    while (left <= right) {\n        int mid = left + (right - left) / 2;\n        if (arr[mid] == target) return mid;\n        else if (arr[mid] < target) left = mid + 1;\n        else right = mid - 1;\n    }\n    return -1;\n}\n\nint main() {\n    int arr[] = {-1, 0, 3, 5, 9, 12};\n    printf("%d\\n", binarySearch(arr, 6, 9));\n    return 0;\n}`,
  },
});

// ─── EXPORT MAP ──────────────────────────────────────────────────────────────
// Keys match the topic id from topics.ts (title.toLowerCase().replace(/[^a-z0-9]+/g, '-'))

export const topicContentMap: Record<string, TopicContent> = {
  'intro-to-programming': introToProgramming,
  'variables-data-types': variablesDataTypes,
  'operators-expressions': operatorsExpressions,
  'input-output': inputOutput,
  'control-flow-conditionals': controlFlowConditionals,
  'control-flow--conditionals': controlFlowConditionals,
  'control-flow-loops': controlFlowLoops,
  'control-flow--loops': controlFlowLoops,
  'functions-scope': functionsScope,
  'recursion': recursion,
  'arrays-1d-2d': arrays,
  'strings': strings,
  'pointers-references': pointersReferences,
  'dynamic-memory-allocation': dynamicMemory,
  'file-i-o': fileIO,
  // OOP
  'classes-objects': classesObjects,
  'inheritance': inheritance,
  // Data Structures
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
    // For topics without specific validators, check that code is non-trivial
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
