//Load Profile Model
const Language = require("../models/Language");

exports.current = async function(req, res) {
    try {
        const langs = await Language.find({})
                                     .exec();
        if (!langs) {
          res.status(404).json({
            success: false,
            error: 'There is no Language'
          });
        } else {
          res.status(200).json({
            success: true,
            langs: langs
          });
        }
      } catch (error) {
        console.log(error);
        res.status(400).json({
          success: false,
          error: error
        })
      }
};

exports.create = async function(req, res, next) {
    const { name, parent } = req.body;
    Language.findOne({ name }, (err, existingName) => {
        if (err) {
            console.log(err);
            return next(err);
        }
    
        // If name is not unique, return error
        if (existingName) {
            return res.status(422).send({ name: 'That name is already in use.' });
        }
    
        // If name is unique , create account
        const lang = new Language({
            name, parent
        });
    
        lang.save((err, lang) => {
          if (err) {
              console.log(err);
              return next(err);
          }
          if(parent != "-1"){
            const updateData = {}
            updateData.child = true;
            Language.findOneAndUpdate(
              {_id: parent},
              {$set: updateData }
            ).then(parent => {
              console.log(parent);
                Language.findById(lang._id,  function(err, thing){ 
                  if(err){ 
                    console.log(err);
                    return next(err);
                  }
                  thing.deep = parent.deep+1;
                  thing.save();
                  console.log('saved!!');
                });
            });

            
          }

          res.status(200).json({
              msg: {type:"success", content: "Success creating new Language"},
          });
        });
    });
}

exports.view = async function(req, res) {
  try {
    const lang = await Language.findOne({name: req.params.name}).exec();
    if (!lang) {
      console.log("no matched lang");
      res.status(200).json({
        
      });
    } else {
      
      res.status(200).json({
        lang
      });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({
      msg: {type:"error", content: "Error finding the language"},
      error: error
    })
  }
};

exports.edit = async function(req, res, next) {
  const { name, id } = req.body;
  Language.findOne({ name }, (err, existingName) => {
      if (err) {
          console.log(err);
          return next(err);
      }
  
      // If name is not unique, return error
      if (existingName) {
          return res.status(422).send({ editName: 'That name is already in use.' });
      }
      
      // save
      
      Language.findById(id,  function(err, lang){ 
        if(err){ 
          console.log(err);
          return next(err);
        }
        lang.name = name;
        lang.save();
        console.log('edited!!');
      });
  
      // return
        res.status(200).json({
            msg: {type:"success", content: "Success editing selected Language"},
        });
  });
}

exports.delete = async function(req, res, next) {
  let id = req.params.id;
  // language === Root? => no
  if(id == -1) {
    res.status(200).json({
      msg: {type:"warning", content: "Root is not delete"},
    })
  }
  try{
      await Language.findById(id,  function(err, lang){ 
        if(err){ 
          console.log(err);
          return next(err);
        }
          // if this language has child, it don't delete 
          if(lang.child){
            res.status(200).json({
              msg: {type:"warning", content: "This language is not delete because it have child"},
            })
          } else {
            let count = 0;
            Language.count({parent: lang.parent}).exec((err, cnt) => {
              if(err){
                console.log(err);
                return next(err);
              }
              // count = cnt;
              console.log(cnt);
              if(cnt == 1){
                console.log(cnt);
                Language.findById(lang.parent,  function(err, thing){ 
                  if(err){ 
                    console.log(err);
                    return next(err); 
                  }
                  thing.child = false;
                  thing.save();
                });
              }
            })
            
            
            lang.remove().then(
              res.status(200).json({
                msg: {type:"success", content: "Success deleting selected Language"},
              }),
            );
          }
      });
    }catch(e){
      console.log(e);
    }

  // return
    
  
}