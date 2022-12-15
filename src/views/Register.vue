<template>
  <div class="wrap animate__animated animate__zoomInDown">
    <div class="logo">
      <img src="../assets/logo-namjob.png" alt="" />
    </div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
      <el-form-item prop="name">
        <el-input
            type="text"
            placeholder="Họ tên"
            v-model="ruleForm.name"
        ></el-input>
      </el-form-item>
      <el-form-item prop="email">
        <el-input
            type="email"
            placeholder="Email"
            v-model="ruleForm.email"
        ></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
            type="password"
            placeholder="Mật khẩu"
            v-model="ruleForm.password"
        ></el-input>
      </el-form-item>
      <el-form-item prop="password_confirmation">
        <el-input
            type="password"
            placeholder="Xác nhận mật khẩu"
            v-model="ruleForm.password_confirmation"
        ></el-input>
      </el-form-item>
      <el-form-item class="submit-login">
        <el-button type="success" round @click="submitForm('ruleForm')"
        >Đăng ký</el-button
        >
      </el-form-item>
      <div class="login">
        <el-button type="text" @click="login()">Đăng nhập</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import api from '@/api';

export default {
  name: 'MyRegister',
  data() {
    return {
      ruleForm: {
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
      },
      rules: {
        name: [
          {
            required: true,
            message: "Họ tên không được để trống",
            trigger: "blur",
          },
          {
            min: 2,
            message: "Họ tên phải lớn hơn 2 ký tự",
            trigger: "blur",
          },
        ],
        email: [
          {
            required: true,
            message: "Email không được để trống",
            trigger: "blur",
          },
          {
            type: "email",
            message: "Vui lòng nhập đúng định dạng email",
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: "Mật khẩu không được để trống",
            trigger: "blur",
          },
          {
            min: 6,
            message: "Mật khẩu phải lớn hơn 6 ký tự",
            trigger: "blur",
          },
        ],
        password_confirmation: [
          {
            required: true,
            message: "Xác nhận mật khẩu không được để trống",
            trigger: "blur",
          },
          {
            min: 6,
            message: "Xác nhận mật khẩu phải lớn hơn 6 ký tự",
            trigger: "blur",
          },
        ],
      },
    };
  },
  computed: {
    ...mapState("auth", ["isAuthenticated"]),
  },
  methods: {
    ...mapMutations("auth", ["changeLoginStatus"]),
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.ruleForm.password !== this.ruleForm.password_confirmation) {
            this.$message({
              message: "Xác nhận mật khẩu không khớp, vui lòng kiểm tra lại!",
              type: "error",
            });
          } else {
            api.register(this.ruleForm).then(res => {
              console.log(res.data)
              this.$message({
                message: 'Đăng kí thành công',
                type: 'success'
              });
              this.ruleForm.name = ''
              this.ruleForm.email = ''
              this.ruleForm.password = ''
              this.ruleForm.checkPass = ''
              this.$router.push({ name: "Login" });
            }).catch(err => {
              console.log(err)
              if(this.error){
                this.$message({
                  message: 'Lỗi đăng ký, vui lòng kiểm tra lại!',
                  type: 'error'
                });
              }
            })
          }
        } else {
          this.$message.error("Lỗi, vui lòng kiểm tra lại");
          return false;
        }
      });
    },
    login() {
      this.$router.push({ name: "Login" });
    },
  },
};
</script>

<style scoped lang="scss">
.wrap {
  background: #fff;
  border-radius: 30px;
  overflow: hidden;
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-box;
  display: -ms-flexbox;
  display: flex;
  flex-wrap: wrap;
  padding: 30px;
  box-shadow: 0 0 50px 10px gainsboro;
  .logo {
    width: 100%;
    text-align: center;
    margin-bottom: 24px;
    img {
      width: 200px;
      display: inline-block;
    }
  }
  .el-form {
    width: 100%;
    .submit-login {
      display: flex;
      justify-content: space-between;
      padding-top: 20px;
      margin-bottom: 0;
    }
  }
  .login {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
