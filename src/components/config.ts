export const ROUTES_CONFIG = [
  {
    label: 'J_1',
    route: '/exam',
  },
  {
    label: 'J_2',
    route: '/contest',
  },
  {
    label: 'J_3',
    route: '/question',
    children: [
      {
        label: 'J_3',
        route: '/question',
      },
      {
        label: 'J_4',
        route: '/question/question-form',
      },
    ],
  },
  {
    label: 'J_5',
    route: '/flash-card',
  },
  {
    label: 'J_6',
    route: '/blog',
    children: [
      {
        label: 'J_6',
        route: '/blog',
      },
      {
        label: 'J_7',
        route: '/blog/blog-management',
      },
      {
        label: 'J_8',
        route: '/blog/blog-form',
      },
    ],
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
