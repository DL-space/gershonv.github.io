class CreateUser {
  constructor(name) {
    this.name = name
    this.instance = null
  }

  getName() {
    return this.name
  }
}

// 代理实现单例模式
var ProxyMode = (function() {
  var instance = null
  return function(name) {
    if (!instance) {
      instance = new CreateUser(name)
    }
    return instance
  }
})()

const instanceA = new ProxyMode('instanceA') // { name: 'instanceA', instance: null }
const instanceB = new ProxyMode('instanceB') // { name: 'instanceA', instance: null }

console.log(instanceA, instanceB)
