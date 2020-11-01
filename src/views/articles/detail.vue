<template>
  <div class="z-card">
    <div class="title flex-center">
      {{ detailObj.article_title }}
    </div>
    <div
      class="flex-end flex-align-end"
      style="width: 100%; height: 50px; padding-right: 40px"
    >
      <div class="art_font">{{ detailObj.article_create_time }}</div>
      <div class="art_font">
        <i class="el-icon-view" style="margin-left: 30px"></i>
        {{ detailObj.article_views }}
      </div>
    </div>
    <div style="width: 100%" v-html="detailObj.article_content"></div>
    <div class="comment">
      <!--  -->
      <!--  -->
      <!-- 输入评论内容 -->
      <div>
        <el-input
          type="textarea"
          placeholder="请输入评论内容"
          v-model="textarea"
          maxlength="30"
          show-word-limit
        >
        </el-input>
        <el-button
          @click="sendComment(textarea)"
          type="primary"
          class="comment-button"
          >评论</el-button
        >
      </div>
      <!-- 输入评论内容结束 -->
      <!-- 评论列表 -->
      <div
        class="commentlsit"
        v-for="(item, index) in commentList"
        :key="index"
      >
        <!-- 第一层 -->
        <div style="border-bottom: 1px #ccc solid; padding: 10px 0">
          <div class="comment-title">{{ item.comment_username }}：</div>
          <div class="comment-content">
            {{ item.comment_content }}
            <a
              href="javascript:;"
              @click="replyClick(item.comment_id)"
              class="reply"
              >回复</a
            >
          </div>
          <div v-show="showreplytext == item.comment_id">
            <el-input
              type="textarea"
              placeholder="请输入评论内容"
              v-model="textarea1"
              maxlength="30"
              show-word-limit
            >
            </el-input>
            <el-button
              @click="sendComment(textarea1, item.comment_id)"
              type="primary"
              class="comment-button"
              >评论</el-button
            >
          </div>
        </div>
        <!-- 第一层结束 -->
        <!-- 第二层 -->
        <div
          class="replyComment"
          v-for="(item1, i1) in item.second_comment"
          :key="i1"
        >
          <div class="comment-title">
            {{ item1.second_comment_username }} 评论：
          </div>
          <div class="comment-content">
            {{ item1.second_comment_content }}
            <a
              href="javascript:;"
              @click="replyClick(item1.second_comment_id)"
              class="reply"
              >回复</a
            >
          </div>
          <div v-show="showreplytext == item1.second_comment_id">
            <el-input
              type="textarea"
              placeholder="请输入评论内容"
              v-model="textarea2"
              maxlength="30"
              show-word-limit
            >
            </el-input>
            <el-button
              @click="sendComment(textarea2, item.comment_id)"
              type="primary"
              class="comment-button"
              >评论</el-button
            >
          </div>
        </div>
      </div>
      <!-- 评论列表 结束-->
    </div>
  </div>
</template>

<script>
import { apiDetail, apiComment, abc } from "@/api/home";
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
  mounted() {
    this.query = this.$route.query;
    this.getDetail();
    this.getComment();
  },
  methods: {
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
        console.log(res);
        if (res.code == 200) {
          this.commentList = res.data[0];
        }
      });
    },
    // 发送评论
    sendComment(a, b) {
      console.log(a, b);
      a = a ? a : "";
      b = b ? b : "";
      let data = new FormData();
      data.append("article_id", this.query.id);
      //   console.log(data)
      if (b == "") {
        data.append("comment", a);
        // data.append("up_comment", ' ');
        console.log(data);
      } else {
        data.append("comment", a);
        data.append("up_comment", b);
        console.log(data);
      }
      abc(data).then((res) => {
        console.log(res);
        if (res.code == 200) {
          this.getComment();
        }
      });
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
.comment {
  padding: 0 10px;
}
.comment-button {
  margin-top: 20px;
}
.commentlsit {
  padding: 20px;
  margin: 20px 0;
  border-top: 1px #ccc solid;
  border-bottom: 1px #ccc solid;
}
.comment-title {
  color: #ccc;
  margin-bottom: 10px;
}
.replyComment {
  margin-top: 20px;
  margin-left: 30px;
}
.reply {
  color: blue;
}
</style>