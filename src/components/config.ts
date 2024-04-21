import Home from 'assets/svg/home.svg';
import User from 'assets/svg/users.svg';
import Question from 'assets/svg/help-circle.svg';
import Exam from 'assets/svg/file-text.svg';
import Contest from 'assets/svg/bookmark.svg';
import FlashCard from 'assets/svg/box.svg';
import Blog from 'assets/svg/book.svg';
import { ROLES } from 'global';

export const getRoutesConfig = (role: ROLES) => [
  {
    label: 'J_37',
    route: '/home',
    icon: Home,
  },
  {
    label: 'J_38',
    route: '/user-mgmt',
    icon: User,
    hide: ![ROLES.ADMIN].includes(role),
  },
  {
    label: 'J_1',
    route: '/exam',
    icon: Exam,
  },
  {
    label: 'J_2',
    route: '/contest',
    icon: Contest,
  },
  {
    label: 'J_3',
    route: '/question',
    icon: Question,
    // children: [
    //   {
    //     label: 'J_3',
    //     route: '/question',
    //   },
    //   {
    //     label: 'J_4',
    //     route: '/question/question-form',
    //   },
    // ],
  },
  {
    label: 'J_5',
    route: '/flash-card',
    icon: FlashCard,
  },
  {
    label: 'J_6',
    route: '/blog',
    icon: Blog,
    // children: [
    //   {
    //     label: 'J_6',
    //     route: '/blog',
    //   },
    //   {
    //     label: 'J_7',
    //     route: '/blog/blog-management',
    //   },
    //   {
    //     label: 'J_8',
    //     route: '/blog/blog-form',
    //   },
    // ],
  },
  // {
  //   label: 'Thanh toán',
  //   route: '/payment',
  //   children: [
  //     {
  //       label: 'Thanh toán',
  //       route: '/payment',
  //     },
  //     {
  //       label: 'Lịch sử thanh toán',
  //       route: '/payment/history',
  //     },
  //   ],
  // },
];
