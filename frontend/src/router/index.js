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
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
