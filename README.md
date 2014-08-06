
# javascript 跨域学习
## 1. Cross Origin Resource Sharing(CORS) 跨域资源共享
(见项目cors文件夹)
### 兼容性:
    IE 8 +
    Firefox 15.0 +
    Chrome 22.0 +
    Safari 5.1 +
    Opera 12.0 +
    IOS Safari 3.2 +
    Android 2.1 +
    Blackberry Browser 7.0 +
### 实现手段:
    数据端:
        设置Access-Control-Allow-Origin头, 值为*或对应要访问的域名
    客户端:
        IE8-9使用 XDomainRequest
        其它客户端使用标准AJAX方法
### 评价:
    数据安全性良好, 支持大量数据, 支持POST, 但兼容性要求相比其它略高
    
### 示例:
客户端 index.html
``` html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Document</title>
</head>
<body>
  <div id="ye"></div>
  <script>
    window.onload = function() {
      function createXHR() {
        if(window.XDomainRequest) {
          return new XDomainRequest();
        }
        else if(window.XMLHttpRequest) {
          return new XMLHttpRequest();
        }
        else if(window.ActiveXObject) {
          return new ActiveXObject('Microsoft.XMLHTTP');
        }
        else {
          throw new Error('no xhr');
        }
      }
      function parse() {
        if(window.JSON) {
          var x = JSON.parse(xhr.responseText);
          document.getElementById('ye').innerHTML = x.name;
        } else {
          document.getElementById('ye').innerHTML = xhr.responseText;
        }
      }
      var xhr = createXHR();
      var url = 'http://localhost:3000';
      xhr.open("post", url, true);
      xhr.onreadystatechange = function() {
        if(xhr.readyState === 4) {
          parse();
        }
      }
      if(window.XDomainRequest) {
        xhr.onload = parse;
      }
      xhr.send('data=hehe');
    };
  </script>
</body>
</html>
```
服务端 nodejs
``` javascript
var express = require('express');
var router = express.Router();

/* POST home page. */
router.post('/', function(req, res) {
  res.header('Access-Control-Allow-Origin', '*');
  var arr = [];
  for(var i in req)
    arr.push(i);
  arr.sort();
  for(var i in arr)
    console.log(arr[i]);
  console.dir(req.param('data'));
  // console.dir(req);
  res.send({
    name: 'yedeying',
    age: 20
  });
});

module.exports = router;
```
## 2. Cross Document Messaging 跨文档消息传输
(见项目postmessage文件夹)
### 兼容性:
    IE 8 +
    Firefox 3.0 +
    Chrome 3.0 +
    Safari 4.0 +
    Opera 9.0 +

### 实现手段:
    HTML5的postMessage和onmessage API, 配合iframe实现
        1. 在要访问数据的页面A创建iframe, 指向保存数据的页面B
        2. 页面A通过iframe.contentWindow.postMessage向页面B发送请求及数据, 数据格式可以为JSON或字符串等
        3. 页面B通过onmessage监听页面A发来的请求, 并通过window.parent.postMessage向页面A反馈信息

### 评价:
    兼容性相比CORS方式更优

### 样例:

客户端 index.html
``` html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Document</title>
</head>
<body>
  <button onclick="handler()">发信</button>
  <input id="value" type="text" placeholder="请输入信息">
  <iframe src="./frame.html" frameborder="0" width="100%" height="100%"></iframe>
  <script>
    var input = document.querySelector('#value');
    function handler() {
      document.querySelector('iframe').contentWindow.postMessage(input.value, '*');
    }
  </script>
</body>
</html>
```
服务端 frame.html
``` html
<!DOCTYPE html>
<html>
  <head>
    <title>ye</title>
  </head>
  <body>
    <h1></h1>
    <script>
      window.onload = function() {
        var h1 = document.querySelector('h1');
        h1.innerHTML = 'you have not post any message';
        window.onmessage = function(e) {
          h1.innerHTML = e.data;
        }
      };
    </script>
  </body>
</html>
```

## 3. 使用window.name解决跨域问题
(见项目name文件夹)
### 兼容性:
    几乎所有浏览器都支持

### 实现手段:
    一个页面在更改document.location前后, 其window.name属性不变.
    利用此特性:
        1. 用一个iframe指向数据页面A, 将需要传输的数据存到window.name里
        2. 将其location指向一个与申请页面B同域名的代理页面C
        3. 在B页面或C页面把window.name的内容由页面C传送到页面B

### 评价:
    接近完美, 只是实现手段有点绕

### 样例:
客户端 index.html
``` html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Document</title>
</head>
<body>
  <button onclick='getInfo()'>获取数据</button>
  <p id='text'></p>
  <script>
    function getInfo() {
      var iframe = document.createElement('iframe'),
        bl = true;
      iframe.style.display = 'none';
      iframe.onload = function() {
        if(bl) {
          iframe.contentWindow.location = './proxy.html?callback=callback';
          bl = false;
        }
      }
      iframe.src = 'http://localhost:3000';
      document.body.appendChild(iframe);
    }
    function callback(data) {
      document.getElementById('text').innerHTML = data;
    }
  </script>
</body>
</html>
```
数据端 data.html
``` html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Data</title>
</head>
<body>
  <script>
    window.name = 'the information I want to send';
  </script>
</body>
</html>
```
代理端 proxy.html
``` html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Document</title>
</head>
<body>
  <script>
    var callback = location.search.split('=')[1];
    window.parent[callback](window.name);
  </script>
</body>
</html>
```

## 4. jsonp
(见项目jsonp文件夹)
### 兼容性:
    几乎所有浏览器都支持

### 实现手段:
    HTML中script的src标签可以跨域申请javascript文本, 属于GET方法, 服务器只要对URL响应返回对应的数据就可以达到目的, 但客户端要求javascript语句, 而json等文本并非javascript语句, 此时将其封装成回调函数即可

    客户端:
        中在目标url后加入?callback=cb之类的字眼, 其中callback及cb都可以自定, callback代表服务器端识别的关键字, cb代表客户端中用以回调数据的全局函数
    服务端:
        1. 接收到请求时, 通过约定的key获取回调函数的名字cb
        2. 设置响应头的Content-Type: text/javascript
        3. 通过读取对应的json文件, 返回cb(jsonData)这样的格式

### 评价:
    兼容性完美, 但因为请求信息通过url传送, 所以传送数据不能太大, 即使浏览器能容纳也不直观, 适合只传送某些参数的情况, 另外不支持POST

### 样例:
客户端 html
``` html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Document</title>
</head>
<body>
  <div id="ye"></div>
  <script>
    function callback(data) {
      if(data) {
        document.getElementById('ye').innerHTML = data.name + ' is at age ' + data.age;
      }
    }
    window.onload = function() {
      var scr = document.createElement('script');
      document.body.appendChild(scr);
      scr.src = 'http://localhost/ye/jsonp/data.php?callback=callback';
    };
  </script>
</body>
</html>
```
数据端 data.php
``` php
<?php
  header("Content-type:text/Javascript");
  echo $_GET['callback'].'(';
  $txt = readfile('data.json');
  echo ')';
?>
```
数据 data.json
``` json
{
  "name": "yedeying",
  "age": 18
}
```

## 5. Websocket
(见项目websocket文件夹)
### 兼容性:
    Chrome 4+
    Firefox 4+
    Internet Explorer 10+
    Opera 10+
    Safari 5+

### 实现手段:
    HTML5的websocket协议, 至今多数服务端都已支持websocket, 样例使用nodejs来实现, 同时在客户端和服务端使用了socket.io库

### 评价:
    websocket实际上应该是作为全双工连接最标准的实现方式, 因此可以用到跨域问题上, 奈何其兼容性不够好
    
### 样例:
客户端 index.html
``` html
<!doctype html>
<html>
  <head>
    <title>Socket.IO</title>
  </head>
  <body>
    <h2 id="p"></h2>
    <script src="/socket.io/socket.io.js"></script>
    <script>
      function $(str) { return document.getElementById(str); }
      function show(str) { p.innerHTML = str; }
      function callback(data) {
        data = JSON.parse(data);
        show(data.name + ' is at age ' + data.age);
      }
      var p = $('p'), socket = io();
      window.onload = function() {
        socket.emit('getData');
      }
      socket.on('data', callback);
    </script>
  </body>
</html>
```
服务端 nodejs index.js
``` javascript
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');

app.get('/', function(req, res) {
  res.sendfile('index.html');
});

io.on('connection', function(socket) {
  console.log('a user connected');
  socket.on('getData', function() {
    fs.readFile('data.json', {encoding: 'utf8'}, function(err, data) {
      if (err) throw new err;
      socket.emit('data', data);
    });
  });
});

http.listen(3000, function() {
  console.log('listening on *:3000');
});
```
## 6. 还有诸如服务器代理, flash, location.hash等跨域方法, 前两者因为非javascript手段还没去尝试, 后者适用性比其它要差很多, 数据受url长度限制, 实现方法比较绕等
