import express from 'express';
import bodyParser  from 'body-parser';
import expressGraphQL from 'express-graphql';

// Graphql schema
//

const app = express();

// Middleware
//
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));


// Routing
//
app.get('/', (request, response) => {
    response.end("It works!!!")
});

app.use('/graphql', expressGraphQL({
    schema: '',
    graphiql: true
}));

app.listen(8000, (err) => {
    if(err) throw err;

    console.log("Serser is running!!!");
});