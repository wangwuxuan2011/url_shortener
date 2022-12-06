const config = {
    "url_length": 6,//短链接长度
}
const html404 = `<!DOCTYPE html>
<body>
  <h1>404 Not Found.</h1>
  <p>The url you visit is not found.</p>
</body>`

let response_header = {
    'content-type': 'application/json;charset=UTF-8',
    'Access-Control-Allow-Headers': 'Content-Type,Fetch-Mode,accept',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Max-Age': '86400',
}

async function randomString(len = 6) {
    let $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
    let maxPos = $chars.length;
    let result = '';
    for (let i = 0; i < len; i++) {
        result += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return result;
}

async function sha512(url) {
    url = new TextEncoder().encode(url)

    const url_digest = await crypto.subtle.digest(
        {
            name: "SHA-512",
        },
        url, // The data you want to hash as an ArrayBuffer
    )
    const hashArray = Array.from(new Uint8Array(url_digest)); // convert buffer to byte array
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

async function checkURL(URL) {
    let Expression = /([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
    let Expression_protocol = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
    let objExp = new RegExp(Expression);
    let objExp_protocol = new RegExp(Expression_protocol);
    if (objExp_protocol.test(URL) === true) {
        return URL;
    } else if (objExp.test(URL) === true) {
        return "http://" + URL;
    } else {
        return null;
    }
}

async function save_url(URL) {
    let random_key = await randomString(config.url_length)
    let is_exist = await KV.get(random_key)
    console.log(is_exist)
    if (is_exist == null)
        return await KV.put(random_key, URL), random_key
    else
        await save_url(URL)
}

async function is_url_exist(url_sha512) {
    let is_exist = await KV.get(url_sha512)
    console.log(is_exist)
    if (is_exist == null) {
        return false
    } else {
        return is_exist
    }
}

async function handleRequest(request) {
    // console.log(request)
    if (request.method === "POST") {
        let req = await request.json()
        let url = await checkURL(req["url"])
        console.log(url)
        if (!url) {
            return new Response(`{"status":400,"key":"错误：URL无法识别"}`, {
                headers: response_header,
            })
        }
        let stat, random_key
        let url_sha512 = await sha512(url)
        let url_key = await is_url_exist(url_sha512)
        if (url_key) {
            random_key = url_key
        } else {
            stat, random_key = await save_url(url)
            if (typeof (stat) == "undefined") {
                console.log(await KV.put(url_sha512, random_key))
            }
        }

        console.log(stat)
        if (typeof (stat) == "undefined") {
            return new Response(`{"status":200,"key":"${config.url}${random_key}"}`, {
                headers: response_header,
            })
        } else {
            return new Response(`{"status":500,"key":"错误:KV写入限制。"}`, {
                headers: response_header,
            })
        }
    } else if (request.method !== "GET") {
        return new Response(``, {
            headers: response_header,
        })

    }

    const requestURL = new URL(request.url)
    const path = requestURL.pathname.split("/")[1]
    const params = requestURL.search;
    console.log(path)
    if (!path) {
        return Response.redirect(config.index_url, 301)
    }

    const value = await KV.get(path);
    console.log(value)
    let location;

    if (params) {
        location = value + params
    } else {
        location = value
    }

    if (location) {
        return Response.redirect(location, 302)
    }
    // If request not in kv, return 404
    return new Response(html404, {
        headers: {
            "content-type": "text/html;charset=UTF-8",
        },
        status: 404
    })
}


addEventListener("fetch", async event => {
    config.url = event.request.url
    config.index_url = "https://url." + event.request.headers.get("host")
    event.respondWith(handleRequest(event.request))
})
