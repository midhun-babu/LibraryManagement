/views
  ├── /layouts          # Base templates (Head, Body, Footer structures)
  ├── /shared           # Reusable UI bits (Buttons, Loaders, Alerts)
  ├── /partials         # Fragments used across multiple pages (Nav, Sidebar)
  ├── /Home             # Views managed by the HomeController
  │    ├── index.html
  │    └── about.html
  └── /User             # Views managed by the UserController
       ├── profile.html
       └── settings.html


project/
│
├── views/
│   ├── partials/
│   │   ├── header.ejs
│   │   ├── footer.ejs
│   │   └── navbar.ejs
│   ├── view.ejs
│   └── otherpage.ejs
│
├── app.js
└── package.json


MVC/
├── config/
├── controllers/
│   └── authController.js
│   └── bookController.js
│   └── dashboardController.js
│   └── pageController.js
│   └── pathController.js
│   └── userController.js
│ app.js
│ .env
│ package.json
│
│error.ejs
│index.ejs
│
├── db/
│   └── connection.js
├── middleware/
│   └── authMiddleware.js
│   └── errorMiddleware.js
│   └── roleMiddleware.js
│
├── model/
│   └── book.js
│   └── category.js
│   └── transcaction.js
│   └── user.js
│   
├── routes/
│   ├── bookRoute.js
│   ├── categoryRoute.js
│   ├── userRoute.js
│   ├── dashboardRoute.js
│   └── indexRoute.js
│   └── authRoute.js
│
├── services/
│   └── authService.js
│   └── bookService.js
│   └── dashboardService.js
│   └── pageService.js
│   └── pathService.js
│   └── userService.js
├── views/
│   ├── layouts/
│   │   └── main.ejs
│   ├── books/
│   │   └──  index.ejs
│   ├── auth/
│   │   ├── login.ejs
│   │   └── register.ejs
│   ├── category/
│   │   └──  index.ejs
│   ├── users/
│   │   ├── dashboard.ejs
│   │   ├── index.ejs
│   │   ├── profile.ejs
│   │   └── settings.ejs
│   ├── partials/
│   │   ├── header.ejs
│   │   └── footer.ejs
│   │   └── navbar.ejs
│   └── books.ejs
│   └── index.ejs
│
└── public/
    ├── css/
    │   └── styles.css
    ├── js/
    └── images/










project-root/
│ app.js
│ server.js
│ .env
│ package.json
│
├── db/
│   └── connection.js
├── routes/
│   ├── bookRoute.js
│   ├── categoryRoute.js
│   ├── userRoute.js
│   └── indexRoute.js
├── views/
│   ├── index.ejs
│   ├── partials/
│   │   ├── header.ejs
│   │   └── footer.ejs
│   └── layouts/
│       └── main.ejs
└── public/
    ├── css/
    ├── js/
    └── images/
