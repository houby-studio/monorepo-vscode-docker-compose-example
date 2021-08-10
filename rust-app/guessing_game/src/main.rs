use rand::Rng;
use std::cmp::Ordering;
use std::io;

fn main() {
  // Print text to player
  println!("Guess the number!");

  // Generate winning number
  let secret_number = rand::thread_rng().gen_range(0..=100);

  // For debug only - print winning number
  // dbg!(secret_number);

  // Loop until player wins or quits game
  loop {
    // Print text to player
    println!("Please input your guess.");

    // Variable to hold uer input
    let mut guess = String::new();

    // Read user input from console
    io::stdin()
      .read_line(&mut guess)
      .expect("Failed to read line");

    // Convert user input to number
    let guess: u32 = match guess.trim().parse() {
      Ok(num) => num,
      Err(_) => continue,
    };

    // Print text to player
    println!("You guessed: {}", guess);

    // Compare guess to correct number and print text to player
    match guess.cmp(&secret_number) {
      Ordering::Less => println!("You guessed too small!"),
      Ordering::Greater => println!("You guessed too big!"),
      Ordering::Equal => {
        println!("You win!");
        break;
      }
    }
  }
}
