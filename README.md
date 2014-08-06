cross-origin-try
================
跨域学习

## 1. Cross Origin Resource Sharing(CORS) 跨域资源共享

### 兼容性:
    IE 8 +
    Firefox 15.0 +
    Chrome 22.0 +
    Safari 5.1 +
    Opera 12.0 +
    IOS Safari 3.2 +
    Android 2.1 +
    Blackberry Browser 7.0 +

### 实现手段
    服务端:
        设置Access-Control-Allow-Origin头, 值为*或对应要访问的域名
    客户端:
        IE8-9使用 XDomainRequest
        其它客户端使用标准AJAX方法

### 评价:
    数据安全性良好, 支持大量数据, 支持POST, 但兼容性要求相比其它略高

## 2. Cross Document Messaging 跨文档消息传输

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

## 3. 使用window.name解决跨域问题

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

## 4. jsonp

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

## 5. Websocket

### 兼容性:
    Chrome 4+
    Firefox 4+
    Internet Explorer 10+
    Opera 10+
    Safari 5+

### 实现手段:
    HTML5的websocket协议, 至今多数服务端都已支持websocket

### 评价:
    websocket实际上应该是作为全双工连接最标准的实现方式, 因此可以用到跨域问题上, 奈何其兼容性不够好