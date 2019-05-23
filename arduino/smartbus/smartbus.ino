#include <Adafruit_GPS.h> //gps
#include <SoftwareSerial.h> //gps, gsm
#include <SPI.h> //rfid
#include <MFRC522.h> //rfid

#define SS_PIN 10 //rfid
#define RST_PIN 9 //rfid
MFRC522 mfrc522(SS_PIN, RST_PIN); //rfid

String Arsp, Grsp; //gsm
SoftwareSerial gsm(6, 7); // RX, TX //gsm

#define GPSECHO  true //gps
SoftwareSerial mySerial(3, 2); //gps
Adafruit_GPS GPS(&mySerial); //gps
boolean usingInterrupt = false; //gps
void useInterrupt(boolean); //gps

#define maxTime 10000 //10 sec
String userID, prevID, lat, lon, latDeg, lonDeg; //those will be sent
boolean newID = false; //new card present
boolean sendInfo = false; 

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  gsm.begin(4800);
  Serial.println("Testing GSM SIM800L");
  
  SPI.begin();      // Initiate  SPI bus
  mfrc522.PCD_Init();   // Initiate MFRC522
  Serial.println("Approximate your card to the reader...");
  Serial.println();

  Serial.println("Adafruit GPS library basic test!");
  GPS.begin(9600);
  GPS.sendCommand(PMTK_SET_NMEA_OUTPUT_RMCGGA);
  GPS.sendCommand(PMTK_SET_NMEA_UPDATE_1HZ); 
  GPS.sendCommand(PGCMD_ANTENNA);
  useInterrupt(true);
  delay(1000);
  mySerial.println(PMTK_Q_RELEASE);

  pinMode( 4, OUTPUT);

}

SIGNAL(TIMER0_COMPA_vect) {
  char c = GPS.read();
  // if you want to debug, this is a good time to do it!
#ifdef UDR0
  if (GPSECHO)
    if (c) ;//UDR0 = c;  
    // writing direct to UDR0 is much much faster than Serial.print 
    // but only one character can be written at a time. 
#endif
}

void useInterrupt(boolean v) {
  if (v) {
    // Timer0 is already used for millis() - we'll just interrupt somewhere
    // in the middle and call the "Compare A" function above
    OCR0A = 0xAF;
    TIMSK0 |= _BV(OCIE0A);
    usingInterrupt = true;
  } else {
    // do not call the interrupt function COMPA anymore
    TIMSK0 &= ~_BV(OCIE0A);
    usingInterrupt = false;
  }
}

uint32_t timer = millis();
void loop() {
  //mySerial.listen();
  String dataJSON = "{  ";

  //buzzer
  digitalWrite( 4, HIGH);
  delay(1000);
  digitalWrite( 4, LOW);
  
  // Looking for new cards
  if ( mfrc522.PICC_IsNewCardPresent()){
    mfrc522.PICC_ReadCardSerial();

    //Show UID on serial monitor
    String content = "";
    byte letter;
    for (byte i = 0; i < mfrc522.uid.size; i++) {
      content.concat(String(mfrc522.uid.uidByte[i] < 0x10 ? " 0" : " "));
      content.concat(String(mfrc522.uid.uidByte[i], HEX));
    }

    userID = content.substring(1);
    if( userID != prevID){
      prevID = userID;
      newID = true;
      sendInfo = true;
    }
  }

  if (GPS.newNMEAreceived() && !GPS.parse(GPS.lastNMEA()))
      return;

  // if millis() or timer wraps around, we'll just reset it
  if (timer > millis())  
    timer = millis();

  // approximately every 2 seconds or so, print out the current stats
  if (millis() - timer > maxTime) {
    timer = millis(); // reset the timer
    sendInfo = true;
  }
  if( GPS.fix){
    lat = GPS.lat;
    lon = GPS.lon;
    //latDeg = GPS.latitudeDegrees;
    //lonDeg = GPS.longitudeDegrees;
  }

  if( sendInfo){
    if( newID) 
      dataJSON = dataJSON + "\"id\" : " + userID + ", ";
      
    dataJSON = dataJSON + "\"latitue\" : " + lat + ", ";
    dataJSON = dataJSON + "\"longtitude\" : " + lon + ", ";
    //dataJSON = dataJSON + "\"latDeg\" : " + latDeg + ", ";
    //dataJSON = dataJSON + "\"lonDeg\" : " + lonDeg + ", ";
    dataJSON = dataJSON + "}";
    Serial.println( "DataJSON --> " + dataJSON);
    sendInfo = false;
    newID = false;

    String a = "AT+HTTPPARA=\"URL\",\"http://34.65.33.103:80/add_activity?" + dataJSON + "\"";
    Serial.println( "a --> " + a);
    String b = "AT+HTTPPARA=\"URL\",\"http://34.65.33.103:80/bus/update_location?" + dataJSON + "\"";
    Serial.println( "b --> " + b);
    
    delay(1000);
    gsm.listen();
    gsm.println("AT"); //initially
    ShowSerialData();
    gsm.println("AT+CFUN=1"); //functionality = 1
    ShowSerialData();
    gsm.println("AT+CPIN?"); //does it need pin code & check sim
    ShowSerialData();
    gsm.println("AT+CSTT=\"internet\",\"\",\"\""); //apn set up for turkcell
    ShowSerialData();
    gsm.println("AT+CIICR");
    ShowSerialData();
    gsm.println("AT+CIFSR");
    ShowSerialData();
    gsm.println("AT+CGATT=1");
    ShowSerialData();
    gsm.println("AT+SAPBR=3,1,\"CONTYPE\",\"GPRS\"");
    ShowSerialData();
    gsm.println("AT+SAPBR=3,1,\"APN\", \"\""); //initially
    ShowSerialData();
    gsm.println("ATAT+SAPBR=1,1"); //initially
    ShowSerialData();
    gsm.println("AT+HTTPINIT");
    ShowSerialData();
    if( newID){
      gsm.print("AT+HTTPPARA=\"URL\",\"http://34.65.33.103:80/add_activity?");
      gsm.print(dataJSON);
      gsm.println("\"");
    }
    else{
      gsm.print("AT+HTTPPARA=\"URL\",\"http://34.65.33.103:80/bus/update_location?");
      gsm.print(dataJSON);
      gsm.println("\"");
    }
    ShowSerialData();
    gsm.println("AT+HTTPINIT");
    ShowSerialData();
    gsm.println("AT+HTTPACTION=0");
    ShowSerialData();
    gsm.println("AT+HTTPREAD");
    ShowSerialData();
    gsm.println("AT+HTTPTERM");      
    ShowSerialData();

  }
}


void ShowSerialData() {
  delay(1000);
  while(gsm.available()){
      Grsp = gsm.readString();
      Serial.println(Grsp);
  }
}
