import { PropOptions, Constructor } from 'vue/types/options';
export interface InOutOptions extends PropOptions {
    isVModel?: boolean;
}
export declare const InOut: (optionsInOut?: Constructor | InOutOptions | Constructor[] | undefined) => PropertyDecorator;
