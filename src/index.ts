import pm2 from "pm2";
import { postMetric, postLog } from "./postengine";

// Send PM2 metrics to Elastic search every 10 secs
setInterval(() => {
	postMetric();
}, 10000);

// Send Logs to Elastic when event is triggered
pm2.launchBus((err, bus) => {
	if (err) {
		console.error("error on launching pm2 bus", err.message);
	}

	bus.on("log:err", async (data: any) => {
		if (data.process.name !== "pm2-elastic-metrics-logs") {
			await postLog("stderr", data);
		}
	});

	bus.on("log:out", async (data: any) => {
		if (data.process.name !== "pm2-elastic-metrics-logs") {
			await postLog("stdout", data);
		}
	});
});
