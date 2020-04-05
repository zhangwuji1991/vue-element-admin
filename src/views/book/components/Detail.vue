<template>
    <el-form ref="postForm" :model="postForm">
      <sticky :z-index="10" :class-name="'sub-navbar ' + postForm.status">
        <el-button v-if="!isEdit" @click.prevent.stop="showGuide">显示帮助</el-button>
        <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm">
          {{ isEdit ? '编辑电子书' : '新增电子书' }}
        </el-button>
      </sticky>
        <div class="detail-container">
        <el-row>
          <Warning />
          <el-col :span="24">
          <ebook-upload />  
            <!-- 编写具体表单控件 -->    
                
          </el-col>
          <el-col :span="24">
            <!-- 编写具体表单控件 -->          
          </el-col>
        </el-row>
      </div>
    </el-form>
   
</template>
<script>
import sticky from '../../../components/Sticky/index'
import Warning from './Warning'
import EbookUpload  from "../../../components/EbookUpload/index";
export default {
    components:{
        sticky,
        Warning,
        EbookUpload
    },
    props: {
        isEdit: Boolean
    },
    data(){
        return {
            loading: false,
            postForm: {
                status: 'draft'
            }
        }
    },
    methods:{
        showGuide(){
            console.log(1)
        },
        submitForm(){
            this.loading = true
            setTimeout(()=>{
                this.loading = false
            },1000)
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
</style>