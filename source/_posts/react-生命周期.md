---
title: react 生命周期
date: 2018-08-07 22:42:05
tags: React
toc: true
comments: true 
---
## constructor 构造方法
`constructor`是ES6对类的默认方法，通过 new 命令生成对象实例时自动调用该方法。并且，该方法是类中必须有的，如果没有显示定义，则会默认添加空的`constructor`方法。当存在`constructor`的时候⚠️必须手动调用`super`方法。
```js
class MyClass extends React.component{
    constructor(props){
        super(props); // 声明constructor时必须调用super方法
        console.log(this.props); // 可以正常访问this.props
        this.state = { // 初始化state
            list: this.props.List
        };
    }
}
```

## componentWillMount 组件挂载之前

`componentWillMount` DOM 挂载前。即将被移除！官方推荐数据请求部分的代码放在组件的`constructor`中。

## render

`render`是一个`React`组件必须定义的生命周期，用来渲染`dom`。⚠️不要在`render`里面修改state，会触发死循环导致栈溢出。`render`必须返回`reactDom`

```js
render() {
	const {nodeResultData: {res} = {}} = this.props;
	if (isEmpty(res)) return noDataInfo;
	const nodeResult = this.getNodeResult(res);
	return (
		<div className="workspace-dialog-result">
			{nodeResult}
		</div>
	);
```
## componentDidMount 组件挂载完成后
在组件挂载完成后调用，且全局只调用一次。可以在这里使用refs，获取真实dom元素。该钩子内也可以发起异步请求，并在异步请求中可以进行`setState`。


## getDerivedStateFromProps props变化前
- 触发时间：在组件构建之后(虚拟dom之后，实际dom挂载之前) ，以及每次获取新的props之后。
- 每次接收新的props之后都会返回一个对象作为新的state，返回null则说明不需要更新state.
- 配合`componentDidUpdate`，可以覆盖`componentWillReceiveProps`的所有用法

```js
class Example extends React.Component {
  static getDerivedStateFromProps(nextProps, prevState) {
    // 没错，这是一个static
  }
}
```

### componentWillReceiveProps (nextProps)  v16.3后移除
`props`发生变化以及父组件重新渲染时都会触发该生命周期，在该钩子内可以通过参数`nextProps`获取变化后的`props`参数，通过this.props访问之前的props。该生命周期内可以进行`setState`。
*(React v16.3后废弃该生命周期，可以用新的周期 `static getDerivedStateFromProps` 代替)*

## shouldComponentUpdate(nextProps, nextState) 是否重新渲染
组件挂载之后，每次调用`setState`后都会调用`shouldComponentUpdate`判断是否需要重新渲染组件。默认返回`true`，需要重新`render`。返回`false`则不触发渲染。在比较复杂的应用里，有一些数据的改变并不影响界面展示，可以在这里做判断，优化渲染效率。

## getSnapshotBeforeUpdate 
- 触发时间: update发生的时候，在render之后，在组件dom渲染之前。
- 返回一个值，作为`componentDidUpdate`的第三个参数。
- 配合`componentDidUpdate`, 可以覆盖`componentWillUpdate`的所有用法。
```js
class Example extends React.Component {
	getSnapshotBeforeUpdate(prevProps, prevState) {
	// ...
	}
}
```

### componentWillUpdate(nextProps, nextState) v16.3后移除

`shouldComponentUpdate`返回true或者调用forceUpdate之后，`componentWillUpdate`会被调用。不能在该钩子中setState，会触发重复循环。
*(React v16.3后废弃该生命周期，可以用新的周期 `getSnapshotBeforeUpdate`)*

## componentDidUpdate 完成组件渲染
除了首次render之后调用`componentDidMount`，其它render结束之后都是调用`componentDidUpdate`。该钩子内`setState`有可能会触发重复渲染，需要自行判断，否则会进入死循环。
```js
componentDidUpdate() {
    if(condition) {
        this.setState({..}) // 设置state
    } else {
        // 不再设置state
    }
}
```

## componentWillUnmount() 组件即将被卸载

## 生命周期图
![](https://user-gold-cdn.xitu.io/2018/5/25/1639548946e168e6?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

### 完整生命周期示例 v16.4+
```jsx
import React from 'react'
import { Button } from 'antd'
class Father extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            num: 2
        }
        this.changeNum = this.changeNum.bind(this)
    }
    changeNum() {
        let num = this.state.num++
        this.setState({ num })
    }

    render() {
        return (
            <div>
                <Button onClick={this.changeNum}>changeNum</Button>
                <LifeCycle num={this.state.num} />
            </div>
        )
    }
}

class LifeCycle extends React.Component {
    constructor(props) {
        super(props);
        this.state = { str: "hello" };
    }


    static getDerivedStateFromProps(nextProps, prevState) {
        console.log('getDerivedStateFromProps ==> props发生变化以及父组件重新渲染时都会触发', 'v16.3之前用 componentWillReceiveProps')
        // 每次接收新的props之后都会返回一个对象作为新的state，返回null则说明不需要更新state
        return null
    }

    componentDidMount() {
        console.log("componentDidMount ==> 挂载后");
    }

    shouldComponentUpdate() {
        console.log("shouldComponentUpdate ==> 是否重新渲染", '默认返回true，需要重新render。返回false则不触发渲染');
        return true;        // 记得要返回true
    }

    getSnapshotBeforeUpdate() {
        console.log('getSnapshotBeforeUpdate ==> update发生前触发', 'v16.3之前用 componentWillUpdate')
        return null
    }

    componentDidUpdate() {
        console.log("componentDidUpdate");
    }

    componentWillUnmount() {
        console.log("componentWillUnmount");
    }
    render() {
        console.log("render");
        return (
            <div>
                <span><h2>{parseInt(this.props.num)}</h2></span>
                <br />
                <span><h2>{this.state.str}</h2></span>
            </div>
        );
    }
}

export default Father
```
点击前
![](https://user-gold-cdn.xitu.io/2018/8/7/1651513be63d27e3?w=734&h=71&f=png&s=4801)
点击后
![](https://user-gold-cdn.xitu.io/2018/8/7/1651512b08b7cef3?w=729&h=94&f=png&s=8558)

### 完整生命周期示例 v16.3
```js
class LifeCycle extends React.Component {
    constructor(props) {
        super(props);
        this.state = {str: "hello"};
    }

    componentWillMount() {
		// v16.3 后被移除建议用 constructor
        alert("componentWillMount");
    }

    componentDidMount() {
        alert("componentDidMount");
    }

    componentWillReceiveProps(nextProps) {
		// v16.3 后被移除 => static getDerivedStateFromProps
        alert("componentWillReceiveProps");
    }

    shouldComponentUpdate() {
        alert("shouldComponentUpdate");
        return true;        // 记得要返回true
    }

    componentWillUpdate() {
		// v16.3 后被移除 => getSnapshotBeforeUpdate
        alert("componentWillUpdate");
    }

    componentDidUpdate() {
        alert("componentDidUpdate");
    }

    componentWillUnmount() {
        alert("componentWillUnmount");
    }
	render() {
        alert("render");
        return(
            <div>
                <span><h2>{parseInt(this.props.num)}</h2></span>
                <br />
                <span><h2>{this.state.str}</h2></span>
            </div>
        );
    }
}
```

