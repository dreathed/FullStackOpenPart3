const express = require('express');
const morgan = require('morgan');

const app = express();
app.use(express.json());

app.use(morgan(function (tokens, req, res) {
    if(tokens.method(req, res) === "POST"){
        return [
            tokens.method(req, res),
            tokens.url(req, res),
            tokens.status(req, res),
            tokens.res(req, res, 'content-length'), '-',
            tokens['response-time'](req, res), 'ms',
            JSON.stringify(req.body)
          ].join(' ')
    }
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms'
      ].join(' ')
  }))



let notes = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]



app.get("/api/persons", (req, res) => {
    res.json(notes);
});

app.get("/api/persons/:id", (req, res) => {
    let id = req.params.id;
    let person = notes.find((note) => note.id === id);
    if(person){
        return res.json(person);
    }else{
        return res.status(404).end();
    }
});

function createMissingErrorMessage(note){
    let message = "";
    if(!note.name){
        message = "name ";
    }
    if(!note.number){
        if(!note.name){
            message += "and "
        }
        message += "number ";
    }
    message += "missing."
    return message;
}

app.post("/api/persons", (req, res) => {
    let newId = String(Math.floor(Math.random()*1000000));
    let note = JSON.parse(JSON.stringify(req.body));
    if(!note.name || !note.number){
        return res.status(400).json({
            error: createMissingErrorMessage(note)
        })
    }

    if(notes.find((elem) => elem.name === note.name)){
        return res.status(400).json({
            error: 'Entry already exists!'
        })
    }

    note.id = newId;
    notes.push(note);
    res.json(note);
})

app.delete("/api/persons/:id", (req, res) => {
    let id = req.params.id;
    notes = notes.filter((note) => note.id !== id);
    res.status(204).end();
});

app.get("/info", (req, res) => {
    res.send(`<p>Phonebook has info for ${notes.length} people</p><p>${new Date()}</p>`)
});


const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
  
app.use(unknownEndpoint)


const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running at ${PORT}.`);
})