<template>
  <div>
    <Slider :sliders="sliders"  />
    <div class="z-card padding-lr-20">
      <div class="flex-start flex-align-center" style="height: 50px;">
        <div class="tab_item" v-for="(item,index) in filters" :key="index" @click="tabChange(index)">
          <div :class="['tab_style',tabIndex == index? 'tab_select': '']">{{ item.category_name }}</div>
        </div>
      </div>
    </div>
    <div class="z-card margin-top-20">
      <div class="padding-lr-20">
        <div v-for="(item,index) in articleList" :key="index" class="art_box flex-start flex-align-center" @click="goDetail(item)">
          <div class="art_left">
            <img class="img-size" src="../assets/login.jpeg" alt="">
          </div>
          <div class="art_right flex-between flex-align-center flex-1">
            <div>{{item.article_title}}</div>
            <div class="flex-start flex-between flex-align-end" style="width: 200px; height: 50px;">
              <div class="art_font">{{item.article_created_time}}</div>
              <div class="art_font"><i class="el-icon-view"></i>  {{item.article_views}}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="margin-top-20 flex-end" style="height: 60px;">
        <el-pagination
        background
        layout="prev, pager, next"
        :total="totalPage"
        @current-change="pageChange"
        >
        </el-pagination>
      </div>
      
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import TheSidebar from '@/components/layouts/TheSidebar'
import {getArticleTypeList,articleType} from '@/api/home.js'
export default {
  name: 'Home',
  components: {
    // 局部注册 TheSidebar
    TheSidebar
  },
  data() {
    return {
      sliders: {
        data: [
          {
            src: 'https://sxsimg.xiaoyuanzhao.com/D6/5A/D685908B685DA7068A50BB6A61EDB45A.png', //图片地址
            url: 'https://www.shixiseng.com/mx2018' //链接跳转地址
          }
        ],//传入图片地址和链接跳转地址，必选
        interval: 3000, //轮播动画时间，可选（默认3000ms）
        target: '_blank', //跳转方式，可选（默认_self）
        width:"1200px",//图片宽度，可选（默认800px）
        height:"600px",//图片高度，可选（默认400px）
        name: 'fade' //轮播图动画方式，可选（默认move）
      },
      msg: '',
      msgType: '',
      msgShow: false,
      articleList: [],
      filter: 'default',
      filters: [
        { filter: 'default', category_name: '活跃', title: '最后回复排序'},
        { filter: 'excellent', category_name: '精华', title: '只看加精的话题'},
        { filter: 'vote', category_name: '投票', title: '点赞数排序'},
        { filter: 'recent', category_name: '最近', title: '发布时间排序'},
        { filter: 'noreply', category_name: '零回复', title: '无人问津的话题'}
      ],
      tabIndex: 0,
      total: 0, // 文章总数
      pageSize: 20, // 每页条数
      articlesArr: [],
      currentPage: [],
      totalPage: 0
    }
  },
  computed: {
    ...mapState([
      'auth',
      'user'
    ])
  },
  watch: {
    auth(value) {
      if (!value) {
        this.showMsg('操作成功')
      }
    },
    '$route'(to) {
      this.setDataByFilter(to.query.filter)
    }
  },
  mounted() {
    this.articleTypeList()
  },
  methods: {
    pageChange(e) {
      console.log(e,'canshu')
      let id = this.filters[this.tabIndex].category_id
      this.homeInit(id,e)
    },
    goDetail(item) {
      this.$router.push({path: '/detail?id=' + item.article_id})
    },
    tabChange(index) {
      this.tabIndex = index
      let id = this.filters[this.tabIndex].category_id
      this.homeInit(id,1)
    },
    articleTypeList() {
      articleType()
        .then(res => {
          if (res.code == 200) {
            this.filters = res.data
          }
          this.homeInit(1)
        })
    },
    homeInit(id,page) {
      let data = {}
      data.category_id = id
      data.page_num = page || 1
      getArticleTypeList(data)
        .then(res => {
          if (res.code == 200) {
            this.articleList = res.data
            this.totalPage = res.total_page
          }
        })
    },
    showMsg(msg, type = 'success') {
      this.msg = msg
      this.msgType = type
      this.msgShow = true
    },
    // 回调，组件的当前页改变时调用
    changePage(page) {
      // 在查询参数中混入 page，并跳转到该地址
      // 混入部分等价于 Object.assign({}, this.$route.query, { page: page })
      this.$router.push({ query: { ...this.$route.query, page } })
    }
  }
}
</script>

<style scoped>
.tab_style {
  font-size: 16px;
  color: #000000;
  
}
.tab_item {
  margin-right: 20px;
}
.tab_select {
  font-size: 18px;
  color: #fbbd08;
  border-bottom: 2px solid #fbbd08;
}
.art_box {
  height: 60px;
  border-bottom: 1px solid #cccccc;
}
.art_left {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
}
.art_right {
  font-size: 20px;
  font-weight: 700;
  margin-left: 20px;
}
.art_font {
  font-size: 14px;
  color: #cccccc;
  font-weight: 400;
}
</style>
