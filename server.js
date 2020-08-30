require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan')
const mongoose = require('mongoose');
const helmet = require('helmet');
const errorMiddlewares = require('./middleware/ErrorHandlers')

const app = express();

app.use(morgan('common'));
app.use(cors());
app.use(helmet());

const uri = process.env.DB_URI;

mongoose.connect(
    uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}
).then(() =>
    console.log('DB Connected')
).catch((err) =>
    console.log(err));

//routes
const Users = require('./routes/Users');
app.use('/users', Users);

app.get('/', (req, res) => {
    res.json({
        message: 'You have made a succsesfull api GET request! Congratulations! 🥳🥳🥳'
    });
});

app.use(errorMiddlewares.notFound);
app.use(errorMiddlewares.errorHandler);

const port = process.env.PORT || 4040;
app.listen(port, () => {
    console.log(`listening on ${port}`)
})