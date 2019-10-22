/**
 * Simply writes "Hello, world!" to serial and then waits forever.
 */

void setup() {
  Serial.begin(9600);
  Serial.println("Hello world!");
}

void loop() {
  while (1);
}
