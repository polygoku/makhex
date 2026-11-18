/*
 MAKHEX Build 13 - independently authored NOVA20 UART and local Wi-Fi demo.
 Research firmware, not yet tested on actual Benewake hardware.
 Confirm sensor's exact 5-pin pinout, 5V power and UART voltage before wiring.
 */
#include <Arduino.h>
#include <WiFi.h>
#include <HardwareSerial.h>
#include <WebServer.h>

static constexpr uint32_t BAUD=921600;
static constexpr int RX_PIN=16; // Example for a verified classic ESP32-WROOM-32 board only
static constexpr uint32_t STALE_MS=1500;
static const char *AP_SSID="MAKHEX-NOVA20-TEST";
static const char *AP_PASS="ChangeBuild13Password"; // Change before public use
HardwareSerial sensor(2);
WebServer server(80);
struct Measure { uint16_t mm=0, peak=0; uint32_t at=0; bool valid=false; };
Measure channels[256]; // Keep raw index; don't assume orientation/index base.
uint8_t packet[9]; uint8_t count=0;
uint32_t good=0,bad=0,latest=0;
void parsePacket() {
  uint8_t sum=0;for (int i=0;i<8;i++) sum+=packet[i];
  if(sum!=packet[8]){bad++;return;}
  uint8_t id=packet[7];
  uint16_t mm=uint16_t(packet[2]) | (uint16_t(packet[3])<<8);
  uint16_t peak=uint16_t(packet[4]) | (uint16_t(packet[5])<<8);
  channels[id]={mm,peak,millis(),true};latest=millis();good++;
}
void ingest(uint8_t b){
  if(count==0){if(b==0x59){packet[0]=b;count=1;}return;}
  if(count==1){if(b==0x59){packet[1]=b;count=2;}else count=0;return;}
  packet[count++]=b;
  if(count==9){parsePacket();count=0;}
}
void jsonData(){
  String body="{\"good\":"+String(good)+",\"bad\":"+String(bad);
  body+=",\"fresh\":";
  body+=(latest && millis()-latest<STALE_MS)?"true":"false";
  body+=",\"channels\":[";
  bool first=true;
  for(int i=0;i<256;i++){
    if(!channels[i].valid)continue;
    if(!first)body+=",";first=false;
    body+="{\"id\":"+String(i)+",\"mm\":"+String(channels[i].mm)
      +",\"strength\":"+String(channels[i].peak)+",\"fresh\":";
    body+=(millis()-channels[i].at<STALE_MS)?"true":"false";
    body+="}";
  }
  body+="]}";
  server.sendHeader("Cache-Control","no-store");
  server.send(200,"application/json",body);
}
static const char PAGE[] PROGMEM=R"html(
<!doctype html><html lang="en"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>MAKHEX NOVA20 Research</title>
<style>body{font:16px system-ui;background:#152832;color:#eee;margin:2rem;max-width:800px}
.p{padding:1rem;border:1px solid #486570;border-radius:12px}
.line{display:grid;grid-template-columns:70px 1fr 80px;gap:12px;margin:8px 0;align-items:center}
.track{height:12px;border-radius:8px;background:#375365}.bar{background:#f68b54;height:12px;border-radius:8px}
small{color:#b1c1c9}</style>
<h1>MAKHEX / NOVA20</h1><p>Experimental 20-channel distance readings</p>
<div class="p"><strong id="state">Waiting for UART frames...</strong><div id="channels"></div></div>
<p><small>Distance plotted by raw channel index, not 360-degree or physical 3D mapping.
Not a safety-critical collision sensor. Local AP only.</small></p>
<script>
async function render(){
try{
 const r=await fetch('/data',{cache:'no-store'}),d=await r.json();
 document.getElementById('state').textContent=(d.fresh?'Sensor data receiving':'No recent sensor frames')
  +' | valid '+d.good+' / rejected '+d.bad;
 const host=document.getElementById('channels');host.replaceChildren();
 for(const x of d.channels.slice(0,40)){
  const row=document.createElement('div'),name=document.createElement('span'),
  track=document.createElement('div'),bar=document.createElement('div'),value=document.createElement('span');
  row.className='line';name.textContent='Ch '+x.id;track.className='track';bar.className='bar';
  bar.style.width=Math.min(Math.max(x.mm/1000*100,0),100)+'%';
  value.textContent=x.fresh?x.mm+' mm':'STALE';
  track.appendChild(bar);row.append(name,track,value);host.append(row);
 }
}catch{document.getElementById('state').textContent='Local connection lost';}
}
setInterval(render,600);render();
</script></html>)html";
void setup(){
 Serial.begin(115200);
 sensor.begin(BAUD,SERIAL_8N1,RX_PIN,-1);
 WiFi.mode(WIFI_AP);WiFi.softAP(AP_SSID,AP_PASS);
 server.on("/",HTTP_GET,[]{server.send_P(200,"text/html; charset=utf-8",PAGE);});
 server.on("/data",HTTP_GET,jsonData);
 server.onNotFound([]{server.send(404,"text/plain","Not found");});
 server.begin();
}
void loop(){while(sensor.available())ingest(uint8_t(sensor.read()));server.handleClient();}
