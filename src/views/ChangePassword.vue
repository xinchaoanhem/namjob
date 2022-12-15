<template>
  <div class="pass">
    <div class="pass-content">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
        <el-form-item prop="old_password" label="Nhập mật khẩu cũ">
          <el-input
            type="password"
            placeholder="Mật khẩu cũ"
            v-model="ruleForm.old_password"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password" label="Nhập mật khẩu mới">
          <el-input
            type="password"
            placeholder="Mật khẩu mới"
            v-model="ruleForm.password"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password_confirmation" label="Nhập xác nhận mật khẩu">
          <el-input
            type="password"
            placeholder="Xác nhận mật khẩu"
            v-model="ruleForm.password_confirmation"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="success" round @click="submitForm('ruleForm')"
            >Lưu</el-button
          >
        </el-form-item>
        <div class="login">
          <el-button type="text" @click="back"
            ><i class="el-icon-back"></i> Quay lại cài đặt</el-button
          >
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import api from "@/api";

export default {
  name: "MyChangePassword",
  data() {
    return {
      ruleForm: {
        old_password: '',
        password: '',
        password_confirmation: '',
      },
      rules: {
        old_password: [
          {
            required: true,
            message: "Mật khẩu cũ không được để trống",
            trigger: "change",
          },
          {
            min: 6,
            message: "Mật khẩu cũ phải lớn hơn 6 ký tự",
            trigger: "change",
          },
        ],
        password: [
          {
            required: true,
            message: "Mật khẩu mới không được để trống",
            trigger: "change",
          },
          {
            min: 6,
            message: "Mật khẩu mới phải lớn hơn 6 ký tự",
            trigger: "change",
          },
        ],
        password_confirmation: [
          {
            required: true,
            message: "Xác nhận mật khẩu không được để trống",
            trigger: "change",
          },
          {
            min: 6,
            message: "Xác nhận mật khẩu phải lớn hơn 6 ký tự",
            trigger: "change",
          },
        ],
      },
    };
  },
  computed: {
    ...mapState("user", ["myUser"]),
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          api.updatePassword(this.ruleForm).then(res => {
            if(res.status === 200){
              this.$message({
                message: "Cập nhật mật khẩu mới thành công!",
                type: "success",
              });
              this.$router.push({ name: 'User' });
            }
          }).catch(err => {
            if (err.response.status === 400) {
              this.$message.error(err.response.data.message);
            }
            if (err.response.status === 422) {
              this.$message.error('Xác nhận mật khẩu không đúng');
            }
            console.log(err)
          })
        } else {
          this.$message.error("Lỗi, vui lòng kiểm tra lại");
          return false;
        }
      });
    },
    back() {
      this.$router.push({ name: 'User' });
    },
  },
};
</script>

<style lang="scss" scoped>
.pass {
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
  .pass-content {
    width: 400px;
    padding: 30px;
    border-radius: 30px;
    background-color: #f4f5f7;
    overflow-x: hidden;
    overflow-y: auto;
    position: absolute;
    top: 0;
    bottom: 0;
  }
  .pass-content::-webkit-scrollbar {
    height: 5px;
    width: 5px;
  }
  .pass-content::-webkit-scrollbar-track {
    background: #dadbe2;
    border-radius: 30px;
    margin: 35px;
  }
  .pass-content::-webkit-scrollbar-thumb {
    background: #bfc4ce;
    border-radius: 30px;
  }
  .pass-content::-webkit-scrollbar-thumb:hover {
    background: #979da7;
  }
}
</style>