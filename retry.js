const AbortController = require('abort-controller');
const fetch = require('node-fetch');

const onAttemptFail = async (data) => {
    const interval = data.exponential ? data.interval * data.factor : data.interval;

    // if interval is set to zero, do not use setTimeout, gain 1 event loop tick
    if (interval) await new Promise((r) => setTimeout(r, interval + data.jitter));
};

const getPromise = (fn, args) => {
    return new Promise((resolve, reject) => {
        if (!args) args = [];
        args.push((err, data) => {
            if (err) return reject(err);
            return resolve(data);
        });
        fn.apply(null, args);
    });
};

const retry = (fn, args = [], config) => {
    if (!config) {
        config = args;
        args = [];
    }
    const retriesMax = config.retriesMax || 3;
    let interval = config.interval || 0;
    const jitter = config.jitter ? Math.floor(Math.random() * config.jitter) + 1 : 0;
    const exponential = Object.prototype.hasOwnProperty.call(config, 'exponential')
        ? config.exponential
        : true;
    const factor = config.factor || 2;

    let canceled = false;

    const cancel = () => (canceled = true);
    const run = async () => {
        for (let i = 0; i < retriesMax; i++) {
            if (canceled) return;
            try {
                if (!config.isCb) {
                    const val = await fn.apply(null, args);
                    return val;
                } else {
                    const val = await getPromise(fn, clone(args));
                    return val;
                }
            } catch (error) {
                console.log('error?: ', error);
                if (typeof config.onFail === 'function') {
                    config.onFail({ currentRetry: i, retriesMax, error });
                }

                if (
                    retriesMax === i + 1 ||
                    (Object.prototype.hasOwnProperty.call(error, 'retryable') && !error.retryable)
                )
                    throw error;

                // wait before next run
                await onAttemptFail({
                    error,
                    currentRetry: i,
                    retriesMax,
                    interval,
                    exponential,
                    factor,
                    jitter,
                });
            }
        }
    };

    return [run, cancel];
};

const fn = async () => {
    const controller = new AbortController();
    const response = await fetch("https://lcd.orai.io/cosmos/tx/v1beta1/txs?events=message.sender%3D%27orai1rqq57xt5r5pnuguffcrltnvkul7n0jdx08ns0g%27",
        { signal: controller.signal }).then((res) => res.json());
    console.log("response: ", response);
    if (!response) throw Error('Empty data');
    return response;
};

(async () => {
    const [run, cancel] = retry(fn, {
        retriesMax: 20,
        interval: 5000,
        onFail: (data) => {
            console.log('on fail data: ', data);
        },
    });

    const queryResult = await run();
    // check if query returns nothing => end
    if (!queryResult) return;
    console.log('query result: ', queryResult);
})();