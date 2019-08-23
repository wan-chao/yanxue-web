import http from '@/util/http'

// cms查询
export function cmsList(actId='',order="") {
  let url= '/api/hibl/cms/list'
  let data = {
    actId,
    order
  };
  return http.post(url,data)
}

// 删除
export function cmsDelete(newsId) {
  let url= '/api/hibl/cms/update'
  let data = {
    newsId,
    newsStatus:'3'
  };
  return http.post(url,data)
}

// 查询
export function cmsDetail(newsId) {
  let url= '/api/hibl/cms/detail'
  let data = {
    newsId
  };
  return http.post(url,data)
}

// cms保存
export function cmsSave({actId,title,image_url,author,content,publishTo}) {

  let url= '/api/hibl/cms/save'

  let param = new FormData();

  param.append("image_url",image_url)
  param.append("actId",actId)
  param.append("title",title)
  param.append("author",author)
  param.append("content",content)
  param.append("publishTo",publishTo)

  return http.post(url,param)
}
