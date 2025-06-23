"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inspectContainerUntilPortsExposed = inspectContainerUntilPortsExposed;
const common_1 = require("../common");
const map_inspect_result_1 = require("../utils/map-inspect-result");
const port_1 = require("../utils/port");
async function inspectContainerUntilPortsExposed(inspectFn, ports, containerId, timeout = 10_000) {
    const result = await new common_1.IntervalRetry(250).retryUntil(async () => {
        const inspectResult = await inspectFn();
        const mappedInspectResult = (0, map_inspect_result_1.mapInspectResult)(inspectResult);
        return { inspectResult, mappedInspectResult };
    }, ({ mappedInspectResult }) => ports
        .map((exposedPort) => (0, port_1.getContainerPort)(exposedPort))
        .every((exposedPort) => mappedInspectResult.ports[exposedPort]?.length > 0), () => {
        const message = `Container did not expose all ports after starting`;
        common_1.log.error(message, { containerId });
        return new Error(message);
    }, timeout);
    if (result instanceof Error) {
        throw result;
    }
    return result;
}
//# sourceMappingURL=inspect-container-util-ports-exposed.js.map