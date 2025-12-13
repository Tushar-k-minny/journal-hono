//biome-ignore lint/performance/noNamespaceImport : needed
import * as routes from "@auth/routes.auth";
import { createRouter } from "../../lib/create-app";
//biome-ignore lint/performance/noNamespaceImport : needed
import * as controllers from "./handlers.auth";

const authRouter = createRouter()
	.basePath("/auth")
	.openapi(routes.register, controllers.register)
	.openapi(routes.login, controllers.login)
	.openapi(routes.logout, controllers.logout)
	.openapi(routes.profile, controllers.profile)
	.openapi(routes.updateProfile, controllers.updateProfile);

export default authRouter;
