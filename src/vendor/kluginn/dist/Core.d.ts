import API from './lib/API';
import UI from './lib/UI';
import Debug from './lib/Debug';
export default class Kluginn {
    $: object;
    $k: {
        [key: string]: any;
    };
    plugin_id: number;
    option: object;
    config: object;
    api: API;
    ui: UI;
    debug: Debug;
    vendor: object;
    service: object;
    external: object;
    constructor(option: any);
    init(opt?: {}): Promise<unknown>;
    load(url: any): Promise<unknown>;
    dialog(a: any): any;
}
