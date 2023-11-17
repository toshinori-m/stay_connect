import { createRouter, createWebHistory } from 'vue-router'
import Open from '../views/OpenPage'
import Login from '../views/LoginPage'
import Password from '../views/PasswordPage'
import SendEmail from '../views/SendEmailPage'
import Signup from '../views/SignupPage'
import Register from '../views/RegisterPage'
import Home from '../views/HomePage'
import SportsType from '../views/MakingIntroductions/SportsTypePage'
import SportsTypeEdit from '../views/MakingIntroductions/SportsTypeEditPage'
import EventSetting from '../views/MakingIntroductions/EventSettingPage'
import EventSettingList from '../views/MakingIntroductions/EventSettingListPage'
import EventSettingEdit from '../views/MakingIntroductions/EventSettingEditPage'
import SportsDiscipline from '../views/MakingIntroductions/SportsDisciplinePage'
import SportsDisciplineEdit from '../views/MakingIntroductions/SportsDisciplineEditPage'
import Prefecture from '../views/MakingIntroductions/PrefecturePage'
import PrefectureEdit from '../views/MakingIntroductions/PrefectureEditPage'
import TargetAge from '../views/MakingIntroductions/TargetAgePage'
import TargetAgeEdit from '../views/MakingIntroductions/TargetAgeEditPage'
import BasicSettingEdit from '../views/BasicSetting/BasicSettingEditPage'
import TeamProfileEdit from '../views/TeamProfile/TeamProfileEditPage'
import TeamProfileList from '../views/TeamProfile/TeamProfileListPage'
import TeamProfile from '../views/TeamProfile/TeamProfilePage'
import ChatRoomList from '../views/ChatRoom/ChatRoomListPage'

const routes = [
  {
    path: '/',
    name: 'OpenPage',
    component: Open
  },
  {
    path: '/login',
    name: 'LoginPage',
    component: Login
  },
  {
    path: '/password',
    name: 'PasswordPage',
    component: Password
  },
  {
    path: '/send_email',
    name: 'SendEmailPage',
    component: SendEmail
  },
  {
    path: '/signup',
    name: 'SignupPage',
    component: Signup
  },
  {
    path: '/register',
    name: 'RegisterPage',
    component: Register
  },
  {
    path: '/home',
    name: 'HomePage',
    component: Home
  },
  {
    path: '/sports_type',
    name: 'SportsTypePage',
    component: SportsType
  },
  {
    path: '/sports_type_edit',
    name: 'SportsTypeEditPage',
    component: SportsTypeEdit
  },
  {
    path: '/event_setting',
    name: 'EventSettingPage',
    component: EventSetting
  },
  {
    path: '/event_setting_list',
    name: 'EventSettingListPage',
    component: EventSettingList
  },
  {
    path: '/event_setting_edit/:id',
    name: 'EventSettingEditPage',
    component: EventSettingEdit
  },
  {
    path: '/sports_discipline',
    name: 'SportsDisciplinePage',
    component: SportsDiscipline
  },
  {
    path: '/sports_discipline_edit',
    name: 'SportsDisciplineEditPage',
    component: SportsDisciplineEdit
  },
  {
    path: '/prefecture',
    name: 'PrefecturePage',
    component: Prefecture
  },
  {
    path: '/prefecture_edit',
    name: 'PrefectureEditPage',
    component: PrefectureEdit
  },
  {
    path: '/target_age',
    name: 'TargetAgePage',
    component: TargetAge
  },
  {
    path: '/target_age_edit',
    name: 'TargetAgeEditPage',
    component: TargetAgeEdit
  },
  {
    path: '/basic_setting_edit',
    name: 'BasicSettingEditPage',
    component: BasicSettingEdit
  },
  {
    path: '/team_profile_edit/:id',
    name: 'TeamProfileEditPage',
    component: TeamProfileEdit
  },
  {
    path: '/team_profile_list',
    name: 'TeamProfileListPage',
    component: TeamProfileList
  },
  {
    path: '/team_profile',
    name: 'TeamProfilePage',
    component: TeamProfile
  },
  {
    path: '/chat_room_list',
    name: 'ChatRoomListPage',
    component: ChatRoomList
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
