---
title: v-model 浅析
date: 2018-07-08 13:45:31
comments: true #是否可评论
tags: Vue.js
toc: true
categories: Vue.js
keywords:  v-model
---
## v-model 介绍
v-model 只是个语法糖，用于实现数据的双向绑定，实现的原理为 

- v-bind 绑定value
- v-on 监听 input 事件 绑定的值发生改变时触发 重新复制给value

如果不理解，请看组件之间的通信。接下来看一段代码

``` html
<input v-model="searchText">

<!--相当于以下代码-->
<input :value="searchText" @input="searchText = $event.target.value">
```

同理我们在封装组件时可以利用这个原理 构造 v-model 语法糖，下例我们封装一个my-input 组件：

``` html
<template>
  <input :value="content" @input="handleChange($event)">
</template>

<script>
  export default {
    props: {
      value: String
    },
    data() {
      return {
        content: this.value
      }
    },
    methods: {
      handleChange($event) {
        this.$emit('input',  $event.target.value)
      }
    }
  }
</script>
```
ok，简单的封装完成。说明一点，props 的类型为**基本类型** 如 `String`、`Number`、`Boolean` 等在my-input 组件是不允许修改，而 props 类型为Object、Array等**引用类型**时可以修改，但是此时数据不再是单向流动。也就是说，你在修改props时也会修改到父组件中的值，简单一句话概括：**父子组件数据双向绑定**。

### .sync 实现父子组件间的双向数据绑定
> 在有些情况下，我们可能需要对一个 prop 进行“双向绑定”。不幸的是，真正的双向绑定会带来维护上的问题，因为子组件可以修改父组件，且在父组件和子组件都没有明显的改动来源。
> 这也是为什么我们推荐以 update:my-prop-name 的模式触发事件取而代之。接着上个例子，在一个包含 value prop 的假设的组件中，我们可以用以下方法表达对其赋新值的意图：
```javascript
this.$emit('update:value', newValue)
```
然后父组件可以监听那个事件并根据需要更新一个本地的数据属性。例如：
```html
<my-input
  :value="searchText"
  @update:value="searchText = $event"></my-input>

<!--等同于-->
<my-input :value.sync="searchText"></my-input>
```
my-input 组件的代码
```html
<template>
  <input :value="value" @input="handleChange($event)">
</template>

<script>
  export default {
    props: {
      value: String
    },
    methods: {
      handleChange($event) {
        this.$emit('update:value', $event.target.value)
      }
    }
  }
</script>
```



## 自定义组件的 v-model
一个组件上的 v-model 默认会利用名为 value 的 prop 和名为 input 的事件，但是像单选框、复选框等类型的输入控件可能会将 value 特性用于不同的目的。model 选项可以用来避免这样的冲突：

自定义单选框：
```html
<template>
  <div>
    <base-checkbox v-model="isCheck"></base-checkbox> {{isCheck}}
  </div>
</template>

<script>
  export default {
    components: {
      'base-checkbox': {
        model: {
          prop: 'checked',
          event: 'change'
        },
        props: {
          checked: Boolean
        },
        template: `<input
                    type="checkbox"
                    :checked="checked"
                    @change="$emit('change', $event.target.checked)">`
      }
    },
    data() {
      return {
        isCheck: true
      }
    },
  }
</script>
```

>这里的 isCheck 的值将会传入这个名为 checked 的 prop。同时当 <base-checkbox> 触发一个 change 事件并附带一个新的值的时候，这个 isCheck 的属性将会被更新。