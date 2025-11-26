export type TrackId = "rust" | "anchor";

type RustPlaygroundExecutor = {
  type: "rust-playground";
  expectedStdout: string;
  harnessBefore?: string;
  harnessAfter?: string;
  channel?: "stable" | "beta" | "nightly";
  edition?: "2021" | "2024";
  mode?: "debug" | "release";
  description?: string;
};

export type ChallengeExecutor = RustPlaygroundExecutor;

export type ChallengeEntry = {
  id: number;
  track: TrackId;
  title: string;
  difficulty?: "Easy" | "Medium" | "Hard";
  tags?: string[];
  description: string;
  starterCode?: string;
  executor?: ChallengeExecutor;
};

// ============================================================================
// 30 DAYS OF RUST - FROM BASICS TO SOLANA-READY
// ============================================================================

export const challenges: ChallengeEntry[] = [
  // ==========================================================================
  // PHASE 1: FOUNDATIONS (Days 1-7)
  // ==========================================================================
  {
    id: 1,
    track: "rust",
    title: "Day 1: Hello Rust",
    difficulty: "Easy",
    tags: ["Basics", "Variables", "println!"],
    description:
      "Your first Rust program! Learn about variables, basic types, and how to print output. Create a greeting message using let bindings.",
    starterCode: `// Day 1: Hello Rust
// Create a variable 'name' with your name and print a greeting

fn main() {
    // TODO: Create a variable called 'name' with the value "Rustacean"
    // TODO: Print "Hello, {name}! Welcome to Rust."
    
}`,
    executor: {
      type: "rust-playground",
      expectedStdout: "Hello, Rustacean! Welcome to Rust.",
      description: "Your program should print the exact greeting message.",
    },
  },
  {
    id: 2,
    track: "rust",
    title: "Day 2: Primitive Types",
    difficulty: "Easy",
    tags: ["Types", "Numbers", "Tuples"],
    description:
      "Explore Rust's primitive types: integers, floats, booleans, and tuples. Calculate the sum and product of two numbers.",
    starterCode: `// Day 2: Primitive Types
// Work with different number types and tuples

fn calculate(a: i32, b: i32) -> (i32, i32) {
    // TODO: Return a tuple of (sum, product)
    (0, 0)
}

fn main() {
    let (sum, product) = calculate(7, 6);
    println!("{} {}", sum, product);
}`,
    executor: {
      type: "rust-playground",
      expectedStdout: "13 42",
      description: "Returns the sum and product as a tuple.",
    },
  },
  {
    id: 3,
    track: "rust",
    title: "Day 3: Functions",
    difficulty: "Easy",
    tags: ["Functions", "Expressions", "Return"],
    description:
      "Master Rust functions: parameters, return types, and the difference between expressions and statements. Implement a temperature converter.",
    starterCode: `// Day 3: Functions
// Convert Celsius to Fahrenheit: F = C * 9/5 + 32

fn celsius_to_fahrenheit(celsius: f64) -> f64 {
    // TODO: Implement the conversion formula
    // Remember: expressions don't end with semicolons!
    0.0
}

fn main() {
    let temp_f = celsius_to_fahrenheit(100.0);
    println!("{}", temp_f);
}`,
    executor: {
      type: "rust-playground",
      expectedStdout: "212",
      description: "Converts 100°C to 212°F.",
    },
  },
  {
    id: 4,
    track: "rust",
    title: "Day 4: Control Flow",
    difficulty: "Easy",
    tags: ["if/else", "match", "Loops"],
    description:
      "Learn control flow with if/else, match expressions, and loops. Implement FizzBuzz for a single number.",
    starterCode: `// Day 4: Control Flow
// Implement FizzBuzz for a single number

fn fizzbuzz(n: u32) -> String {
    // TODO: Return "FizzBuzz" if divisible by both 3 and 5
    // Return "Fizz" if divisible by 3
    // Return "Buzz" if divisible by 5
    // Otherwise return the number as a string
    String::new()
}

fn main() {
    println!("{}", fizzbuzz(15));
}`,
    executor: {
      type: "rust-playground",
      expectedStdout: "FizzBuzz",
      description: "15 is divisible by both 3 and 5, so output is FizzBuzz.",
    },
  },
  {
    id: 5,
    track: "rust",
    title: "Day 5: Ownership Basics",
    difficulty: "Easy",
    tags: ["Ownership", "Move", "Clone"],
    description:
      "Understand Rust's ownership system: move semantics, scope, and when values are dropped. Fix a program with ownership errors.",
    starterCode: `// Day 5: Ownership Basics
// Fix this code so it compiles and runs correctly

fn take_ownership(s: String) -> usize {
    s.len()
}

fn main() {
    let message = String::from("ownership");
    
    // TODO: Fix this code - currently the second call won't work!
    // Hint: You might need to clone, or restructure the calls
    let len1 = take_ownership(message);
    let len2 = take_ownership(message); // This line causes an error!
    
    println!("{}", len1 + len2);
}`,
    executor: {
      type: "rust-playground",
      expectedStdout: "18",
      description: "Both calls should work, each returning 9 (length of 'ownership').",
    },
  },
  {
    id: 6,
    track: "rust",
    title: "Day 6: References & Borrowing",
    difficulty: "Easy",
    tags: ["References", "Borrowing", "&mut"],
    description:
      "Learn to borrow values with references (&T and &mut T). Modify a value through a mutable reference.",
    starterCode: `// Day 6: References & Borrowing
// Use references to avoid taking ownership

fn add_suffix(s: &mut String) {
    // TODO: Append "_modified" to the string
    
}

fn get_length(s: &String) -> usize {
    // TODO: Return the length without taking ownership
    0
}

fn main() {
    let mut text = String::from("rust");
    add_suffix(&mut text);
    let len = get_length(&text);
    println!("{} {}", text, len);
}`,
    executor: {
      type: "rust-playground",
      expectedStdout: "rust_modified 13",
      description: "The string is modified in place and its length is calculated.",
    },
  },
  {
    id: 7,
    track: "rust",
    title: "Day 7: Slices",
    difficulty: "Easy",
    tags: ["Slices", "&str", "&[T]"],
    description:
      "Work with slices: views into contiguous sequences. Extract the first word from a string.",
    starterCode: `// Day 7: Slices
// Extract the first word from a string (up to first space)

fn first_word(s: &str) -> &str {
    // TODO: Return a slice of the first word
    // If there's no space, return the entire string
    ""
}

fn main() {
    let sentence = "hello world";
    let word = first_word(sentence);
    println!("{}", word);
}`,
    executor: {
      type: "rust-playground",
      expectedStdout: "hello",
      description: "Extracts 'hello' from 'hello world'.",
    },
  },

  // ==========================================================================
  // PHASE 2: CORE CONCEPTS (Days 8-14)
  // ==========================================================================
  {
    id: 8,
    track: "rust",
    title: "Day 8: Structs",
    difficulty: "Easy",
    tags: ["Structs", "Data", "Types"],
    description:
      "Define and use structs to create custom data types. Build a simple User struct with fields.",
    starterCode: `// Day 8: Structs
// Create a User struct and implement a greeting

// TODO: Define a User struct with 'name' (String) and 'age' (u32) fields
struct User {
    // Add fields here
}

fn create_user(name: &str, age: u32) -> User {
    // TODO: Create and return a User instance
    todo!()
}

fn greet(user: &User) -> String {
    // TODO: Return "Hi, I'm {name} and I'm {age} years old"
    String::new()
}

fn main() {
    let user = create_user("Alice", 30);
    println!("{}", greet(&user));
}`,
    executor: {
      type: "rust-playground",
      expectedStdout: "Hi, I'm Alice and I'm 30 years old",
      description: "Creates a user and prints a greeting.",
    },
  },
  {
    id: 9,
    track: "rust",
    title: "Day 9: Enums & Option",
    difficulty: "Medium",
    tags: ["Enums", "Option", "Pattern Matching"],
    description:
      "Master enums and the Option type. Implement safe division that handles division by zero.",
    starterCode: `// Day 9: Enums & Option
// Implement safe division using Option<T>

fn safe_divide(a: i32, b: i32) -> Option<i32> {
    // TODO: Return None if b is 0, otherwise return Some(a / b)
    None
}

fn main() {
    match safe_divide(10, 2) {
        Some(result) => println!("Result: {}", result),
        None => println!("Cannot divide by zero"),
    }
}`,
    executor: {
      type: "rust-playground",
      expectedStdout: "Result: 5",
      description: "Safely divides 10 by 2.",
    },
  },
  {
    id: 10,
    track: "rust",
    title: "Day 10: Methods & impl",
    difficulty: "Medium",
    tags: ["Methods", "impl", "self"],
    description:
      "Add behavior to structs with impl blocks. Create a Rectangle with area and perimeter methods.",
    starterCode: `// Day 10: Methods & impl
// Implement methods for a Rectangle struct

struct Rectangle {
    width: u32,
    height: u32,
}

impl Rectangle {
    // TODO: Implement 'new' associated function
    fn new(width: u32, height: u32) -> Self {
        todo!()
    }

    // TODO: Implement 'area' method
    fn area(&self) -> u32 {
        todo!()
    }

    // TODO: Implement 'is_square' method
    fn is_square(&self) -> bool {
        todo!()
    }
}

fn main() {
    let rect = Rectangle::new(5, 5);
    println!("{} {}", rect.area(), rect.is_square());
}`,
    executor: {
      type: "rust-playground",
      expectedStdout: "25 true",
      description: "A 5x5 rectangle has area 25 and is a square.",
    },
  },
  {
    id: 11,
    track: "rust",
    title: "Day 11: Result & Error Handling",
    difficulty: "Medium",
    tags: ["Result", "Error Handling", "?"],
    description:
      "Handle errors gracefully with Result<T, E>. Parse a string to a number with proper error handling.",
    starterCode: `// Day 11: Result & Error Handling
// Parse and double a number from a string

fn parse_and_double(s: &str) -> Result<i32, String> {
    // TODO: Parse the string to i32
    // If parsing fails, return Err("Invalid number")
    // If successful, return Ok(number * 2)
    Err(String::from("Not implemented"))
}

fn main() {
    match parse_and_double("21") {
        Ok(n) => println!("Doubled: {}", n),
        Err(e) => println!("Error: {}", e),
    }
}`,
    executor: {
      type: "rust-playground",
      expectedStdout: "Doubled: 42",
      description: "Parses '21' and doubles it to 42.",
    },
  },
  {
    id: 12,
    track: "rust",
    title: "Day 12: Vectors",
    difficulty: "Medium",
    tags: ["Vec", "Collections", "Iteration"],
    description:
      "Work with Vec<T>, Rust's growable array. Calculate the sum and find the maximum of a vector.",
    starterCode: `// Day 12: Vectors
// Work with Vec<T> - find sum and max

fn sum_and_max(numbers: &[i32]) -> (i32, i32) {
    // TODO: Return (sum of all numbers, maximum number)
    // Assume the slice is non-empty
    (0, 0)
}

fn main() {
    let nums = vec![3, 1, 4, 1, 5, 9, 2, 6];
    let (sum, max) = sum_and_max(&nums);
    println!("{} {}", sum, max);
}`,
    executor: {
      type: "rust-playground",
      expectedStdout: "31 9",
      description: "Sum is 31, max is 9.",
    },
  },
  {
    id: 13,
    track: "rust",
    title: "Day 13: Strings",
    difficulty: "Medium",
    tags: ["String", "&str", "UTF-8"],
    description:
      "Understand String vs &str and string manipulation. Reverse the words in a sentence.",
    starterCode: `// Day 13: Strings
// Reverse the order of words in a sentence

fn reverse_words(s: &str) -> String {
    // TODO: Reverse the order of words
    // "hello world" -> "world hello"
    String::new()
}

fn main() {
    let result = reverse_words("rust is awesome");
    println!("{}", result);
}`,
    executor: {
      type: "rust-playground",
      expectedStdout: "awesome is rust",
      description: "Reverses word order in the sentence.",
    },
  },
  {
    id: 14,
    track: "rust",
    title: "Day 14: HashMaps",
    difficulty: "Medium",
    tags: ["HashMap", "Collections", "Entry API"],
    description:
      "Use HashMaps to store key-value pairs. Count the frequency of characters in a string.",
    starterCode: `// Day 14: HashMaps
// Count character frequency in a string

use std::collections::HashMap;

fn char_frequency(s: &str) -> HashMap<char, u32> {
    // TODO: Return a map of each character to its count
    // Only count alphabetic characters, lowercase them
    HashMap::new()
}

fn main() {
    let freq = char_frequency("Hello");
    // Print in sorted order for consistent output
    let mut pairs: Vec<_> = freq.iter().collect();
    pairs.sort_by_key(|&(c, _)| c);
    for (c, count) in pairs {
        print!("{}:{} ", c, count);
    }
    println!();
}`,
    executor: {
      type: "rust-playground",
      expectedStdout: "e:1 h:1 l:2 o:1",
      description: "Counts each character's frequency.",
    },
  },

  // ==========================================================================
  // PHASE 3: INTERMEDIATE (Days 15-21)
  // ==========================================================================
  {
    id: 15,
    track: "rust",
    title: "Day 15: Generics",
    difficulty: "Medium",
    tags: ["Generics", "Type Parameters", "Reusability"],
    description:
      "Write flexible code with generics. Implement a generic function to find the largest element.",
    starterCode: `// Day 15: Generics
// Find the largest element in a slice using generics

fn largest<T: PartialOrd + Copy>(list: &[T]) -> T {
    // TODO: Return the largest element
    // Hint: You can compare with > because of PartialOrd
    todo!()
}

fn main() {
    let numbers = vec![34, 50, 25, 100, 65];
    println!("{}", largest(&numbers));
}`,
    executor: {
      type: "rust-playground",
      expectedStdout: "100",
      description: "Finds the largest number in the vector.",
    },
  },
  {
    id: 16,
    track: "rust",
    title: "Day 16: Traits",
    difficulty: "Medium",
    tags: ["Traits", "Polymorphism", "impl Trait"],
    description:
      "Define shared behavior with traits. Create a Describable trait and implement it for multiple types.",
    starterCode: `// Day 16: Traits
// Define and implement a trait

trait Describable {
    fn describe(&self) -> String;
}

struct Dog {
    name: String,
}

struct Cat {
    name: String,
}

// TODO: Implement Describable for Dog
// Should return "Dog: {name}"

// TODO: Implement Describable for Cat
// Should return "Cat: {name}"

fn print_description(item: &impl Describable) {
    println!("{}", item.describe());
}

fn main() {
    let dog = Dog { name: String::from("Buddy") };
    print_description(&dog);
}`,
    executor: {
      type: "rust-playground",
      expectedStdout: "Dog: Buddy",
      description: "Prints the dog's description.",
    },
  },
  {
    id: 17,
    track: "rust",
    title: "Day 17: Trait Objects",
    difficulty: "Hard",
    tags: ["dyn Trait", "Dynamic Dispatch", "Box"],
    description:
      "Use trait objects for runtime polymorphism. Store different types in a single collection.",
    starterCode: `// Day 17: Trait Objects
// Use dyn Trait for heterogeneous collections

trait Speak {
    fn speak(&self) -> String;
}

struct Dog;
struct Cat;

impl Speak for Dog {
    fn speak(&self) -> String {
        String::from("Woof!")
    }
}

// TODO: Implement Speak for Cat (should return "Meow!")

fn main() {
    // TODO: Create a Vec<Box<dyn Speak>> containing a Dog and a Cat
    let animals: Vec<Box<dyn Speak>> = vec![];
    
    for animal in &animals {
        println!("{}", animal.speak());
    }
}`,
    executor: {
      type: "rust-playground",
      expectedStdout: "Woof!\nMeow!",
      description: "Both animals speak through dynamic dispatch.",
    },
  },
  {
    id: 18,
    track: "rust",
    title: "Day 18: Lifetimes",
    difficulty: "Hard",
    tags: ["Lifetimes", "'a", "References"],
    description:
      "Understand lifetime annotations. Return the longer of two string slices safely.",
    starterCode: `// Day 18: Lifetimes
// Return the longer of two string slices

// TODO: Add lifetime annotations to make this compile
fn longest(x: &str, y: &str) -> &str {
    if x.len() > y.len() {
        x
    } else {
        y
    }
}

fn main() {
    let s1 = String::from("short");
    let s2 = String::from("much longer string");
    let result = longest(&s1, &s2);
    println!("{}", result);
}`,
    executor: {
      type: "rust-playground",
      expectedStdout: "much longer string",
      description: "Returns the longer string.",
    },
  },
  {
    id: 19,
    track: "rust",
    title: "Day 19: Iterators",
    difficulty: "Medium",
    tags: ["Iterator", "map", "filter", "collect"],
    description:
      "Master iterator adapters. Transform and filter collections functionally.",
    starterCode: `// Day 19: Iterators
// Use iterator adapters to transform data

fn process_numbers(numbers: Vec<i32>) -> Vec<i32> {
    // TODO: Filter to keep only even numbers
    // Then square each number
    // Return the result as a Vec
    vec![]
}

fn main() {
    let nums = vec![1, 2, 3, 4, 5, 6];
    let result = process_numbers(nums);
    for n in result {
        print!("{} ", n);
    }
    println!();
}`,
    executor: {
      type: "rust-playground",
      expectedStdout: "4 16 36",
      description: "Filters even numbers and squares them.",
    },
  },
  {
    id: 20,
    track: "rust",
    title: "Day 20: Closures",
    difficulty: "Medium",
    tags: ["Closures", "Fn", "FnMut", "Capturing"],
    description:
      "Use closures to capture environment. Implement a counter factory.",
    starterCode: `// Day 20: Closures
// Create a counter using closures

fn make_counter(start: i32) -> impl FnMut() -> i32 {
    // TODO: Return a closure that:
    // - Starts at 'start'
    // - Returns the current value and increments it each call
    let mut count = start;
    move || {
        todo!()
    }
}

fn main() {
    let mut counter = make_counter(1);
    println!("{}", counter()); // 1
    println!("{}", counter()); // 2
    println!("{}", counter()); // 3
}`,
    executor: {
      type: "rust-playground",
      expectedStdout: "1\n2\n3",
      description: "Counter increments from 1 to 3.",
    },
  },
  {
    id: 21,
    track: "rust",
    title: "Day 21: Modules",
    difficulty: "Medium",
    tags: ["Modules", "pub", "use", "Visibility"],
    description:
      "Organize code with modules. Understand pub, mod, and use keywords.",
    starterCode: `// Day 21: Modules
// Organize code with modules and visibility

mod math {
    // TODO: Make this function public
    fn add(a: i32, b: i32) -> i32 {
        a + b
    }
    
    pub mod advanced {
        // TODO: Make this function public
        // It should call the parent add function
        fn multiply_and_add(a: i32, b: i32, c: i32) -> i32 {
            // Hint: Use super:: to access parent module
            a * b + c
        }
    }
}

fn main() {
    // TODO: Call math::add(5, 3)
    // TODO: Call math::advanced::multiply_and_add(2, 3, 4)
    let sum = 0;
    let result = 0;
    println!("{} {}", sum, result);
}`,
    executor: {
      type: "rust-playground",
      expectedStdout: "8 10",
      description: "5+3=8, 2*3+4=10",
    },
  },

  // ==========================================================================
  // PHASE 4: ADVANCED & SOLANA PREP (Days 22-30)
  // ==========================================================================
  {
    id: 22,
    track: "rust",
    title: "Day 22: Smart Pointers",
    difficulty: "Hard",
    tags: ["Box", "Rc", "RefCell"],
    description:
      "Explore smart pointers: Box for heap allocation, Rc for shared ownership.",
    starterCode: `// Day 22: Smart Pointers
// Use Box<T> for heap allocation

// A recursive type needs Box to have known size
enum List {
    Cons(i32, Box<List>),
    Nil,
}

use List::{Cons, Nil};

fn sum_list(list: &List) -> i32 {
    // TODO: Recursively sum all values in the list
    match list {
        Cons(value, next) => todo!(),
        Nil => todo!(),
    }
}

fn main() {
    // Creates list: 1 -> 2 -> 3 -> Nil
    let list = Cons(1, Box::new(Cons(2, Box::new(Cons(3, Box::new(Nil))))));
    println!("{}", sum_list(&list));
}`,
    executor: {
      type: "rust-playground",
      expectedStdout: "6",
      description: "Sums 1+2+3=6 from the linked list.",
    },
  },
  {
    id: 23,
    track: "rust",
    title: "Day 23: Derive Macros",
    difficulty: "Medium",
    tags: ["derive", "Debug", "Clone", "PartialEq"],
    description:
      "Use derive macros to auto-implement common traits. Essential for Solana development!",
    starterCode: `// Day 23: Derive Macros
// Use #[derive] to auto-implement traits

// TODO: Add derives for Debug, Clone, PartialEq
struct Token {
    symbol: String,
    amount: u64,
}

fn main() {
    let token1 = Token {
        symbol: String::from("SOL"),
        amount: 100,
    };
    let token2 = token1.clone();
    
    println!("{:?}", token1);
    println!("{}", token1 == token2);
}`,
    executor: {
      type: "rust-playground",
      expectedStdout: "Token { symbol: \"SOL\", amount: 100 }\ntrue",
      description: "Demonstrates Debug and PartialEq derives.",
    },
  },
  {
    id: 24,
    track: "rust",
    title: "Day 24: Attributes",
    difficulty: "Medium",
    tags: ["Attributes", "#[cfg]", "#[repr]"],
    description:
      "Use attributes for conditional compilation and memory layout control.",
    starterCode: `// Day 24: Attributes
// Use attributes for memory layout (important for Solana!)

// TODO: Add #[repr(C)] for predictable memory layout
struct AccountHeader {
    is_initialized: bool,  // 1 byte
    account_type: u8,      // 1 byte
    authority: [u8; 32],   // 32 bytes - simulating a Pubkey
}

impl AccountHeader {
    fn new(account_type: u8, authority: [u8; 32]) -> Self {
        Self {
            is_initialized: true,
            account_type,
            authority,
        }
    }
}

fn main() {
    let header = AccountHeader::new(1, [0u8; 32]);
    // With #[repr(C)], size should be exactly 34 bytes
    println!("{}", std::mem::size_of::<AccountHeader>());
}`,
    executor: {
      type: "rust-playground",
      expectedStdout: "34",
      description: "With #[repr(C)], the struct is exactly 34 bytes.",
    },
  },
  {
    id: 25,
    track: "rust",
    title: "Day 25: Byte Serialization",
    difficulty: "Hard",
    tags: ["Bytes", "Serialization", "[u8]"],
    description:
      "Manually serialize and deserialize data to bytes. Foundation for Borsh!",
    starterCode: `// Day 25: Byte Serialization
// Manually serialize a struct to bytes

struct Transfer {
    amount: u64,
    recipient: [u8; 4], // Simplified "address"
}

impl Transfer {
    // TODO: Serialize to bytes (little-endian for amount)
    fn to_bytes(&self) -> [u8; 12] {
        let mut bytes = [0u8; 12];
        // First 8 bytes: amount as little-endian
        // Next 4 bytes: recipient
        bytes
    }
    
    // TODO: Deserialize from bytes
    fn from_bytes(data: &[u8; 12]) -> Self {
        todo!()
    }
}

fn main() {
    let transfer = Transfer {
        amount: 1000,
        recipient: [1, 2, 3, 4],
    };
    let bytes = transfer.to_bytes();
    let restored = Transfer::from_bytes(&bytes);
    println!("{} {:?}", restored.amount, restored.recipient);
}`,
    executor: {
      type: "rust-playground",
      expectedStdout: "1000 [1, 2, 3, 4]",
      description: "Round-trip serialization preserves data.",
    },
  },
  {
    id: 26,
    track: "rust",
    title: "Day 26: Working with Bytes",
    difficulty: "Hard",
    tags: ["Bytes", "Pubkey", "Endianness"],
    description:
      "Build a Pubkey-like struct and work with byte arrays - essential for Solana!",
    starterCode: `// Day 26: Working with Bytes
// Create a simplified Pubkey type

#[derive(Debug, Clone, Copy, PartialEq)]
struct Pubkey([u8; 32]);

impl Pubkey {
    const fn new(bytes: [u8; 32]) -> Self {
        Pubkey(bytes)
    }
    
    // TODO: Create a "default" pubkey (all zeros)
    fn default() -> Self {
        todo!()
    }
    
    // TODO: Check if this is the default/zero pubkey
    fn is_zero(&self) -> bool {
        todo!()
    }
    
    // TODO: Return the bytes as a slice
    fn as_bytes(&self) -> &[u8] {
        todo!()
    }
}

fn main() {
    let zero = Pubkey::default();
    let custom = Pubkey::new([1u8; 32]);
    
    println!("{} {}", zero.is_zero(), custom.is_zero());
    println!("{}", custom.as_bytes()[0]);
}`,
    executor: {
      type: "rust-playground",
      expectedStdout: "true false\n1",
      description: "Zero check works, and we can access bytes.",
    },
  },
  {
    id: 27,
    track: "rust",
    title: "Day 27: The From Trait",
    difficulty: "Hard",
    tags: ["From", "Into", "Conversions"],
    description:
      "Implement type conversions with From/Into traits. Used heavily in Solana programs!",
    starterCode: `// Day 27: The From Trait
// Implement type conversions

struct Lamports(u64);
struct Sol(f64);

// TODO: Implement From<Sol> for Lamports
// 1 SOL = 1_000_000_000 lamports
impl From<Sol> for Lamports {
    fn from(sol: Sol) -> Self {
        todo!()
    }
}

// TODO: Implement From<Lamports> for Sol
impl From<Lamports> for Sol {
    fn from(lamports: Lamports) -> Self {
        todo!()
    }
}

fn main() {
    let sol = Sol(1.5);
    let lamports: Lamports = sol.into();
    println!("{}", lamports.0);
    
    let back: Sol = lamports.into();
    println!("{}", back.0);
}`,
    executor: {
      type: "rust-playground",
      expectedStdout: "1500000000\n1.5",
      description: "Converts SOL to lamports and back.",
    },
  },
  {
    id: 28,
    track: "rust",
    title: "Day 28: Error Enums",
    difficulty: "Hard",
    tags: ["Error", "Enums", "From"],
    description:
      "Create custom error enums with numeric codes - the Solana program error pattern!",
    starterCode: `// Day 28: Error Enums
// Create Solana-style error enums

#[derive(Debug, Clone, Copy)]
#[repr(u32)]
enum ProgramError {
    NotInitialized = 0,
    AlreadyInitialized = 1,
    InvalidAuthority = 2,
    InsufficientFunds = 3,
}

impl ProgramError {
    // TODO: Convert error to its numeric code
    fn code(&self) -> u32 {
        todo!()
    }
    
    // TODO: Convert from code to error
    fn from_code(code: u32) -> Option<Self> {
        todo!()
    }
}

fn main() {
    let err = ProgramError::InsufficientFunds;
    let code = err.code();
    let restored = ProgramError::from_code(code).unwrap();
    
    println!("{} {:?}", code, restored);
}`,
    executor: {
      type: "rust-playground",
      expectedStdout: "3 InsufficientFunds",
      description: "Error code 3 maps to InsufficientFunds.",
    },
  },
  {
    id: 29,
    track: "rust",
    title: "Day 29: Account Validation",
    difficulty: "Hard",
    tags: ["Validation", "Accounts", "Patterns"],
    description:
      "Implement Solana-style account validation patterns with discriminators.",
    starterCode: `// Day 29: Account Validation
// Solana-style account structure with discriminator

const ACCOUNT_DISCRIMINATOR: u8 = 1;

#[repr(C)]
struct TokenAccount {
    discriminator: u8,
    is_initialized: bool,
    owner: [u8; 32],
    balance: u64,
}

impl TokenAccount {
    // TODO: Create a new initialized account
    fn new(owner: [u8; 32], balance: u64) -> Self {
        todo!()
    }
    
    // TODO: Validate the account (check discriminator and initialized)
    fn validate(&self) -> Result<(), &'static str> {
        todo!()
    }
    
    // TODO: Check if the given pubkey is the owner
    fn is_owner(&self, pubkey: &[u8; 32]) -> bool {
        todo!()
    }
}

fn main() {
    let owner = [42u8; 32];
    let account = TokenAccount::new(owner, 1000);
    
    match account.validate() {
        Ok(()) => println!("Valid"),
        Err(e) => println!("Error: {}", e),
    }
    
    println!("{}", account.is_owner(&owner));
    println!("{}", account.balance);
}`,
    executor: {
      type: "rust-playground",
      expectedStdout: "Valid\ntrue\n1000",
      description: "Account validation passes for properly initialized account.",
    },
  },
  {
    id: 30,
    track: "rust",
    title: "Day 30: Capstone - State Machine",
    difficulty: "Hard",
    tags: ["Capstone", "State Machine", "Solana Patterns"],
    description:
      "Build a complete Solana-style state machine combining all concepts learned!",
    starterCode: `// Day 30: Capstone - Solana-Style State Machine
// Combine everything: enums, structs, traits, error handling

#[derive(Debug, Clone, Copy, PartialEq)]
#[repr(u8)]
enum EscrowState {
    Uninitialized = 0,
    Initialized = 1,
    Deposited = 2,
    Completed = 3,
    Cancelled = 4,
}

#[derive(Debug)]
enum EscrowError {
    InvalidState,
    InvalidAmount,
    Unauthorized,
}

#[repr(C)]
struct Escrow {
    state: EscrowState,
    maker: [u8; 32],
    taker: [u8; 32],
    amount: u64,
}

impl Escrow {
    fn new(maker: [u8; 32]) -> Self {
        Self {
            state: EscrowState::Initialized,
            maker,
            taker: [0u8; 32],
            amount: 0,
        }
    }
    
    // TODO: Deposit funds (only maker can do this, only when Initialized)
    fn deposit(&mut self, caller: &[u8; 32], amount: u64) -> Result<(), EscrowError> {
        todo!()
    }
    
    // TODO: Complete the escrow (only when Deposited, sets taker)
    fn complete(&mut self, taker: [u8; 32]) -> Result<(), EscrowError> {
        todo!()
    }
    
    // TODO: Cancel (only maker, only when not Completed)
    fn cancel(&mut self, caller: &[u8; 32]) -> Result<(), EscrowError> {
        todo!()
    }
}

fn main() {
    let maker = [1u8; 32];
    let taker = [2u8; 32];
    let mut escrow = Escrow::new(maker);
    
    escrow.deposit(&maker, 100).unwrap();
    println!("After deposit: {:?}", escrow.state);
    
    escrow.complete(taker).unwrap();
    println!("After complete: {:?}", escrow.state);
    println!("Amount: {}", escrow.amount);
}`,
    executor: {
      type: "rust-playground",
      expectedStdout: "After deposit: Deposited\nAfter complete: Completed\nAmount: 100",
      description: "Full escrow state machine working correctly.",
    },
  },
];

export function getChallenge(track: TrackId, id: number) {
  return challenges.find((c) => c.track === track && c.id === id) || null;
}

export function getTrackCount(track: TrackId) {
  return challenges.filter((c) => c.track === track).length;
}

export function toMdxSlug(track: TrackId, id: number) {
  return [track, String(id)];
}
