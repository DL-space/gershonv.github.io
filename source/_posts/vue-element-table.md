---
title: 封装组件系列 - el 分页表格
date: 2018-07-07 00:44:38
comments: true #是否可评论
tags: 
   - Vue.js
   - 封装组件
toc: true
categories: Vue.js
keywords:  
  - element-ui
  - Pagination
  - table
---
## 前言
公司开发新的项目，用到表格是之前的人封装，主要是用于展示，但是使用过后才发现限制太多，所以决定自己封装一个，稍微动态一点的。结合 element-table+ pagination 进行了二次封装。下面有参数说明，方便大家使用。
只需要传入一些必要参数就可以使用了，代码复用也相对高了。效果图如下：

![table](https://user-gold-cdn.xitu.io/2018/7/11/1648913a4714e7fb?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

## 组件参数说明

**Table Attributes**

|  参数  |  说明   |  类型   |  可选值   |  
| --- | --- | --- | --- | --- |
|   list  |  表格数据   |  Array   |  必选   |  
|   columns  |   列数据  | Array    |   必选  |  
|   operates   |  操作表格数据的信息   |  Object   |  可选   | 
|   pagination  |   分页信息  |   Object  |  必选   |     


**Table Events**

|  事件名  |  说明   |  参数   |
| --- | --- | --- |
|   handleSelectionChange  |   当选择项发生变化时会触发该事件  |   selection  |

## 表格组件的引入与使用

``` html
<common-table
    :list="list"
    :options="options"
    :pagination="pagination"
    :columns="columns"
    :operates="operates"
    :getList="getList"
    @handleSelectionChange="handleSelectionChange">
</common-table>
```
``` javascript
import axios from 'axios'
import commonTable from './commonTable'

export default {
  components: {commonTable},
  data() {
    return {
      msg: '',
      list: [],
      columns: [
        {
          prop: 'id',
          label: '编号',
          width: 60
        },
        {
          prop: 'title',
          label: '标题',
          formatter: (row, column, cellValue) => {
            return `<span style="white-space: nowrap;color: dodgerblue;">${row.title}</span>`
          }
        },
        {
          prop: 'state',
          label: '状态',
          render: (h, params) => {
            return h('el-tag', {
              props: {type: params.row.state === 0 ? 'success' : params.row.state === 1 ? 'info' : 'danger'} // 组件的props
            }, params.row.state === 0 ? '上架' : params.row.state === 1 ? '下架' : '审核中')
          }
        },
        {
          prop: 'author',
          label: '作者',
        },
        {
          prop: 'phone',
          label: '联系方式',
          render: (h, params) => {
            return (
              <el-button type="text" nativeOnClick={() => {
                this.call(params)
              }}>{params.row.phone}</el-button>
            )
          }
        },
        {
          prop: 'blog',
            label: '博客地址',
            render: (h, params) => {
              return (
                <el-button type="text" nativeOnClick={() => {
                  window.location.href = params.row.blog
                }}>{params.row.blog}</el-button>
              )
            }
        },
        {
          prop: 'createDate',
          label: '发布时间',
          formatter: (row, column, cellValue) => {
            return '2018-02-01'
          }
        }
      ], // 需要展示的列
      operates: {
        width: 200,
        fixed: 'right',
        list: [
          {
            label: '编辑',
            type: 'warning',
            icon: 'el-icon-edit',
            plain: true,
            disabled: false,
            method: (row, index) => {
              this.handleEdit(row, index)
            }
          },
          {
            label: '删除',
            type: 'danger',
            icon: 'el-icon-delete',
            show: true,
            plain: false,
            disabled: false,
            method: (row, index) => {
              this.handleDel(row, index)
            }
          }
        ]
      }, // 操作按钮组
      pagination: {
        show: true,
        total: 0,
        pageIndex: 1,
        pageSize: 15
      }, // 分页参数
      options: {
        index: true, //序号
        loading: false, // 表格loading加载动画控制
      } // table 的参数
    }
  },
  methods: {
    getList() {
      this.options.loading = true
      axios.post('https://www.easy-mock.com/mock/5b3f80edfa972016b39fefbf/example/tableData', {
        pageIndex: this.pagination.pageIndex,
        pageSize: this.pagination.pageSize
      }).then((response) => {
        this.pagination.total = response.data.data.total
        this.list = response.data.data.list
        this.options.loading = false
      }).catch((error) => {
        console.log(error);
        this.options.loading = false
      })
    },
    // 选中行
    handleSelectionChange(val) {
      console.log('val:', val)
    },
    // 编辑
    handleEdit(row, index) {
      console.log(' index:', index)
      console.log(' row:', row)
    },
    // 删除
    handleDel(row, index) {
      console.log(' index:', index)
      console.log(' row:', row)
    },
    call(params) {
      this.$message(`click call ${params.row.phone}`)
    }
  }
}
```

#### 参数说明
- **list** : 表格数据
- **getList**: 获取表格数据的方法
  - 注意loading控制 存放在表格参数 **options** 里面 
- **options**：表格参数
	- initTable ： 是否默认加载数据 不加载则在  **options** 中添加为false
	- maxHeight ： 表格最大高度 Number 默认500
	- stripe ： 是否为斑马纹 默认true
	- loading ： **请求数据的加载动画**
	- highlightCurrentRow ： 是否支持当前行高亮显示 默认true
	- mutiSelect ： 是否支持列表项选中功能 默认false
  - border: 是否为边框表格 默认true
- **columns** ：列数据参数
	- prop ： **对应列内容的字段名 【必选】**
	- label ： **显示的标题 【必选】**
	- align ： 对齐方式
	- width ： 列宽度
	- fixed ：列固定方式
	- formatter ： 渲染数据的函数
	- render ： 渲染表格的组件的函数 **jsx语法 上述有采用请参照**
- **pagination** ： 分页信息
	- show ： **控制分页是否显示** 
	- total ： **表格数据总条数**
	- pageIndex ： **当前页码**
	- pageSize ： **每页显示条目个数**
  - pageSizeArr： **控制表格的每页显示条目个数**
- **operates** : 操作行
	- width ： 宽度
	- fixed ：固定位置
	- list : 存放按钮信息的数组
		- label ：按钮标签
		- type ： 按钮类型
		- icon ： icon
		- plain ： 是否为朴素按钮
		- disabled ： 是否禁用
		- method ： 回调方法



## 封装 pagination-table 组件

### template

``` html
<template>
  <div class="op-table">
    <div class="table-wrap">
      <el-table
        v-loading="options.loading"
        :data="list"
        :max-height="options.maxHeight"
        :stripe="options.stripe"
        ref="mutipleTable"
        @selection-change="handleSelectionChange"
        header-cell-class-name="table-header"
        :border="options.border"
      >

        <!--selection选择框-->
        <el-table-column v-if="options.mutiSelect" type="selection" style="width: 50px;">
        </el-table-column>

        <!--序号-->
        <el-table-column v-if="options.index" label="序号" type="index" width="50" align="center"></el-table-column>

        <!--数据列-->
        <template v-for="(column, index) in columns">
          <el-table-column :prop="column.prop"
                           :label="column.label"
                           :align="column.align || 'center'"
                           :width="column.width"
                           :fixed="column.fixed">
            <template slot-scope="scope">

              <template v-if="!column.render">
                <template v-if="column.formatter">
                  <span v-html="column.formatter(scope.row, column)"></span>
                </template>
                <template v-else>
                  <span>{{scope.row[column.prop]}}</span>
                </template>
              </template>

              <!--render-->
              <template v-else>
                <expand-dom :column="column" :row="scope.row" :render="column.render" :index="index"></expand-dom>
              </template>
            </template>
          </el-table-column>
        </template>

        <!-- 按钮操作组-->
        <el-table-column v-if="operates" ref="fixedColumn" label="操作" align="center"
                         :width="operates.width" :fixed="operates.fixed">
          <template slot-scope="scope">
            <div class="operate-group">
              <template v-for="(btn, key) in operates.list">
                <el-button :type="btn.type" size="mini" :icon="btn.icon" :disabled="btn.disabled"
                           :plain="btn.plain" @click.native.prevent="btn.method(scope.row, key)">{{ btn.label }}
                </el-button>
              </template>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页-->
    <el-pagination v-if="pagination.show"
                   @size-change="handleSizeChange"
                   @current-change="handleIndexChange"
                   :page-size="pagination.pageSize"
                   :page-sizes="pagination.pageSizeArr && pagination.pageSizeArr.length > 0 ? pagination.pageSizeArr : [20, 50, 100, 500, 5000]"
                   :current-page="pagination.pageIndex"
                   layout="total,sizes, prev, pager, next,jumper"
                   :total="pagination.total"
                   style="margin-top: 20px;text-align: right"></el-pagination>
  </div>
</template>
```


### JavaScript
```javascript
export default {
  props: {
    list: {
      type: Array,
      default: () => [] // prop:表头绑定的地段，label：表头名称，align：每列数据展示形式（left, center, right），width:列宽
    }, // 数据列表
    columns: {
      type: Array,
      default: () => [] // 需要展示的列 === prop：列数据对应的属性，label：列名，align：对齐方式，width：列宽
    },
    operates: {
      type: Object,
      default: () => {
        // width:按钮列宽，fixed：是否固定（left,right）,按钮集合 === label: 文本，type :类型（primary / success / warning / danger / info / text
        // show：是否显示，icon：按钮图标，plain：是否朴素按钮，disabled：是否禁用，method：回调方法
      }
    },
    pagination: {
      type: Object,
      default: {}// 分页参数 === pageSize:每页展示的条数，pageIndex:当前页，pageArray: 每页展示条数的控制集合，默认 _page_array
    },
    getList: Function,
    options: {
      type: Object,
      default: {}
    } // table 表格的控制参数
  },
  components: {
    expandDom: {
      functional: true,
      props: {
        row: Object,
        render: Function,
        index: Number,
        column: {
          type: Object,
          default: null
        }
      },
      render: (h, ctx) => {
        const params = {
          row: ctx.props.row,
          index: ctx.props.index
        }
        if (ctx.props.column) params.column = ctx.props.column
        return ctx.props.render(h, params)
      }
    }
  },
  data() {
    return {
      multipleSelection: [], // 多行选中
    }
  },
  created() {
    // options 处理
    if (this.options.initTable !== false) {
      this.getList()
    }
    // === 表格参数默认值
    this.$parent.options = Object.assign({
      maxHeight: 500, // 表格 max-height
      initTable: true, // 是否一进来就加载表格数据
      stripe: true, // 是否为斑马纹 table
      loading: false, // 是否添加表格loading加载动画
      highlightCurrentRow: true, // 是否支持当前行高亮显示
      mutiSelect: false, // 是否支持列表项选中功能
      border: true
    }, this.options)
  },
  methods: {
    // 切换每页显示的数量
    handleSizeChange(size) {
      this.pagination.pageSize = size
      this.getList()
    },
    // 切换页码
    handleIndexChange(current) {
      this.pagination.pageIndex = current
      this.getList()
    },
    // 多行选中
    handleSelectionChange(val) {
      this.multipleSelection = val
      this.$emit('handleSelectionChange', val)
    }
  }
}
```

[jsx 语法快速入门](https://github.com/vuejs/babel-plugin-transform-vue-jsx)