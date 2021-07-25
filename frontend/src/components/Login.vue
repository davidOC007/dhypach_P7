<template>
  <b-container>
    <b-row align-h="center">
      <b-col class="text-center" sm="10" lg="8">
        <img class="logogroupo" src="../assets/images/logo-name-blue-left.svg" alt="Logo de Groupomania" />
        
        <h2>Connectez-vous</h2>
      </b-col>
    </b-row>
    <b-row align-h="center">
      <b-col cols="12" sm="10" md="10" lg="8">
        <b-row>
          <b-col cols="12" offset-sm="1" sm="10" offset-md="2" md="8" offset-lg="2" lg="8">
            <b-card align="center" class="datacard">
              <div align="center">
                <b-form>
                  <label for="email-adress">Adresse email</label>
                  <b-form-input
                    class="mb-3 input"
                    v-model="email"
                    type="email"
                    required
                    @keyup.enter="login"
                  ></b-form-input>

                  <label for="password">Mot de passe</label>
                  <b-form-input
                    class="input"
                    v-model="password"
                    type="password"
                    required   
                    @keyup.enter="login"
                  ></b-form-input>
                </b-form>
                
                <b-row class="mt-4">
          <b-col align="center" cols="12" offset-sm="1" sm="6" offset-md="2" md="5" offset-lg="2" lg="5">
                
          </b-col>
          <b-col align="center" class="mb-3" cols="12" sm="4" md="3" lg="3">
            <b-button pill class="submit-button" type="submit" @click="login">Connexion</b-button>
          </b-col>
          
        </b-row>
              </div>
            </b-card>
            <router-link to="/signup">Inscription si vous n'avez pas encore de compte</router-link>
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
  name: "Login",
  data() {
    return {
      email: "", 
      password: "",
      error: "",
    };
  },
  methods: {
    login() {
      const user = {
        email: this.email,
        password: this.password,
      };
      this.$http.post(url + "users/login", user)
        .then((res) => {
          if (res.status === 200) {
            localStorage.setItem("currentUser", JSON.stringify(res.data));
            this.$router.push("/");
          }
        })
        .catch((err) => {
          localStorage.clear();
          if (err.response.status === 401) {
            this.error =
              "Connexion impossible. Vérifiez vos identifiants.";
          } else {
            this.error = "Echec de la tentative, essayez de nouveau";
          }
        });
    },
  },
};
</script>

<style scoped>

h2 {
  font-size: 22px;
  color : #992930;
}

.datacard {
  background-color: #B7B7BD;
  border : solid black 1px;
  color : #030176;
}

.logogroupo {
  height: 100px;
}


.submit-button {
  background-color: #992930;
  color: #FFFFFF;
  
}

.submit-button:hover {
  background: #F73708;
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