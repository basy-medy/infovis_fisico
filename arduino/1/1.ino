void setup() {
  pinMode(A0, INPUT);       // Set A0 as input for the potentiometer
  pinMode(7, INPUT_PULLUP);  // Set pin 7 as input with pull-up resistor for the button
  Serial.begin(9600);       // Start the serial communication at 9600 baud
}

void loop() {
  int potValue = analogRead(A0);  // Read the potentiometer value (0 - 1023)
  int outputValue;

  // Map the potentiometer reading to a range of 1 to 5
  if (potValue < 205) {
    outputValue = 1;
  } else if (potValue < 410) {
    outputValue = 2;
  } else if (potValue < 615) {
    outputValue = 3;
  } else if (potValue < 820) {
    outputValue = 4;
  } else {
    outputValue = 5;
  }

  // Only send the output value when the button is pressed
  if (digitalRead(7) == LOW) {  // Check if button is pressed (pin is LOW)
    Serial.println(outputValue + 1);  // Print the corresponding value
    delay(500);  // Debounce delay to avoid multiple readings
  }
}
