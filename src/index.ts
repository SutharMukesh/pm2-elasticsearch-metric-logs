
import { postMetric } from "./postengine";

// Send PM2 metrics to Elastic search every 10 secs
setInterval(() => {
	postMetric();
}, 10000);


