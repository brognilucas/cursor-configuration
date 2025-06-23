import Dockerode from "dockerode";
import { BoundPorts } from "../utils/bound-ports";
import { AbstractWaitStrategy } from "./wait-strategy";
export interface HttpWaitStrategyOptions {
    abortOnContainerExit?: boolean;
}
export declare class HttpWaitStrategy extends AbstractWaitStrategy {
    private readonly path;
    private readonly port;
    private readonly options;
    private protocol;
    private method;
    private headers;
    private readonly predicates;
    private _allowInsecure;
    private readTimeoutMs;
    constructor(path: string, port: number, options: HttpWaitStrategyOptions);
    forStatusCode(statusCode: number): this;
    forStatusCodeMatching(predicate: (statusCode: number) => boolean): this;
    forResponsePredicate(predicate: (response: string) => boolean): this;
    withMethod(method: string): this;
    withHeaders(headers: {
        [key: string]: string;
    }): this;
    withBasicCredentials(username: string, password: string): this;
    withReadTimeout(startupTimeoutMs: number): this;
    usingTls(): this;
    allowInsecure(): this;
    waitUntilReady(container: Dockerode.Container, boundPorts: BoundPorts): Promise<void>;
    private handleContainerExit;
    /**
     * Converts an undici response to a fetch response.
     * This is necessary because node's fetch does not support disabling SSL validation (https://github.com/orgs/nodejs/discussions/44038).
     *
     * @param undiciResponse The undici response to convert.
     * @returns The fetch response.
     */
    private undiciResponseToFetchResponse;
    private getAgent;
}
