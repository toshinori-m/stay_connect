import { setupWorker } from "msw/browser"
import { teamHandlers } from "./handlers/teams"

// Create the worker instance
export const worker = setupWorker(...teamHandlers)
