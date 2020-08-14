<template>
  <el-form
    ref="postForm"
    :model="postForm"
    class="detail"
    :rules="rules"
  >
    <sticky
      :z-index="10"
      :class-name="'sub-navbar ' + postForm.status"
    >
      <el-button
        v-if="!isEdit"
        @click.prevent.stop="showGuide"
      >显示帮助</el-button>
      <el-button
        v-loading="loading"
        style="margin-left: 10px;"
        type="success"
        @click="submitForm"
      >{{ isEdit ? '编辑电子书' : '新增电子书' }}</el-button>
    </sticky>
    <div class="detail-container">
      <el-row>
        <Warning />
        <el-col :span="24">
          <EbookUpload
            :file-list="fileList"
            disabled:-is-edit-
            @onSuccess="onUploadSuccess"
            @onRemove="onUploadRemove"
          />
          <!-- 编写具体表单控件 -->
        </el-col>
        <el-col :span="24">
          <el-form-item prop="title">
            <!-- <MDinput v-model="postForm.title" :maxlength="100" name="name" required>书名</MDinput> -->
            <el-form-item
              :label-width="labelWidth"
              label="书名："
              prop="title"
            >
              <el-input
                v-model="postForm.title"
                placeholder="书名"
                style="width: 100%"
              />
            </el-form-item>
          </el-form-item>
          <div>
            <el-row>
              <el-col
                :span="12"
                class="form-item-author"
              >
                <el-form-item
                  :label-width="labelWidth"
                  label="作者："
                  prop="author"
                >
                  <el-input
                    v-model="postForm.author"
                    placeholder="作者"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  :label-width="labelWidth"
                  label="出版社："
                  prop="publisher"
                >
                  <el-input
                    v-model="postForm.publisher"
                    placeholder="出版社"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item
                  :label-width="labelWidth"
                  label="语言："
                  prop="language"
                >
                  <el-input
                    v-model="postForm.language"
                    placeholder="语言"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  :label-width="labelWidth"
                  label="根文件："
                  prop="rootFile"
                >
                  <el-input
                    v-model="postForm.rootFile"
                    placeholder="根文件"
                    style="width: 100%"
                    disabled
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item
                  :label-width="labelWidth"
                  label="文件路径："
                  prop="filePath"
                >
                  <el-input
                    v-model="postForm.filePath"
                    placeholder="文件路径"
                    style="width: 100%"
                    disabled
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  :label-width="labelWidth"
                  label="解压路径："
                  prop="unzipPath"
                >
                  <el-input
                    v-model="postForm.unzipPath"
                    placeholder="解压路径"
                    style="width: 100%"
                    disabled
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item
                  :label-width="labelWidth"
                  label="封面路径："
                  prop="coverPath"
                >
                  <el-input
                    v-model="postForm.coverPath"
                    placeholder="封面路径"
                    style="width: 100%"
                    disabled
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  :label-width="labelWidth"
                  label="文件名称："
                  prop="fileName"
                >
                  <el-input
                    v-model="postForm.fileName"
                    placeholder="文件名称"
                    style="width: 100%"
                    disabled
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item
                  label-width="60px"
                  label="封面："
                  prop="cover"
                >
                  <a
                    v-if="postForm.cover"
                    :href="postForm.cover"
                    target="_blank"
                  >
                    <img
                      :src="postForm.cover"
                      class="preview-img"
                    >
                  </a>
                  <span v-else>无</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item
                  label-width="60px"
                  label="目录："
                  prop="contents"
                >
                  <div
                    v-if="contentsTree && contentsTree.length > 0"
                    class="contents-wrapper"
                  >
                    <el-tree
                      :data="contentsTree"
                      @node-click="onContentClick"
                    />
                  </div>
                  <span v-else>无</span>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-col>
      </el-row>
    </div>
  </el-form>
</template>
<script>
import sticky from '../../../components/Sticky/index'
import Warning from './Warning'
import EbookUpload from '../../../components/EbookUpload/index'
import MdInput from '../../../components/MDinput/index'
import { createBook, getBook, updateBook } from '../../../api/book'
const defaultForm = {
  title: '',
  author: '',
  publisher: '',
  language: '',
  rootFile: '',
  cover: '',
  originalName: '',
  url: '',
  contents: '',
  contentsTree: '',
  fileName: '',
  coverPath: '',
  filePath: '',
  unzipPath: ''
}

const fields = {
  title: '书名',
  author: '作者',
  publisher: '出版社',
  language: '语言'
}

export default {
  components: {
    sticky,
    Warning,
    EbookUpload,
    MdInput
  },
  props: {
    isEdit: Boolean
  },
  data() {
    const valideteRequire = (rule, value, callback) => {
      console.log(rule, value)
      if (value.length === 0) {
        callback(new Error(rule.field + '必须填写'))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      postForm: {
        status: 'draft'
      },
      fileList: [],
      rules: {
        title: [{ validator: valideteRequire }],
        author: [{ validator: valideteRequire }],
        publisher: [{ validator: valideteRequire }],
        language: [{ validator: valideteRequire }]
      }
    }
  },
  created() {
    if (this.isEdit) {
      const fileName = this.$route.params.fileName
      this.getBookData(fileName)
    }
  },
  methods: {
    getBookData(fileName) {
      getBook(fileName).then(response => {
        console.log(response.data)
        this.setData(response.data)
      })
    },
    showGuide() {
      console.log(1)
    },
    setData(data) {
      const {
        title,
        author,
        publisher,
        language,
        rootFile,
        cover,
        originalName,
        url,
        contents,
        contentsTree,
        fileName,
        coverPath,
        filePath,
        unzipPath
      } = data
      this.postForm = {
        title,
        author,
        publisher,
        language,
        rootFile,
        cover,
        url,
        originalName,
        contents,
        fileName,
        coverPath,
        filePath,
        unzipPath
      }
      this.fileList = [{ name: originalName, url }]
      this.contentsTree = contentsTree
    },
    submitForm() {
      if (!this.loading) {
        this.loading = true
        this.$refs.postForm.validate((valid, fields) => {
          if (valid) {
            const book = Object.assign({}, this.postForm)
            delete book.contentsTree
            if (!this.isEdit) {
              createBook(book).then(response => {
                const { msg } = response
                this.$notify({
                  title: '操作成功',
                  message: msg,
                  type: 'success',
                  duration: 2000
                })
                this.loading = false
              }).catch(() => {
                this.loading = false
              })
            } else {
              updateBook(book).then(response => {
                const { msg } = response
                this.$notify({
                  title: '操作成功',
                  message: msg,
                  type: 'success',
                  duration: 2000
                })
                this.loading = false
                this.$router.push('/book/list')
              }).catch(() => {
                this.loading = false
              })
            }
          } else {
            const message = fields[Object.keys(fields)[0]][0].message
            this.$message({ message, type: 'error' })
            this.loading = false
          }
        })
      }
    },
    onUploadSuccess(data) {
      this.setData(data)
    },
    onUploadRemove() {
      this.toDefault()
    },
    toDefault() {
      // this.postForm = Object.assign({}, defaultForm)
      this.fileList = []
      this.contentsTree = []
      this.$refs.postForm.resetFields()
    },
    onContentClick(data) {
      if (data.text) {
        window.open(data.text)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.detail {
  position: relative;
  .detail-container {
    padding: 40px 45px 20px 50px;
    .preview-img {
      width: 200px;
      height: 270px;
    }
    .contents-wrapper {
      padding: 5px 0;
    }
  }
}
.elform {
  margin: 0 auto;
}
</style>
