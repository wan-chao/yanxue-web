import http from '@/util/http'

// 设备查询
export function deviceList(status='',officeId='') {
  let url= '/api/hibl/card/usage'
  let data = {
    status,
	  officeId
  };
  return http.post(url,data)
}

// 批量删除设备
export function cardDelete(cardIds) {
  return http({
    url: '/api/hibl/card/delete',
    method: 'GET',
    params:{
      cardIds
    },
    headers:{
      'Content-Type':'application/x-www-form-urlencoded'
    }
  })
}


// 设备历史记录
export function cardHistory(cardSid) {
  return http({
    url: '/api/hibl/card/history',
    method: 'GET',
    params:{
      cardSid
    },
    headers:{
      'Content-Type':'application/x-www-form-urlencoded'
    }
  })
}


// 设备保存
export function cardSave({officeId,cardId,cardType,cardCode,cardName,cardSid,simId,cardDesc}) {
  let url= '/api/hibl/card/save'
  let data = {
    officeId,
    cardId,
    cardType,
    cardCode,
    cardName,
    cardSid,
    simId,
    cardDesc,
  };
  return http.post(url,data)
}
