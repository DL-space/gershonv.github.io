var myImage = (function() {
  var imgNode = document.createElement('img')
  document.body.appendChild(imgNode)
  return function(src) {
    imgNode.src = src
  }
})()

var ProxyImage = (function() {
  var img = new Image()

  img.onload = function() {
    myImage(this.src)
  }
  return function(src) {
    // 占位图片loading
    myImage('http://img.lanrentuku.com/img/allimg/1212/5-121204193Q9-50.gif')
    img.src = src
  }
})()

// 调用方式
ProxyImage('https://img.alicdn.com/tps/i4/TB1b_neLXXXXXcoXFXXc8PZ9XXX-130-200.png') // 真实要展示的图片
