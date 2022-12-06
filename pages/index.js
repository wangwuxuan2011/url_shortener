let res
//pages部署域名仅支持url.xxx.xxx格式
let api_url = "https://" + location.host.split('.').slice(1).join('.')//获取域名

function short_url() {
    let url = checkURL($("#url").val())
    if (!url) {
        alert("请输入正确的URL！")
        return
    }
    document.getElementById("search_btn").disabled = true;
    document.getElementById("search_btn").innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>请稍等…';
    fetch(api_url, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({url})
    }).then(function (response) {
        console.log(response)
        return response.json();
    })
        .then(function (res) {
            console.log(res)
            document.getElementById("search_btn").disabled = false;
            document.getElementById("search_btn").innerHTML = ' Go!';
            if (res.status === 200)
                document.getElementById("result").innerHTML = res.key;
            else
                document.getElementById("result").innerHTML = res.key;
            $('#exampleModal').modal('show')
        }).catch(function (err) {
        alert("错误,请重试");
        console.log(err);
        document.getElementById("search_btn").disabled = false;
        document.getElementById("search_btn").innerHTML = ' Go!';
    })
}

function copy_url(id, attr) {
    let target;
    if (attr) {
        target = document.createElement('div');
        target.id = 'tempTarget';
        target.style.opacity = '0';
        if (id) {
            let curNode = document.querySelector('#' + id);
            target.innerText = curNode[attr];
        } else {
            target.innerText = attr;
        }
        document.body.appendChild(target);
    } else {
        target = document.querySelector('#' + id);
    }

    try {
        let range = document.createRange();
        range.selectNode(target);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
        document.execCommand('copy');
        window.getSelection().removeAllRanges();
        console.log('复制成功')
    } catch (e) {
        console.log('复制失败')
    }

    if (attr) {
        // remove temp target
        target.parentElement.removeChild(target);
    }
}

function checkURL(URL) {
    let Expression_protocol = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
    let Expression = /([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
    if (Expression_protocol.test(URL) === true) {
        return URL;
    } else if (Expression.test(URL) === true) {
        return "http://" + URL;
    } else {
        return null;
    }
}

$(function () {
    $('[data-toggle="popover"]').popover()
})
