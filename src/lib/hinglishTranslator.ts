// Hinglish / Indian Classroom style narration translator
// Tailored specifically to give students of Indian origin a warm, highly understanding, and authentic learning experience.

const TOPIC_HINGLISH: Record<string, string[]> = {
  'variables': [
    'Dekho, variable memory mein ek labeled box ya dabba ki tarah hota hai jo value store karta hai.',
    'Yahan humne ek integer variable "age" declare kiya aur usme 25 store kar diya. Ye memory mein 4 bytes leta hai.',
    'Iske baad, float variable "height" mein humne 5.9 save kiya. Floats 4 bytes space lete hain aur decimal points wale numbers store karte hain.',
    'Aur aakhir mein, string variable "name" mein "Alice" text save kiya. Strings mein hum characters ki sequence store kar sakte hain.',
    'Ab hum "cout" use karke har variable ko uske label ke sath print karenge. Ye values seedha memory location se read hoti hain.',
    'Toh har variable ka ek name, type, value aur memory address hota hai. Bas, yahi toh programming ki foundation hai!'
  ],
  'data-types': [
    'Data types compiler ko batate hain ki memory mein save kiye gaye bits ko kaise padhna (interpret karna) hai.',
    'Ek integer 4 bytes space leta hai aur whole numbers store karta hai. Ye lagbhag 2 billion tak ki values store kar sakta hai.',
    'Float bhi 4 bytes leta hai par ye decimal wale numbers save karta hai standard IEEE 754 format use karke.',
    'Double variable 8 bytes leta hai — float se double accuracy ke sath, yaani lagbhag 15 decimal digits tak bilkul sahi value!',
    'Char variable sirf 1 byte leta hai aur single character save karta hai ASCII code ka use karke.',
    'Bool variable bhi 1 byte leta hai aur true ya false save karta hai. Zero ka matlab false, aur baaki sab true.',
    'Sizeof operator use karke aap dekh sakte hain ki aapke system par har type kitni memory bytes occupy kar raha hai.'
  ],
  'input-output': [
    'Input aur Output se aapka program user ke sath batchit (communicate) karta hai.',
    'Hum iostream include karte hain taaki cin aur cout use kar sakein — ye hamare standard input-output streams hain.',
    'cin ke sath extraction operator use karke hum keyboard se input read karte hain aur variables mein daalte hain.',
    'User ne 3 aur 7 type kiya. cin use read karke variables a aur b mein save kar deta hai.',
    'Ab humne a plus b kiya taaki sum compute ho sake, jo ki 10 hai.',
    'cout ke sath insertion operator use karke result screen par print karenge. User ko ab 10 dikhega.',
    'Data stream ki tarah flow karta hai — keyboard se andar aata hai, aur screen par chala jata hai. Simple hai!'
  ],
  'syntax': [
    'Chalo C++ program ki basic structure (yaani anatomy) ko samajhte hain.',
    'Sabse pehle, hash-include directive compiler ko batata hai ki iostream header file ko copy karke program mein daal do.',
    'Using namespace std likhne se hum cout aur cin ko seedha use kar sakte hain, bina std-colon-colon likhe.',
    'Int main hamara entry point hai — poora program yahi se chalna shuru hota hai.',
    'Curly braces blocks define karte hain. Jo bhi in braces ke andar hai, vo main function ka hissa hai.',
    'Har statement semicolon se end hoti hai. Ye compiler ko batata hai ki ek command yahan khatam ho chali.',
    'Double-slash se comment banta hai. Comments compiler ignore karta hai, par ye hamare samajhne ke liye hain.',
    'Return 0 operating system ko batata hai ki hamara program bina kisi error ke successfully complete ho gaya.'
  ],
  'operators': [
    'Operators vo symbols hote hain jo values par mathematical ya logical operations perform karte hain.',
    'Plus operator do numbers ko jodta hai: 10 plus 3 ho gaya 13.',
    'Minus subtract karta hai: 10 minus 3 ho gaya 7.',
    'Asterisk multiply karta hai: 10 times 3 ho gaya 30.',
    'Forward slash divide karta hai: 10 divided by 3 ho gaya 3. integer division decimals ko truncate kar deta hai.',
    'Percent modulo operator hai jo remainder deta hai: 10 modulo 3 ho gaya 1.',
    'Operators precedence rules follow karte hain. Multiplication aur division pehle hote hain, bilkul maths ki tarah!'
  ],
  'type-casting': [
    'Type casting ek data type ko dusre type mein convert karne ke liye use hota hai.',
    'Implicit casting automatically hota hai jab conversion safe ho, jaise integer 7 automatically ban jata hai double 7.0.',
    'Ise widening kehte hain — isme chote type se bade type mein jate hain, isliye koi data loss nahi hota.',
    'Explicit casting hume khud karni padti hai. Hum static_cast use karke double 3.99 ko int mein badalte hain.',
    'Ye narrowing hai — isme decimal part truncate ho jata hai. 3.99 ban jata hai sirf 3, yaani data loss hota hai!',
    'C++ mein, static_cast use karna sabse best aur safe method maana jata hai.'
  ],
  'what-is-data-structure-static-dynamic': [
    'Data structure memory mein data ko store aur organize karne ka tarika hai taaki kaam efficient ho sake.',
    'Data structures do tarike ke hote hain: Linear aur Non-Linear.',
    'Linear data structures sequential hote hain, jaise Arrays, Linked Lists, Stack aur Queue.',
    'Non-Linear data structures hierarchical hote hain, jaise Trees aur Graphs.',
    'Static structures jaise arrays ka size fixed hota hai, jo hum declare karte vakt hi tay karte hain.',
    'Dynamic structures jaise vectors jarurat ke hisab se apna size bada ya chota kar sakte hain.',
    'Sahi data structure select karna sabse bada decision hai. Yahi tay karta hai ki aapka program kitna fast chalega!'
  ],
  'control-statements': [
    'Control statements program ko decisions lene mein madad karte hain.',
    'Hum user se ek number input lete hain. Samajhte hain ki user ne negative 5 dala.',
    'If statement check karta hai: kya n greater than 0 hai? Nahi, toh hum if block ko skip karenge.',
    'Else-if block check karta hai: kya n less than 0 hai? Haan! Negative 5 toh chota hai, toh hum yahan enter karenge.',
    'Hum screen par Positive print karenge aur baaki else blocks ko skip kar denge.',
    'Program ek bar mein sirf ek hi rasta chunta hai — bilkul ek churahe par rasta chunne ki tarah!'
  ],
  'loops': [
    'Loops hume ek hi code block ko bar-bar repeat karne ki suvidha dete hain.',
    'Ek for loop ke teen part hote hain: initialization, condition, aur update step.',
    'Hum loop shuru karte hain i equals 2 se. Ye hamara shuruat (initialization) step hai.',
    'Condition check karti hai: kya i chota hai ya barabar hai n ke? Agar haan, toh loop chalega.',
    'Hum i ki value print karte hain, jo ki shuruat mein 2 hai.',
    'Update step i mein 2 add karta hai. Ab i ho gaya 4.',
    'Hum fir check karte hain: kya 4 chota hai 10 se? Haan! Print karenge 4, aur i ban jayega 6.',
    'Ye chalta rahega: 6, 8, aur 10. Jab i 12 hoga, loop condition false ho jayegi aur loop ruk jayega.',
    'Loop total 5 baar chala, aur 2 se 10 tak ke saare even numbers print ho gaye!'
  ],
  'arrays': [
    'Array same type ke multiple elements ko consecutive (ek ke baad ek) memory blocks mein store karta hai.',
    'Humne ek integer array banaya jahan har element memory mein ek dusre ke padosi ki tarah rehte hain.',
    'Humne 5 values read ki: 3, 1, 4, 1, 5. Ye array ke indices 0 se 4 tak store ho gayi.',
    'Maximum number dhundhne ke liye, hum pehle element ko hi sabse bada (max) maan lete hain.',
    'Ab hum har number ko max se compare karenge. Kya 1 bada hai 3 se? Nahi. Kya 4 bada hai 3 se? Haan! Max ban gaya 4.',
    'Aage badhte hain: kya 1 bada hai 4 se? Nahi. Kya 5 bada hai 4 se? Haan! Max ban gaya 5.',
    'Array scan ho gaya, aur hamara final maximum value hume 5 mil gaya!',
    'Array index access toh instant hota hai O(1), par max value search karne ke liye hume har element check karna padta hai yaani O(n).'
  ],
  'arrays-strings': [
    'Strings character ki sequences hoti hain. Chalo check karte hain kya "racecar" ek palindrome hai.',
    'Palindrome ka matlab jo word aage se aur peeche se ekdam same padha jaye.',
    'Hum string ko store karke uski ek reverse (ulte order ki) copy bana lete hain.',
    'Reverse function dono ends se characters ko aapas mein swap karte hue center tak jata hai.',
    'r-a-c-e-c-a-r ko ulta karne par bhi r-a-c-e-c-a-r hi rehta hai. Ye toh match ho gaya!',
    'Kyuki original aur reverse bilkul same hain, isliye ye palindrome hai. Hum print karenge true.'
  ],
  'pointers': [
    'Pointer ek special variable hai jo kisi dusre variable ka memory address (ghar ka pata) store karta hai.',
    'Humne x variable banaya jiski value 5 hai. Ye memory mein kisi address par rehta hai, maan lo address 0x7fff.',
    'Ab hum pointer p banate hain. Ampersand operator x ka memory address nikal kar p mein save kar deta hai.',
    'Ab p ke andar 0x7fff address hai — yaani p x ki taraf point kar raha hai (jaise ek arrow x ki taraf).',
    'Asterisk symbol dereferencing operator hai — ye arrow ko follow karke x ki value ko direct access karta hai.',
    'Humne star-p equals 10 likha. Isse p jis address par point kar raha tha, vahan value 10 save ho gayi. Yaani x ab 10 ban gaya!',
    'Ab jab hum x print karenge, hume 10 dikhega. Humne pointers ke zariye x ki value ko indirectly badal diya!'
  ],
  'by-value-vs-by-reference': [
    'Pass-by-value mein function ko variables ki copy milti hai — function ke andar badlav original ko change nahi karta.',
    'Pass-by-reference mein actual variable ka reference (yaani address) jata hai — function ke andar change seedha original par asar karta hai.',
    'By value mein stack par copy banti hai. By reference mein original ka reference jata hai toh ye extra memory nahi leta.',
    'Swap by value swap nahi kar payega kyuki vo sirf duplicate copies ko swap karta hai.',
    'Swap by reference original variables ko swapping memory block mein direct swap kar deta hai, isliye values sach mein badal jati hain!'
  ]
};

// Standard words mapper for fallback Hinglish translation
const GLOSSARY: Record<string, string> = {
  'welcome': 'Namaste students, swagat hai aapka!',
  'let us': 'chalo hum',
  'let\'s': 'chalo',
  'we will': 'hum ab',
  'variable': 'variable (yaani memory ka dabba)',
  'memory': 'computer memory',
  'box': 'dabba',
  'labeled': 'naam wala',
  'store': 'save',
  'holds': 'store karke rakhta hai',
  'we declare': 'hum declare karte hain',
  'called': 'naam ka',
  'integer': 'integer',
  'finally': 'aakhir mein',
  'now we': 'ab hum',
  'print': 'print karenge',
  'using': 'use karke',
  'address': 'ghar ka address (memory address)',
  'is like': 'ekdum ek',
  'this is': 'ye hai',
  'foundation': 'base yaani foundation',
  'programming': 'programming ka',
  'data structures': 'data structures',
  'data structure': 'data structure',
  'efficiency': 'performance aur speed',
  'efficiently': 'fast aur efficient tarike se',
  'linked list': 'linked list',
  'stack': 'stack (jaise plates ka dher)',
  'queue': 'queue (yaani line)',
  'tree': 'tree structures',
  'graph': 'graph structures',
  'static': 'fixed-size static',
  'dynamic': 'resizable dynamic',
  'pointer': 'pointer',
  'reference': 'reference (alias)',
  'value': 'value',
  'is simple': 'bahut simple hai!',
  'simple': 'simple',
  'easy': 'easy',
  'understand': 'samajh',
  'concept': 'concept',
  'overview': 'overview',
  'pointers': 'pointers',
  'arrays': 'arrays',
  'array': 'array',
  'algorithm': 'algorithm (step-by-step method)',
  'complexity': 'complexity (time aur space)',
  'time complexity': 'time complexity',
  'space complexity': 'space complexity',
  'how it works': 'ye kaise kaam karta hai',
  'explanation': 'explanation',
  'step': 'step',
};

/**
 * Dynamically converts text to Hinglish to support authentic Indian Classroom Teaching style
 */
export function getIndianNarration(topicId: string, stepIndex: number, originalText: string): string {
  // If we have hand-crafted high-fidelity translation, use it!
  const topicMap = TOPIC_HINGLISH[topicId];
  if (topicMap && topicMap[stepIndex]) {
    return topicMap[stepIndex];
  }

  // Fallback: Word replacements to generate an authentic Hinglish feel dynamically!
  let translated = originalText;
  
  // Clean string and replace matching terms
  Object.keys(GLOSSARY).forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    translated = translated.replace(regex, GLOSSARY[word]);
  });

  // Dynamic friendly suffixes/prefixes that Indian educators use
  if (stepIndex === 0) {
    translated = `Namaste! ${translated}`;
  } else if (stepIndex === 1) {
    translated = `Acha, abhi dekho... ${translated}`;
  }
  
  // Soft end sentence tag
  if (!translated.endsWith('!') && !translated.endsWith('.')) {
    translated += ', samajh gaye na?';
  } else if (translated.endsWith('.')) {
    translated = translated.slice(0, -1) + ', simple hai!';
  }

  return translated;
}
