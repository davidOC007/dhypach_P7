<template>
  <b-container>
    <b-row align-h="center">
      <b-col lg="8">
        <h1 align="center" class="mb-4">Changer mes identifiants</h1>
        <b-row>
          <b-col cols="12" offset-sm="1" sm="10" offset-md="2" md="8" offset-lg="2" lg="8">
            <b-card class="datacard">
              

              <!--Formulaire-->
              <div align="center">
                <label for="pseudo">Pseudo (20 caractères max)</label>
                <b-form-input
                  class="mb-3 input"
                  v-model="user.pseudo"
                  maxlength="20"
                  @input="lengthCheck(20, user.pseudo, 'pseudo')"
                ></b-form-input>
                <label for="email-adress">Adresse email</label>
                <b-form-input
                  class="mb-3 input"
                  v-model="user.email"
                  type="email"
                  maxlength="30"
                  @input="lengthCheck(30, user.email, 'email')"
                ></b-form-input>
              </div>
              
              
            </b-card>
            <p class="error-message text-center mt-2">{{ error }}</p>
          </b-col>
        </b-row>
        <b-row class="mt-4" align="center">
          <b-col offset="1" cols="5" offset-sm="3" sm="3" offset-md="3" md="3" offset-lg="3" lg="3">
            <div>
              <b-button pill @click="noUpdate" class="ml-3 noUpdate-btn">Annuler</b-button>
            </div>
          </b-col>
          <b-col cols="5" sm="3" md="3" lg="3">
            <div>
              <b-button pill @click="modifyUser" class="send-button">Modifier</b-button>
            </div>
          </b-col>
        </b-row>
        <b-row>
          <b-col offset="3" cols="6">
            <div class="mt-4" align="center">
              <b-button
                pill
                size="sm"
                class="mb-3 delete-button"
                @click="deleteUser"
              >Supprimer mon profil</b-button>
            </div>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
  </b-container>
</template>
 
<script>
import { url } from "../main";

export default {
  name: "Profile",
  data() {
    return {
      displayModifyPassword: true,
      imageData: "",
      password: "",
      user: {},
      uri: "users/" + this.userId,
      file: "",
      error: "",
      pseudoRegex: /^[a-zA-Z0-9]{3,}$/,
      emailRegex: /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/,
      passwordRegex: /^(?=.*[a-z])(?=.*[0-9])(?=.{8,})/,
      headers: {
        headers: {
          Authorization: this.token,
          userId: this.userId,
        },
      },
    };
  },
  props: {
    userId: {
      type: String,
    },
    displayProfile: {
      type: Boolean,
    },
    token: {
      type: String,
    },
  },
  created() {
    this.getUser();
  },
  watch: {
    error() {
      setTimeout(() => {
          this.error = "";
        }, 3000);
    }
  },
  computed: {
    body() {
      if (this.password === "" || this.password === null) {
        return {
          pseudo: this.user.pseudo,
          email: this.user.email,
        };
      } else {
        return {
          pseudo: this.user.pseudo,
          email: this.user.email,
          password: this.password,
        };
      }
    },
  },
  
  methods: {
    lengthCheck(length, object, message) {
      if (object.length === length) {
        this.error = "Votre " + message + " est trop long";
      } else {
        this.error = "";
      }
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
    switchDisplayProfile() {
      //dès que clic sur modifier ou anuler retour au forum
      let emitDisplayProfile = !this.displayProfile;
      this.$emit("display-profile", emitDisplayProfile);
    },
    
    getUser() {
      this.$http.get(url + "users/" + this.userId, this.headers).then((res) => {
        this.user = res.data;
        this.imageData = res.data.profilePicture;
      });
    },
    modifyUser() {
      if (!this.emailRegex.test(this.body.email)) {
        return (this.error = "Vous devez renseigner une adresse email valide");
      } else if (!this.pseudoRegex.test(this.body.pseudo)) {
        return (this.error =
          "Votre pseudo doit contenir au moins 3 caractères");
      } else if (this.body.password) {
          if (!this.passwordRegex.test(this.password)){
            return (this.error =
          "Votre mot de passe doit contenir au moins 8 caractères et au moins 1 lettre et 1 chiffre");
        }
      }
        
      let formData = new FormData();
      
      formData.append("pseudo", this.body.pseudo);
      formData.append("email", this.body.email);
      formData.append("user_id", this.userId);
      if (this.body.password) {
        formData.append("password", this.body.password);
      }
      this.$http.put(url + this.uri, formData, this.headers)
        .then(() => {
          this.$parent.getPosts();
          this.switchDisplayProfile();
          this.$refs.fileInput.value = "";
        })
        .catch(() => {
          this.error = "Un problème est survenu, veuillez réessayer";
        });
    },
    noUpdate() {
      this.getUser();
      
     
    },
    deleteUser() {
      let deleteConfirm = confirm(
        //apparition de la fenêtre
        "Cette action est irréversible, toutes vos données seront supprimées"
      );
      if (deleteConfirm) {
        this.$http.delete(url + this.uri, this.headers)
          .then(() => {
            this.logout();
          })
          .catch(() => {
            this.error = "Un problème est survenu, veuillez réessayer";
          });
      }
    },
    logout() {
      localStorage.clear();
      this.$router.push("/login");
    },
  },
};
</script>

<style scoped>
.datacard {
  background-color: #B7B7BD;
  border : solid black 1px;
  color : #030176;
}

.send-button {
  background-color: #992930;
  color: #FFFFFF;
  
}
.send-button:hover {
  background-color: #F73708;
}
.noUpdate-btn {
  background-color: transparent;
  border: solid 1px #F73708;
  color: #F73708;
}
.noUpdate-btn:hover {
  background: #F73708;
  color: #FFFFFF;
}
.delete-button {
  background-color: #B7B7BD;
  border: solid black 1px;
  color:  #000000;
}
.delete-button:hover {
  background: #F73708;
  color : #FFFFFF;
}
.error-message {
  color: #F73708;
}

.file-input {
  display: none;
}
.input {
  width: 300px;
}
.input:hover {
  border: solid 1px #F73708;

}
@media screen and (max-width: 870px) {
  
  h1 {
    font-size: 32px;
  }
 
  .input {
    width: 300px;
  }
}
@media screen and (max-width: 560px) {
  h1 {
    font-size: 24px;
  }
 
  .input {
    width: 250px;
  }
}
@media screen and (max-width: 440px) {
  .input {
    width: 200px;
  }
}
</style>