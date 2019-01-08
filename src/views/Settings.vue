<template>
  <div class="container justify-content-center">
    <div v-if="alert" class="alert alert-success" role="alert">{{alert}}</div>
    <change-pass-modal
      @confirm="changePassword()"
      title="Change Password"
      :confirmation="oldPass&&newPass&&newPass2?'change':null"
      modalId="changePass"
    >
      <form class="text-left">
        <div class="form-group">
          <label for="exampleInputPassword1">Old Password</label>
          <input
            type="password"
            v-model="oldPass"
            class="form-control"
            id="exampleInputPassword1"
            placeholder="Password"
          >
        </div>
        <div class="form-group">
          <label for="exampleInputPassword2">New Password</label>
          <input
            type="password"
            class="form-control"
            v-model="newPass"
            id="exampleInputPassword2"
            placeholder="New Password"
          >
        </div>
        <div class="form-group">
          <input type="password" v-model="newPass2" class="form-control" placeholder="Enter Again">
        </div>
        <p class="text-danger">{{warning2}}</p>
      </form>
    </change-pass-modal>
    <change-phone-modal
      title="New Phone No."
      @confirm="changePhone()"
      :confirmation="warning3===true?'Confirm':null"
      modalId="changePhone"
    >
      <div class="input-group">
        <div class="input-group-prepend">
          <span class="input-group-text">+880</span>
        </div>
        <input type="text" v-model="newPhone" class="form-control">
      </div>
      <p v-if="warning3!==true" class="text-danger">{{warning3}}</p>
    </change-phone-modal>
    <erase-modal
      title="Erase Everything?"
      :confirmation="erasePass.length>5?'ERASE':null "
      modalId="erase"
      @confirm="eraseAll()"
    >
      <div class="form-group">
        <label for="exampleInputPassword3">Enter Password to continue</label>
        <input
          type="password"
          class="form-control"
          v-model="erasePass"
          id="exampleInputPassword3"
          placeholder="Password"
        >
      </div>
    </erase-modal>
    <Accordion @clicked="logOut()" :rows="isApproved?4:2">
      <span slot="slotHeader1">
        <i class="fas fa-plus-circle"></i>
        Add/Remove {{clientType}}
      </span>
      <form slot="slot1">
        <div class="row">
          <div class="col pl-0 pr-1">
            <input
              type="text"
              v-model="clientName"
              class="form-control mx-0"
              :placeholder="clientType+' Name'"
              required
            >
          </div>
          <div class="col pr-0 pl-1">
            <input
              type="text"
              v-model="clientArea"
              class="form-control mx-0"
              placeholder="Area Name"
              required
            >
          </div>
        </div>
        <p class="text-danger w-100 text-center">{{warning}}</p>
        <div class="row">
          <button
            v-if="isApproved"
            type="submit"
            @click.prevent="addClient"
            class="btn btn-info my-2 mx-auto"
          >Add</button>
        </div>
        <table class="table">
          <tbody>
            <tr :key="index" v-for="(element, index) in clients">
              <th>{{index+1}}</th>
              <th class="text-truncate" scope="row">{{element.name}}</th>
              <td>{{element.area}}</td>
              <td>
                <span
                  class="btn btn-outline-danger btn-sm"
                  style="font-size:16px; height: 25px; line-height: 16px"
                  @click="deleteClient(element.id, index)"
                >&times;</span>
              </td>
            </tr>
          </tbody>
        </table>
      </form>
      <span slot="slotHeader2">
        <i class="fas fa-info-circle"></i>Edit account info
      </span>
      <div slot="slot2" class="list-group">
        <a
          @click.prevent
          data-toggle="modal"
          data-target="#changePass"
          class="list-group-item list-group-item-action"
        >
          <i class="fas fa-unlock-alt mr-2"></i>Change Password
        </a>
        <a
          @click.prevent
          data-toggle="modal"
          data-target="#changePhone"
          class="list-group-item list-group-item-action"
        >
          <i class="fas fa-mobile-alt mr-2"></i>Change mobile no.
        </a>
        
        <a
          @click.prevent
          data-toggle="modal"
          data-target="#erase"
          class="list-group-item list-group-item-action"
        >
          <i class="fas fa-power-off mr-2 text-danger"></i>Reset all
        </a>
      </div>
      <span slot="slotHeader3">
        <i class="fas fa-user-plus"></i>Approve user
      </span>
      <table slot="slot3" class="table">
        <tbody>
          <tr :key="index" v-for="(element, index) in unApproved">
            <th class="text-left text-truncate" scope="row">
              <p class="mb-0">{{element.name}}</p>
              <small>{{element.area}}</small>
            </th>
            <td>{{element.post}}</td>
            <td>
              <span
                class="btn btn-outline-success btn-sm mx-2"
                style="font-size:16px; height: 25px; line-height: 16px"
                @click="confirmApproval(element.id, index)"
              >
                <i class="fas fa-check"></i>
              </span>
              <span
                class="btn btn-outline-danger btn-sm mx-2"
                style="font-size:16px; height: 25px; line-height: 16px"
                @click="deleteApproval(element.id, index)"
              >&times;</span>
            </td>
          </tr>
        </tbody>
        <p v-if="!unApproved[0]">No users left unapproved</p>
      </table>
      <span slot="slotHeader4">
        <i class="fas fa-user-check text-success"></i>Approved users
      </span>
      <table slot="slot4" class="table">
        <tbody>
          <tr :key="index" v-for="(element, index) in approved">
            <th>{{index+1}}</th>
            <th class="text-truncate text-left" scope="row">
              <p class="mb-0">{{element.name}}</p>
              <small>{{element.area}}</small>
            </th>
            <td>{{element.post}}</td>
          </tr>
        </tbody>
        <p v-if="!approved[0]">No Approved users available</p>
      </table>
      <span slot="bttn">
        <i class="fas fa-sign-out-alt text-danger"></i>
        Sign Out
      </span>
    </Accordion>

    <Loader v-if="loading"/>
  </div>
</template>

<script>
import firebase from "firebase";
import { mapGetters, mapActions } from "vuex";
import Accordion from "@/components/Accordion";
import changePassModal from "@/components/Modal2.vue";
import changePhoneModal from "@/components/Modal2.vue";
import eraseModal from "@/components/Modal2.vue";
import db from "@/components/firebaseInit.js";
import Loader from "@/components/Loader.vue";
export default {
  components: {
    Loader,
    changePassModal,
    changePhoneModal,
    eraseModal,
    Accordion
  },
  data() {
    return {
      newPhone: null,
      oldPass: null,
      newPass: null,
      newPass2: null,
      clientName: null,
      erasePass: "",
      clientArea: null,
      warning: null,
      warning2: null,
      warning3: null,
      alert: "",
      clients: [],
      unApproved: [],
      approved: []
    };
  },
  computed: {
    ...mapGetters(["userInfo", "clientType", "loading", "isApproved"])
  },
  methods: {
    ...mapActions(["loadOn", "loadOff"]),
    confirmApproval(id, index) {
      db.collection("user")
        .doc(id)
        .update({
          approved: true
        })
        .then(() => {
          this.alert = "user Approved";
          const user = this.unApproved.slice(index, 1);
          this.approved.push(user[0]);
          this.unApproved.splice(index, 1);
        })
        .catch(err => alert(err));
    },
    deleteApproval(id, index) {
      db.collection("user")
        .doc(id)
        .delete()
        .then(() => {
          this.unApproved.splice(index, 1);
          firebase
            .storage()
            .ref()
            .child("user-profile/" + id + ".jpg")
            .delete()
            .then(() => {
              this.alert = "profile deleted";
            })
            .catch(err => (this.alert = err));
        })
        .catch(err => alert(err));
    },
    eraseCollection(name, fieldKey) {
      db.collection(name)
        .where(fieldKey, "==", this.userInfo.id)
        .get()
        .then(querySnapshot => {
          var batch = db.batch();
          querySnapshot.forEach(function(doc) {
            batch.delete(doc.ref);
          });
          return batch.commit();
        })
        .then(() => {
          this.alert = "Erased";
          this.loadOff();
        })
        .catch(err => {
          this.loadOff();
          alert(err);
        });
    },
    eraseAll() {
      this.validateUser(() => {
        this.eraseCollection(this.clientType, "ref");
        this.eraseCollection("transactions", "refId");
        this.eraseCollection("payments", "refId");
      }, this.erasePass);
    },
    changePhone() {
      db.collection("user")
        .doc(this.userInfo.id)
        .update({
          phone: Number(this.newPhone)
        })
        .then(() => (this.alert = "Phone No. updated"))
        .catch(errr => alert(err));
    },
    changePassword() {
      if (this.newPass == this.newPass2) {
        this.warning2 = null;
        this.validateUser(() => {
          firebase
            .auth()
            .currentUser.updatePassword(this.newPass)
            .then(() => {
              this.alert = "Updated password successfully";
              this.loadOff();
            })
            .catch(err => {
              alert(err);
              this.loadOff();
            });
        }, this.oldPass);
      } else {
        this.warning2 = "Passwords don't match";
      }
    },
    validateUser(callback, password) {
      this.loadOn();
      const credential = firebase.auth.EmailAuthProvider.credential(
        this.userInfo.email,
        password
      );
      firebase
        .auth()
        .currentUser.reauthenticateAndRetrieveDataWithCredential(credential)
        .then(promise => {
          callback();
        })
        .catch(err => {
          this.loadOff();
          alert(err);
        });
    },
    logOut() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.$router.push("/login");
        });
    },
    addClient() {
      if (this.clientName && this.clientArea) {
        this.loadOn();
        db.collection(this.clientType)
          .where("name", "==", this.clientName)
          .where("ref", "==", this.userInfo.id)
          .get()
          .then(querySnapshot => {
            if (querySnapshot.size) {
              this.warning = this.clientType + " already Exists";
              this.loadOff();
            } else {
              db.collection(this.clientType)
                .doc()
                .set({
                  name: this.clientName,
                  area: this.clientArea,
                  ref: this.userInfo.id
                })
                .then(() => {
                  console.log("done");
                  this.warning = "";
                  this.clientName = null;
                  this.clientArea = null;
                  this.updateClients();
                  this.loadOff();
                })
                .catch(err => alert(err));
            }
            this.loadOff();
          });
      } else {
        this.loadOff();
        this.warning = "Insert Name and Area";
      }
    },
    deleteClient(id, index) {
      db.collection(this.clientType)
        .doc(id)
        .delete()
        .then(() => {
          this.clients.splice(index, 1);
        })
        .catch(err => alert(err));
    },
    updateClients() {
      this.clients = [];
      db.collection(this.clientType)
        .where("ref", "==", this.userInfo.id)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            this.clients.push({
              name: doc.data().name,
              area: doc.data().area,
              id: doc.id
            });
          });
        })
        .catch(err => alert(err));
    }
  },
  watch: {
    newPhone() {
      const n = Number(this.newPhone);
      const str = String(n);
      const l = str.length;
      if ((n == NaN || Number(str[0]) != 1) && l > 9) {
        this.warning3 = "Enter a valid Phone No.";
      } else if (l == 10) {
        this.warning3 = true;
      } else {
        this.warning3 = null;
      }
    },
    newPass2() {
      if (this.newPass != this.newPass2)
        this.warning2 = "passwords don't match";
      else this.warning2 = "";
    },
    alert() {
      setTimeout(() => {
        this.alert = "";
      }, 4000);
    }
  },
  created() {
    db.collection(this.clientType)
      .where("ref", "==", this.userInfo.id)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          this.clients.push({
            name: doc.data().name,
            area: doc.data().area,
            id: doc.id
          });
        });
      })
      .catch(err => alert(err));
    db.collection("user")
      .where("refId", "==", this.userInfo.id)
      .where("approved", "==", false)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          this.unApproved.push({
            id: doc.id,
            name: doc.data().name,
            post: doc.data().post,
            area: doc.data().area
          });
        });
      });
    db.collection("user")
      .where("refId", "==", this.userInfo.id)
      .where("approved", "==", true)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          this.approved.push({
            id: doc.id,
            name: doc.data().name,
            post: doc.data().post,
            area: doc.data().area
          });
        });
      });
  }
};
</script>

<style lang="scss" scoped>
div.container {
  margin-top: 80px;
  button {
    text-align: left;
    font-size: 16px;
    i {
      font-size: 20px;
      margin: 5px;
      margin-right: 10px;
      transform: translateY(3px);
    }
  }
}
</style>
