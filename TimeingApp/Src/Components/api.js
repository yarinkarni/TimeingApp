//זה api כללי כשכל פעם שאני רוצה לעשות קריאה מהשרת לא אצטרך לכתוב מחדש
//אני שולח אליה פרמטרים וכך היא יודעת לאיזה פונקציה לקרוא מהשרת
//כדי לייעל את הקוד בצורה פשוטה ונקייה החלטתי להוציא את הapi שיהיה בקומפוננטה חיצונית
//כדי ליצור קוד נקי ומסודר
//וגם כיוון שה fetch קורה לא מעט באפליקציה אז רציתי שהקוד לא ירשם כל פעם מחדש
let url = 'http://site04.up2app.co.il/';
export const Api = async (urlName, getOrPost, reqData) => {
  //console.log(url+urlName+'                 url')
  //console.log(reqData,'reqData')
  try {
    return fetch(url + urlName,
      {
        method: getOrPost,
        body: reqData ? JSON.stringify(reqData) : null,
        headers: new Headers({
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }),
      })
      .then((resp) => resp.json())
      .then((data) => {
        //console.log("data", data)
        return data
      })
  } catch (error) {
    console.log("API -" + urlName + " -ERROR  - >", error)
    return null
  }
}