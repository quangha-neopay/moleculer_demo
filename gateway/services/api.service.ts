import { Service, ServiceBroker } from "moleculer";
import * as ApiGateway from "moleculer-web";
import { AppModule } from "./app.module";
import { NestFactory } from "@nestjs/core";

export default class ApiService extends Service {

	public constructor(broker: ServiceBroker) {
		super(broker);
		this.parseServiceSchema({
			name: "api",
			mixins: [ApiGateway],
			settings: {
				port: process.env.PORT || 3000,

				ip: "0.0.0.0",

				routes: [{
					path: "/api",

					whitelist: ["**"],

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
				}],

				log4XXResponses: false,
				logRequestParams: null,
				logResponseData: null,
				assets: {
					folder: "public",
				},
			},

			methods: {

				/**

				async authenticate (ctx: Context, route: any, req: IncomingMessage): Promise < any >  => {
					// Read the token from header
					const auth = req.headers.authorization;

					if (auth && auth.startsWith("Bearer")) {
						const token = auth.slice(7);

						// Check the token. Tip: call a service which verify the token. E.g. `accounts.resolveToken`
						if (token === "123456") {
							// Returns the resolved user. It will be set to the `ctx.meta.user`
							return {
								id: 1,
								name: "John Doe",
							};

						} else {
							// Invalid token
							throw new ApiGateway.Errors.UnAuthorizedError(ApiGateway.Errors.ERR_INVALID_TOKEN, {
								error: "Invalid Token",
							});
						}

					} else {
						// No token. Throw an error or do nothing if anonymous access is allowed.
						// Throw new E.UnAuthorizedError(E.ERR_NO_TOKEN);
						return null;
					}
				},
				 */

				/**
				async authorize (ctx: Context < any, {
					user: string;
				} > , route: Record<string, undefined>, req: IncomingMessage): Promise < any > => {
					// Get the authenticated user.
					const user = ctx.meta.user;

					// It check the `auth` property in action schema.
					// @ts-ignore
					if (req.$action.auth === "required" && !user) {
						throw new ApiGateway.Errors.UnAuthorizedError("NO_RIGHTS", {
							error: "Unauthorized",
						});
					}
				},
				 */
			},

			started: this.bootstrap,

		});
	}

	private async bootstrap() {
		await NestFactory.create(AppModule);
	}
}
