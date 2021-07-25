<template>
  <b-container display="flex">
    <Header @display-profile="switchDisplayProfile" :displayProfile="displayProfile" />
    <Profile
      @display-profile="switchDisplayProfile"
      v-show="displayProfile"
      :userId="userId"
      :token="token"
      :displayProfile="displayProfile"
    />

    <div v-show="!displayPostByProfile">
      <b-row class="mb-2" v-show="!displayProfile">
       <p class="pb-4 welcome">Bienvenue sur votre réseau social d'entreprise</p>
        <b-col cols="8" sm="9" md="9" lg="10">
          <b-form-textarea
            id="textarea-rows"
            placeholder="Votre post..."
            rows="3"
            class="text-area"
            v-model="postTextArea"
          ></b-form-textarea>
          <p class="error-message text-center mt-2">{{ postError }}</p>
        </b-col>
        
         <b-col cols="4" sm="3" md="2" lg="2" align="center">
          <div
            class="image-input"
            :style="{ 'background-image': `url(${imageData})` }"
            @click="selectImage"
          >
            <span v-if="!imageData" class="image-area">Ajouter une image</span>
            <input type="file" class="file-input" ref="file" @input="onSelectFile" />
          </div>
          <a
            @click="removeImage"
            v-show="displayRemoveImage"
            class="remove-image"
            href="#"
            style="display: inline"
          >&#215;</a>
        </b-col>
        <b-col cols="12" sm="12" md="2" lg="2" align="center">
          <div class="button-col">
            <b-button pill size="sm" class="mb-3 publish-btn" 
            @click="createPost">Publier</b-button>
            <b-button pill size="sm" class="mb-3 noUpdate-btn"
            @click="resetPost">Annuler</b-button>
          </div>
        </b-col>
        <b-col align-h="center">
          <h2>Derniers posts...</h2>
        </b-col>
        </b-row> 
    </div>

    <b-row v-show="displayPostByProfile" class="mb-4">
      <b-col align="center" offset-lg="2" lg="3">
        
      </b-col>
      <b-col align="center" lg="3">
        <h1>Les posts de {{ userName }}</h1>
        <p>{{ userEmail }}</p>
        <div>
          <b-button
            pill
            size="sm"
            class="back-button"
            @click="
              switchDisplayPostByProfile(false);
              getPosts();
            "
          >Retour vers le forum</b-button>
        </div>
      </b-col>
    </b-row>

    <b-row v-for="postData in posts" :key="postData.id" v-show="!displayProfile">
      <b-col>
        <Post
          @users-posts="usersPosts"
          @post-by-profile="switchDisplayPostByProfile"
          :post="postData"
          :admin="admin"
          :userId="userId"
          :token="token"
        ></Post>
      </b-col>
    </b-row>
  </b-container>
</template>
 
<script>
import Header from "./Header.vue";
import Post from "./Post.vue";
import Profile from "./Profile.vue";
import { url } from "../main";
export default {
  name: "Forum",
  components: {
    Header,
    Post,
    Profile,
  },
  data() {
    return {
      postError: "",
      userName: "",
      userEmail: "",
      displayPostByProfile: false,
      imageData: null,
      displayProfile: false,
      posts: [],
      users: [],
      token: "",
      userId: "",
      admin: false,
      error: {},
      postTextArea: "",
      file: "",
    };
  },
  watch: {
    posts() {
      if (this.posts !== "undefined" && this.posts.length > 0) {
        
        this.userName = this.posts[0].user;
        if (this.posts[0].email.startsWith("ancien compte")) {
          this.userEmail = "";
        } else {
          this.userEmail = this.posts[0].email;
        }
      }
    },
    displayProfile() {
      if (this.displayProfile === true) {
        this.displayPostByProfile = false;
      }
    },
  },
  computed: {
    headers() {
      return { headers: { Authorization: this.token, userId: this.userId } };
    },
   
  },
  
  created() {
    this.getUser();
  },
  
  mounted() {
    this.getPosts();
  },
  methods: {
    removeImage() {
      this.file = "";
      this.imageData = null;
    },
    selectImage() {
      this.$refs.file.click();
    },
    onSelectFile() {
      const input = this.$refs.file;
      const files = input.files;
      if (files && files[0]) {
        const reader = new FileReader();
        reader.onload = (event) => {
          this.imageData = event.target.result;
        };
        reader.readAsDataURL(files[0]);
        this.file = this.$refs.file.files[0];
      }
    },
    createPost() {
      if (!this.postTextArea && !this.imageData) {
        this.postError = "Veuillez écrire quelque chose ou ajouter une image";
        setTimeout(() => {
          this.postError = "";
        }, 3000);
        return;
      }
      let formData = new FormData();
      formData.append("image", this.file);
      formData.append("content", this.postTextArea);
      formData.append("user_id", this.userId);
      this.$http.post(url + "posts", formData, this.headers)
        .then(() => {
          this.resetPost();
          this.getPosts();
        })
        .catch(() => {
          this.postError = "Echec de la tentative, essayer de nouveau";
        });
    },
    getPosts() {
      this.$http.get(url + "posts", this.headers).then((res) => {
        this.posts = res.data;
      });
    },
    usersPosts(data) {
      this.posts = data;
    },
    switchDisplayPostByProfile(data) {
      this.displayPostByProfile = data;
    },
    switchDisplayProfile(data) {
      this.displayProfile = data;
    },
    getUser() {
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      if (currentUser) {
        this.token = currentUser.token;
        this.userId = currentUser.userId;
        this.$http.get(url + "users/" + currentUser.userId, this.headers)
          .then((res) => {
            this.admin = res.data.admin;
          })
          .catch(() => {
            this.$router.push("/login");
          });
      } else {
        this.$router.push("/login");
      }
    },
    resetPost() {
      this.imageData = null;
      this.file = "";
      this.postTextArea = "";
      this.$refs.file.value = "";
    },
  },
};
</script>

<style scoped>

.welcome {
  font-size : 22px;
  color : #992930;
}

h2 {
  color : #992930;
}

.text-area {
  resize: none;
  border: 1px solid;
}

.text-area:focus {
  border: 1px solid #F73708;
}

.publish-btn {
  background-color: #992930;
  color: #FFFFFF;
}
.publish-btn:hover {
  background: #030176;
}

.noUpdate-btn {
  background-color: transparent;
  border: solid 1px #F73708;
  color: #F73708;
}

.noUpdate-btn:hover {
  background: #030176;
  color : #FFFFFF;
}

.button-col {
  display: flex;
  width: 110px;
  flex-direction: column;
}

.error-message {
  color: #F73708;
}

.image-input {
  width: 90px;
  height: 90px;
  cursor: pointer;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center center;
}

.image-area {
  background: #030176;
  width: 100px;
  height: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #FFFFFF;
  font-size: 14px;
  text-align: center;
  border: solid 1px #F73708;
  border-radius: 5px;
}

.image-area:hover {
  background: #B7B7BD;
  color : #000000;
}

.file-input {
  display: none;
}

.back-button {
  background-color: #992930;
  color: #FFFFFF;
}

.back-button:hover {
  background: #030176;
  color : #FFFFFF;
}

@media screen and (max-width: 767px) {
  
  .button-col {
    flex-direction: row-reverse;
    justify-content: space-evenly;
    width: auto;
  }
}

@media screen and (max-width: 560px) {
  
  .welcome {
    margin-left : 5px;
  }
  h1 {
    font-size: 32px;
  }
}
</style>