<template>
  <div class="z-card">
      <div class="title flex-center">
          {{detailObj.article_title}}
      </div>
      <div class="flex-end flex-align-end" style="width: 100%; height: 50px; padding-right: 40px;">
        <div class="art_font">{{detailObj.article_create_time}}</div>
        <div class="art_font"><i class="el-icon-view" style="margin-left: 30px;"></i>  {{detailObj.article_views}}</div>
      </div>
      <div style="width: 100%;" v-html="detailObj.article_content"></div>
  </div>
</template>

<script>
import {apiDetail} from "@/api/home"
export default {
    data() {
        return {
            query: '',
            detailObj: {}
        }
    },
    mounted() {
        this.query = this.$route.query
        this.getDetail()
    },
    methods: {
        getDetail() {
            let data = {}
            data.article_id = this.query.id
            apiDetail(data)
                .then(res => {
                    if (res.code == 200) {
                        this.detailObj = res
                        let content = document.getElementById('content')
                        content.append(res.article_content)
                    }
                })
        }
    }
}
</script>

<style scoped>
.title {
    height: 80px;
    font-size: 30px;
    font-weight: 700;
}
</style>