import Vue from 'vue'
import Vuex from 'vuex'
import vuexModules from './modules'

Vue.use(Vuex);


const state = {
  isLogin:localStorage.eleToken?true:false,
  showWeather:true,
  showHeader:true,
  userInfo:{}
}

const mutations = {
  SET_LOGIN(state,data){
    state.isLogin=data
  },
  SET_USERINFO(state,data){
    state.userInfo=data
  },
  SET_WEATHER(state,data){
    state.showWeather=data
  },
  SET_HEADER(state,data){
    state.showHeader=data
  },
}

const actions = {
  setLogin:({commit},data)=>{
    commit('SET_LOGIN',data)
  },
  setUserInfo:({commit},data)=>{
    commit('SET_USERINFO',data)
  },
  setWeather:({commit},data)=>{
    commit('SET_WEATHER',data)
  },
  setHeader:({commit},data)=>{
    commit('SET_HEADER',data)
  },
}

export default new Vuex.Store({
  state,
  mutations,
  actions,
  modules: vuexModules
})
