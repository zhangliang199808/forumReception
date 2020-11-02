<template>
<div>
  <div class="z-card">
    <div class="title flex-center">
      {{ detailObj.article_title }}
    </div>
    <div class="flex-end flex-align-end" style="width: 100%; height: 50px; padding-right: 40px">
      <div class="art_font">{{ detailObj.article_create_time }}</div>
      <div class="art_font">
        <i class="el-icon-view" style="margin-left: 30px"></i>
        {{ detailObj.article_views }}
      </div>
    </div>
    <div style="width: 100%" v-html="detailObj.article_content"></div>
  </div>
  <div class="z-card margin-top-20">
     <comment :commentList="commentList" @doSend="sendContent" @doChidSend="twoSendContent"></comment>
  </div>
</div>
</template>

<script>
import { apiDetail, apiComment, abc } from "@/api/home";
import comment from 'hbl-comment'
import moment from 'moment'
import { Message } from 'element-ui';

export default {
  data() {
    return {
      query: "",
      detailObj: {},
      commentList: [], //评论列表
      textarea: "", //评论内容
      textarea1: "", //评论内容
      textarea2: "", //评论内容
      showreplytext: false,
    };
  },
  components: {
    comment
  },
  mounted() {
    this.query = this.$route.query;
    this.getDetail();
    this.getComment();
  },
  methods: {
    sendContent(text) {
      let obj = {}
      obj.id = this.commentList.length + 200
      obj.commentUser = this.$store.state.user.username
      obj.content = text
      obj.createDate = moment(new Date()).format("YYYY-MM-DD hh:mm:ss")
      this.commentList.unshift(obj)
      this.sendComment(text)
    },
    twoSendContent(text,commentId,fatherId,index) {
      console.log(text,commentId,fatherId,index,'评论ID')
      // commentId // 被评论的id； fatherId： 父级评论的ID
      // this.commentList.forEach((item,index) => {
      //   if (item.first_comment.id == fatherId)
      // })
    },
    getDetail() {
      let data = {};
      data.article_id = this.query.id;
      apiDetail(data).then((res) => {
        if (res.code == 200) {
          this.detailObj = res;
          let content = document.getElementById("content");
          content.append(res.article_content);
        }
      });
    },
    // 获取评论列表
    getComment() {
      let data = {};
      data.article_id = this.query.id;
      apiComment(data).then((res) => {
        if (res.code == 200) {
          let list = res.data
          list = list.map(item => {
            let childList = item.first_comment.second_comment
            childList = childList.map(e => {
              return {
                id: e.second_comment_id, // 评论id
                commentUser: {nickName:e.second_comment_username},  // 评论用户
                targetUser: {nickName:'admin2'},   // 被评论用户
                content: e.second_comment_content,  // 评论内容
                createDate: '2020-11-11', // 评论时间
              }
            })
            return {
              id: item.first_comment.comment_id, // 评论id
              commentUser: {nickName: item.first_comment.comment_username},  // 评论用户
              targetUser: 'admin',   // 被评论用户
              content: item.first_comment.comment_content,  // 评论内容
              createDate: '2020-11-02', // 评论时间
              childrenList: childList   // 子评论列表
            }
          })
          this.commentList = list;
        }
      });
    },
    // 发送评论
    sendComment(content,twoId) {
      let data = new FormData();
      if (twoId) {
        data.append("up_comment",twoId)
      }
      data.append("article_id", this.query.id);
      data.append("comment", content);
      abc(data).then((res) => {
        console.log(res);
        if (res.code == 200) {
          Message({
            message: res.message,
            type: 'success'
          });
        } else {
          Message({
              message: res.message || '评论失败',
              type: 'error'
            });
          }
      })
      .catch(err => {
        Message(
          {
            message: err,
            type: 'error'
          })
      })
    },
    // 回复评论
    replyClick(a) {
      this.showreplytext = a;
    },
  },
};
</script>

<style scoped>
.title {
  height: 80px;
  font-size: 30px;
  font-weight: 700;
}
/deep/ .btn {
  line-height: 20px !important;
}
</style>