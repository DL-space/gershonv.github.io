---
title: vscode-react 快捷键
date: 2018-10-10 20:56:32
tags: vscode
comments: true #是否可评论
toc: true
categories: 开发工具
keywords:  v-model
---

插件 React/Redux/react-router Snippets

### import 相关

- imr => `import React from 'react'`
- imrc => `import React, { Component } from 'react'`
- impt => `import PropTypes from 'prop-types'`
- imc => `import ${1:componentName} from './Components/${1:componentName}'`

- imconnect => import { connect } from 'react-redux'

### React

#### rcc => 创建模板组件

```jsx
import React, { Component } from 'react'

class componentName extends Component {
  render() {
    return <div />
  }
}

export default componentName

// or
import React, { Component } from 'react'

export default class componentName extends Component {
  render() {
    return (
      <div></div>
    )
  }
}
```

#### rccp 创建带 propsTypes 的模板组件

rccp => class component skeleton with prop types after the class

```jsx
import React, { Component, PropTypes } from 'react'

class componentName extends Component {
  render() {
    return <div />
  }
}

componentName.propTypes = {}

export default componentName
```

#### rsc 创建无状态组件

rsc

```jsx
import React from 'react'

function componentName() {
  return <div />
}

export default componentName
```

#### rscp 创建无状态组件带 propTypes

rscp => stateless component with prop types skeleton

```jsx
import React from 'react'
import PropTypes from 'prop-types'

const propTypes = {}

function componentName(props) {
  return <div />
}

componentName.propTypes = propTypes

export default componentName
```

#### con 构造函数

```jsx
constructor(props) {
  super(props)

}
```

#### st 声明 state

st => Creates empty state object with ES7 synTax

```jsx
state = {}
```

生命周期

- cwm→ componentWillMount method
- cdm→ componentDidMount method
- cwr→ componentWillReceiveProps method
- scu→ shouldComponentUpdate method
- cwup→ componentWillUpdate method
- cdup→ componentDidUpdate method
- cwun→ componentWillUnmount method

#### ren render 方法

```jsx
render() {
  return (
    <div>

    </div>
  )
}
```

#### sst => this.setState({})

#### ssf => this.setState(()=>{})

```js
this.setState((state, props) => {
  return {}
})
```

### PropTypes 检查

- pta→ `PropTypes.array`
- ptar→ `PropTypes.array.isRequired`
- ptb→ `PropTypes.bool`
- ptbr→ `PropTypes.bool.isRequired`
- ptbr→ `PropTypes.bool.isRequired`
- ptf→ `PropTypes.func`
- ptfr→ `PropTypes.func.isRequired`
- ptn→ `PropTypes.number`
- ptnr→ `PropTypes.number.isRequired`
- pto→ `PropTypes.object.`
- ptor→ `PropTypes.object.isRequired`
- pts→ `PropTypes.string`
- ptsr→ `PropTypes.string.isRequired`
- ptnd→ `PropTypes.node`
- ptndr→ `PropTypes.node.isRequired`
- ptel→ `PropTypes.element`
- ptelr→ `PropTypes.element.isRequired`

### redux

- rat => `export const = ''` types
- rac => actionCreator

```jsx
export const actionCreator = payload => ({
  type: actionType,
  payload
})
```

- reducer

```jsx
export const reducerName = (state = , action) => {
  switch (action.type) {
    case 'ACTION_TYPE':
      return
    default:
      return state
  }
}
```

- container

```jsx
import { connect } from 'react-redux'
import component from '../components/component'
import { actionCreator } from '../actionPath'

const mapStateToProps = (state, ownProps) => ({})

const mapDispatchToProps = {}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(component)
```
