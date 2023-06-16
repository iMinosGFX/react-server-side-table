/**
 * Successive calls of the throttled version will only execute the last call in the defined period
 * @param func expensive function, for example API call
 * @param ms number of milliseconds to wait
 * @returns a throttled version of the function
 */
export default function throttleP<O>(func: (...any: any) => Promise<O>, ms: number): (...any: any) => Promise<O> {
    let lastCall = null;
    console.log("Init last call");
    return (...args) => {
        if (lastCall != null) {
            console.log("Last call is recent, DELETE IT");            
            clearTimeout(lastCall);
        }
        return new Promise((resolve, reject) => {
            lastCall = setTimeout(() => {
                console.log("My time has arrived");
                lastCall = null;
                func(args).then(resolve).catch(reject);
            }, ms);
        });
    }
}