---
title: 封装组件系列 - el 分页表格
date: 2018-07-07 00:44:38
comments: true #是否可评论
tags:
  - Vue.js
  - element-ui
categories: Vue.js
---

## 前言

本次封装基于 `antd` 风格, 实现高度可配置的表格封装配置。本来想通过 `vue.extends` 去封装的，奈何几个月没写过 `vue` ，而且对 `vue` 的 `extends` 不熟悉所以放弃了...

之前有小伙伴确实引用了我的代码，发现封装出现了一些纰漏，对此十分抱歉，之前封装的太仓促了。几个月前的代码，现在重新封装又有了新的体会。

更新时间 【2018.11.09】，效果如下：

![](https://user-gold-cdn.xitu.io/2018/11/9/166f7e2fa283341b?w=1896&h=761&f=png&s=84208)

## API 说明

- `columns` : **必选**, 列描述数据对象， Array
- `dataSource` : **必选**, 数据数组
- `options` : **必选**, 表格参数控制, maxHeight、stripe 等等..
- `fetch` : 获取数据的 Function
- `pagination` : 分页信息，不传则不显示分页
- `row-click` ：当某一行被点击时会触发该事件
- `selection-change` : 当选择项发生变化时会触发该事件
- 其他的 api 可以自行添加

其他说明我在代码注释中写的很清楚了，请自行查看。

根据条件渲染: 只通过 `render` 去判断参数不同而渲染不一样的表格数据。 `render` 函数可以渲染任何你想要的组件

值得注意的是，`this` 对象的绑定不要出错了,如果需要更多增强的功能，各位可以自行添加...

## Home.vue 组件

```html
<template>
    <div>
      <h2>Home</h2>
      <CommonTable
        :columns="columns"
        :dataSource="tableData"
        :options="options"
        :fetch="fetchTableData"
        :pagination="pagination"
        @row-click="handleRowClick"
        @selection-change="handleSelectionChange"
        />
    </div>
</template>

<script>
import axios from 'axios'
import CommonTable from '../components/Table'

export default{
  components:{
    CommonTable
  },
  data(){
    return {
      columns: [
         {
          prop: 'id',
          label: '编号',
          width: 60
        },
        {
          prop: 'title',
          label: '标题',
          // render 可以根据你想要渲染的方式渲染
          // jsx 不提供 v-model 指令，若你想要使用，，推荐使用插件 babel-plugin-jsx-v-model
          // jsx https://github.com/vuejs/babel-plugin-transform-vue-jsx
          render: (row, index) => {
            return (
              <span style="color: blue" onClick={e => this.handleClick(e, row)}>{row.title}</span>
            )
          }
        },
        {
          prop: 'author',
          label: '作者'
        },
        {
          button: true,
          label: '按钮组',
          group: [{
            // you can props => type size icon disabled plain
            name: '编辑',
            type: 'warning',
            icon: 'el-icon-edit',
            plain: true,
            onClick: (row, index) => { // 箭头函数写法的 this 代表 Vue 实例
              console.log(row, index)
            }
          }, {
            name: '删除',
            type: 'danger',
            icon: 'el-icon-delete',
            disabled: false,
            onClick(row) { // 这种写法的 this 代表 group 里的对象
              this.disabled = true
              console.log(this)
            }
          }]
        }
      ],
      tableData: [
        {
          id: 1,
          title: '标题1',
          author: '郭大大'
        },
        {
          id: 2,
          title: '标题2',
          author: '郭大大2'
        }
      ],
      pagination: {
        total: 0,
        pageIndex: 1,
        pageSize: 15
      },
      options: {
        mutiSelect: true,
        index: true, // 显示序号， 多选则 mutiSelect
        loading: false, // 表格动画
        initTable: true, // 是否一挂载就加载数据
      }
    }
  },
  methods: {
    handleClick(e, row){
      //transform-vue-jsx 的nativeOnClick 失效 , 所以采用 event.cancelBubble 控制点击事件的冒泡... 如果点击事件不影响你的点击行事件，可以不传
      e.cancelBubble = true // 停止冒泡，否则会触发 row-click
      console.log(row)
    },
    fetchTableData() {
       this.options.loading = true
       axios.post('https://www.easy-mock.com/mock/5b3f80edfa972016b39fefbf/example/tableData', {
        pageIndex: this.pagination.pageIndex,
        pageSize: this.pagination.pageSize
      }).then(res => {
        const { list, total } = res.data.data
        this.tableData = list
        this.pagination.total = total
        this.options.loading = false
      }).catch((error) => {
        console.log(error)
        this.options.loading = false
      })
    },
    handleRowClick(row, event, column){ // 点击行的事件，同理可以绑定其他事件
      console.log('click row:',row, event, column)
    },
    handleSelectionChange(selection){
      console.log(selection)
    }
  }
}
</script>
```

## Table.vue 组件

```html
<template>
  <div>
    <el-table
      v-loading="options.loading"
      :data="dataSource"
      :max-height="options.maxHeight"
      :stripe="options.stripe"
      :border="options.border"
      @row-click="handleRowClick"
      @selection-change="handleSelectionChange"
      header-row-class-name="table-header-row">

      <!--selection选择框-->
      <el-table-column v-if="options.mutiSelect" type="selection" style="width:50px" align="center"></el-table-column>

      <!--序号-->
      <el-table-column v-if="options.index" label="序号" type="index" width="50" align="center"></el-table-column>

      <!--数据列-->
      <template v-for="(column, index) in columns">
        <el-table-column
          :key="index"
          :prop="column.prop"
          :label="column.label"
          :align="column.align||'center'"
          :width="column.width"
          :fixed="column.fixed">
          <template slot-scope="scope">

            <template v-if="!column.render">
              {{scope.row[column.prop]}}
            </template>

             <!-- render -->
            <template v-else>
              <RenderDom :row="scope.row" :index="index" :render="column.render" />
            </template>

            <!-- render button -->
            <template v-if="column.button">
              <template v-for="(btn, i) in column.group">
                <el-button
                  :key="i"
                  :type="btn.type" :size="btn.size || 'mini'" :icon="btn.icon" :disabled="btn.disabled" :plain="btn.plain"
                   @click.stop="btn.onClick(scope.row, scope.$index)"
                  >{{btn.name}}</el-button>
              </template>
            </template>

            <!-- slot 你可以其他常用项 -->

          </template>

        </el-table-column>
      </template>

    </el-table>

     <!-- 分页 -->
    <el-pagination
        v-if="pagination"
        :total="pagination.total"
        :page-sizes="[20, 50, 100, 500, 5000]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleIndexChange"
        style="margin-top: 20px;text-align: right"
    ></el-pagination>

  </div>
</template>

<script>
  export default {
    components: {
      RenderDom: {
        functional: true, // 函数式组件 - 无 data 和 this 上下文 => better render
        props: {
          row: Object,
          index: Number,
          render: Function
        },
        /**
         * @param {Function} createElement - 原生创建dom元素的方法， 弃用，推荐使用 jsx
         * @param {Object} ctx - 渲染的节点的this对象
         * @argument 传递参数 row index
         */
        render(createElement, ctx){
          const { row, index } = ctx.props
          return ctx.props.render(row, index)
        }
      }
    },
    props:{
      dataSource: Array,
      options: Object,   // 表格参数控制 maxHeight、stripe 等等...
      columns: Array,
      fetch: Function,   // 获取数据的函数
      pagination: Object // 分页，不传则不显示
    },
    created() {
      // 传入的options覆盖默认设置
      this.$parent.options = Object.assign({
          maxHeight: 500,
          stripe: true, // 是否为斑马纹
          border: true
      }, this.options)

      this.options.initTable && this.fetch()
    },
    methods: {
      handleSizeChange(size) { // 切换每页显示的数量
        this.pagination.pageSize = size
        this.fetch()
      },
      handleIndexChange(current) { // 切换页码
        this.pagination.pageIndex = current
        this.fetch()
      },
      handleSelectionChange(selection) {
        this.$emit('selection-change', selection)
      },
      handleRowClick(row, event, column) {
        this.$emit('row-click', row, event, column)
      }
    }
  }
</script>

<style>
.el-table th,
.el-table tr.table-header-row {
  background: #e5c5d2; /* 示例， 对表格样式上的修饰 */
}
</style>
```

## 结语

上述代码封装完整性可能不是这么高，但思路在呢，如果需要更多配置，各位可以在进行加强...

吐槽一下，本来是想 `props` 数据来重写 `table` 参数，类似 `react`:

```jsx
<Home>
  <ComonTable {...props} >
</Home>

// ComonTable
<el-table {...props.options}>
</el-table>
```

所以想到继承，自己又不熟悉。 而且发现 `vue` 展开绑定多个属性是不可以的： 可能是我没 `google` 到。如果可以，请大佬告知一声，谢谢

[jsx 语法快速入门](https://github.com/vuejs/babel-plugin-transform-vue-jsx)
