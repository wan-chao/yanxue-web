const state = {
  organization:[],
  charge:[]
}

const getters = {
 
}

const mutations = {
  SET_ORG(state,data){
    state.organization=data
  },
  SET_CHARGE(state,data){
    state.charge=data
  },
};


const actions = {
  setOrg:({commit},data)=>{
    commit('SET_ORG',data)
  },
  setCharge:({commit},data)=>{
    commit('SET_CHARGE',data)
  },
};


export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
