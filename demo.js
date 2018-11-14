function fun(n, o) {
  console.log(o)
  return {
    fun: function(m) {
      return fun(m, n)
    }
  }
}

var a = fun(0)
a.fun(1) 
a.fun(2) 
a.fun(3) 
var b = fun(0)
  .fun(1)
  .fun(2)
  .fun(3) 
var c = fun(0).fun(1) 
c.fun(2) 
c.fun(3) 

function Foo() {
  getName = function() {
    console.log(1)
  }
  return this
}
Foo.getName = function() {
  console.log(2)
}
Foo.prototype.getName = function() {
  console.log(3)
}
var getName = function() {
  console.log(4)
}
function getName() {
  console.log(5)
}

Foo.getName() 
getName()
Foo().getName()
getName()
new Foo.getName() 
new Foo().getName() 
