<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.title"
        placeholder="书名"
        style="width: 200px"
        class="filter-item"
        clearable
        @keydown.enter.native="handleFilter"
        @clear="handleFilter"
        @input="handleFilter"
      />
      <el-input
        v-model="listQuery.author"
        placeholder="作者"
        style="width: 200px"
        class="filter-item"
        clearable
        @keyup.enter.native="handleFilter"
        @clear="handleFilter"
        @clur="handleFilter"
      />
      <el-select
        v-model="listQuery.category"
        placeholder="分类"
        style="width: 200px"
        class="filter-item"
        clearable
        @change="handleFilter"
      >
        <el-option
          v-for="item in categoryList"
          :key="item.value"
          :label="item.label + '(' + item. num + ')'"
          :value="item.label"
        />
      </el-select>
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        style="margin-left:10px"
        @click="handleFilter"
      >
        查询
      </el-button>
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-edit"
        style="margin-left:5px"
        @click="handleCreate"
      >
        新增
      </el-button>
      <el-checkbox
        v-model="showCover"
        class="filter-item"
        style="margin-left:5px"
        @click="changeShowcover"
      >
        显示封面
      </el-checkbox>
    </div>
    <el-table
      :key="tableKey"
      v-loading="ListLoading"
      :data="list"
      border
      highlight-current-row
      style="width: 100%"
      :default-sort="defaultSort"
      @sort-change="sortChange"
    >
      <el-table-column
        label="ID"
        prop="id"
        sortable="custom"
        align="center"
        width="80"
      />
      <el-table-column
        label="书名"
        align="center"
        width="150"
      >
        <template slot-scope="{row: {titleWrapper} }">
          <span v-html="titleWrapper" />
        </template>
      </el-table-column>
      <el-table-column
        label="作者"
        align="center"
        width="150"
      >
        <template slot-scope="{row: {authorWrapper} }">
          <span v-html="authorWrapper" />
        </template>
      </el-table-column>
      <el-table-column
        label="出版社"
        align="center"
        width="150"
        prop="publisher"
      />
      <el-table-column
        label="分类"
        align="center"
        width="150"
        prop="categoryText"
      />
      <el-table-column
        label="语言"
        width="100"
        align="center"
        prop="language"
      />
      <el-table-column
        label="文件名"
        align="center"
        width="100"
        prop="fileName"
      />
      <el-table-column
        label="文件路径"
        align="center"
        width="100"
        prop="filePath"
      >
        <template slot-scope="{row: {filePath} }">
          <span>{{ filePath | valueFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="封面路径"
        align="center"
        width="100"
        prop="coverPath"
      >
        <template slot-scope="{row: {coverPath} }">
          <span>{{ coverPath | valueFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="解压路径"
        align="center"
        width="100"
        prop="unzipPath"
      >
        <template slot-scope="{row: {unzipPath} }">
          <span>{{ unzipPath | valueFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="上传人"
        align="center"
        width="100"
        prop="createUser"
      >
        <template slot-scope="{row: {createUser} }">
          <span>{{ createUser | valueFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="上传时间"
        align="center"
        width="100"
        prop="createDt"
      >
        <template slot-scope="{row: {createDt} }">
          <span>{{ createDt | titmeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="showCover"
        label="封面"
        align="center"
        width="150"
        prop="cover"
      >
        <template slot-scope="{row: {cover} }">
          <a :href="cover" target="_blank">
            <img :src="cover" style="width: 120px;height: 180px;">
          </a>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="120"
        align="center"
        fixed="right"
      >
        <template slot-scope="{row}">
          <el-button type="text" icon="el-icon-edit" @click="handleUpdate(row)" />
          <el-button type="text" icon="el-icon-delete" style="color: #f56c6c" @click="handleDelete(row)" />
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      background
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.pageSize"
      @pagination="refresh"
    />
  </div>
</template>

<script>
import Pagination from '../../components/Pagination/index'
import waves from '../../directive/waves/waves'
import { parseTime } from '../../utils'
import { getCategory, listBook, deleteBook } from '../../api/book'

export default {
  components: {
  	Pagination
  },
  directives: {
  	waves
  },
  filters: {
  	valueFilter(value) {
  		return value || '无'
  	},
  	titmeFilter(time) {
  		return time ? parseTime(time, '{y}-{m}-{d} {h}:{i}') : '无'
  	}
  },
  data() {
  	return {
  		listQuery: {},
  		showCover: true,
  		categoryList: [],
  		tableKey: 0,
  		ListLoading: false,
  		list: [],
  		total: 0,
  		defaultSort: {}
  	}
  },
  created() {
  	this.parseQuery()
  },
  mounted() {
  	this.getCategoryList()
  	this.getList()
  },
  beforeRouteUpdate(to, from, next) {
  	if (to.path === from.path) {
  		const newQuery = Object.assign({}, to.query)
  		const oldQuery = Object.assign({}, from.query)
  		if (JSON.stringify(newQuery) !== JSON.stringify(oldQuery)) {
  			this.getList()
  		}
  	}
  	next()
  },
  methods: {
  	parseQuery() {
  	  const query = Object.assign({}, this.$route.query)
  	  let sort = '+id'
  	  const listQuery = {
  	  	page: 1,
  		pageSize: 20,
  		sort: '+id'
  	  }
  	  if (query) {
  	  	query.page && (query.page = +query.page)
  	  	query.pageSize && (query.pageSize = +query.pageSize)
  	  	query.sort && (sort = query.sort)
  	  }
  	  const sortSymbol = sort[0]
  	  const sortColum = sort.slice(1, sort.length)
      this.defaultSort = {
      	prop: sortColum,
      	order: sortSymbol === '+' ? 'ascending' : 'descending'
      }
  	  this.listQuery = { ...listQuery, ...query }
  	},
  	refresh() {
  		console.log(this.listQuery)
  		this.$router.push({
  			path: '/book/list',
  			query: this.listQuery
  		})
  	},
  	handleFilter() {
  		this.listQuery.page = 1
  		this.refresh()
  	},
  	handleCreate() {
  		this.$router.push('/book/create')
  	},
  	changeShowcover(value) {
  		this.showCover = value
  	},
  	getCategoryList() {
  		getCategory().then(response => {
  			this.categoryList = response.data
  		})
  	},
  	sortChange(data) {
  		console.log('sortChange', data)
  		const { prop, order } = data
  		this.sortBy(prop, order)
  		this.handleFilter()
  	},
  	sortBy(prop, order) {
  		if (order === 'ascending') {
  			this.listQuery.sort = `+${prop}`
  		} else {
  			this.listQuery.sort = `-${prop}`
  		}
  	},
  	handleUpdate(row) {
  	  const { fileName } = row
  	  this.$router.push(`/book/edit/${fileName}`)
  	},
  	handleDelete(row) {
  		const { fileName } = row
  		this.$confirm('此操作将永久删除该电子书，是否继续？', '友情提示', {
  			confirmButtonText: '确定',
  			cancelButtonText: '取消'
  		}).then(() => {
  			deleteBook(fileName).then(response => {
  				const { msg } = response
  				this.$notify({
                  title: '操作成功',
                  message: msg,
                  type: 'success',
                  duration: 2000
                })
                this.handleFilter()
  			})
  		})
  	},
  	wrapperKeywork(k, v) {
  	  function highlight(value) {
  	  	return `<span style="color:#1AC83F;">${value}</span>`
  	  }
  	  if (!this.listQuery[k]) {
  	  	return v
  	  } else {
  	  	return v.replace(new RegExp(this.listQuery[k], 'ig'), v => highlight(v))
  	  }
  	},
  	getList() {
  		this.ListLoading = true
  		listBook(this.listQuery).then(response => {
  			const { list, count } = response.data
  			this.list = list
  			this.total = count
  			this.ListLoading = false
  			this.list.forEach(book => {
  				book.titleWrapper = this.wrapperKeywork('title', book.title)
  				book.authorWrapper = this.wrapperKeywork('author', book.author)
  			})
  		})
  	}
  }
}
</script>
