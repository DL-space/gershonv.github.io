var doms = []
function getChildren(parent) {
  // parent.nodeType === 1

  if (parent.children.length > 0) {
    for (let i = 0; i < parent.children.length; i++) {
      getChildren(parent.children[i])
    }
  }
  if (parent.nodeType === 1) {
    // parent.nodeType === 1：节点是一个元素节点
    doms.push(parent)
  }
}

getChildren(document)

console.log(doms)
