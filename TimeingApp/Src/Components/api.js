let url = 'http://site04.up2app.co.il/';
export const Api = async (urlName, getOrPost, reqData) => {
  try {
    return fetch(url + urlName,
      {
        method: getOrPost,
        body:reqData?  JSON.stringify(reqData):null,
        headers: new Headers({
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }),
      })
      .then((resp) => resp.json())
      .then((data) => {
        console.log("data", data)
        return data
      })
  } catch (error) {
    console.log("API -" + urlName + " -ERROR  - >", error)
    return null
  }

}