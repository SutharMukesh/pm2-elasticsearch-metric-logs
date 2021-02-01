import { postMetric } from "./utility";

// Send PM2 metrics to Elastic search every 10 secs
setInterval(()=>{
    console.log("sending")
    postMetric();
},10000)

