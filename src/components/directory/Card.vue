<template>
  <div @click="dialogFormVisible = true; getLabels(); getUserBoard()">
    <div class="content-tag">
      <labelComponent v-for="(label) in labels" :key="label.id" :label="label" />
    </div>
    <div class="content-text">
      <p>
        {{ card.title }}
      </p>
    </div>
    <div class="content-end">
      <div v-show="formatDate2(card.deadline) !== 'Invalid date'">
        <div
            v-if="card.status === 1"
            class="content-end-detail"
            style="background-color: #61bd4f; color: white"
        >
          <i class="el-icon-time"></i> {{ formatDate2(card.deadline) }}
        </div>
        <div
            v-else
            class="content-end-detail"
            style="background-color: #ec9488; color: white"
        >
          <i class="el-icon-time"></i> {{ formatDate2(card.deadline) }}
        </div>
      </div>
      <div v-show="card.description" class="content-end-detail">
        <i class="el-icon-tickets"></i>
      </div>
      <div v-show="files.length" class="content-end-detail"><i class="el-icon-files"></i>{{files.length}}</div>
      <div v-show="jobLists.length" class="content-end-detail">
        <i class="el-icon-document-checked"></i>
         {{ lengthJobListChildCheck }}/{{ lengthJobListChild }}
      </div>
      <div class="view-user-card" v-for="userCard in userCards" :key="userCard.id">
        <el-tooltip :content="userCard.name +' ('+userCard.email+')'" placement="top">
          <el-avatar icon="el-icon-user-solid" v-if="userCard.avatar"
                     :src="baseUrl+'/storage/'+userCard.avatar">
          </el-avatar>
          <el-avatar v-else icon="el-icon-user-solid"></el-avatar>
        </el-tooltip>
      </div>
    </div>

    <!-- edit detail -->
    <el-dialog
        width="750px"
        :append-to-body="true"
        :visible.sync="dialogFormVisible"
    >
      <el-row>
        <el-col :span="1">
          <div class="left-title">
            <i class="el-icon-bank-card"></i>
          </div>
        </el-col>
        <el-col :span="23">
          <div class="right-title">
            <p v-if="isTitleClick" @click="isTitleClick = false">
              {{ card.title }}
            </p>
            <el-input
                v-else
                type="textarea"
                @focusout.native="updateCard"
                @keyup.enter.native="updateCard"
                autosize
                autofocus
                v-model="cardTitleInput"
            ></el-input>
            <span>Trong danh sách <b> {{ card.directory.title }}</b></span>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="15" class="dialog-container">
        <el-col :span="17">
          <el-row v-show="labels.length || userCards.length">
            <el-col :span="2" style="font-size: 1px"> . </el-col>
            <el-col :span="22" class="container-user-tag">
              <div v-show="userCards.length" class="user-card">
                <p class="title-tag-detail">THÀNH VIÊN</p>
                <div class="user-card-list">
                  <div v-for="userCard in userCards" :key="userCard.id">
                    <el-tooltip :content="userCard.name +' ('+userCard.email+')'" placement="top">
                      <el-avatar icon="el-icon-user-solid" v-if="userCard.avatar"
                                 :src="baseUrl+'/storage/'+userCard.avatar">
                      </el-avatar>
                      <el-avatar v-else icon="el-icon-user-solid"></el-avatar>
                    </el-tooltip>
                  </div>
                </div>
              </div>
              <div v-show="labels.length" class="tag-detail">
                <p class="title-tag-detail">NHÃN</p>
                <div class="tag-detail-tag">
                  <div
                      v-for="(label) in labels"
                      :key="label.id"
                      :style="{ background: label.color }"
                  >
                    {{ label.name }}
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
          <el-row v-show="card.deadline" class="magin-mission">
            <el-col :span="2" style="font-size: 1px"> . </el-col>
            <el-col :span="22">
              <div class="tag-detail">
                <p class="title-tag-detail">NGÀY HẾT HẠN</p>
                <div class="checkbox-date">
                  <input
                      type="checkbox"
                      :checked="card.status === 1"
                      @click="statusChange"
                  />
                  <div>
                    {{ card.deadline }}
                    <span
                        v-if="card.status === 1"
                        style="background-color: #61bd4f;"
                    >HOÀN TẤT</span
                    >
                    <span
                        v-if="
                        card.deadline <= formatDate(new Date()) &&
                        card.status === 0
                      "
                        style="background-color: #ec9488;"
                    >HẾT HẠN</span
                    >
                    <span
                        v-else-if="
                        card.deadline <= formatDate(new Date().setDate(new Date().getDate() + 1)) &&
                        card.status === 0
                      "
                        style="background-color: #f2d600;"
                    >GẦN HẾT HẠN</span
                    >
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
          <el-row class="magin-mission">
            <el-col :span="2" style="font-size: 24px"
            ><i class="el-icon-document"></i
            ></el-col>
            <el-col :span="22">
              <div class="note-card">
                <p class="title-tag-detail">MÔ TẢ</p>
                <p style="white-space: pre-line"
                    v-if="isDescriptionClick && card.description"
                    @click="isDescriptionClick = false"
                >
                  {{ card.description }}
                </p>
                <div v-else>
                  <el-input
                      type="textarea"
                      :autosize="true"
                      placeholder="Thêm mô tả chi tiết hơn..."
                      @focusout.native="updateCard"
                      v-model="cardDescriptionInput"
                  ></el-input>
                  <div style="margin-top: 10px">
                    <el-button
                        size="mini"
                        type="success"
                        @click="updateCard"
                    >Lưu</el-button
                    >
                    <el-button size="mini" type="text" @click="isDescriptionClick = true"
                    >Hủy</el-button>
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
          <el-row v-show="files.length" class="magin-mission">
            <el-col :span="2" style="font-size: 24px"
            ><i class="el-icon-files"></i
            ></el-col>
            <el-col :span="22">
              <div class="note-card">
                <p class="title-tag-detail">TẬP TIN ĐÍNH KÈM</p>
                <el-row :gutter="20">
                  <el-col v-for="file in files" :key="file.id" :span="12">
                    <div>
                      <el-image v-if="isImage(file.path)"
                          :src="baseUrl+'/storage/'+file.path"
                      ></el-image>
                      <el-input v-if="fileId===file.id" @keyup.enter.native="updateFile(file.id)" size="mini" placeholder="Nhập tên tệp..." v-model="fileNameInput"></el-input>
                      <a v-else class="file-name" :href="baseUrl+'/storage/'+file.path" target="_blank">{{file.name}}</a>
                    </div>
                    <div class="button-file-edit">
                      <el-button v-if="fileId===file.id" type="text" @click="updateFile(file.id)"
                      >Lưu</el-button
                      >
                      <el-button v-else type="text" @click="changeFiletEdit(file.id, file.name)"
                      >Sửa</el-button
                      >
                      <el-button v-if="fileId===file.id" type="text" @click="changeFiletEdit('', '')"
                      >Thoát</el-button
                      >
                      <el-button v-else type="text" @click="deleteFile(file.id)"
                      >Loại bỏ</el-button
                      >
                    </div>
                  </el-col>
                </el-row>
              </div>
            </el-col>
          </el-row>
          <el-row
              v-for="(jobList,index) in jobLists"
              :key="jobList.id"
              class="magin-mission"
          >
            <jobList :index="index" :jobList="jobList" @loadJobList="getJobList"/>
          </el-row>
        </el-col>
        <el-col :span="7">
          <div class="menu-detail">
            <p class="title-tag-detail">THÊM VÀO THẺ</p>
            <div class="title-tag-detail-button">
              <el-popover
                  class="labels"
                  placement="bottom"
                  width="350"
                  trigger="click"
              >
                <div>
                  <p class="title-tag-detail">Thành viên của bảng</p>
                  <div>
                    <div class="user-board-detach" @click="attachUser(userBoard.id)" v-for="(userBoard) in userBoards"
                         :key="userBoard.id">
                      <div>
                        <el-avatar icon="el-icon-user-solid" v-if="userBoard.avatar"
                                   :src="baseUrl+'/storage/'+userBoard.avatar">
                        </el-avatar>
                        <el-avatar v-else icon="el-icon-user-solid"></el-avatar>
                        <span>{{ userBoard.name }}</span>
                      </div>
                      <i
                          v-for="(userCard) in userCards"
                          :key="userCard.id"
                          v-show="userBoard.id === userCard.id"
                          class="el-icon-check"
                      ></i>
                    </div>
                  </div>
                </div>
                <el-button class="button-detail-add-tag" slot="reference">
                  <i class="el-icon-user"></i>
                  Thành viên
                </el-button>
              </el-popover>
            </div>
            <div class="title-tag-detail-button">
              <el-popover
                  class="labels"
                  placement="bottom"
                  width="300"
                  trigger="click"
              >
                <div v-if="isAddLabel">
                  <el-input placeholder="Tìm nhãn..." v-model="searchLabels" style="margin-bottom: 10px;"></el-input>
                  <p class="title-tag-detail">NHÃN</p>
                  <div>
                    <el-row
                        v-for="(labelList) in labelLists"
                        :key="labelList.id"
                        :gutter="10"
                    >
                      <el-col
                          @click.native="attachLabel(labelList.id)"
                          :span="21"
                      ><div
                          class="tag-content"
                          :style="{ background: labelList.color }"
                      >
                        <span>{{ labelList.name }}</span>
                        <i
                            v-for="(label) in labels"
                            :key="label.id"
                            v-show="labelList.id === label.id"
                            class="el-icon-check"
                        ></i>
                      </div>
                      </el-col>
                      <el-col :span="3"
                      ><el-button
                          @click="
                            editFormLabel(
                              labelList.id,
                              labelList.name,
                              labelList.color
                            )
                          "
                          size="mini"
                          icon="el-icon-edit"
                          circle
                      ></el-button
                      ></el-col>
                    </el-row>
                  </div>
                  <el-button plain size="mini" @click="isAddLabel = !isAddLabel"
                  >Tạo nhãn mới</el-button
                  >
                </div>
                <div v-else>
                  <div class="add-new-card-input">
                    <p class="add-new-card-title">Tên</p>
                    <el-input
                        placeholder="Nhập tên nhãn"
                        v-model="addLabelInput"
                    ></el-input>
                  </div>
                  <div class="add-new-card-color">
                    <p class="add-new-card-title">Chọn một màu</p>
                    <div class="add-new-card-color-box">
                      <div @click="radioColor = '#61bd4f'" style="background-color: #61bd4f">
                        <i
                            v-show="radioColor === '#61bd4f'"
                            class="el-icon-check"
                        ></i>
                      </div>
                      <div @click="radioColor = '#f2d600'" style="background-color: #f2d600">
                        <i
                            v-show="radioColor === '#f2d600'"
                            class="el-icon-check"
                        ></i>
                      </div>
                      <div @click="radioColor = '#ff9f1a'" style="background-color: #ff9f1a">
                        <i
                            v-show="radioColor === '#ff9f1a'"
                            class="el-icon-check"
                        ></i>
                      </div>
                      <div @click="radioColor = '#eb5a46'" style="background-color: #eb5a46">
                        <i
                            v-show="radioColor === '#eb5a46'"
                            class="el-icon-check"
                        ></i>
                      </div>
                      <div @click="radioColor = '#c377e0'" style="background-color: #c377e0">
                        <i
                            v-show="radioColor === '#c377e0'"
                            class="el-icon-check"
                        ></i>
                      </div>
                      <div @click="radioColor = '#0079bf'" style="background-color: #0079bf">
                        <i
                            v-show="radioColor === '#0079bf'"
                            class="el-icon-check"
                        ></i>
                      </div>
                      <div @click="radioColor = '#00c2e0'" style="background-color: #00c2e0">
                        <i
                            v-show="radioColor === '#00c2e0'"
                            class="el-icon-check"
                        ></i>
                      </div>
                      <div @click="radioColor = '#51e898'" style="background-color: #51e898">
                        <i
                            v-show="radioColor === '#51e898'"
                            class="el-icon-check"
                        ></i>
                      </div>
                      <div @click="radioColor = '#ff78cb'" style="background-color: #ff78cb">
                        <i
                            v-show="radioColor === '#ff78cb'"
                            class="el-icon-check"
                        ></i>
                      </div>
                      <div @click="radioColor = '#344563'" style="background-color: #344563">
                        <i
                            v-show="radioColor === '#344563'"
                            class="el-icon-check"
                        ></i>
                      </div>
                      <div @click="radioColor = '#b3bac5'" style="background-color: #b3bac5">
                        <i
                            v-show="radioColor === '#b3bac5'"
                            class="el-icon-check"
                        ></i>
                      </div>
                    </div>
                    <div>
                      <el-button v-if="isShowEditLabel" @click="addLabel" type="success" size="mini"
                      >Tạo mới</el-button
                      >
                      <div v-else style="display: inline-block; margin-right: 10px">
                        <el-button
                            @click="editLabel"
                            type="success"
                            size="mini"
                        >Sửa</el-button>
                        <el-button
                            @click="deleteLabel"
                            type="danger"
                            size="mini"
                        >Xóa</el-button>
                      </div>
                      <el-button
                          type="text"
                          @click="cancelAddLabel"
                          size="mini"
                      >Thoát</el-button
                      >
                    </div>
                  </div>
                </div>
                <el-button class="button-detail-add-tag" slot="reference">
                  <i class="el-icon-price-tag"></i>
                  Nhãn
                </el-button>
              </el-popover>
            </div>
            <div class="title-tag-detail-button">
              <el-popover
                  class="labels"
                  placement="bottom"
                  width="350"
                  trigger="click"
              >
                <div class="add-new-card-input">
                  <p class="add-new-card-title">Tiêu đề</p>
                  <el-input
                      placeholder="Nhập tiêu đề công viêc"
                      v-model="jobListInput"
                      @keyup.enter.native="addJobList"
                  ></el-input>
                </div>
                <div class="add-new-card-color">
                  <div>
                    <el-button @click="addJobList" type="success" size="mini"
                    >Thêm</el-button
                    >
                  </div>
                </div>
                <el-button class="button-detail-add-tag" slot="reference">
                  <i class="el-icon-document-checked"></i>
                  Việc cần làm
                </el-button>
              </el-popover>
            </div>
            <div class="title-tag-detail-button">
              <el-popover
                  class="labels"
                  placement="bottom"
                  width="350"
                  trigger="manual"
                  v-model="visibleDateCard"
              >
                <el-date-picker
                    style="width: 100%"
                    v-model="dateValue"
                    type="datetime"
                    placeholder="Chọn ngày hết hạn"
                >
                </el-date-picker>
                <div class="date-list">
                  <el-button @click="addDateCard" type="success" size="mini"
                  >Lưu</el-button
                  >
                  <el-button type="danger" size="mini" @click="visibleDateCard = false">Gỡ bỏ</el-button>
                </div>
                <el-button @click="visibleDateCard = true" class="button-detail-add-tag" slot="reference">
                  <i class="el-icon-time"></i>
                  Ngày hết hạn
                </el-button>
              </el-popover>
            </div>
            <div class="title-tag-detail-button">
              <el-popover
                  class="labels"
                  placement="bottom"
                  width="350"
                  trigger="click"
              >
                <div class="file-input">
                  <input @change="pickFile" type="file" id="file" class="file">
                  <span v-if="fileData" @click="fileData = ''">
                    Xóa tệp
                  </span>
                  <label v-else for="file">
                    Chọn tệp
                  </label>
                </div>
                <el-button type="success" @click="addFile">Thêm tệp</el-button>
                <el-button class="button-detail-add-tag" slot="reference">
                  <i class="el-icon-files"></i>
                  Đính kèm
                </el-button>
              </el-popover>
            </div>
          </div>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-tooltip
            class="item"
            effect="dark"
            content="Xóa thẻ"
            placement="left"
        >
          <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              @click="deleteCard()"
          ></el-button>
        </el-tooltip>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from "@/api";
import moment from "moment";
import jobList from "@/components/directory/jobList";
import labelComponent from "@/components/directory/Label";
import {mapState} from "vuex";

export default {
  name: "MyCard",
  props: ['card'],
  components: {
    labelComponent,
    jobList
  },
  data () {
    return {
      baseUrl: 'http://namjob.epizy.com',
      dialogFormVisible: false,
      labelLists: [],
      labels: [],
      jobLists:[],
      files: [],
      userBoards: [],
      userCards: [],
      isTitleClick: true,
      isDescriptionClick: true,
      cardTitleInput: this.card.title,
      cardDescriptionInput: this.card.description,
      dateValue: '',
      visibleDateCard: false,
      isAddLabel: true,
      searchLabels: '',
      isShowEditLabel: true,
      addLabelInput: '',
      radioColor: '#61bd4f',
      idLabel: '',
      jobListInput: 'Việc cần làm',
      fileId: '',
      fileNameInput: '',
      fileData: ''
    }
  },
  watch: {
    searchLabels: function() {
      this.getLabels();
    }
  },
  computed: {
    ...mapState('home', ['idBoard']),
    lengthJobListChildCheck() {
      let data = 0;
      for (let i = 0; i < this.jobLists.length; i++) {
        for (let j = 0; j < this.jobLists[i].job_list_childs.length; j++) {
          if (this.jobLists[i].job_list_childs[j].status === 1) {
            data ++
          }
        }
      }
      return data
    },
    lengthJobListChild() {
      let data = 0;
      for (let i = 0; i < this.jobLists.length; i++) {
        for (let j = 0; j < this.jobLists[i].job_list_childs.length; j++) {
          data ++
        }
      }
      return data
    }
  },
  methods: {
    formatDate(dateString) {
      return moment(dateString).format("YYYY-MM-DD hh:mm:ss");
    },
    formatDate2(dateString) {
      return moment(dateString).format("DD - MM");
    },
    changeFiletEdit(id, name) {
      this.fileId = id
      this.fileNameInput = name
    },
    getExtension(filename) {
      var parts = filename.split('.');
      return parts[parts.length - 1];
    },
    isImage(filename) {
      let ext = this.getExtension(filename);
      switch (ext.toLowerCase()) {
        case 'jpg':
        case 'gif':
        case 'jpeg':
        case 'png':
        case 'svg':
          return true;
      }
      return false;
    },
    getUserBoard() {
      api.getUserBoard(this.idBoard).then((res) => {
        this.userBoards = res.data
      }).catch((err) =>  {
        console.log(err);
      })
    },
    getUserBoardInCards() {
      api.getUserBoardInCards(this.card.id).then((res) => {
        this.userCards = res.data
      }).catch((err) =>  {
        console.log(err);
      })
    },
    getLabelInCards() {
      api.getLabelInCard(this.card.id).then(res => {
        this.labels = res.data
      }).catch(err => {
        console.log(err)
      })
    },
    getAllLabels() {
      api.getLabel().then(res => {
        this.labelList = res.data
      }).catch(err => {
        console.log(err)
      })
    },
    getLabels() {
      api.getLabel(this.searchLabels).then(res => {
        if(res.status === 200){
          this.labelLists = res.data
        }
      }).catch(err => {
        console.log(err)
      })
    },
    getJobList() {
      api.getJobList(this.card.id).then(res => {
        if(res.status === 200){
          this.jobLists = res.data
        }
      }).catch(err => {
        console.log(err)
      })
    },
    getFile() {
      api.getFile(this.card.id).then(res => {
        if(res.status === 200){
          this.files = res.data
        }
      }).catch(err => {
        console.log(err)
      })
    },
    updateCard() {
      if (!this.isTitleClick) {
        let form = {
          title: this.cardTitleInput,
        };
        api.updateCard(this.card.id, form).then(res => {
          if(res.status === 200){
            this.isTitleClick = true;
            this.$emit('loadCard')
          }
        }).catch(err => {
          console.log(err)
        })
      }
      if (this.isDescriptionClick || this.cardDescriptionInput) {
        let form = {
          description: this.cardDescriptionInput,
        };
        api.updateCard(this.card.id, form).then(res => {
          if(res.status === 200){
            this.isDescriptionClick = true;
            this.$emit('loadCard')
          }
        }).catch(err => {
          console.log(err)
        })
      }
    },
    attachUser(id) {
      let form = {
        user_id: id
      };

      let aa;
      for (let index = 0; index < this.userCards.length; index++) {
        if (this.userCards[index].id === id) {
          aa = this.userCards[index].id;
        }
      }
      if (!aa) {
        api.attachUser(this.card.id, form).then(res => {
          if(res.status === 200){
            this.getUserBoardInCards()
          }
        }).catch(err => {
          console.log(err)
        })
      } else {
        api.detachUser(this.card.id, form).then(res => {
          if(res.status === 200){
            this.getUserBoardInCards()
          }
        }).catch(err => {
          console.log(err)
        })
      }
    },
    attachLabel(id) {
      let form = {
        label_id: id
      };

      let aa;
      for (let index = 0; index < this.labels.length; index++) {
        if (this.labels[index].id === id) {
          aa = this.labels[index].id;
        }
      }
      if (!aa) {
        api.attachLabel(this.card.id, form).then(res => {
          if(res.status === 200){
            this.getLabelInCards()
          }
        }).catch(err => {
          console.log(err)
        })
      } else {
        api.detachLabel(this.card.id, form).then(res => {
          if(res.status === 200){
            this.getLabelInCards()
          }
        }).catch(err => {
          console.log(err)
        })
      }
    },
    editFormLabel(id, name, color) {
      this.idLabel = id;
      this.addLabelInput = name;
      this.radioColor = color;
      this.isAddLabel = false;
      this.isShowEditLabel = false;
    },
    addLabel() {
      if (this.addLabelInput) {
        let form = {
          name: this.addLabelInput,
          color: this.radioColor,
        };
        api.addLabel(this.card.id, form).then(res => {
          if(res.status === 200){
            this.cancelAddLabel()
            this.$emit('loadCard')
            this.getLabels()
            this.getLabelInCards()
          }
        }).catch(err => {
          console.log(err)
        })
      }
    },
    editLabel() {
      if (this.addLabelInput) {
        let form = {
          name: this.addLabelInput,
          color: this.radioColor,
        };
        api.updateLabel(this.idLabel, form).then(res => {
          if(res.status === 200){
            this.cancelAddLabel()
            this.$emit('loadCard')
            this.getLabels()
            this.getLabelInCards()
          }
        }).catch(err => {
          console.log(err)
        })
      }
    },
    deleteLabel() {
      if (this.idLabel) {
        api.deleteLabel(this.idLabel).then(res => {
          if(res.status === 200){
            this.cancelAddLabel()
            this.$emit('loadCard')
            this.getLabels()
            this.getLabelInCards()
          }
        }).catch(err => {
          console.log(err)
        })
      }
    },
    cancelAddLabel() {
      this.idLabel = '';
      this.addLabelInput = '';
      this.radioColor = '#61bd4f';
      this.isAddLabel = true;
      this.isShowEditLabel = true;
    },
    addDateCard() {
      if (this.dateValue) {
        let form = {
          deadline: this.formatDate(this.dateValue),
        };
        api.updateCardDeadline(this.card.id, form).then(res => {
          if(res.status === 200){
            this.visibleDateCard = false;
            this.dateValue = ''
            this.$emit('loadCard')
          }
        }).catch(err => {
          console.log(err)
        })
      }
    },
    statusChange(){
      let form = {
        status: this.card.status === 1 ? 0 : 1,
      };
      api.updateCardStatus(this.card.id, form).then(res => {
        if(res.status === 200){
          this.$emit('loadCard')
        }
      }).catch(err => {
        console.log(err)
      })
    },
    addJobList() {
      if (this.jobListInput) {
        let form = {
          title: this.jobListInput,
          card_id: this.card.id,
        };
        api.addJobList(form).then(res => {
          if(res.status === 200){
            this.jobListInput = 'Việc cần làm'
            this.getJobList();
          }
        }).catch(err => {
          console.log(err)
        })
      }
    },
    pickFile(e) {
      if (e.target.files.length) {
        this.fileData = e.target.files[0];
      }
    },
    addFile() {
      if (this.fileData) {
        const formData = new FormData();
        formData.append("file", this.fileData);

        api.addFile(this.card.id, formData).then(res => {
          if(res.status === 200){
            this.fileData = ''
            this.getFile()
          }
        }).catch(err => {
          if (err.response.status === 422) {
            this.$notify.error({
              title: 'Lỗi tệp',
              message: 'Tệp này không được hỗ trợ!'
            });
          }
          console.log(err)
        })
      } else {
        this.$notify.error({
          title: 'Lỗi tệp',
          message: 'Vui lòng chọn tệp!'
        });
      }
    },
    updateFile(id) {
      if (this.fileNameInput) {
        let form = {
          name: this.fileNameInput,
        };
        api.updateFile(id, form).then(res => {
          if(res.status === 200){
            this.changeFiletEdit('', '')
            this.getFile()
          }
        }).catch(err => {
          console.log(err)
        })
      }
    },
    deleteFile(id) {
      api.deleteFile(id).then(res => {
        if(res.status === 200){
          this.getFile()
        }
      }).catch(err => {
        console.log(err)
      })
    },
    deleteCard() {
      this.$confirm("Bạn có chắc chắn muốn xóa?", "Thông báo", {
        confirmButtonText: "OK",
        cancelButtonText: "Hủy",
        type: "warning",
        center: true,
      }).then(() => {
        api.deleteCard(this.card.id).then(res => {
          if(res.status === 200){
            this.$emit('loadCard')
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
    this.userCards = this.card.users
    this.labels = this.card.labels
    this.jobLists = this.card.job_lists
    this.files = this.card.files
    // this.$root.$on('getLoadUserBoardInCards', (data) => {
    //   for (let i = 0; i < this.card.users.length; i++) {
    //     if (this.card.users[i].id === data) {
    //       this.getUserBoardInCards()
    //     }
    //   }
    // })
  }
}
</script>

<style scoped lang="scss">
.content-tag {
  display: flex;
  flex-wrap: wrap;
  background-color: #fff;
  border-radius: 10px 10px 0 0;
  margin-left: 10px;
  margin-right: 10px;
  padding: 10px;
}
.content-text {
  background-color: #fff;
  margin-left: 10px;
  margin-right: 10px;
  padding-left: 10px;
  padding-right: 10px;
  font-size: 14px;
}
.content-end {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  background-color: #fff;
  border-radius: 0 0 10px 10px;
  margin-bottom: 10px;
  margin-left: 10px;
  margin-right: 10px;
  padding: 10px;
  .content-end-detail {
    border-radius: 5px;
    padding: 5px;
    margin-right: 4px;
    margin-bottom: 4px;
    font-size: 14px;
  }
  .view-user-card {
    margin-right: 5px;
  }
}
</style>

// style dialog
<style scoped>
.left-title {
  font-size: 24px;
}

.right-title {
  margin-left: 13px;
}

.right-title > p {
  font-size: 24px;
  padding-bottom: 5px;
}

.right-title > span {
  font-size: 14px;
  margin-top: 5px;
}

.dialog-container {
  margin-top: 20px;
}

.container-user-tag {
  display: flex;
  flex-wrap: wrap;
  align-items: start;
}

.user-card {
  display: inline-block;
  margin-right: 20px;
}

.user-card-list {
  display: flex;
  flex-wrap: wrap;
}

.user-card-list div {
  display: flex;
  flex-wrap: wrap;
  margin-right: 5px;
  margin-bottom: 5px;
}

.tag-detail {
  display: inline-block;
}

.tag-detail-tag {
  display: flex;
  flex-wrap: wrap;
  align-items: start;
}

.tag-detail-tag div {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  color: white;
  padding: 10px;
  font-size: 14px;
  border-radius: 5px;
  margin-bottom: 5px;
  margin-right: 5px;
  cursor: pointer;
  transition: 0.5s;
}

.title-tag-detail {
  margin-top: 5px;
  margin-bottom: 5px;
  color: gray;
  font-weight: bold;
}

.button-detail-add-tag {
  width: 100%;
  text-align: left;
}

.title-tag-detail-button {
  margin-bottom: 5px;
}

.magin-mission {
  margin-bottom: 10px;
}

.user-board-detach {
  padding: 8px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: .1s;
}

.user-board-detach>div {
  display: flex;
  align-items: center;
}

.user-board-detach span {
  text-overflow: ellipsis;
  overflow: hidden;
  margin-right: 10px;
  white-space: nowrap;
}

.user-board-detach:hover {
  background-color: #f5f6f8;
  cursor: pointer;
}

.tag-content {
  padding: 8px;
  border-radius: 5px;
  display: flex;
  justify-content: space-between;
  color: white;
  margin-bottom: 10px;
}

.tag-content span {
  text-overflow: ellipsis;
  overflow: hidden;
  margin-right: 10px;
  white-space: nowrap;
}

.tag-content:hover {
  opacity: 0.5;
  cursor: pointer;
}

.add-new-card-input {
  width: 100%;
  margin-bottom: 10px;
}

.add-new-card-title {
  font-size: 12px;
  font-weight: bold;
  margin-bottom: 5px;
}

.add-new-card-color-box {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  margin-bottom: 10px;
}

.add-new-card-color-box div {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 35px;
  color: white;
  border-radius: 5px;
  margin-right: 10px;
  margin-bottom: 10px;
}

.add-new-card-color-box div:hover {
  opacity: 0.5;
  cursor: pointer;
}

.date-list {
  margin-top: 10px;
}

.checkbox-date {
  display: flex;
  align-items: center;
}

.checkbox-date div {
  background-color: #eaecf0;
  border-radius: 5px;
  padding: 10px;
  margin-left: 5px;
}

.checkbox-date div span {
  color: white;
  margin: 5px;
  border-radius: 5px;
  padding: 5px;
  font-size: 10px;
}

/* file */
.file-input {
  text-align: center;
  margin-bottom: 15px;
  margin-top: 5px;
}
.file {
  opacity: 0;
  width: 0.1px;
  height: 0.1px;
  position: absolute;
}

.file-input span {
  display: inline-block;
  position: relative;
  width: 200px;
  height: 50px;
  border-radius: 10px;
  background-color: #f5f6f8;
  box-shadow: 0 0 10px 5px #f5f6f8;
  line-height: 50px;
  color: rgb(245, 73, 73);
  font-weight: bold;
  cursor: pointer;
}

.file-input label {
  display: inline-block;
  position: relative;
  width: 200px;
  height: 50px;
  border-radius: 10px;
  background-color: #f5f6f8;
  box-shadow: 0 0 10px 5px #f5f6f8;
  line-height: 50px;
  color: grey;
  font-weight: bold;
  cursor: pointer;
}

.button-file-edit {
  display: flex;
  justify-content: space-between;
}

.file-name {
  outline: none;
  color: black;
  text-decoration: none;
  font-weight: bold;
  font-size: 12px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  cursor: pointer;
  transition: .2s;
}

.file-name:hover {
  border-bottom: 1px solid;
  background: #eaecf0;
}
</style>