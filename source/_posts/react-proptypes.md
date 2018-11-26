---
title: react - PropTypes
date: 2018-11-26 10:30:00
categories: React
tags: React
---

```js
import React, { Component } from 'react'
import PropTypes from 'prop-types'

class MyComponent extends Component {
  // static propTypes = {} 第二种写法
  // static defaultProps = {}
}

// default props
MyComponent.defaultProps = {
  name: 'Stranger'
}

MyComponent.PropTypes = {
  // 声明的prop可以是一个特殊的JS基础变量，默认情况下，下面都是可选的
  optionalArray: PropTypes.array,
  optionalBool: PropTypes.bool,
  optionalFunc: PropTypes.func,
  optionalNumber: PropTypes.number,
  optionalObject: PropTypes.object,
  optionalString: PropTypes.string,
  optionalSymbol: PropTypes.symbol,

  // 下面示例能够渲染任何元素: numbers, strings, elements ，array, fragment
  optionalNode: PropTypes.node,

  // 需要是 React 元素
  optionalElement: PropTypes.element,

  // 可以声明 prop 是某个类的示例
  optionalMessage: PropTypes.instanceOf(Message),

  // 可以声明 prop 在某个 enum 中的一个
  optionalEnum: PropTypes.oneOf(['News', 'Photos']),

  // 用来验证prop对象中的每一个属性
  optionalUnion: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.instanceOf(Message)
  ]),

  // 验证 prop 数组的每个子元素的类型
  optionalArrayOf: PropTypes.arrayOf(PropTypes.number),

  // 检查 prop 对象的属性的类型
  optionalObjectOf: PropTypes.objectOf(PropTypes.number),

  // 用来检查 prop 对象的每个属性的类型
  optionalObjectWithShape: PropTypes.shape({
    color: PropTypes.string,
    fontSize: PropTypes.number
  }),

  // 检查 prop 是必须存在的（required）
  requiredFunc: PropTypes.func.isRequired,

  // 用来检查任意的数值都必须存在
  requiredAny: PropTypes.any.isRequired,

  // 你可以通过自定义验证器的方法来进行验证。
  // 自定义验证器应当返回一个抛出错误的Error对象。
  // 不要使用`console.warn`或者throw抛出错误，因为无法再 oneOfType 中使用
  customProp: function(props, propName, componentName) {
    if (!/matchme/.test(props[propName])) {
      return new Error(
        'Invalid prop `' + propName + '` supplied to' +
        ' `' + componentName + '`. Validation failed.'
      );
    }
  },

  // 你也可以为'arrayOf'和'objectOf'提供自定义验证器
  // 如果验证失败，应该返回一个Error对象
  // 数组或者对象的每一个key都会被调用这个验证器。
  // 此验证器的前面两个参数是数组或者是对象本身以及当前遍历的index(如数组下标或对象属性key)
  customArrayProp: PropTypes.arrayOf(function(propValue, key, componentName, location, propFullName) {
    if (!/matchme/.test(propValue[key])) {
      return new Error(
        'Invalid prop `' + propFullName + '` supplied to' +
        ' `' + componentName + '`. Validation failed.'
      );
    }
  })

}
```
