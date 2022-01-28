function renameKeys(obj) {
    const keyValues = Object.entries(obj).map(([key, value]) => {
        if (key === "value") {
            obj[key] = null;
        }
        // we skip this key, and move on to the next recursively
        if (key === "value_raw") {
            return { [key]: null };
        }
        if (typeof value === 'object' && value !== null && !(value instanceof Array)) {
            obj[key] = renameKeys(value);
        }
        else if (value instanceof Array) {
            obj[key] = value.map(obj => renameKeys(obj));
        }
        return {
            [key]: obj[key]
        };
    });
    return Object.assign({}, ...keyValues);
}

const obj = {
    "type_url": "/cosmos.gov.v1beta1.MsgSubmitProposal",
    "value_raw": [{
        "foo": "bar"
    }],
    "test": [{ "value": "something" }],
    "content": {
        "type_url": "/cosmos.params.v1beta1.ParameterChangeProposal",
        "title": "Mint param Change",
        "description": "Update inflation min",
        "changes": [
            {
                "subspace": "mint",
                "key": "InflationMin",
                "value_raw": {
                    "something": "foobar",
                    "hello world": "hello there",
                    "testttt": {
                        "type_url": "/cosmos.params.v1beta1.ParameterChangeProposal",
                        "title": "Mint param Change",
                    }
                },
                "value": "\"0.027\""
            }
        ],
    },
    "initial_deposit": [
        {
            "denom": "orai",
            "amount": "10000000"
        }
    ],
    "proposer": "orai14vcw5qk0tdvknpa38wz46js5g7vrvut8lk0lk6"
}

console.log(JSON.stringify(renameKeys(obj)));