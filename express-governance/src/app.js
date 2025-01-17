const express = require('express');
const app = express();
const cors = require('cors');
const {port} = require("../config/AppConfig")

const cookieParser = require('cookie-parser');
const logger = require('morgan');
const userRouter = require('./routes/UserRouter');
const areaRouter = require('./routes/AreaRouter');
const taskRouter = require('./routes/TaskRouter');
const adminRouter = require('./routes/AdminRouter');
const testRouter = require('./routes/TestRouter');
const factoryRouter = require('./routes/FactoryRouter');
const garageRouter = require('./routes/GarageRouter');
const AppConfig = require('../config/AppConfig');
const expressWs = require('express-ws');

expressWs(app)

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(AppConfig.staticResourcePath))

// 部署时重定向到静态页面
app.get('/', (req, res) => {
    res.redirect('/pages');
});
app.use('/user', userRouter);
app.use('/area', areaRouter);
app.use('/task', taskRouter);
app.use('/test', testRouter);
app.use('/admin', adminRouter);
app.use('/factory', factoryRouter);
app.use('/garage', garageRouter);


app.listen(port, "0.0.0.0", () => {
    console.log(`listening on port ${port}`)
})
