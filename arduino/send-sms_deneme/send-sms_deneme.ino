#include <SoftwareSerial.h>

String Arsp, Grsp;
SoftwareSerial gsm(10, 11); // TX, RX

void setup() {
  // put your setup code here, to run once:

  Serial.begin(9600);
  Serial.println("Testing GSM SIM800L");
  gsm.begin(9600);

}

void loop() {
  // put your main code here, to run repeatedly:

    
    gsm.println("AT"); //initially
    ShowSerialData();
    //gsm.println("AT+CFUN=1"); //functionality = 1
    //ShowSerialData();
    //gsm.println("AT+CMEE=2"); //expanded error descr.
    //ShowSerialData();
    gsm.println("AT+CPIN?"); //does it need pin code & check sim
    ShowSerialData();
    //gsm.println("AT+CGATT=1"); //attach to gprs
    //ShowSerialData();
  

  if (Serial.available())
  {
    Arsp = Serial.readString();
    gsm.println(Arsp);
    //gsm.write(0x1a);
  }

  if (gsm.available())
  {
    Grsp = gsm.readString();
    Serial.println(Grsp);
  }

}


void ShowSerialData() {
  delay(100);
  while(gsm.available()){
      Grsp = gsm.readString();
      Serial.println(Grsp);
  }
}
