const express = require('express');
const bodyParser = require('body-parser');

const leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());

const mongoose = require('mongoose');

const Leaders = require('../models/leaders');

leaderRouter.route('/')
.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req,res,next) => {
    res.end('Will send all the leaders to you!');
})
.post((req, res, next) => {
    res.end('Will add the leader: ' + req.body.name + ' with details: ' + req.body.description);
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /leaders');
})
.delete((req, res, next) => {
    res.end('Deleting all leaders');
});


leaderRouter.route('/:leaderId')
.get((req,res,next) => {
    res.end('Will send details of the leader: ' + req.params.leaderId +' to you!');
})
.post( (req, res, next) => {
  res.statusCode = 403;
  res.end('POST operation not supported on /leaders/'+ req.params.leaderId);
})
.put((req, res, next) => {
  res.write('Updating the leader: ' + req.params.leaderId + '\n');
  res.end('Will update the leader: ' + req.body.name + 
        ' with details: ' + req.body.description);
})
.delete((req, res, next) => {
    res.end('Deleting leader: ' + req.params.leaderId);
});


leaderRouter.route('/:leaderId/comments')
.get((req,res,next) => {
    Leaders.findById(req.params.leaderId)
    .then((leader) => {
        if (leader != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(leader.comments);
        }
        else {
            err = new Error('leader ' + req.params.leaderId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
    Leaders.findById(req.params.leaderId)
    .then((leader) => {
        if (leader != null) {
            leader.comments.push(req.body);
            leader.save()
            .then((leader) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(leader);                
            }, (err) => next(err));
        }
        else {
            err = new Error('leader ' + req.params.leaderId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /leaders/'
        + req.params.leaderId + '/comments');
})
.delete((req, res, next) => {
    Leaders.findById(req.params.leaderId)
    .then((leader) => {
        if (leader != null) {
            for (var i = (leader.comments.length -1); i >= 0; i--) {
                leader.comments.id(leader.comments[i]._id).remove();
            }
            leader.save()
            .then((leader) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(leader);                
            }, (err) => next(err));
        }
        else {
            err = new Error('leader ' + req.params.leaderId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));    
});

leaderRouter.route('/:leaderId/comments/:commentId')
.get((req,res,next) => {
    Leaders.findById(req.params.leaderId)
    .then((leader) => {
        if (leader != null && leader.comments.id(req.params.commentId) != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(leader.comments.id(req.params.commentId));
        }
        else if (leader == null) {
            err = new Error('leader ' + req.params.leaderId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /leaders/'+ req.params.leaderId
        + '/comments/' + req.params.commentId);
})
.put((req, res, next) => {
    Leaders.findById(req.params.leaderId)
    .then((leader) => {
        if (leader != null && leader.comments.id(req.params.commentId) != null) {
            if (req.body.rating) {
                leader.comments.id(req.params.commentId).rating = req.body.rating;
            }
            if (req.body.comment) {
                leader.comments.id(req.params.commentId).comment = req.body.comment;                
            }
            leader.save()
            .then((leader) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(leader);                
            }, (err) => next(err));
        }
        else if (leader == null) {
            err = new Error('leader ' + req.params.leaderId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete((req, res, next) => {
    Leaders.findById(req.params.leaderId)
    .then((leader) => {
        if (leader != null && leader.comments.id(req.params.commentId) != null) {
            leader.comments.id(req.params.commentId).remove();
            leader.save()
            .then((leader) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(leader);                
            }, (err) => next(err));
        }
        else if (leader == null) {
            err = new Error('leader ' + req.params.leaderId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});


module.exports = leaderRouter;

