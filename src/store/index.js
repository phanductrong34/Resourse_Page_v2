import { createStore } from 'vuex'

const moduleUser = {
    namespaced: true,
    state: {
      isAmin: false,
      currentUser: null,
    },
    getters:{
      getIsAdmin(state){
        return state.isAmin
      },
      getCurrentUser(state){
        return state.currentUser;
      }
    },
    mutations:{
      changeUser(state,user){
        if(user == null) state.currentUser = null;
        else state.currentUser = user
      },
      changeAdmin(state,check){
        state.isAmin = check;
      }
    },
    actions: {
    },
    modules: {

    }
}

export const store =  createStore({
  state: {
  },
  mutations:{
  },
  actions: {
  },
  modules: {
    user: moduleUser,
  }
})
