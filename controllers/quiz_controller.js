// Ahora lo hacemos a trav�s del modelo concreto definido en models.js a trav�s de Quiz
var models = require('../models/models.js');

// Autoload - factoriza el c�digo si ruta incluye :quizId
exports.load = function(req, res, next, quizId) {
  models.Quiz.find(quizId).then(
    function(quiz) {
      if (quiz) {
        req.quiz = quiz;
        next();
      } else { next(new Error('No existe quizId=' + quizId)); }
    }
  ).catch(function(error) { next(error);});
};

// GET /quizes con listado de preguntas filtradas
exports.index = function(req, res) {
  // Si es la primera vez req.query.search ser� nulo o undefined, entonces lo colocamos a nulo,
  // sino formamos el nuevo argumento de la nueva query a realizar
  var miQueryArg= req.query.search ? "%" + req.query.search.replace(/ +/g, "%") + "%" : '';
  var miQuery= miQueryArg
                ?
                  {where: ["pregunta like ?", miQueryArg], order: 'pregunta ASC'}
                :
                  ''
                ;

  models.Quiz.findAll(miQuery).then(
    function(quizes) {
      res.render('quizes/index.ejs', { quizes: quizes, search: req.query.search });
    }
  ).catch(function(error) { next(error);})
};


// GET /quizes/:id
exports.show = function(req, res) {
  res.render('quizes/show', { quiz: req.quiz});
};

// GET /quizes/:id/answer
exports.answer = function(req, res) {
  var resultado = 'Incorrecto';
  if (req.query.respuesta === req.quiz.respuesta) {
    resultado = 'Correcto';
  }
  res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado});
};


// GET /quizes/new
exports.new = function(req, res) {
  var quiz = models.Quiz.build(
    {pregunta: "Pregunta", respuesta: "Respuesta"}
  );

  res.render('quizes/new', {quiz: quiz});
};

// POST /quizes/create
exports.create = function(req, res) {
  var quiz = models.Quiz.build( req.body.quiz );

// guarda en DB los campos pregunta y respuesta de quiz
  quiz.save({fields: ["pregunta", "respuesta"]}).then(function(){
    res.redirect('/quizes');
  })   // res.redirect: Redirecci�n HTTP a lista de preguntas
};