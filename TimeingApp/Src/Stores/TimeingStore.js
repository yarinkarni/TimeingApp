import { observable, action, computed } from 'mobx';
import { persist, create } from 'mobx-persist';
import PushNotification from "react-native-push-notification";
//החנות שלי לשמירת נתונים
class TimeingStore {
  //משתנים שנשמרים במכשיר
  @persist @observable userData = null
  @persist('object') @observable reportData = null;

  //משתנים לוקאלי של האפליקציה
  @observable user = '';
  @observable ScholarshipDetails = null;
  @observable news = [];
  @observable Token = '';
  @observable scholorships = [];
  @observable scholarshipByStudent = []

  testPush = () => {
    PushNotification.localNotification({
      title: "My Notification Title", // (optional)
      message: "My Notification Message", // (required)
    });
  }
  testCancel = () => {
    PushNotification.cancelAllLocalNotifications()
  }
  testSchedule = () => {
    PushNotification.localNotificationSchedule({
      message: "My Notification Massege",
      data: new Date(Date.now() + 15 * 1000)
    });
  }
  //מחזיר משתנים
  @computed
  get getScholorships() {
    return this.scholorships
  }
  @computed
  get getUser() {
    return this.user
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
  setReportData(data) {
    //console.log("data - - - ->",data)
    this.reportData = data
  }
  @action
  setUser(user) {
    this.user = user
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