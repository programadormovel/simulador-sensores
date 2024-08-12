#include <dummy.h>

// lib sensor
#include <SPI.h>
#include <Adafruit_Sensor.h>
#include "Adafruit_BME680.h"

//#include "Arduino.h"
#include <HTTPClient.h>
//data hora ntp
#include <NTPClient.h>
// Include the correct display library

// For a connection via I2C using the Arduino Wire include:
#include <Wire.h>         // Only needed for Arduino 1.6.5 and earlier
//#include "SSD1306Wire.h"  // legacy: #include "SSD1306.h"


#include "pins_arduino.h"

#include <WiFi.h>
#include <WiFiClient.h>

#include <freertos/FreeRTOS.h>
#include <freertos/task.h>
#include <esp_system.h>
#include <time.h>
#include <sys/time.h>

WiFiClient client;

WiFiUDP udp;
// NTPClient ntp(ntpUDP);

NTPClient ntp(udp, "a.st1.ntp.br", -3 * 3600, 60000);//Cria um objeto "NTP" com as configurações.
#define led D4//Define o LED ao pino D4.
String hora;//Váriavel que armazenara o horario do NTP.

const char* ssid = "Neia"; //"IPT-WiFi-Novo";
const char* password = "20d01a12"; //"c@dmiumCd";
const char* server = "http://iot.ipt.br:8000/adaptor/resources/36adc6d0-27c8-41ca-8a82-c6c8f590c06b/data";

struct tm data;//Cria a estrutura que contem as informacoes da data.
char data_formatada[64];

Adafruit_BME680 bme;
float temperature;
float humidity;
float pressure;
float gasResistance;
float depth;

unsigned long lastTime = 0;  
unsigned long timerDelay = 30000;  // send readings timer

const int PINO_TRIG = 4; // Pino D4 conectado ao TRIG do HC-SR04
const int PINO_ECHO = 2; // Pino D2 conectado ao ECHO do HC-SR04

void getHCSR04(){
  digitalWrite(PINO_TRIG, LOW);
  delayMicroseconds(2);
  digitalWrite(PINO_TRIG, HIGH);
  delayMicroseconds(10);
  digitalWrite(PINO_TRIG, LOW);

  long duracao = pulseIn(PINO_ECHO, HIGH); // Mede o tempo de resposta do ECHO 
  depth = (duracao * 0.0343) / 2;// Calcula a distância usando a velocidade do som (aproximadamente 343 m/s)
  //Serial.print("Distancia: ");
  //Serial.print(distancia);
  //Serial.println(" cm");
}

void getBME680Readings(){
  // Tell BME680 to begin measurement.
  unsigned long endTime = bme.beginReading();
  if (endTime == 0) {
    Serial.println(F("Failed to begin reading :("));
    return;
  }
  if (!bme.endReading()) {
    Serial.println(F("Failed to complete reading :("));
    return;
  }
  temperature = bme.temperature;
  pressure = bme.pressure / 100.0;
  humidity = bme.humidity;
  gasResistance = bme.gas_resistance / 1000.0;
}

String processor(const String& var){
  getBME680Readings();
  //Serial.println(var);
  if(var == "TEMPERATURE"){
    return String(temperature);
  }
  else if(var == "HUMIDITY"){
    return String(humidity);
  }
  else if(var == "PRESSURE"){
    return String(pressure);
  }
  else if(var == "GAS"){
    return String(gasResistance);
  }
  else if(var == "DEPTH"){
    return String(depth);
  }

}

void ntp_service(){
  if (ntp.forceUpdate()) {
    Serial.print("DATA/HORA: ");
    //Serial.println(ntp.getFormattedDate());

    Serial.print("HORARIO: ");
    Serial.println(ntp.getFormattedTime());

    Serial.print("HORA: ");
    Serial.println(ntp.getHours());

    Serial.print("MINUTOS: ");
    Serial.println(ntp.getMinutes());

    Serial.print("SEGUNDOS: ");
    Serial.println(ntp.getSeconds());

    Serial.print("DIA DA SEMANA (0=domingo): ");
    Serial.println(ntp.getDay());

    Serial.print("EPOCH TIME (Segundos desde 01/01/1970): ");
    Serial.println(ntp.getEpochTime());

    Serial.println();

  } else {
    Serial.println("!Erro ao atualizar NTP!\n");
  }
  delay(1000);
}


void setup(){
  Serial.begin(115200);

  // ultrasonic sensor
  pinMode(PINO_TRIG, OUTPUT); // Configura o pino TRIG como saída
  pinMode(PINO_ECHO, INPUT); // Configura o pino ECHO como entrada

  // Init BME680 sensor
  if (!bme.begin()) {
    Serial.println(F("Could not find a valid BME680 sensor, check wiring!"));
    while (1);
  }
  // Set up oversampling and filter initialization
  bme.setTemperatureOversampling(BME680_OS_8X);
  bme.setHumidityOversampling(BME680_OS_2X);
  bme.setPressureOversampling(BME680_OS_4X);
  bme.setIIRFilterSize(BME680_FILTER_SIZE_3);
  bme.setGasHeater(320, 150); // 320*C for 150 ms

  Serial.println();
  Serial.println();

  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");
  Serial.println(WiFi.localIP());

  // ntp datetime
  ntp.begin();
  ntp.forceUpdate();//Força o Update.
  //GMT em segundos
  // +1 = 3600
  // +8 = 28800
  // -1 = -3600
  // -3 = -10800 (BRASIL)
  ntp.setTimeOffset(-10800);
  Serial.println(ntp.getFormattedTime());

  timeval tv;//Cria a estrutura temporaria para funcao abaixo.
  tv.tv_sec = 1551355200;//Atribui minha data atual. Voce pode usar o NTP para isso ou o site citado no artigo!
  settimeofday(&tv, NULL);//Configura o RTC para manter a data atribuida atualizada.

  // Example HTTP GET request
  if (client.connect(server, 8000)) {
    client.println("GET /your-path HTTP/1.1");
    client.println("Host: http://iot.ipt.br:8000/");
    client.println("Connection: close");
    client.println();
  } else {
    Serial.println("Connection failed");
  }
}

void enviarDados(){
   HTTPClient http;

  // Send POST request
  http.begin(server); 
  
  // Specify content-type header
  http.addHeader("Content-Type", "application/json");

  char bufferT[20]; // Buffer para armazenar a string da temperatura
  char bufferH[20]; // Buffer para armazenar a string da umidade
  char bufferP[20];
  char bufferG[20];
  char bufferProf[20];

  // Convertendo float para string usando dtostrf
  dtostrf(temperature, 6, 2, bufferT); // Formato: 6 caracteres no total, 2 após o ponto decimal
  dtostrf(humidity, 6, 2, bufferH);     // Formato: 6 caracteres no total, 2 após o ponto decimal
  dtostrf(pressure, 6, 2, bufferP);
  dtostrf(gasResistance, 6, 2, bufferG);
  dtostrf(depth, 6, 2, bufferProf);

  char jsonPayload[250]; // Buffer para armazenar o payload JSON (ajuste o tamanho conforme necessário)

  // Montando o payload JSON com os valores convertidos
  sprintf(jsonPayload, "{\"data\":{\"environment_monitoring\":[{\"temperatura_gastron\":\"%s\",\"umidade_gastron\":\"%s\", \"pressao_gastron\":\"%s\",\"gas_gastron\":\"%s\",\"profundidade_gastron\":\"%s\",\"date\":\"%s\"}]}}", bufferT, bufferH, bufferP, bufferG, bufferProf, data_formatada);

  // Imprimindo o payload JSON no monitor serial para verificar
  Serial.println(jsonPayload);
  // Send the POST request
  int httpResponseCode = http.POST(jsonPayload);

  // Check for errors
  if (httpResponseCode > 0) {
    Serial.print("HTTP Response code: ");
    Serial.println(httpResponseCode);

    // Print the response payload
    String responsePayload = http.getString();
    Serial.println("Response payload:");
    Serial.println(responsePayload);
  } else {
    Serial.print("Error in POST request: ");
    Serial.println(httpResponseCode);
  }

}

void loop(){

  if ((millis() - lastTime) > timerDelay) {
    getBME680Readings();
    Serial.printf("Temperature = %.2f ºC \n", temperature);
    Serial.printf("Humidity = %.2f % \n", humidity);
    Serial.printf("Pressure = %.2f hPa \n", pressure);
    Serial.printf("Gas Resistance = %.2f KOhm \n", gasResistance);
    getHCSR04();
    Serial.printf("Depth = %.2f cm \n", depth);
    Serial.println();

    vTaskDelay(pdMS_TO_TICKS(1000));//Espera 1 seg

    ntp_service();

    vTaskDelay(pdMS_TO_TICKS(1000));//Espera 1 seg

    ntp.setTimeOffset(-10800);
    ntp.forceUpdate();
    Serial.println(ntp.getFormattedTime());
    Serial.println(ntp.getEpochTime());

    timeval tv;//Cria a estrutura temporaria para funcao abaixo.
    tv.tv_sec = ntp.getEpochTime(); //1551355200;//Atribui minha data atual. Voce pode usar o NTP para isso ou o site citado no artigo!
    settimeofday(&tv, NULL);//Configura o RTC para manter a data atribuida atualizada.

    time_t tt = time(NULL);//Obtem o tempo atual em segundos. Utilize isso sempre que precisar obter o tempo atual
    data = *gmtime(&tt);//Converte o tempo atual e atribui na estrutura
    
    
    strftime(data_formatada, 64, "%d/%m/%Y %H:%M:%S", &data);//Cria uma String formatada da estrutura "data"
    Serial.printf("\nUnix Time: %d\n", int32_t(tt));//Mostra na Serial o Unix time
    Serial.printf("Data formatada: %s\n", data_formatada);//Mostra na Serial a data formatada

    

    lastTime = millis();
  }

  enviarDados();

  delay(216000);
}