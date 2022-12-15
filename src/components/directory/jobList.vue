<template>
  <el-row>
    <el-col :span="2" style="font-size: 24px"
    ><i class="el-icon-document-checked"></i
    ></el-col>
    <el-col :span="22">
      <div class="note-card">
        <div v-if="jobListEditId === jobList.id">
          <el-input
              type="textarea"
              placeholder="Nhập công việc"
              v-model="jobListEditInput"
              @keydown.enter.native="updateJobList(jobList.id)"
              @focusout.native="updateJobList(jobList.id)">
          </el-input>
          <el-button
              @click="updateJobList(jobList.id)"
              type="success"
              size="mini"
          >Lưu</el-button>
          <el-button type="text" @click="changeJobListEdit('','')"
          ><i class="el-icon-close"></i
          ></el-button>
        </div>
        <div v-else class="delete-check-list">
          <p
              @click="changeJobListEdit(jobList.id, jobList.title)"
              class="title-tag-detail"
          >
            {{ jobList.title }}
          </p>
          <el-popconfirm
              title="Danh sách công việc sẽ bị xoá vĩnh viễn và không bao giờ lấy lại được."
              confirm-button-text="Xóa"
              @confirm="deleteJobList(jobList.id)"
              cancel-button-text="Thoát"
              icon="el-icon-info"
              icon-color="red"
          >
            <el-button size="mini" type="info" plain slot="reference"
            >Xóa</el-button
            >
          </el-popconfirm>
        </div>
        <el-progress class="margin-checklist" :percentage="progressData" />
        <div
            v-for="jobListChild in jobList.job_list_childs"
            :key="jobListChild.id"
        >
          <div v-if="jobListChildEditId === jobListChild.id">
            <el-input
                type="textarea"
                placeholder="Nhập công việc con"
                v-model="jobListChildEditInput"
                @keydown.enter.native="updateJobListChild(jobListChild.id)"
                @focusout.native="updateJobListChild(jobListChild.id)"
            >
            </el-input>
            <el-button
                @click="updateJobListChild(jobListChild.id)"
                type="success"
                size="mini"
            >Lưu</el-button
            >
            <el-button
                type="text"
                @click="changeJobListChildEdit('','')"
            ><i class="el-icon-close"></i
            ></el-button>
          </div>
          <div v-else class="flex-checklist">
            <div class="margin-checklist check-box-check-list-chid">
              <input
                  @click="updateJobListChildStatus(jobListChild)"
                  :checked="jobListChild.status === 1"
                  type="checkbox"
              />
              <del
                  v-if="jobListChild.status === 1"
                  @click="changeJobListChildEdit(jobListChild.id, jobListChild.title)"
              >{{ jobListChild.title }}</del
              >
              <span
                  v-else
                  @click="changeJobListChildEdit(jobListChild.id, jobListChild.title)"
              >{{ jobListChild.title }}</span
              >
            </div>
            <el-button
                @click="deleteJobListChild(jobListChild.id)"
                style="margin-bottom: 10px"
                size="mini"
                type="text"
                icon="el-icon-close"
            ></el-button>
          </div>
        </div>
        <div>
          <div v-if="jobListId === jobList.id">
            <el-input
                type="textarea"
                @keyup.enter.native="addJobListChild(jobList.id)"
                v-model="jobListChildInput"
            ></el-input>
            <div style="margin-top: 10px">
              <el-button
                  size="mini"
                  type="success"
                  @click="addJobListChild(jobList.id)"
              >Thêm</el-button
              >
              <el-button size="mini" type="text" @click="changeJobListChildAdd('', '')"
              ><i class="el-icon-close"></i
              ></el-button>
            </div>
          </div>
          <el-button v-else size="mini" plain @click="changeJobListChildAdd(jobListId = jobList.id, '')"
          >Thêm một mục</el-button
          >
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import api from "@/api";

export default {
  name: "MyJobList",
  props: ["index", "jobList"],
  data() {
    return {
      jobListEditId: '',
      jobListEditInput: '',
      jobListChildEditId: '',
      jobListChildEditInput: '',
      jobListId: '',
      jobListChildInput: '',
      progressData: 0
    };
  },
  methods: {
    changeJobListEdit(id, title) {
      this.jobListEditId = id
      this.jobListEditInput = title
    },
    changeJobListChildEdit(id, title) {
      this.jobListChildEditId = id
      this.jobListChildEditInput = title
    },
    changeJobListChildAdd(id, title) {
      this.jobListId = id
      this.jobListChildInput = title
    },
    getProgressData() {
      let st = 0;
      let lt = 0;
      api.getJobListChild(this.jobList.id).then(res => {
        if(res.status === 200){
          res.data.forEach(
              (li) => {
                if (li.status === 1) {
                  st += 1;
                }
                lt += 1;
                this.progressData = Math.ceil((st / lt) * 100);
              }
          )
        }
      }).catch(err => {
        console.log(err)
      })
    },
    updateJobList(id){
      if (this.jobListEditInput) {
        let form = {
          title: this.jobListEditInput,
        };
        api.updateJobList(id, form).then(res => {
          if(res.status === 200){
            this.changeJobListEdit('', '')
            this.$emit('loadJobList')
          }
        }).catch(err => {
          console.log(err)
        })
      }
    },
    deleteJobList(id) {
      api.deleteJobList(id).then(res => {
        if(res.status === 200){
          this.$emit('loadJobList')
        }
      }).catch(err => {
        console.log(err)
      })
    },
    addJobListChild(id) {
      if (this.jobListChildInput) {
        let form = {
          title: this.jobListChildInput,
          job_list_id: id
        };
        api.addJobListChild(form).then(res => {
          if(res.status === 200){
            this.changeJobListChildAdd('', '')
            this.getProgressData()
            this.$emit('loadJobList')
          }
        }).catch(err => {
          console.log(err)
        })
      }
    },
    updateJobListChild(id) {
      if (this.jobListChildEditInput) {
        let form = {
          title: this.jobListChildEditInput,
        };
        api.updateJobListChild(id, form).then(res => {
          if(res.status === 200){
            this.changeJobListChildEdit('', '')
            this.getProgressData()
            this.$emit('loadJobList')
          }
        }).catch(err => {
          console.log(err)
        })
      }
    },
    updateJobListChildStatus(jobListChild) {
      let stt = 0;
      if (jobListChild.status) {
        stt = 0;
      } else {
        stt = 1;
      }
      let form = {
        status: stt,
      };
      api.updateJobListChildStatus(jobListChild.id, form).then(res => {
        if(res.status === 200){
          this.getProgressData()
          this.$emit('loadJobList')
        }
      }).catch(err => {
        console.log(err)
      })
    },
    deleteJobListChild(id) {
      api.deleteJobListChild(id).then(res => {
        if(res.status === 200){
          this.getProgressData()
          this.$emit('loadJobList')
        }
      }).catch(err => {
        console.log(err)
      })
    },
  },
  mounted() {
    this.getProgressData()
  },
}
</script>

<style scoped>
.margin-checklist {
  margin-bottom: 10px;
  width: 100%;
}

.flex-checklist {
  display: flex;
  justify-content: space-between;
}

.check-box-check-list-chid {
  display: flex;
  align-items: center;
}

.check-box-check-list-chid input {
  margin-right: 10px;
}

.title-tag-detail {
  margin-top: 5px;
  margin-bottom: 5px;
  color: gray;
  font-weight: bold;
}

.delete-check-list {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.delete-check-list p {
  cursor: pointer;
}
</style>