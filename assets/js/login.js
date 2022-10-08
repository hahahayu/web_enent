const linkReg = document.querySelector('.link-reg');
const linkLogin = document.querySelector('.link-login');
const regBox = document.querySelector('.reg-box');
const loginBox = document.querySelector('.login-box');

// 点击去注册按钮
linkReg.addEventListener('click', () => {
    loginBox.style.display = 'none'
    regBox.style.display = 'block'
})
// 点击去登录按钮
linkLogin.addEventListener('click', () => {
    loginBox.style.display = 'block'
    regBox.style.display = 'none'
})

// 用户名和密码校验规则

// 从 layui 中获取 form 对象
const form = layui.form

form.verify({
    username: function (value, item) { //value：表单的值、item：表单的DOM对象
        if (!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)) {
            return '用户名不能有特殊字符';
        }
        if (/(^\_)|(\__)|(\_+$)/.test(value)) {
            return '用户名首尾不能出现下划线\'_\'';
        }
        if (/^\d+\d+\d$/.test(value)) {
            return '用户名不能全为数字';
        }

        //如果不想自动弹出默认提示框，可以直接返回 true，这时你可以通过其他任意方式提示（v2.5.7 新增）
        if (value === 'xxx') {
            alert('用户名不能为敏感词');
            return true;
        }
    }

    //我们既支持上述函数式的方式，也支持下述数组的形式
    //数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]
    , pass: [
        /^[\S]{6,12}$/
        , '密码必须6到12位，且不能出现空格'
    ],
    // 校验两次密码是否一致

    repwd: function (value) {
        const pwd = document.getElementsByName('reg-password')[0].value;
        if (pwd !== value) {
            return '两次密码不一致！'
        }
    }
});

// 监听注册表单
const regForm = document.querySelector('.reg-form');

regForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // 1 创建对象
    const xhr = new XMLHttpRequest();

    // 2 初始化
    xhr.open('POST', 'http://www.liulongbin.top:3007/api/reguser');

    // 设置 Content-Tyep 属性（固定写法）
    xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded" );

    // 4 发送
    xhr.send("username=" + document.getElementsByName('reg-username')[0].value + "&password=" + document.getElementsByName('reg-password')[0].value)

    // 
    xhr.onreadystatechange = function() {
        if(xhr.readyState === 4) {
            if(xhr.status >= 200 && xhr.status < 300) {
                let data = JSON.parse(xhr.response)
                if(data.status === 0) {
                    // 注册成功
                    layer.msg(data.message, {time: 1500, icon: 1});
                } else {
                    layer.msg(data.message, {time: 1500, icon: 2});
                }
            }
        }
    }
})

// 监听登录表单
const loginForm = document.querySelector('.login-form')

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://www.liulongbin.top:3007/api/login');
    xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded" );
    xhr.send("username=" + document.getElementsByName('username')[0].value + "&password=" + document.getElementsByName('password')[0].value)
    xhr.onreadystatechange = function() {
        if(xhr.readyState === 4) {
            if(xhr.status >= 200 && xhr.status < 300) {
                let data = JSON.parse(xhr.response)
                if(data.status === 0) {
                    // 登录成功
                    // 将登录成功后得到的 token 保存到 localStorage 中
                    localStorage.setItem('token', data.token)
                    location.href = './index.html'
                } else {
                    layer.msg(data.message, {time: 1500, icon: 2});
                }
            }
        }
    }
})