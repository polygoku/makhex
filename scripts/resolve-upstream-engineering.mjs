import{spawnSync}from'node:child_process';import fs from'node:fs';const sources=[
['touch-weather-station','Damov/esp32_weather_forecast_screen'],
['voice-command-node','muhammedsaban/dudley'],
['tiny-ble-presence','BrunoGG69/Spottr'],
['plant-health-monitor','ConnerWill/esp32-plant'],
['camera-event-trigger','bernardoeugster/espseccam'],
['epaper-desk-calendar','trandi/e-paper-calendar'],
['indoor-voc-explorer','koenvervloesem/esphome-air-quality-monitor'],
['rgb-matrix-clock','l0calgost/ledclock'],
['espnow-remote','ncmreynolds/sticky'],
['smart-desk-button','aamat09/baby-tracker-suite'],
['mosaico-learning-assistant','samyeei/mosaico-learning-assistant'],
['microduck-robot','kissqy/Microduck-kissqy']];
const out=[];for(const[slug,repo]of sources){const call=spawnSync('gh',['api','repos/'+repo],{encoding:'utf8',timeout:15000});if(call.status!==0){out.push({slug,repo,error:String(call.stderr).slice(0,200)});console.log(slug,'ERROR');continue;}const json=JSON.parse(call.stdout);const c=spawnSync('gh',['api','repos/'+repo+'/commits/'+json.default_branch],{encoding:'utf8',timeout:15000});const sha=c.status===0?JSON.parse(c.stdout).sha:null;out.push({slug,repo,defaultBranch:json.default_branch,commit:sha,license:json.license?.spdx_id??'unverified',archived:json.archived,site:json.html_url,description:json.description});console.log(slug,sha?.slice(0,12),json.license?.spdx_id??'?');}
fs.mkdirSync('docs/engineering', {recursive:true});fs.writeFileSync('docs/engineering/upstream-pins.json',JSON.stringify({createdAt:new Date().toISOString(),references:out},null,2)+'\n');