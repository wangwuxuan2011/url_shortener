const html404 = `<!DOCTYPE html>
<body>
  <h1>404 Not Found.</h1>
  <p>The url you visit is not found.</p>
</body>`

let response_header = {
    "content-type": "text/html;charset=UTF-8",
}

async function randomString(len) {
    len = len || 6;
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
    let str = URL;
    let Expression = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
    let objExp = new RegExp(Expression);
    if (objExp.test(str) == true) {
        return str[0] == 'h';
    } else {
        return false;
    }
}

async function save_url(URL) {
    let random_key = await randomString()
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
    console.log(request)
    if (request.method === "POST") {
        let req = await request.json()
        console.log(req["url"])
        if (!await checkURL(req["url"])) {
            return new Response(`{"status":500,"key":": Error: Url illegal."}`, {
                headers: response_header,
            })
        }
        let stat, random_key
        let url_sha512 = await sha512(req["url"])
        let url_key = await is_url_exist(url_sha512)
        if (url_key) {
            random_key = url_key
        } else {
            stat, random_key = await save_url(req["url"])
            if (typeof (stat) == "undefined") {
                console.log(await KV.put(url_sha512, random_key))
            }
        }

        console.log(stat)
        if (typeof (stat) == "undefined") {
            return new Response(`{"status":200,"key":"/` + random_key + `"}`, {
                headers: response_header,
            })
        } else {
            return new Response(`{"status":200,"key":": Error:Reach the KV write limitation."}`, {
                headers: response_header,
            })
        }
    } else if (request.method === "OPTIONS") {
        return new Response(``, {
            headers: response_header,
        })

    }

    const requestURL = new URL(request.url)
    const path = requestURL.pathname.split("/")[1]
    console.log(path)
    if (!path) {

        const html = await fetch("https://url-shortener.pages-source.xuan.gq")

        return new Response(await html.text(), {
            headers: {
                "content-type": "text/html;charset=UTF-8",
            },
        })
    }

    const value = await KV.get(path);
    console.log(value)

    // If request not in kv, return 404
    return new Response(html404, {
        headers: {
            "content-type": "text/html;charset=UTF-8",
        },
        status: 404
    })
}


addEventListener("fetch", async event => {
    event.respondWith(handleRequest(event.request))
})
