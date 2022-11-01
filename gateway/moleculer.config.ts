import { BrokerOptions, Errors, ServiceBroker } from "moleculer";

const brokerConfig: BrokerOptions = {
	namespace: process.env.NAMESPACE,
	nodeID: process.env.NODE_ID,
	metadata: {},

	logger: {
		type: "Console",
		options: {
			colors: true,
			moduleColors: false,
			formatter: "full",
			objectPrinter: null,
			autoPadding: false,
		},
	},
	logLevel: "info",

	transporter: process.env.TRANSPORTER, // "NATS"

	cacher: null,

	serializer: "JSON",

	requestTimeout: 10 * 1000,

	retryPolicy: {
		enabled: false,
		retries: 5,
		delay: 100,
		maxDelay: 1000,
		factor: 2,
		check: (err: Errors.MoleculerError) => err && !!err.retryable,
	},

	maxCallLevel: 100,
	heartbeatInterval: 10,
	heartbeatTimeout: 30,
	contextParamsCloning: false,

	tracking: {
		enabled: false,
		shutdownTimeout: 5000,
	},

	disableBalancer: false,

	registry: {
		strategy: "RoundRobin",
		preferLocal: true,
	},

	circuitBreaker: {
		enabled: false,
		threshold: 0.5,
		minRequestCount: 20,
		windowTime: 60,
		halfOpenTime: 10 * 1000,
		check: (err: Errors.MoleculerError) => err && err.code >= 500,
	},

	bulkhead: {
		enabled: false,
		concurrency: 10,
		maxQueueSize: 100,
	},

	validator: true,

	errorHandler: null,

	metrics: {
		enabled: false,
		reporter: {
			type: "",
		},
	},

	tracing: {
		enabled: false,
		exporter: {
			type: "",
		},
	},

	middlewares: [],

	replCommands: null,

	// created : (broker: ServiceBroker): void => {},
	// started: async (broker: ServiceBroker): Promise<void> => {},
	// stopped: async (broker: ServiceBroker): Promise<void> => {},
};

export = brokerConfig;
