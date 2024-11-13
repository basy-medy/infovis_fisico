int number = 2;  // Start with 2

void setup() {
  pinMode(7, INPUT_PULLUP);  // Set pin 7 as input with pull-up resistor
  Serial.begin(9600);        // Start the serial communication at 9600 baud
}

void loop() {
  if (digitalRead(7) == LOW) {  // Check if button is pressed (pin is LOW)
    Serial.println(number);  // Send the current number to serial
    delay(200);  // Debounce delay to avoid multiple readings

    number++;  // Increment the number
    if (number > 6) {  // Reset to 2 if it goes above 6
      number = 2;
    }
  }
}
