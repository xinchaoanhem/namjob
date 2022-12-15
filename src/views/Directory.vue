<template>
  <draggable :list="directoryList" @change="changeIndex" :animation="100" draggable=".divList" class="home" group="dire" @start="dragging = true"
             @end="dragging = false">
    <div class="divList" v-for="(directory) in directoryList" :key="directory.id">
      <directoryList :directory="directory" :idBoard="idBoard" @loadDirectory="getDirectories()"/>
    </div>
    <div slot="footer" key="footer" role="group" v-if="!isClickAdd" class="add-new-list">
      <el-button type="text" @click="isClickAdd = true"
      ><i class="el-icon-plus"></i> Thêm danh sách khác</el-button
      >
    </div>
    <div slot="footer" v-else class="add-new-list-text">
      <div class="add-new-list-text-input">
        <el-input @keyup.enter.native="addDirectory" @focusout.native="isClickAdd = false" placeholder="Nhập tiêu đề danh sách..." v-model="form.title"></el-input>
      </div>
      <div class="add-new-list-text-button">
        <el-button @click="addDirectory" type="success" size="small">Thêm danh sách</el-button>
        <i @click="isClickAdd = false" class="el-icon-close"></i>
      </div>
    </div>
  </draggable>
</template>

<script>
import directoryList from "../components/directory/DirectoryList";
import { mapState, mapMutations } from "vuex";
import draggable from 'vuedraggable'
import api from "@/api";

export default {
  name: "MyDirectory",
  components: {
    directoryList,
    draggable
  },
  data () {
    return {
      directories: [],
      isClickAdd: false,
      dragging: false,
      form: {
        title: '',
        index: 0
      }
    }
  },
  computed: {
    ...mapState("home", ['idBoard']),
    directoryList: {
      get() {
        return this.directories
      },
      set(value) {
        this.directories = value
      }
    }
  },
  methods: {
    ...mapMutations("user", ["setUser"]),
    getDirectories() {
      if (this.idBoard) {
        api.getDirectory(this.idBoard).then(res => {
          this.directories = res.data
        }).catch(err => {
          console.log(err)
        })
      } else {
        this.$router.push({name: "Home"})
      }
    },
    addDirectory() {
      if (this.form.title) {
        this.form.index = this.directories.length
        api.addDirectory(this.idBoard, this.form).then(res => {
          if(res.status === 200){
            this.form.title = ''
            this.getDirectories()
          }
        }).catch(err => {
          console.log(err)
        })
      }
    },
    changeIndex() {
      this.directoryList.map((dir, index) => {
        dir.index = index;
      })
      let data = {
        directory_order_list: this.directoryList
      }
      api.updateDirectoryIndex(this.idBoard, data).then(res => {
        if(res.status === 200){
          this.getDirectories()
        }
      }).catch(err => {
        console.log(err)
      })
    }
  },
  mounted() {
    this.getDirectories();
  }
};
</script>

<style scoped lang="scss">
.home {
  user-select: none;
  white-space: nowrap;
  padding: 0 8px;
  margin-top: 15px;
  margin-bottom: 10px;
  overflow-x: auto;
  overflow-y: hidden;
  padding-bottom: 10px;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  .divList{
    width: 272px;
    margin: 0 8px;
    height: 100%;
    box-sizing: border-box;
    display: inline-block;
    vertical-align: top;
    white-space: nowrap;
    position: relative;
  }
}
/* width */
.home::-webkit-scrollbar {
  height: 10px;
}

/* Track */
.home::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.15);
  border-radius: 30px;
  margin: 20px;
}

/* Handle */
.home::-webkit-scrollbar-thumb {
  background: #ffffff7a;
  border-radius: 30px;
}

/* Handle on hover */
.home::-webkit-scrollbar-thumb:hover {
  background: #ffffffa8;
}
.add-new-list {
  width: 272px;
  margin: 0 8px;
  box-sizing: border-box;
  display: inline-block;
  vertical-align: top;
  white-space: nowrap;
  position: relative;
  background-color: #ffffff94;
  border-radius: 10px;
  .el-button {
    margin-left: 10px;
  }
}

.add-new-list-text {
  width: 272px;
  margin: 0 8px;
  box-sizing: border-box;
  display: inline-block;
  vertical-align: top;
  white-space: normal;
  position: relative;
  background-color: #ebecf0;
  border-radius: 10px;
  padding: 10px;
  .add-new-list-text-input {
    padding-bottom: 10px;
  }
  .add-new-list-text-button {
    display: flex;
    align-items: center;
    i {
      margin-left: 10px;
      font-size: 24px;
      cursor: pointer;
    }
  }
}
</style>