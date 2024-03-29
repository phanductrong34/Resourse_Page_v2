<template>
  <teleport to="#modal">
    <transition name="fadeModal" appear>
      <div v-if="showModal" class="modal-back" @click="closeUpdateModal"></div>
    </transition>
    <transition name="slideModal" appear>
      <div v-if="showModal" class="modal-card card">
        <form @submit.prevent="handleSubmit" v-if="student">
          <div class="row center title">
            <h3>Update student</h3>
            <h5 class="student-email">{{ student.email }}</h5>
          </div>
          <!-- LIST OF NEW STUDENTS -->

          <div class="row">
            <div class="input-field col s12">
              <input
                id="updateStudent-fullname"
                type="text"
                class="validate"
                v-model="fullname"
                required
              />
              <label class="active" for="updateStudent-fullname"
                >Full name</label
              >
            </div>
          </div>
          <div class="row">
            <div class="input-field col s12">
              <input
                id="updateStudent-nickname"
                type="text"
                class="validate"
                v-model="nickname"
                required
              />
              <label class="active" for="updateStudent-nickname"
                >Nickname</label
              >
            </div>
          </div>
          <div class="row">
            <div class="input-field col s12">
              <input
                id="updateStudent-phone"
                type="text"
                class="validate"
                v-model="phone"
                required
              />
              <label class="active" for="updateStudent-phone">Phone</label>
            </div>
          </div>

          <div class="row" v-if="error">
            <p class="error-message center">{{ error }}</p>
          </div>

          <div v-if="isAdmin" class="row">
            <div class="col s4">
              <button
                class="
                  waves-effect waves-light
                  btn btn-small
                  red
                  darken-4
                  button-submit
                "
              >
                <i class="material-icons left">add</i>Update Student
              </button>
            </div>
            <div class="col s4">
              <button
                class="
                  waves-effect waves-light
                  btn btn-small
                  grey
                  lighten-1
                  button-submit
                "
                @click.prevent="deleteStudent"
              >
                <i class="material-icons left">delete</i>delete
              </button>
            </div>
            <div class="col s4">
              <button
                class="
                  waves-effect waves-light
                  btn btn-small
                  grey
                  lighten-1
                  button-submit
                "
                @click.prevent="closeUpdateModal"
              >
                <i class="material-icons left">cancel</i>cancel
              </button>
            </div>
          </div>

          <div v-if="isTeacher" class="row">
            <div class="col s6 center">
              <button
                class="
                  waves-effect waves-light
                  btn btn-small
                  red
                  darken-4
                  button-submit
                "
              >
                <i class="material-icons left">add</i>Update Student
              </button>
            </div>

            <div class="col s6 center">
              <button
                class="
                  waves-effect waves-light
                  btn btn-small
                  grey
                  lighten-1
                  button-submit
                "
                @click.prevent="closeUpdateModal"
              >
                <i class="material-icons left">cancel</i>cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </transition>
  </teleport>
</template>

<script>
import { ref, watchEffect, computed } from "vue";
import { useStore } from "vuex";

export default {
  emits: ["closeModal", "updateCount"],
  props: ["student", "showModal"],
  setup(props, context) {
    const store = useStore();
    const isAdmin = computed(() => store.getters["user/getIsAdmin"]);
    const isTeacher = computed(() => store.getters["user/getIsTeacher"]);

    // ref
    const error = ref(null);
    const fullname = ref("");
    const nickname = ref("");
    const phone = ref("");

    // update vào các input khi props student thay đổi
    watchEffect(async () => {
      if (props.student != null) {
        fullname.value = props.student.fullname;
        nickname.value = props.student.nickname;
        phone.value = props.student.phone;
      }
    });

    // hàm reset toàn bộ field
    const resetField = () => {
      error.value = null;
      fullname.value = "";
      nickname.value = "";
      phone.value = "";
    };

    // hàm đóng modal lại
    const closeUpdateModal = () => {
      resetField();
      context.emit("closeModal");
    };

    //hàm xóa student
    
    const deleteStudent = async () => {
      await store.dispatch("admin/deleteStudent", {
        studentID: props.student.id,
        classID: props.student.classID,
      });
      resetField();
      closeUpdateModal();
    };

    // hàm update
    const handleSubmit = async () => {
      error.value = "";
      if (nickname.value.length > 6) {
        error.value = "Student nickname must less than 7 character";
      } else if (fullname.value.length > 30) {
        error.value = "Are you trying to spam :)))";
      } else if (
        isNaN(phone.value) ||
        (phone.value.length < 10 && phone.value.length > 11)
      ) {
        error.value = "Phone must be 10 or 11 number";
      } else {
        await store.dispatch("admin/updateStudent", {
          studentID: props.student.id,
          classID: props.student.classID,
          newData: {
            fullname: fullname.value,
            nickname: nickname.value,
            phone: phone.value,
          },
        });
        resetField();
        closeUpdateModal();
      }
    };

    return {
      fullname,
      nickname,
      phone,
      error,
      closeUpdateModal,
      handleSubmit,
      deleteStudent,
      isAdmin,
      isTeacher
    };
  },
};
</script>

<style lang="scss" scoped>
//////////////////BACK GROUND/////////////////
.modal-back {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 98;
  background-color: rgba(0, 0, 0, 0.3);
}
.fadeModal-enter-from,
.fadeModal-leave-to {
  opacity: 0;
}

.fadeModal-enter-active,
.fadeModal-leave-active {
  transition: opacity 0.5s;
}

//////////////////// MODAL ////////////////////
.modal-card {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 99;
  border-radius: 1rem;
  padding: 2rem 3rem;

  width: 100%;
  max-width: 40rem;
}

.slideModal-enter-from,
.slideModal-leave-to {
  transform: translateY(-50%) translateX(100vw);
}

.slideModal-enter-active,
.slideModal-leave-active {
  transition: transform 0.5s;
}
/////////// STYLEING MODAl ///////////////
.title {
  padding-left: 10px;
  margin-bottom: 2rem;
}

////////////

.button-submit {
  width: 100%;
  font-family: "Averta Semi Bold";
}
</style>
