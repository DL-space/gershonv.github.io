---
title: Vue render 函数解析
date: 2018-07-04 22:30:48
comments: true #是否可评论
tags: Vue.js
toc: true
categories: Vue.js
---

## Vue的一些基本概念

使用 Vue 编写可复用组件，那么要对 render 函数有所了解。今天我们学习的目的是了解和学习Vue的render函数。如果想要更好的学习Vue的render函数相关的知识，我们有必要重温一下Vue中的一些基本概念。那么先上一张图，这张图从宏观上展现了Vue整体流程：
![enter description here](https://www.w3cplus.com/sites/default/files/blogs/2018/1804/vue-render-1.jpg)
从上图中，不难发现一个Vue的应用程序是如何运行起来的，模板通过编译生成AST，再由AST生成Vue的render函数（渲染函数），渲染函数结合数据生成Virtual DOM树，Diff和Patch后生成新的UI。从这张图中，可以接触到Vue的一些主要概念：

- **模板**：Vue的模板基于纯HTML，基于Vue的模板语法，我们可以比较方便地声明数据和UI的关系。
- **AST**：AST是Abstract Syntax   Tree的简称，Vue使用HTML的Parser将HTML模板解析为AST，并且对AST进行一些优化的标记处理，提取最大的静态树，方便Virtual  DOM时直接跳过Diff。 
- **渲染函数**：渲染函数是用来生成VirtualDOM的。Vue推荐使用模板来构建我们的应用界面，在底层实现中Vue会将模板编译成渲染函数，当然我们也可以不写模板，直接写渲染函数，以获得更好的控制
- **Virtual DOM**：虚拟DOM树，Vue的Virtual DOM Patching算法是基于Snabbdom的实现，并在些基础上作了很多的调整和改进。
- **Watcher**：每个Vue组件都有一个对应的watcher，这个watcher将会在组件render的时候收集组件所依赖的数据，并在依赖有更新的时候，触发组件重新渲染。你根本不需要写shouldComponentUpdate，Vue会自动优化并更新要更新的UI。

## 渲染函数的基础
Vue推荐在绝大多数情况下使用template来创建你的HTML。然而在一些场景中，需要使用JavaScript的编程能力和创建HTML，这就是render函数，它比template更接近编译器。

```html
<h1>
  <a name="hello-world" href="#hello-world">
    Hello world!
  </a>
</h1>
```
在 HTML 层，我们决定这样定义组件接口：
```html
<anchored-heading :level="1">Hello world!</anchored-heading>
```
当我们开始写一个通过 level prop 动态生成 heading 标签的组件，你可能很快想到这样实现：
```html
<!-- HTML -->
<script type="text/x-template" id="anchored-heading-template">
  <h1 v-if="level === 1">
    <slot></slot>
  </h1>
  <h2 v-else-if="level === 2">
    <slot></slot>
  </h2>
  <h3 v-else-if="level === 3">
    <slot></slot>
  </h3>
  <h4 v-else-if="level === 4">
    <slot></slot>
  </h4>
  <h5 v-else-if="level === 5">
    <slot></slot>
  </h5>
  <h6 v-else-if="level === 6">
    <slot></slot>
  </h6>
</script>

<!-- Javascript -->
Vue.component('anchored-heading', {
  template: '#anchored-heading-template',
  props: {
    level: {
      type: Number,
      required: true
    }
  }
})
```
在这种场景中使用 template 并不是最好的选择：首先代码冗长，为了在不同级别的标题中插入锚点元素，我们需要重复地使用 <slot></slot>。
虽然模板在大多数组件中都非常好用，但是在这里它就不是很简洁的了。那么，我们来尝试使用 render 函数重写上面的例子：

``` javascript
Vue.component('anchored-heading', {
  render: function (createElement) {
    return createElement(
      'h' + this.level,   // tag name 标签名称
      this.$slots.default // 子组件中的阵列
    )
  },
  props: {
    level: {
      type: Number,
      required: true
    }
  }
})
```

## 节点、树以及虚拟DOM
在深入渲染函数之前，了解一些浏览器的工作原理是很重要的。以下面这段 HTML 为例：

``` html
<div>
  <h1>My title</h1>
  Some text content
  <!-- TODO: Add tagline -->
</div>
```
当浏览器读到这些代码时，它会建立一个[DOM节点树](https://javascript.info/dom-nodes)来保持追踪，如果你会画一张家谱树来追踪家庭成员的发展一样。
HTML 的 DOM 节点树如下图所示：
![enter description here](https://cn.vuejs.org/images/dom-tree.png)
每个元素都是一个节点。每片文字也是一个节点。甚至注释也都是节点。一个节点就是页面的一个部分。就像家谱树一样，每个节点都可以有孩子节点 (也就是说每个部分可以包含其它的一些部分)。
高效的更新所有这些节点会是比较困难的，不过所幸你不必再手动完成这个工作了。你只需要告诉 Vue 你希望页面上的 HTML 是什么，这可以是在一个模板里：

``` html
<h1>{{ blogTitle }}</h1>
```
或者一个渲染函数里：

``` javascript
render: function (createElement) {
  return createElement('h1', this.blogTitle)
}
```
在这两种情况下，Vue 都会自动保持页面的更新，即便 **blogTitle** 发生了改变。

### 虚拟 DOM
Vue 通过建立一个虚拟 DOM 对真实 DOM 发生的变化保持追踪。
![enter description here](https://www.w3cplus.com/sites/default/files/blogs/2018/1804/vue-render-2.png)
Vue的编译器在编译模板之后，会把这些模板编译成一个渲染函数。而函数被调用的时候就会渲染并且返回一个虚拟DOM的树。
当我们有了这个虚拟的树之后，再交给一个**Patch函数**，负责把这些虚拟DOM真正施加到真实的DOM上。在这个过程中，Vue有自身的响应式系统来侦测在渲染过程中所依赖到的数据来源。在渲染过程中，侦测到数据来源之后就可以精确感知数据源的变动。到时候就可以根据需要重新进行渲染。当重新进行渲染之后，会生成一个新的树，将新的树与旧的树进行对比，就可以最终得出应施加到真实DOM上的改动。最后再通过Patch函数施加改动。

简单点讲，在Vue的底层实现上，Vue将模板编译成虚拟DOM渲染函数。结合Vue自带的响应系统，在应该状态改变时，Vue能够智能地计算出重新渲染组件的最小代价并应到DOM操作上。
![enter description here](https://www.w3cplus.com/sites/default/files/blogs/2017/1711/vue-r-1.png)
Vue支持我们通过data参数传递一个JavaScript对象做为组件数据，然后Vue将遍历此对象属性，使用[Object.defineProperty方法](https://www.w3cplus.com/vue/vue-two-way-binding-object-defineproperty.html)设置描述对象，通过存取器函数可以追踪该属性的变更，Vue创建了一层Watcher层，在组件渲染的过程中把属性记录为依赖，之后当依赖项的setter被调用时，会通知Watcher重新计算，从而使它关联的组件得以更新,如下图：
![enter description here](https://www.w3cplus.com/sites/default/files/blogs/2017/1711/Object-defineProperty-14.png)

有关于Vue的响应式相关的内容，可以阅读下列文章：

深入理解Vue.js响应式原理

 - [Vue双向绑定的实现原理Object.defineproperty](https://www.w3cplus.com/vue/understanding-vue-js-reactivity-depth-object-defineproperty.html)
 - [Vue的双向绑定原理及实现](https://www.w3cplus.com/vue/vue-two-way-binding.html)
 - [Vue中的响应式](https://www.w3cplus.com/vue/vue-reactivity.html)
 - [从JavaScript属性描述器剖析Vue.js响应式视图](https://www.w3cplus.com/vue/reactive.html)

对于虚拟DOM，咱们来看一个简单的实例，就是下图所示的这个，详细的阐述了**模板 → 渲染函数 → 虚拟DOM树 → 真实DOM**的一个过程
![enter description here](https://www.w3cplus.com/sites/default/files/blogs/2018/1804/vue-render-3.png)

Vue 通过建立一个虚拟 DOM 对真实 DOM 发生的变化保持追踪。请仔细看这行代码：

``` javascript
return createElement('h1', this.blogTitle)
```
**createElement** 到底会返回什么呢？其实不是一个实际的 DOM 元素。它更准确的名字可能是 **createNodeDescription**，因为它所包含的信息会告诉 Vue 页面上需要渲染什么样的节点，及其子节点。我们把这样的节点描述为“虚拟节点 (Virtual Node)”，也常简写它为“VNode”。“虚拟 DOM”是我们对由 Vue 组件树建立起来的整个 VNode 树的称呼。

Vue组件树建立起来的整个VNode树是唯一的。这意味着，下面的render函数是无效的：

``` javascript
render: function (createElement) {
  var myParagraphVNode = createElement('p', 'hi')
  return createElement('div', [
    // 错误-重复的 VNodes
    myParagraphVNode, myParagraphVNode
  ])
}
```
如果你真的需要重复很多次的元素/组件，你可以使用工厂函数来实现。例如，下面这个例子 **render** 函数完美有效地渲染了 20 个重复的段落：

``` javascript
render: function (createElement) {
  return createElement('div',
    Array.apply(null, { length: 20 }).map(function () {
      return createElement('p', 'hi')
    })
  )
}
```
## Vue的渲染机制
![enter description here](https://www.w3cplus.com/sites/default/files/blogs/2018/1804/vue-render-4.png)
上图展示的是独立构建时的一个渲染流程图。

继续使用上面用到的模板到真实DOM过程的一个图：
![enter description here](https://www.w3cplus.com/sites/default/files/blogs/2018/1804/vue-render-3.png)

这里会涉及到Vue的另外两个概念：

- 独立构建：包含模板编译器，渲染过程HTML字符串 → render函数 → VNode → 真实DOM节点
- 运行时构建：不包含模板编译器，渲染过程render函数 → VNode → 真实DOM节点

运行时构建的包，会比独立构建少一个模板编译器。在$mount函数上也不同。而$mount方法又是整个渲染过程的起始点。用一张流程图来说明：
![enter description here](https://www.w3cplus.com/sites/default/files/blogs/2018/1804/vue-render-5.png)
由此图可以看到，在渲染过程中，提供了三种渲染模式，自定义render函数、template、el均可以渲染页面，也就是对应我们使用Vue时，三种写法：
自定义render函数

``` javascript
Vue.component('anchored-heading', {
  render: function(createElement) {
    return createElement(
      'h' + this.level, // tag name标签名称
      this.$slots.default // 子组件中的阵列
    )
  },
  props: {
    level: {
      type: Number,
      required: true
    }
  }
})
```
template写法

``` javascript
let app = new Vue({
  template: `<div>{{msg}}</div>`,
  data() {
    return {
      msg: ''
    }
  }
})
```
el写法

``` javascript
let app = new Vue({
  el: '#app',
  data() {
    return {
      msg: ''
    }
  }
})
```
这三种渲染模式最终都是要得到render函数。只不过用户自定义的render函数省去了程序分析的过程，等同于处理过的render函数，而普通的template或者el只是字符串，需要解析成AST，再将AST转化为render函数。

> 记住一点，无论哪种方法，都要得到**render函数**

## 理解createElement 参数
第一个参数：**{String | Object | Function}**
第一个参数对于createElement而言是一个必须的参数，这个参数可以是字符串string、是一个对象object，也可以是一个函数function。

``` javascript
<div id="app">
	<custom-element></custom-element>
</div>

Vue.component('custom-element', {
	render: function (createElement){
		return createElement('div')
	}
})

let app = new Vue({
	el: '#app'
})
```
上面的示例，给createElement传了一个String参数'div'，即传了一个HTML标签字符。最后会有一个div元素渲染出来。

接着把上例中的String换成一个Object，比如：

``` javascript
Vue.component('custom-element', {
	render: function (createElement){
		return createElement({
			template: `<div>Hello Vue</div>`
		})
	}
})
```
上例传了一个{template: '<div>Hello Vue!</div>'}对象。此时custom-element组件渲染出来的结果如下：

![enter description here](https://www.w3cplus.com/sites/default/files/blogs/2018/1804/vue-render-7.png)

除此之外，还可以传一个Function，比如：

``` javascript
Vue.component('custom-element', {
	render: function (createElement){
		var eleFun = function () {
			return {
				template: `<div>hello</div>`
			}
		}
		return createElement(eleFun)
	}
})
```
最终得到的结果和上图是一样的。这里传了一个eleFun()函数给createElement，而这个函数返回的是一个对象。
第二个参数: **{Object}**
createElement是一个可选参数，这个参数是一个Object。来看一个小示例：

``` javascript
<div id="app">
	<custom-element></custom-element>
</div>

Vue.component('custom-element', {
	render: function (createElement){
		// 第一个参数是一个简单的HTML标签字符 “必选”
		// 第二个参数是一个包含模板相关属性的数据对象 “可选”
		return createElement('div', {
			'class': {
				foo: true,
				bar: false
			},
			style: {
				color: 'red',
				fontSize: '14px'
			},
			attrs: {
				id: 'boo'
			},
			domProps: {
				innerHTML: 'Hello Vue!'
			}
		})
	}
})

let app = new Vue({
	el: '#app'
})
```
最终生成的DOM，将会带一些属性和内容的div元素，如下图所示：
![enter description here](https://www.w3cplus.com/sites/default/files/blogs/2018/1804/vue-render-8.png)

第三个参数：**{String | Array}**
createElement还有第三个参数，这个参数是可选的，可以给其传一个String或Array。比如下面这个小示例：

``` javascript
<div>
    <custom-element></custom-element>    
</div>

Vue.component('custom-element', {
    render: function (createElemen) {
        var self = this

        return createElement(
            'div', // 第一个参数是一个简单的HTML标签字符 “必选”
            {
                class: {
                    title: true
                },
                style: {
                    border: '1px solid',
                    padding: '10px'
                }
            }, // 第二个参数是一个包含模板相关属性的数据对象 “可选”
            [
                createElement('h1', 'Hello Vue!'),
                createElement('p', '开始学习Vue')
            ] // 第三个参数是传了多个子元素的一个数组 “可选”
        )
    }
})
let app = new Vue({ el: '#app' })
```
最终的效果如下：
![enter description here](https://www.w3cplus.com/sites/default/files/blogs/2018/1804/vue-render-9.png)
其实从上面这几个小例来看，不难发现，以往我们使用Vue.component()创建组件的方式，都可以用render函数配合createElement来完成。你也会发现，使用Vue.component()和render各有所长，正如文章开头的一个示例代码，就不适合Vue.component()的template，而使用render更方便。

接下来看一个小示例，看看template和render方式怎么创建相同效果的一个组件:

``` javascript
<div>
    <custom-element></custom-element>    
</div>


Vue.component('custom-element', {
    template: `<div id='box' :class='{show: show}' @click='handleClick'></div>`,
    data() {
        return {
            show: true
        }
    },
    methods: {
        handleClick(){
            console.log('Clicked!')
        }
    }
})
```

上面Vue.component()中的代码换成render函数之后，可以这样写：

``` javascript
Vue.component('custom-element', {
    render: function (createElemen) {
        return createElement('div', {
            class: {
                show: this.show
            },
            attrs: {
                id: 'box'
            },
            on: {
                click: this.handleClick
            }
        }, 'Hello Vue!')
    },
    data () {
        return {
            show: true
        }
    },
    methods: {
        handleClick (){
             console.log('Clicked!')
        }
    }
})
let app = new Vue({
	el: '#app'
}）
```

### createElement解析过程
简单的来看一下createElement解析的过程，这部分需要对JS有一些功底。不然看起来有点蛋疼：

``` javascript
const SIMPLE_NORMALIZE = 1
const ALWAYS_NORMALIZE = 2

function createElement(context, tag, data, children, normalizationType, alwaysNormalize) {
    // 兼容不传data的情况
    if (Array.isArray(data) || isPrimitive(data)) {
        normalizationType = children
        children = data
    }

    // 如果alwaysNormalize是true
    // 那么normalizationType应该设置为常量 ALWAYS_NORMALIZE 的值
    if (alwaysNormalize) {
        normalizationType = ALWAYS_NORMALIZE
        // 调用_createElement创建虚拟节点
        return _createElement(context, tag, data, children, normalizationType)
    }

    function_createElement(context, tag, data, children, normalizationType) {
        /**
         * 如果存在data.__ob__，说明data是被Observer观察的数据
         * 不能用作虚拟节点的data
         * 需要抛出警告，并返回一个空节点
         * 
         * 被监控的data不能被用作vnode渲染的数据的原因是：
         * data在vnode渲染过程中可能会被改变，这样会触发监控，导致不符合预期的操作
         */
        if (data && data.__ob__) {
            process.env.NODE_ENV !== 'production' && warn(
                `Avoid using observed data object as vnode data: ${JSON.stringify(data)}\n` +
                'Always create fresh vnode data objects in each render!',
                context
            )
            return createEmptyVNode()
        }

        // 当组件的is属性被设置为一个falsy的值
        // Vue将不会知道要把这个组件渲染成什么
        // 所以渲染一个空节点
        if (!tag) return createEmptyVNode()

        // 作用域插槽
        if (Array.isArray(children) && typeof children[0] === 'function') {
            data = data || {}
            data.scopedSlots = {
                default: children[0]
            }
            children.length = 0
        }

        // 如果标签名是字符串类型
        if (typeof tag === 'string') {
            let Ctor
            // 获取标签名的命名空间
            ns = config.getTagNamespace(tag)
            // ...略
        } else {
            // 当tag不是字符串的时候，我们认为tag是组件的构造类
            // 所以直接创建
            vnode = createComponent(tag, data, context, children)
        }

        if (vnode) {
            // 如果有namespace，就应用下namespace，然后返回vnode
            if (ns) applyNS(vnode, ns)
            return vnode
        } else {
            return createEmptyVNode()
        }
    }
}
```
> 这部分代码和流程图来自于@JoeRay61的《[Vue原理解析之Virtual DOM](https://segmentfault.com/a/1190000008291645)》一文。

## 使用JavaScript代替模板功能
在使用Vue模板的时候，我们可以在模板中灵活的使用v-if、v-for、v-model和<slot>之类的。但在render函数中是没有提供专用的API。如果在render使用这些，需要使用原生的JavaScript来实现。

### v-if和v-for
在render函数中可以使用if/else和map来实现template中的v-if和v-for。

``` html
<template>
    <ul v-if="items.length">
        <li v-for="item in items">{{item}}</li>
    </ul>
    <p v-else>No item found.</p>
</template>
```
换成 **render** 函数可以这么写

```html
<template>
  <div class="hello">
      <item-list :items="items"></item-list>
  </div>
</template>

<script>
  export default {
    components: {
      'item-list': {
        props: ['items'],
        render: function (createElement){
          if (this.items.length){
            return createElement('ul', this.items.map((item)=>{
              return createElement('li', item)
            }))
          } else{
            return createElement('p', 'No items found.')
          }
        }
      }
    },
    data() {
      return {
        items: ['Javascript', 'Vue', 'react']
      }
    }
  }
</script>
```
### v-model
render函数中也没有与v-model相应的API，如果要实现v-model类似的功能，同样需要使用原生JavaScript来实现。

``` javascript
<template>
  <div class="hello">
    <my-input :name="name" @input="val => name = val"></my-input>
  </div>
</template>

<script>
  export default {
    components: {
      'my-input': {
        render: function (createElement) {
          var self = this
          return createElement('input', {
            domProps: {
              value: self.name
            },
            on: {
              input: function (event) {
                self.$emit('input', event.target.value)
              }
            }
          })
        },
        props: {
          name: String
        }
      }
    },
    data() {
      return {
        name: 'react'
      }
    }
  }
</script>
```

### 插槽
你可以从this.$slots获取VNodes列表中的静态内容：

``` javascript
render: function (createElement){
    // 相当于 `<div><slot></slot></div>`
    return createElement('div', this.$slots.default)
}
```
还可以从this.$scopedSlots中获得能用作函数的作用域插槽，这个函数返回VNodes:

``` javascript
props: ['message'],
render: function (createElement){
    // 相当于 `<div><slot></slot></div>`
    return createElement('div', [
        this.$scopeSlots.default({
            text: this.message
        })
    ])
}
```
如果要用渲染函数向子组件中传递作用域插槽，可以利用VNode数据中的scopedSlots域

## JSX
如果写习惯了template，然后要用render函数来写，一定会感觉好痛苦，特别是面对复杂的组件的时候。不过我们在Vue中使用JSX可以让我们回到更接近于模板的语法上。

``` javascript
<template>
  <div class="hello">
    <my-con></my-con>
  </div>
</template>

<script>
  export default {
    components: {
      'myCon': {
        render: function (h) {
          return (
            <div>1221</div>
          )
        }
      }
    }
  }
</script>
```
> 将 h 作为 createElement 的别名是 Vue 生态系统中的一个通用惯例，实际上也是 JSX 所要求的，如果在作用域中 h 失去作用，在应用中会触发报错。

## 总结
回过头来看，Vue中的渲染核心关键的几步流程还是非常清晰的：

- new Vue，执行初始化
- 挂载$mount方法，通过自定义render方法、template、el等生成render函数
- 通过Watcher监听数据的变化
- 当数据发生变化时，render函数执行生成VNode对象
- 通过patch方法，对比新旧VNode对象，通过DOM Diff算法，添加、修改、删除真正的DOM元素

至此，整个new Vue的渲染过程完毕。

而这篇文章，主要把精力集中在render函数这一部分。学习了怎么用render函数来创建组件，以及了解了其中createElement。

 参考 [大漠 - Vue的render函数](https://www.w3cplus.com/vue/vue-render-function.html)