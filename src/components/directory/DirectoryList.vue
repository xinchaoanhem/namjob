<template>
  <div>
    <div class="list-content" data-simplebar-auto-hide="false">
      <div class="title">
        <div class="title-col">
          <div class="title-text">
            <p v-if="titleClick" @click="onClickTitle(directory.title)">
              {{ directory.title }}
            </p>
            <el-input
                v-else
                type="textarea"
                @focusout.native="updateTitle(directory.id)"
                @keyup.enter.native="updateTitle(directory.id)"
                autosize
                autofocus
                v-model="form.title"
            ></el-input>
          </div>
          <div class="list-delete">
            <el-button type="text" @click="deleteDirectory(directory.id)"
            ><i class="el-icon-delete"></i
            ></el-button>
          </div>
        </div>
      </div>
      <draggable :list="cards" draggable=".content-body" @change="changeIndex" @add="changeIndexDirectory" :id="directory.id" :animation="100" class="content" group="card">
        <div class="content-body" v-for="(card) in cards" :key="card.id">
          <card :card="card" @loadCard="getCards()"/>
        </div>
        <div class="add-new-list">
          <el-input
              id="inputaddlist"
              v-if="!addCardClick"
              type="textarea"
              autosize
              autofocus
              placeholder="Nhập tiêu đề cho thẻ này"
              v-model="formCard.title"
              @keyup.enter.native="addCard"
          ></el-input>
        </div>
      </draggable>
      <div v-if="addCardClick" class="add-note">
        <el-button type="text" @click="addCardClick = false"
        ><i class="el-icon-plus"></i> Thêm thẻ khác</el-button
        >
      </div>
      <div v-else class="add-note-text-button">
        <el-button @click="addCard" type="success" size="small"
        >Thêm thẻ</el-button
        >
        <i @click="addCardClick = true" class="el-icon-close"></i>
      </div>
    </div>
  </div>
</template>

<script>
import card from "../directory/Card";
// import { mapState, mapMutations } from "vuex";
import draggable from 'vuedraggable'
import api from "@/api";

export default {
  name: "MyDirectoryList",
  props: ["directory", 'idBoard'],
  components: {
    card,
    draggable
  },
  data() {
    return {
      cards: this.directory.cards,
      titleClick: true,
      form: {
        title: this.directory.title,
      },
      delete: {
        job_boards_id: this.idBoard,
      },
      formCard: {
        title: '',
        index: 0,
      },
      addCardClick: true,
      idCardDrag: 0
    };
  },
  methods: {
    getCards() {
      api.getCard(this.directory.id).then(res => {
        this.cards = res.data
        // console.log(res.data)
      }).catch(err => {
        console.log(err)
      })
    },
    onClickTitle(title){
      this.titleClick = false
      this.form.title = title
    } ,
    updateTitle(id) {
      api.updateDirectory(id, this.form).then(res => {
        if(res.status === 200){
          this.titleClick = true;
          this.$emit('loadDirectory')
          this.form.title = this.form.title.trim();
        }
      }).catch(err => {
        console.log(err)
      })
    },
    deleteDirectory(id) {
      this.$confirm("Bạn có chắc chắn muốn xóa?", "Thông báo", {
        confirmButtonText: "OK",
        cancelButtonText: "Hủy",
        type: "warning",
        center: true,
      }).then(() => {
        api.deleteDirectory(id,this.delete).then(res => {
          if(res.status === 200){
            this.$emit('loadDirectory')
          }
        }).catch(err => {
          console.log(err)
        })
        this.$message({
          type: "success",
          message: "Xóa thành công",
        });
      }).catch(() => {
        this.$message({
          type: "info",
          message: "Hủy xóa",
        });
      });
    },
    addCard() {
      if (this.formCard.title) {
        this.formCard.index = this.cards.length
        api.addCard(this.directory.id, this.formCard).then(res => {
          if(res.status === 200){
            this.formCard.title = ''
            this.getCards()
          }
        }).catch(err => {
          console.log(err)
        })
      }
    },
    changeIndex(e){
      if (e.moved) {
        this.cards.map((dir, index) => {
          dir.index = index;
        })
        let data = {
          card_list: this.cards
        }
        api.updateCardIndex(this.directory.id, data).then(res => {
          if(res.status === 200){
            this.getCards()
          }
        }).catch(err => {
          console.log(err)
        })
      }
      if (e.added) {
        this.idCardDrag = e.added.element.id;
      }

    },
    changeIndexDirectory(e){
      this.cards.map((dir, index) => {
        dir.index = index;
      })
      let data = {
        card_list: this.cards,
        directory_id: e.to.id
      }
      api.updateCardIndexDirectory(this.idCardDrag, data).then(res => {
        if(res.status === 200){
          this.getCards()
        }
      }).catch(err => {
        console.log(err)
      })
    }
  },
  mounted() {
    // this.getCards()
  }
};
</script>

<style scoped lang="scss">
.list-content {
  white-space: normal;
  overflow-x: hidden;
  overflow-y: auto;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  .title {
    background-color: #ebecf0;
    width: 100%;
    border-radius: 10px 10px 0 0;
    .title-col {
      margin: 10px;
      display: flex;
      justify-content: space-between;
      .title-text {
        width: 100%;
        padding: 5px 10px 0 5px;
        font-weight: bold;
        font-size: 14px;
      }
      .list-delete {
        .el-button {
          padding: 5px 5px 0 0;
        }
      }
    }
  }
  .content {
    width: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    background-color: #ebecf0;
    padding-bottom: 2px;
    .content-body {
      width: 100%;
      display: flex;
      flex-direction: column;
      cursor: pointer;
    }
    .add-new-list {
      padding: 0 10px 0 10px;
    }
  }
  .content::-webkit-scrollbar {
    width: 8px;
  }
  .content::-webkit-scrollbar-track {
    background: #dadbe2;
    border-radius: 30px;
  }
  .content::-webkit-scrollbar-thumb {
    background: #bfc4ce;
    border-radius: 30px;
  }
  .content::-webkit-scrollbar-thumb:hover {
    background: #979da7;
  }
  .add-note {
    background-color: #ebecf0;
    border-radius: 0 0 10px 10px;
    .el-button {
      margin-left: 10px;
    }
  }
  .add-note-text-button {
    display: flex;
    align-items: center;
    background-color: #ebecf0;
    border-radius: 0 0 10px 10px;
    padding: 10px;
    i {
      margin-left: 10px;
      font-size: 24px;
      cursor: pointer;
    }
  }
}
</style>