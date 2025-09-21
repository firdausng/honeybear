import {sequence} from "@sveltejs/kit/hooks";
import {setupServicesHandler, checkSessionHandler} from "$lib/server/middleware";

export const handle = sequence(setupServicesHandler, checkSessionHandler);
