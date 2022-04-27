const fetch = require('node-fetch');

let offset = "";
let maxPing = 0;
const start = async () => {
    let msg = Buffer.from(JSON.stringify({ get_ping_infos: { offset, limit: 100 } })).toString('base64');
    const { data } = await fetch(`http://18.223.242.70:1317/wasm/v1beta1/contract/orai1enp2zauur6hatpmuqs4h9avafezuyxnek4rzz6/smart/${msg}`).then(data => data.json());
    console.log("data: ", data);
    for (let info of data) {
        if (info.ping_info.total_ping > maxPing) maxPing = info.ping_info.total_ping;
    }
    if (data.length > 0) {
        offset = data[data.length - 1].executor;
        await start();
    } else {
        console.log("max ping: ", maxPing)
    }
}

start();