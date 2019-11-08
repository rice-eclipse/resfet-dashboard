/**
 * Simply printlns "Hello, world!" to serial and then waits forever.
 */

void setup() {
  Serial.begin(9600);
  Serial.println("Hello world!");
}

void loop() {
  for (int i = 0; i < 100; i++){
    Serial.println("alt:[" + String(i + random(-20, 100)) + "]-- RSSI: #");
    Serial.println("gps:[" + String(i + random(-20, 100)) + "," + String(i + random(-20, 100)) + "]-- RSSI: #");
    Serial.println("imu:[" + String(i + random(-20, 100)) + "," + String(i + random(-20, 100)) + "," + 
    String(i + random(-20, 100)) + "," + String(i + random(-20, 100)) + "," + String(i + random(-20, 100))
    + "," + String(i + random(-20, 100)) + "," + String(i + random(-20, 100)) + "," + String(i + random(-20, 100))
    + "," + String(i + random(-20, 100)) + "]-- RSSI: #");
  }
}
