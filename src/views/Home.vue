<template>
  <div class="home">
    <div class="header-board">
      <h2>CÁC KHÔNG GIAN LÀM VIỆC CỦA BẠN</h2>
      <div class="header-board-action">
        <h3>Namjob Không gian làm việc</h3>
        <el-button @click="dialogFormVisible = true" type="info" plain>Tạo mới</el-button>
      </div>
    </div>
    <el-row :gutter="20">
      <el-col v-for="(board, index)  in boards" :key="index" :xs="12" :sm="8" :md="6" :xl="4">
        <div @click="directories(board)" class="grid-content" :style="backgroundImageStyle(board.image)">
          <div class="bg-gray">
            <p>
              {{ board.title}}
            </p>
          </div>
        </div>
      </el-col>
    </el-row>

    <el-dialog title="Tạo bảng" width="30%" :append-to-body="true" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="form">
        <el-form-item prop="title" label="Tên bảng" label-width="120px">
          <el-input v-model="form.title" ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm('form')">Thoát</el-button>
        <el-button type="primary" @click="addBoard('form')">Tạo bảng</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from "@/api";
import { mapMutations } from "vuex";

export default {
  name: "MyHome",
  data () {
    return {
      baseUrl: 'http://127.0.0.1:8000',
      dialogFormVisible: false,
      boards: [],
      form: {
        title: '',
      },
      rules: {
        title: [
          {
            required: true,
            message: "Tên bảng không được để trống",
            trigger: 'blur',
          }
        ],
      },
    }
  },
  methods: {
    ...mapMutations('home', ['setIdBoard','setBackgroundImageBoardData','setTitleBoard','setBoardUserId']),
    getBoards(){
      api.getBoard().then(res => {
        this.boards = res.data
      }).catch(err => {
        console.log(err)
      })
    },
    backgroundImageStyle(image) {
      if (image)
        return `background-image: url('${this.baseUrl}/storage/${image}');`
      return `background-color: rgba(0, 0, 0, 0.2)`
    },
    addBoard(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          api.addBoard(this.form).then(res => {
            if(res.status === 200){
              this.form.title = ''
              this.dialogFormVisible = false;
              this.getBoards()
            }
          }).catch(err => {
              console.log(err)
            }
          )
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.dialogFormVisible = false;
    },
    directories(board) {
      this.setIdBoard(board.id)
      this.setBoardUserId(board.user_id)
      this.setBackgroundImageBoardData(board.image)
      this.setTitleBoard(board.title)
      this.$router.push({ name: "Directories" });
    },
  },
  mounted() {
    this.getBoards();
  }
};
</script>

<style scoped lang="scss">
.home {
  padding: 25px 50px 0 50px;
  .header-board {
    width: 100%;
    >h2 {
      color: #5e6c84;
    }
    .header-board-action{
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
  .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .grid-content {
    margin-bottom: 20px;
    position: relative;
    color: white;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    border-radius: 8px;
    height: 140px;
    cursor: pointer;
    .bg-gray {
      transition: .5s;
      position: absolute;
      top: 0;
      bottom: 0;
      right: 0;
      left: 0;
      padding: 20px;
      border-radius: 8px;
      background-color: rgba(0, 0, 0, 0.1);
      p {
        font-weight: bold;
        font-size: 16px;
      }
    }
    .bg-gray:hover {
      background-color: rgba(0, 0, 0, 0.3);
    }
  }
}
</style>