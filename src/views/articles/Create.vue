<template>
  <div>
    <Message :show.sync="msgShow" :type="msgType" :msg="msg"/>
    <el-input placeholder="请输入标题" v-model="titleValue" clearable></el-input>
    <el-input class="margin-top-20" placeholder="请输入内容简介" v-model="contentValue" clearable></el-input>
    <div class="z-card flex-center flex-align-center margin-top-20">
      <div class="flex-start flex-align-center" style="height: 50px;">
        <div class="tab_item" v-for="(item,index) in filters" :key="index" @click="tabChange(index)">
          <div :class="['tab_style','flex-center',tabIndex == index? 'tab_select': '']">{{ item.category_name }}</div>
        </div>
      </div>
    </div>
    <div id="teat" class="margin-top-20"></div>
    <div class="flex-center" style="height: 80px;">
      <el-button id="add" type="primary">发布</el-button>
    </div>
  </div>
</template>

<script>
import {apiImgUpload,addArtice,articleType} from "@/api/home"
import E from "wangeditor";

export default {
  name: 'Create',
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      msgShow: false,
      msgType: '',
      msg: '',
      titleValue: '',
      filters: [],
      tabIndex: 0,
      contentValue: ''
    }
  },
  mounted() {
    this.articleTypeList()
    const baseUrl = localStorage.getItem('baseUrl')
    const editor = new E('#teat')
    // 设置编辑区域高度为 500px
    editor.config.height = 600
    // 注意，先配置 height ，再执行 create()
    editor.create()
    editor.config.customUploadImg = (resultFiles, insertImgFn) => {
      // resultFiles 是 input 中选中的文件列表
      // insertImgFn 是获取图片 url 后，插入到编辑器的方法
      // 上传图片，返回结果，将图片插入到编辑器中
      let data = new FormData()
      data.append('upload_file',resultFiles[0])
      apiImgUpload(data)
        .then(res => {
          if (res.code == 200) {
            let imgUrl = 'http://' + res.image_url
            insertImgFn(imgUrl)
          } else {
            this.msg = res.message
            this.msgShow = true
            this.msgType = 'warging'
          }
          
        })
    }
    let addSubmit = document.getElementById('add')
    addSubmit.onclick = () => {
      let content = editor.txt.html()
      let id = this.filters[this.tabIndex].category_id
      let data = new FormData()
      data.append('article_title',this.titleValue)
      data.append('article_excerpt',this.contentValue)
      data.append('article_category',id)
      data.append('article_body',content)

      addArtice(data)
        .then(res => {
          console.log(res)
          if (res.code == 200) {
            this.msg = res.message
            this.msgShow = true
            this.msgType = 'success'
          } else {
            this.msg = res.message
            this.msgShow = true
            this.msgType = 'wraning'
          }
        })
        .catch(err => {
          this.msg = err
          this.msgShow = true
          this.msgType = 'wraning'
        })

    }
  },
  methods: {
    tabChange(index) {
      this.tabIndex = index
    },
    articleTypeList() {
      articleType()
        .then(res => {
          if (res.code == 200) {
            this.filters = res.data
          }
        })
    },
  }
}
</script>

<style scoped>
.tab_style {
  font-size: 16px;
  color: #000000;
  
}
.tab_item {
  width: 80px;
  height: 40px;
  margin-right: 20px;
  line-height: 40px;
  border-radius: 4px;
}
.tab_select {
  font-size: 18px;
  color: #fbbd08;
  border-bottom: 2px solid #fbbd08;
}
</style>
