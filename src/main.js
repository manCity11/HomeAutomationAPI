import express from 'express';
import bodyParser  from 'body-parser';
import expressGraphQL from 'express-graphql';
import cors from 'cors';

// Graphql schema
//
import deviceSchema from './graphql/device.schema';

const app = express();

// Middleware
//
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));


// Routing
//
app.get('/', cors(), (request, response) => {
    response.end("It works!!!")
});

app.use('/graphql', cors(), expressGraphQL({
    schema: deviceSchema,
    graphiql: true
}));

app.listen(8000, (err) => {
    if(err) throw err;

    console.log("Serser is running!!!");
});