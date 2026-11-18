/*
  MAKHEX Build 13 alternative: ESP32 + genuine VL53L5CX 8x8 I2C depth map.
  New experimental program. Not physically tested with Pololu #3417.
  Uses external SparkFun VL53L5CX Arduino Library (license per upstream).
  Must NOT be used with Benewake NOVA20 UART sensor. Distinct sensors.
  Verify your actual I2C carrier VIN and signal level first: use 3.3V for
  a Pololu 3417 on an ESP32 3.3V bus; ESP32 GPIOs are NOT 5V tolerant.
*/
#include <Arduino.h>
#include <Wire.h>
#include <WiFi.h>
#include <WebServer.h>
#include <SparkFun_VL53L5CX_Library.h>

static constexpr int PIN_SDA=21, PIN_SCL=22; // Classic ESP32; verify purchased board
static constexpr uint32_t STALE_AFTER_MS=1500;
static const char *SSID="MAKHEX-VL53L5CX-TEST";
static const char *PASSWORD="ChangeBuild13Password"; // Replace before demos.
SparkFun_VL53L5CX lidar;
VL53L5CX_ResultsData results;
WebServer server(80);
int16_t zones[64]={0};
uint32_t sampled=0,updates=0;
bool sensorReady=false;
void handleData(){
  String body="{\"ready\":";
  body+=sensorReady?"true":"false";
  body+=",\"fresh\":";
  body+=(sampled && millis()-sampled<STALE_AFTER_MS)?"true":"false";
  body+=",\"updates\":"+String(updates)+",\"mm\":[";
  for(int i=0;i<64;i++){if(i)body+=",";body+=String(zones[i]);}
  body+="]}";
  server.sendHeader("Cache-Control","no-store");
  server.send(200,"application/json; charset=utf-8",body);
}
static const char PAGE[] PROGMEM=R"html(
<!doctype html><html lang="en"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>MAKHEX Build 13 | VL53L5CX 8x8</title>
<style>
body{font-family:system-ui;background:#152c34;color:#f1f1e8;margin:2rem;max-width:720px}
#grid{display:grid;grid-template-columns:repeat(8,minmax(26px,1fr));gap:5px}
#grid div{aspect-ratio:1;display:grid;place-items:center;border-radius:5px;
background:#405660;font-size:clamp(9px,2vw,13px)}
small{color:#b5c7c7}
</style><h1>MAKHEX / 8x8 ToF</h1><p id="state">Initializing sensor...</p>
<div id="grid" aria-label="8 by 8 distance zones"></div>
<p><small>Distance in mm. Research sensor display, not 360-degree
scanning, not safety-rated mapping. NOVA20 UART software is incompatible.</small></p>
<script>
const host=document.getElementById('grid');
for(let i=0;i<64;i++){const p=document.createElement('div');p.textContent='-';host.append(p);}
async function update(){
 try{
  const response=await fetch('/data',{cache:'no-store'});
  if(!response.ok)throw Error('HTTP');
  const d=await response.json();
  document.getElementById('state').textContent=d.fresh?'Sensor live / samples '+d.updates:
     d.ready?'Waiting for fresh ranging frames':'Sensor initialization failed';
  d.mm.forEach((mm,i)=>{
   const el=host.children[i],valid=d.fresh && mm>0 && mm<=4000;
   const hue=valid?(120-Math.min(mm,4000)/4000*120):0;
   el.style.background=valid?'hsl('+hue+',42%,37%)':'#405660';
   el.textContent=valid?String(mm):'-';
  });
 }catch{document.getElementById('state').textContent='Wi-Fi/local data unavailable';}
}
setInterval(update,650);update();
</script></html>)html";
void setup(){
 Serial.begin(115200);
 Wire.begin(PIN_SDA,PIN_SCL);
 Wire.setClock(400000); // Conservative initial I2C speed.
 // VL53L5CX firmware load may require multiple seconds and significant RAM.
 sensorReady=lidar.begin();
 if(sensorReady){
  sensorReady=lidar.setResolution(8*8);
  if(sensorReady)sensorReady=lidar.setRangingFrequency(10);
  if(sensorReady)sensorReady=lidar.startRanging();
 }
 Serial.println(sensorReady?"VL53L5CX initialized":"VL53L5CX failed to initialize");
 WiFi.mode(WIFI_AP);WiFi.softAP(SSID,PASSWORD);
 server.on("/",HTTP_GET,[]{server.send_P(200,"text/html; charset=utf-8",PAGE);});
 server.on("/data",HTTP_GET,handleData);
 server.onNotFound([]{server.send(404,"text/plain","Not found");});
 server.begin();
}
void loop(){
 if(sensorReady&&lidar.isDataReady()){
  if(lidar.getRangingData(&results)){
   // Leave zone order as library returns it; confirm physical rotation on bench.
   for(int i=0;i<64;i++)zones[i]=results.distance_mm[i];
   sampled=millis();updates++;
  }
 }
 server.handleClient();
 delay(2);
}
