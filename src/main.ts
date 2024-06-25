import './style.css'
import {App} from "./app/app.ts";
import './app/services/mouse.service.ts';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
   <canvas width="640" height="1136" id="canvas"></canvas>
  </div>
`
const app = new App(document.querySelector('canvas'));
app.start();
