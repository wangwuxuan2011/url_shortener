let res

function short_url() {
    if (document.querySelector("#text").value === "") {
        alert("URL不能为空！")
        return
    }

    document.getElementById("search_btn").disabled = true;
    document.getElementById("search_btn").innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>Please wait...';
    fetch(window.location.pathname, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({url: document.querySelector("#text").value})
    }).then(function (response) {
        return response.json();
    })
        .then(function (myJson) {
            res = myJson;
            document.getElementById("search_btn").disabled = false;
            document.getElementById("search_btn").innerHTML = ' Go!';
            if (res.key !== "")
                document.getElementById("result").innerHTML = window.location.host + res.key;
            $('#exampleModal').modal('show')
        }).catch(function (err) {
        alert("未知链接，请重试");
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

$(function () {
    $('[data-toggle="popover"]').popover()
})
