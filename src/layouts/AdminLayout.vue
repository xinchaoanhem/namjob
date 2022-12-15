<template>
  <el-container :style="[backgroundImageBoardData ? {'background-image': 'url(' + imageUrl + ')'} : '']">
    <el-header style="height: auto">
      <el-row>
        <el-col :span="12" class="logo">
          <img @click="$router.push({ name: 'Home' })" src="../assets/logo-name-namjob.png" alt="" style="cursor: pointer;"/>
          <span>{{titleBoard ? titleBoard : ''}}</span>
        </el-col>
        <el-col :span="12" class="user">
          <div>
            <div v-show="isDirectoryRouter">
              <el-tooltip content="Menu" placement="left">
                <el-button  @click="drawerMenu = true;getUserBoard()" icon="el-icon-more" plain></el-button>
              </el-tooltip>
            </div>
            <el-dropdown trigger="click">
              <el-avatar
                  v-if="myUser.avatar"
                  :src="baseUrl+'/storage/'+myUser.avatar"
              ></el-avatar>
              <el-avatar v-else icon="el-icon-user-solid"></el-avatar>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click="user()" icon="el-icon-setting">
                  <el-button @click="user()" type="text">Cài đặt</el-button>
                </el-dropdown-item>
                <el-dropdown-item divided icon="el-icon-close">
                  <el-button @click="handleLogout()" type="text">Đăng xuất</el-button>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </el-col>
      </el-row>
    </el-header>
    <el-main>
      <router-view />
    </el-main>

    <el-drawer
        title="Menu"
        :visible.sync="drawerMenu"
        :append-to-body="true"
        size="20%"
        >
      <div class="drawer-menu">
        <div v-if="isSetBackground && isUpdateTitle">
          <div>
            <p><el-button class="drawer-menu-background" @click="isSetBackground = false" type="text" icon="el-icon-picture-outline" >Thay đổi hình nền</el-button></p>
            <p><el-button class="drawer-menu-background" @click="isUpdateTitle = false; form.title = titleBoard" type="text" icon="el-icon-edit" >Thay đổi tên bảng</el-button></p>
          </div>
          <div>
            <el-button @click="isAttachUserBoard = !isAttachUserBoard" icon="el-icon-user" plain>Chia sẻ</el-button>
            <div class="add-board-user" v-show="!isAttachUserBoard">
              <el-select
                  v-model="idUserSelect"
                  multiple
                  filterable
                  remote
                  reserve-keyword
                  placeholder="Nhập địa chỉ email"
                  :remote-method="selectEmail"
                  :loading="loading">
                <el-option
                    v-for="item in users"
                    :key="item.id"
                    :label="item.email"
                    :value="item.id">
                </el-option>
              </el-select>
              <div>
                <el-button @click="attachUserBoard" type="success" icon="el-icon-circle-plus-outline">Chia sẻ</el-button>
              </div>
            </div>
            <div class="board-user">
              <div @click="detachUserBoard(userBoard)" v-for="userBoard in userBoards" :key="userBoard.id">
                <el-tooltip :content="userBoard.pivot.user_id === boardUserId ?
                myUser.id !== boardUserId ?  userBoard.name +' (Quản trị viên)' : userBoard.name +' (Bạn)' :
                myUser.id === userBoard.pivot.user_id ? userBoard.name+' (Bạn)' : userBoard.name" placement="top">
                  <el-avatar icon="el-icon-user-solid" v-if="userBoard.avatar"
                             :src="baseUrl+'/storage/'+userBoard.avatar">
                  </el-avatar>
                  <el-avatar v-else icon="el-icon-user-solid"></el-avatar>
                </el-tooltip>
              </div>
            </div>
          </div>
          <div v-show="myUser.id === boardUserId" class="drawer-menu-delete">
            <el-tooltip content="Xóa bảng" placement="left">
              <el-button @click="deleteBoard" type="danger" icon="el-icon-delete" circle></el-button>
            </el-tooltip>
          </div>
        </div>
        <div v-else>
          <div>
            <el-row class="set-background">
              <el-col :span="2">
                <i @click="isSetBackground = true; isUpdateTitle = true; fileData=''; form.title=''" class="el-icon-arrow-left"></i>
              </el-col>
              <el-col :span="22">
                <h3 v-if="!isSetBackground">Thay đổi phông nền</h3>
                <h3 v-else>Sửa tên bảng</h3>
              </el-col>
            </el-row>
            <div v-if="!isSetBackground" class="grid-content" :style="backgroundImageStyle()">
              <label for="file">
                <div class="bg-gray">
                  <input @change="pickFile" type="file" id="file" class="file">
<!--                  <i v-if="fileData" @click="fileData = ''" class="el-icon-close"></i>-->
                  <i class="el-icon-plus"></i>
                </div>
              </label>
            </div>
            <div v-else class="title-input">
              <el-input v-model="form.title" placeholder="Nhập tên bảng"></el-input>
            </div>
            <el-button v-show="fileData || form.title" @click="updateBoard" type="success">{{fileData? 'Đặt làm phông nền' :'Sửa tên bảng'}}</el-button>
          </div>
        </div>
      </div>
    </el-drawer>
  </el-container>
</template>

<script>
import {mapState, mapMutations } from 'vuex'
import api from '@/api'

export default {
  data () {
    return {
      baseUrl: 'http://127.0.0.1:8000',
      drawerMenu: false,
      isSetBackground: true,
      isUpdateTitle: true,
      isAttachUserBoard: true,
      fileData: '',
      form: {
        title: '',
      },
      idUserSelect: [],
      users: [],
      userBoards: [],
      loading: false,
      popoverDetachUser: false
    }
  },
  computed: {
    ...mapState('user', ['myUser']),
    ...mapState('home', ['isDirectoryRouter','idBoard','backgroundImageBoardData','titleBoard','boardUserId']),
    imageUrl() {
      if (this.backgroundImageBoardData)
        return this.baseUrl+'/storage/'+this.backgroundImageBoardData
      return ''
    }
  },
  methods: {
    ...mapMutations('auth', ['updateAccessToken','updateStatusLogin']),
    ...mapMutations('user', ['setUser']),
    ...mapMutations('home', ['setBackgroundImageBoardData','setTitleBoard','setIdBoard']),
    getMyUser() {
      api.getUser().then((res) => {
        this.setUser(res.data)
      }).catch((err) => {
        console.log(err);
      })
    },
    getUserBoard() {
      api.getUserBoard(this.idBoard).then((res) => {
        this.userBoards = res.data
      }).catch((err) =>  {
        console.log(err);
      })
    },
    handleLogout() {
      api.logout().then(() => {
        this.updateAccessToken('')
        this.updateStatusLogin(false);
        this.$router.push({name: "Login"})
      })
    },
    user() {
      this.$router.push({ name: "User" });
    },
    backgroundImageStyle () {
      if (this.fileData)
        return `background-image: url('${URL.createObjectURL(this.fileData)}');`
      return `''`
    },
    pickFile(e) {
      if (e.target.files.length) {
        this.fileData = e.target.files[0];
      }
    },
    updateBoard() {
      const formData = new FormData();
      if (this.fileData) {
        formData.append("image", this.fileData);
      }
      if (this.form.title) {
        formData.append("title", this.form.title);
      }
      api.updateBoard(this.idBoard, formData).then(res => {
        if(res.status === 200){
          this.fileData = ''
          this.form.title = ''
          this.isSetBackground = true
          this.isUpdateTitle = true
          this.setBackgroundImageBoardData(res.data.image)
          this.setTitleBoard(res.data.title)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    selectEmail(query) {
      if (query !== '') {
        this.loading = true;
        api.getAddUser(this.idBoard, query).then((res) => {
          this.users = res.data
          this.loading = false;
        }).catch((err) =>  {
          console.log(err);
        })
      } else {
        this.users = [];
      }
    },
    attachUserBoard() {
      if (this.idUserSelect) {
        let data = {
          list_user: this.idUserSelect
        }
        api.attachUserBoard(this.idBoard, data).then(res => {
          if(res.status === 200){
            this.isAttachUserBoard = true
            this.users = []
            this.idUserSelect = []
            this.getUserBoard()
          }
        }).catch(err => {
          console.log(err)
        })
      }
    },
    detachUserBoard(userBoard) {
      if (userBoard.pivot.user_id !== this.boardUserId) {
        this.$confirm("Bạn có chắc chắn muốn xóa "+userBoard.name+" ra khỏi bảng này?", "Thông báo", {
          confirmButtonText: "OK",
          cancelButtonText: "Hủy",
          type: "warning",
          center: true,
        }).then(() => {
          let data = {
            id_user: userBoard.id
          }
          api.detachUserBoard(this.idBoard, data).then(res => {
            if(res.status === 200){
              this.getUserBoard()
              // this.$root.$emit('getLoadUserBoardInCards', userBoard.id)
              if (this.myUser.id === userBoard.pivot.user_id) {
                this.drawerMenu = false
                this.$router.push({name: "Home"})
                this.setIdBoard('')
              }
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
      }
    },
    deleteBoard() {
      this.$confirm("Bạn có chắc chắn muốn xóa?", "Thông báo", {
        confirmButtonText: "OK",
        cancelButtonText: "Hủy",
        type: "warning",
        center: true,
      }).then(() => {
        api.deleteBoard(this.idBoard).then(res => {
          if(res.status === 200){
            this.drawerMenu = false
            this.$router.push({name: "Home"})
            this.setIdBoard('')
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
    }
  },
  mounted() {
    this.getMyUser()
  }
};
</script>

<style scoped lang="scss">
.el-container {
  //background-image: url("../assets/bg-home.jpg");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  overflow: auto;
  .el-header {
    background-color: rgba(0, 0, 0, 0.32);
    padding: 5px;
    .logo {
      display: flex;
      align-items: center;
      img {
        width: 148px;
      }
      span{
        margin-left: 20px;
        font-weight: bold;
        font-size: 24px;
        color: white;
      }
    }
    .user {
      display: flex;
      >div {
        margin-left: auto;
        display: flex;
        align-items: center;
        justify-content: center;

        .el-tooltip {
          margin-right: 20px;
        }
      }
    }
  }
  .el-main {
    position: relative;
    padding: 0;
  }
}

.drawer-menu {
  padding: 0 20px 0 20px;
  >div>div {
    border-top: #091e4221 solid 1px;
    >p {
      margin: 10px;
      .drawer-menu-background {
        color: black;
        display: block;
      }
    }
    .set-background {
      padding-top: 10px;
      h3 {
        text-align: center;
      }
    }
    .grid-content {
      margin-top: 20px;
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
        display: flex;
        align-items: center;
        justify-content: center;
        .file {
          opacity: 0;
          width: 0.1px;
          height: 0.1px;
          position: absolute;
        }
        i {
          font-size: 34px;
          color: #979da7;
        }
      }
      .bg-gray:hover {
        background-color: rgba(0, 0, 0, 0.2);
      }
    }
    .title-input {
      margin-top: 10px;
    }
    .el-button {
      margin-top: 10px;
    }
    .add-board-user {
      margin-top: 10px;
      >div {
        display: flex;
        justify-content: flex-end;
      }
    }
    .board-user {
      display: flex;
      flex-wrap: wrap;
      margin-bottom: 15px;
      .el-avatar {
        margin: 10px 10px 0 0;
      }
    }
  }
  .drawer-menu-delete {
    display: flex;
    justify-content: flex-end;
    .el-tooltip {
      margin: 10px;
    }
  }
}
</style>
