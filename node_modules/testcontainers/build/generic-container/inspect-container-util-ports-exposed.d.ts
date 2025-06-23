import { ContainerInspectInfo } from "dockerode";
import { InspectResult } from "../types";
import { PortWithOptionalBinding } from "../utils/port";
type Result = {
    inspectResult: ContainerInspectInfo;
    mappedInspectResult: InspectResult;
};
export declare function inspectContainerUntilPortsExposed(inspectFn: () => Promise<ContainerInspectInfo>, ports: PortWithOptionalBinding[], containerId: string, timeout?: number): Promise<Result>;
export {};
