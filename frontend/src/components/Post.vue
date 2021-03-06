<template>
  <b-container>
    <b-row>
      <b-col sm="12" offset-md="1" md="10" offset-lg="2" lg="8" class="post mb-4">
        <div class="post-header mb-3">
          <p class="mb-0" align="center">
            <span class="user-name font-weight-bolder" @click="getUsersPosts">
              {{ post.user }}
            </span>
            le {{ post.creationDate }}
          </p>
        </div>
        <b-row v-show="displayModifyPost">
          <b-col cols="8" sm="8=9" md="8" lg="8" align="center">
            <b-form-textarea
              class="text-area"
              rows="3"
              v-model="modifyTextArea"
            ></b-form-textarea>
            <p align="center" class="error-message font-weight-bold mt-2">{{ error }}</p>
          </b-col>
           <b-col cols="4" sm="3" md="2" lg="2" align="center">
            <div
              class="image-input"
              v-b-tooltip.hover
              title="Modifier l'image"
              :style="{ 'background-image': `url(${imageData})` }"
              @click="selectImage"
            >
              <span v-if="!imageData" class="image-area">Ajouter une image</span>
              <input class="file-input" ref="fileInput" type="file" @input="onSelectFile" />
            </div>
          </b-col>
          <b-col cols="12" sm="12" md="2" lg="2" align="center">
            <div class="button-col">
              <b-button pill size="sm" class="mb-3 send-button" @click="modifyPost">Envoyer</b-button>
              <b-button pill size="sm" class="mb-3 reset-button" @click="resetModifyPost">Annuler</b-button>
            </div>
          </b-col>
        </b-row>

        <b-row v-show="!displayModifyPost">
          <b-col cols="12" sm="10" md="12" lg="12" v-show="displayPostImage">
            <div class="post-content pr-2 pl-2">{{ post.content }}</div>
          </b-col>
          <b-col cols="12" sm="10" md="10" lg="10" v-show="!displayPostImage">
            <div class="post-content pr-2 pl-2">{{ post.content }}</div>
          </b-col> 
        </b-row>
         <b-col align="center" cols="12" sm="12" md="12" lg="12" v-show="displayPostImage">
            <div class="post-image">
              <img id="modifyImage" class="image-styling" :src="postImage" alt="Posted image" />
            </div>
          </b-col>
          <b-col cols="12" sm="2" md="2" lg="2">
            <div align="center">
               <b-button-group v-show="displayDropdownButton">
                <b-dropdown variant="outline-danger" size="sm" right text="Editer">
                  <b-dropdown-item v-if="userId === post.userId" @click="displaySwitch">Modifier</b-dropdown-item>
                  <b-dropdown-item
                    v-if="admin || userId === post.userId"
                    @click="deletePost"
                  >Supprimer</b-dropdown-item>
                </b-dropdown>
              </b-button-group>
            </div>
          </b-col>
      </b-col>
    </b-row>
  </b-container>
</template>           

<script>
import { url } from "../main";
export default {
  name: "Post",
  data() {
    return {
      imageData: this.post.image,
      displayModifyPost: false,
      displayDropdownButton: false,
      modifyTextArea: this.post.content,
      uri: "posts/" + this.post.id,
      file: "",
      error: "",
      headers: {
        headers: {
          Authorization: this.token,
          userId: this.userId,
        },
      },
    };
  },
  computed: {
    postImage() {
      //image du post
      return this.post.image;
    },
    body() {
      return {
        content: this.modifyTextArea,
      };
    },
    displayPostImage() {
      if (this.post.image) {
        return true;
      } else {
        return false;
      }
    },
    displayRemoveImage() {
      if (this.imageData) {
        return true;
      } else {
        return false;
      }
    },
  },
  props: {
    post: {
      type: Object,
    },
    userId: {
      type: String,
    },
    token: {
      type: String,
    },
    admin: {
      type: Boolean,
    },
  },
  created() {
    this.switchDropdownButton();
  },
  methods: {
    getUsersPosts() {
      this.$http.get(url + "posts/users/" + this.post.userId, this.headers)
        .then((res) => {
          this.$emit("users-posts", res.data);
          this.$emit("post-by-profile", true);
        });
    },
    selectImage() {
      this.$refs.fileInput.click();
    },
    onSelectFile() {
      const input = this.$refs.fileInput;
      const files = input.files;
      if (files && files[0]) {
        const reader = new FileReader();
        reader.onload = (event) => {
          this.imageData = event.target.result;
        };
        reader.readAsDataURL(files[0]);
        this.file = this.$refs.fileInput.files[0];
      }
    },
    removeImage() {
      this.file = "delete";
      this.imageData = "";
    },
    
    switchDropdownButton() {
      if (this.admin === true || this.userId === this.post.userId) {
        this.displayDropdownButton = !this.displayDropdownButton;
      }
    },
    displaySwitch() {
      (this.displayModifyPost = !this.displayModifyPost),
        (this.displayDropdownButton = !this.displayDropdownButton);
    },
    getOnePost() {
      this.$http.get(url + "posts/" + this.post.id, this.headers)
        .then((res) => {
          this.modifyTextArea = res.data.content;
        });
    },
    deletePost() {
      this.$http.delete(url + this.uri, this.headers)
        .then(() => {
          this.$parent.getPosts();
        })
        .catch(() => {
          this.error = "Un problème est survenu, veuillez réessayer";
        });
    },
    sendModifyPost(data) {
      this.$http.put(url + this.uri, data, this.headers)
        .then(() => {
          this.$parent.getPosts();
          this.$refs.fileInput.value = "";
          this.displaySwitch();
        })
        .catch(() => {
          this.error = "Un problème est survenu, veuillez réessayer";
        });
    },
    modifyPost() {
      if (
        (this.file === "delete" || this.file === "") &&
        this.body.content === ""
      ) {
        this.deletePost();
      } else if (this.file === "delete") {
        let formData = new FormData();
        formData.append("image", "delete");
        formData.append("content", this.body.content);
        this.sendModifyPost(formData);
      } else {
        let formData = new FormData();
        formData.append("image", this.file);
        formData.append("content", this.body.content);
        this.sendModifyPost(formData);
      }
    },
    resetModifyPost() {
      this.imageData = this.post.image;
      this.getOnePost();
      this.displaySwitch();
    },
  },
};
</script>

<style scoped>
.post {
  padding-right: 0;
  padding-left: 0;
}

.post-content {
  padding-bottom: 10px;
  word-wrap: break-word;
}

.post-header {
  line-height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #B7B7BD;
  font-size: 16px;
  border-radius : 15px 15px 0 0;
  white-space: pre-wrap; 
}

.user-name {
  cursor: pointer;
}

.text-area {
  resize: none;
  border: 1px solid #F73708;
}

.text-area:focus {
  outline: none !important;
  border: 1px solid #F73708;
}

.send-button {
  background-color: #992930;
  color: #FFFFFF;
  border: solid 1px #F73708;
}

.send-button:hover {
  background: #030176;
}

.reset-button {
  background-color: transparent;
  border: solid 1px #F73708;
  color:#e42701;
}

.reset-button:hover {
  background: #030176;
  color : #FFFFFF;
}

.button-col {
  display: flex;
  flex-direction: column;
}

.error-message {
  color: #F73708;
}

.post-image {
  max-width: 250px;
  max-height: 300px;
}

.image-styling {
  height: 100%;
  width: 100%;
  object-fit: cover;
}

.image-input {
  display: block;
  width: 100px;
  height: 80px;
  cursor: pointer;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center center;
}

.image-input:hover {
  opacity: 0.5;
}

.image-area {
  background: #030176;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #FFFFFF;
  font-size: 16px;
  text-align: center;
  border: solid 1px #fd2d01;
  border-radius: 5px;
}

.image-area:hover {
  background: #B7B7BD;
  color : #000000;
  font-weight : bolder;
}

.file-input {
  display: none;
}

@media screen and (max-width: 767px) {
  .post-image {
    max-width: 200px;
    max-height: 200px;
  }
  .button-col {
    flex-direction: row-reverse;
    justify-content: space-evenly;
    margin-top: 16px;
  }
}

@media screen and (max-width: 560px) { 
  .post-header {
    font-size: 14px;
  }
  .post-content {    
    text-align: center;
  }
  .post-image {
    margin-bottom: 24px;
  }
  .button-col {
    margin-top: 16px;
  }
}

@media screen and (max-width: 440px) {
  .post-image {
    max-width: 200px;
    max-height: 250px;
  }
  .post-content {
    font-size: 14px;
  }
  .post-header {
    font-size: 13px;
  }
}
</style>