import { Service, ServiceBroker } from "moleculer";
import * as ApiGateway from "moleculer-web";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

export default class ApiService extends Service {
	public constructor(broker: ServiceBroker) {
		super(broker);

		this.parseServiceSchema({
			name: process.env.NAME,

			mixins: [ApiGateway],

			settings: {
				path: "api",

				port: process.env.PORT || 3000,

				ip: "0.0.0.0",

				routes: [
					{
						path: "/",

						whitelist: ["user.*"],

						use: [],

						mergeParams: true,

						authentication: false,

						authorization: false,

						autoAliases: true,

						callingOptions: {},

						bodyParsers: {
							json: {
								strict: false,
								limit: "1MB",
							},
							urlencoded: {
								extended: true,
								limit: "1MB",
							},
						},

						mappingPolicy: "all",

						logging: true,
					},
				],

				log4XXResponses: false,
				logRequestParams: null,
				logResponseData: null,
				assets: {
					folder: "public",
				},
			},

			methods: {
				async authorize(ctx, route, req, res) {
					const auth = req.headers["authorization"];
					if (auth && auth.startsWith("Bearer")) {
						const token = auth.slice(7);

						const payload = await ctx.call("user.verifyToken", {
							token,
						});

						ctx.meta.user = payload;
						return Promise.resolve(ctx);
					} else {
						return Promise.reject("No token");
					}
				},
			},

			started: this.bootstrap,
		});
	}

	private async bootstrap() {
		await NestFactory.create(AppModule);
	}
}
