/**
 * Build 11 procurement decomposition.
 * Keep full bundle and individual research parts mutually exclusive in cart.
 * Original firmware and photographic/video assets are not licensed for commercial bundling.
 */
export interface MosaicoAssemblyPart {
  slug:string;title:string;quantity:number;role:string;details:string;includedInVisionCombo:boolean;requiredForOriginalDemo:boolean;image:string;
}
export const mosaicoAssemblyParts:readonly MosaicoAssemblyPart[]=[
  {slug:'esp-mosaico-core-unit',title:'ESP-Mosaico ESP32-S31 Core Unit V1.2',quantity:1,role:'Processor, 480×480 touchscreen, Wi-Fi and integrated audio',details:'Built-in microphone, speaker, power/AI buttons and battery. Confirm mainboard V1.2 silkscreen and recovery ABI before flashing.',includedInVisionCombo:true,requiredForOriginalDemo:true,image:'/assets/mosaico-core-technical.svg'},
  {slug:'esp-mosaico-camera-module',title:'ESP-Mosaico H2 Camera Module',quantity:1,role:'Document capture and LED illumination',details:'LEFT H2 slot only. Current official kit specifies camera V1.4 with SC101IOT; legacy V1.2 uses OV3640. Do not assume old firmware supports both.',includedInVisionCombo:true,requiredForOriginalDemo:true,image:'/assets/mosaico-camera-technical.svg'},
  {slug:'esp-mosaico-interaction-module',title:'ESP-Mosaico Interaction Module',quantity:1,role:'Extra keys, RGB LEDs, light/motion sensors',details:'Vision Combo Kit includes this board, although basic camera/voice learning functions use the main unit and camera. Not interchangeable with generic GPIO breakouts.',includedInVisionCombo:true,requiredForOriginalDemo:false,image:'/assets/mosaico-interaction-technical.svg'},
  {slug:'usb-c-data-cable',title:'USB-C Data Cable (1 m)',quantity:1,role:'5 V power and USB data/diagnostics',details:'One data-capable USB-A to USB-C or USB-C to USB-C cable with a compatible host connector. Confirm whether the selected kit already includes a cable.',includedInVisionCombo:false,requiredForOriginalDemo:true,image:'/assets/usb-c-cable-diagram.svg'}
] as const;
export const mosaicoCommercePlans={
 bundle:{
  label:'Vision Combo Kit plus data cable',
  parts:[{slug:'esp-mosaico-vision-combo-kit',option:'Option pending',qty:1},{slug:'usb-c-data-cable',option:'Option pending',qty:1}]
 },
 separate:{
  label:'Individual modules plus cable (research only)',
  parts:mosaicoAssemblyParts.map(p=>({slug:p.slug,option:'Option pending',qty:p.quantity}))
 }
} as const;
