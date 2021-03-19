import { observable, action, computed } from 'mobx';
import { persist, create } from 'mobx-persist';
import PushNotification from "react-native-push-notification";
//החנות שלי לשמירת נתונים
class TimeingStore {
  //משתנים שנשמרים במכשיר
  @persist('object') @observable userData = null
  @persist @observable picker = 'סטודנט'
  @persist('object') @observable reportData = null;

  //משתנים לוקאלי של האפליקציה
  @observable ScholarshipDetails = null;
  @observable news = [];
  @observable Token = '';
  @observable scholorships = [];
  @observable scholarshipByStudent = []

  push = () => {
    PushNotification.configure({
      onRegister: (Token) => {
        this.setState({ Token: Token });
      },
      onNotification: function (notification) {
      },
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: true,
    });
  }



  //מחזיר משתנים
  @computed
  get getScholorships() {
    return this.scholorships
  }
@computed
get getPicker(){
  return this.picker
}
  @computed
  get getUser() {
    return this.userData
  }
  @computed
  get getScholarshipDetails() {
    return this.ScholarshipDetails
  }
  get getToken() {
    return this.Token
  }

  @computed
  get getScholarshipByStudent() {
    return this.scholarshipByStudent
  }

  @computed
  get getReportData() {
    return this.reportData
  }
  //לשנות את המשתנה

  @action
  setPicker(data){
    this.picker=data
  }
  @action
  setReportData(data) {
    this.reportData = data
  }
  @action
  setUser(userData) {
    this.userData = userData
  }
  @action
  setScholarshipByStudent(data) {
    this.scholarshipByStudent = data
  }
  @action
  setScholarship(data) {
    this.scholorships = data
  }
  @action
  setScholarshipDetails(ScholarshipDetails) {
    this.ScholarshipDetails = ScholarshipDetails
  }
  @action
  setToken(token) {
    this.Token = token
  }
}


const store = new TimeingStore();
export default store;