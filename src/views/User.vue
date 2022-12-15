<template>
  <div class="user">
    <div class="user-content">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
        <div class="avatar">
          <div>
            <el-avatar
                v-if="myUser.avatar && !urlAvtar"
                :size="100"
                :src="baseUrl+'/storage/'+myUser.avatar"
            ></el-avatar>
            <el-avatar v-else-if="urlAvtar" :size="100" :src="urlAvtar"></el-avatar>
            <el-avatar v-else icon="el-icon-user-solid" :size="100"></el-avatar>
          </div>
          <div class="sub-title">{{ myUser.name }}</div>
        </div>
        <div class="file-input">
          <input @change="changeFile" type="file" id="file" class="file" />
          <span
              v-if="fileData"
              @click="(fileData = ''); (urlAvtar = '')"
          >
            Xóa avatar vừa chọn
          </span>
          <label v-else for="file"> Chọn avatar </label>
        </div>
        <el-form-item prop="name" label="Họ tên">
          <el-input
              type="text"
              placeholder="Họ tên"
              v-model="ruleForm.name"
          ></el-input>
        </el-form-item>
        <el-form-item prop="email" label="Email">
          <el-input
              type="email"
              placeholder="Email"
              v-model="ruleForm.email"
              :disabled="true"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="success" round @click="submitForm('ruleForm')"
          >Lưu</el-button
          >
          <el-button round @click="changePass">Đổi mật khẩu</el-button>
        </el-form-item>
        <div class="login">
          <el-button type="text" @click="back"
          ><i class="el-icon-back"></i> Quay lại trang chủ</el-button
          >
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import api from "@/api";

export default {
  name: "MyUserView",
  data() {
    return {
      baseUrl: 'http://namjob.epizy.com',
      fileData: '',
      urlAvtar: '',
      ruleForm: {
        name: '',
        email: '',
      },
      rules: {
        name: [
          {
            required: true,
            message: "Họ tên không được để trống",
            trigger: "change",
          },
          {
            min: 2,
            message: "Họ tên phải lớn hơn 2 ký tự",
            trigger: "change",
          },
        ],
        email: [
          {
            required: true,
            message: "Email không được để trống",
            trigger: "change",
          },
          {
            type: "email",
            message: "Vui lòng nhập đúng định dạng email",
            trigger: ["blur", "change"],
          },
        ],
      },
    };
  },
  computed: {
    ...mapState("user", ["myUser"]),
  },
  methods: {
    ...mapMutations("user", ["setUser"]),
    changeFile(e) {
      if (e.target.files.length) {
        let file = e.target.files[0];
        this.fileData = file;
        this.urlAvtar = URL.createObjectURL(file);
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const formData = new FormData();
          formData.append("name", this.ruleForm.name);
          if (this.fileData) {
            formData.append("avatar", this.fileData);
          }
          api.updateUser(formData).then(res => {
            if(res.status === 200){
              this.urlAvtar = '';
              this.fileData = '';
              this.setUser(res.data)
              this.$message({
                message: "Sửa thành công",
                type: "success",
              });
            }
          }).catch(err => {
            console.log(err)
          })
        } else {
          this.$message.error("Lỗi, vui lòng kiểm tra lại");
          return false;
        }
      });
    },
    changePass() {
      this.$router.push({ name: "ChangePassword" });
    },
    back() {
      this.$router.push({ name: "Home" });
    },
  },
  mounted() {
    this.ruleForm.name = this.myUser.name;
    this.ruleForm.email = this.myUser.email;
  },
};
</script>

<style lang="scss" scoped>
.user {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin-top: 30px;
  margin-bottom: 30px;
  .user-content {
    width: 400px;
    padding: 30px;
    border-radius: 30px;
    background-color: #f4f5f7;
    overflow-x: hidden;
    overflow-y: auto;
    position: absolute;
    top: 0;
    bottom: 0;
    .el-form {
      .avatar {
        width: 100%;
        text-align: center;
        .sub-title {
          font-weight: bold;
          margin-top: 10px;
        }
      }
      .file-input {
        text-align: center;
        margin-bottom: 15px;
        margin-top: 5px;
        .file {
          opacity: 0;
          width: 0.1px;
          height: 0.1px;
          position: absolute;
        }
        span {
          display: inline-block;
          position: relative;
          width: 200px;
          height: 40px;
          border-radius: 10px;
          line-height: 40px;
          color: grey;
          font-size: 12px;
          font-weight: bold;
          cursor: pointer;
          color: rgb(245, 73, 73);
        }
        label {
          display: inline-block;
          position: relative;
          width: 200px;
          height: 40px;
          border-radius: 10px;
          line-height: 40px;
          color: grey;
          font-size: 12px;
          font-weight: bold;
          cursor: pointer;
        }
      }
    }
  }
  .user-content::-webkit-scrollbar {
    height: 5px;
    width: 5px;
  }
  .user-content::-webkit-scrollbar-track {
    background: #dadbe2;
    border-radius: 30px;
    margin: 35px;
  }
  .user-content::-webkit-scrollbar-thumb {
    background: #bfc4ce;
    border-radius: 30px;
  }
  .user-content::-webkit-scrollbar-thumb:hover {
    background: #979da7;
  }
}
</style>