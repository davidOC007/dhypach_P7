<template>
  <b-container>
    <b-row align-h="center">
      <b-col class="text-center" sm="10" lg="8">
        <router-link to="/login">
          <img class="logogroupo" src="../assets/images/logo-name-blue-left.svg" alt="Logo Groupomania" />
        </router-link>
        
        <h2>Inscrivez-vous</h2>
      </b-col>
    </b-row>
    <b-row align-h="center">
      <b-col cols="12" sm="10" md="10" lg="8">
        <b-row>
          <b-col cols="12" offset-sm="1" sm="10" offset-md="1" md="10" offset-lg="2" lg="8">
            <b-card class="datacard">
              <div align="center">
                <b-form>
                  <label for="pseudo">Pseudo</label>
                  <b-form-input
                    class="mb-3 input"
                    v-model="pseudo"
                    maxlength="15"
                    @input="lengthCkeck(15, pseudo, 'pseudo')"
                    required
                    @keyup.enter="signup"
                  ></b-form-input>

                  <label for="email-adress">Adresse email</label>
                  <b-form-input 
                    class="mb-3 input"
                    v-model="email"
                    type="email"
                    maxlength="30"
                    @input="lengthCkeck(30, email, 'email')"
                    required
                    @keyup.enter="signup"
                  ></b-form-input>

                  <label for="password">Mot de passe</label>
                  <b-form-input
                    class="input"
                    v-model="password"
                    type="password"
                    maxlength="15"
                    @input="lengthCkeck(15, password, 'mot de passe')"
                    required
                    @keyup.enter="signup"
                  ></b-form-input>
                </b-form>
                
                <b-row class="mt-4">
          <b-col align="center" cols="12" offset-sm="1" sm="6" offset-md="2" md="5" offset-lg="2" lg="5">
                
          </b-col>
          <b-col align="center" class="mb-3" cols="12" sm="4" md="3" lg="3">
            <b-button pill class="submit-button" type="submit" @click="signup">Inscription</b-button> 
          </b-col>
          
        </b-row>
              </div>
            </b-card>
            <router-link to="/login">Connexion si vous avez déjà un compte</router-link>
            <p class="error-message text-center mt-2">{{ error }}</p>
          </b-col>
        </b-row>
        <b-row class="mt-2">
          <b-col align="center" cols="12" offset-sm="1" sm="6" offset-md="2" md="5" offset-lg="2" lg="5">
               
          </b-col>
        </b-row>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { url } from "../main";

export default {
  name: "Signup",
  data() {
    return {
      email: "",
      pseudo: "",
      password: "",
      show: true,
      error: "",
      pseudoRegex: /^[a-zA-Z0-9]{3,}$/,
      emailRegex: /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/,
      passwordRegex: /^(?=.*[a-z])(?=.*[0-9])(?=.{8,})/,
    };
  },
  methods: {
    lengthCkeck(length, object, message) {
      if (object.length === length) {
        this.error = "Votre " + message + " est trop long";
      } else {
        this.error = "";
      }
    },
    
    signup() {
      let newUser = {
        pseudo: this.pseudo,
        email: this.email,
        password: this.password,    
      };
      if (!this.emailRegex.test(this.email)) {
        return (this.error = "Vous devez renseigner une adresse email valide");
      } else if (!this.pseudoRegex.test(this.pseudo)) {
        return (this.error =
          "Votre pseudo doit contenir au moins 3 caractères");
      } else if (!this.passwordRegex.test(this.password)) {
        return (this.error =
          "Votre mot de passe doit contenir au moins 8 caractères et au moins 1 lettre et 1 chiffre");
      }
      this.$http.post(url + "users", newUser)
        .then((res) => {
          if (res.status === 200) {
            this.$http.post(url + "users/login", newUser)
              .then((res) => {
                if (res.status === 200) {
                  localStorage.setItem("currentUser", JSON.stringify(res.data));
                  this.$router.push("/");
                }
              })
              .catch(() => {
                localStorage.clear();
                this.error = "Echec de la tentative, essayer de nouveau";
              });
          }
        })
        .catch((err) => {
          if (err.response.status === 409) {
            this.error = "Adresse email déjà utilisée";
          } else {
            this.error = "Echec de la tentative, essayer de nouveau";
          }
        });
    },
  },
};
</script>

<style scoped>

h2 {
  font-size: 22px;
  color :#992930;
}

.datacard {
  background-color: #B7B7BD;
  border : solid black 1px;
  color : #030176;
}

.submit-button {
  background-color: #992930;
  color: #FFFFFF;
}

.submit-button:hover {
  background: #F73708;
}

.logogroupo {
  height: 100px;
}

.error-message {
  color: #F73708;
}

.input {
  width: 300px;
}

.input:hover {
  border: solid 1px #F73708;
}

@media screen and (max-width: 870px) {

  .logogroupo {
    height: 100px;
  }

}

@media screen and (max-width: 560px) {

  .logogroupo {
    height: 90px;
  }

}

</style>