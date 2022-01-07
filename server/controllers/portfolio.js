//Load Profile Model
const Portfolio = require("../models/portfolio");
const Language = require("../models/Language");
const formidable = require('formidable');
const util = require('util');
const fs = require('fs');
const multer = require('multer');
const validateMiddleware = require('../middleware/validate');
const validateCreate = require('../validations/portfolio/create');
const validateEdit = require('../validations/portfolio/edit');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../client/src/image')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
})

var upload = multer({ storage: storage }).array('photos', 20); 


exports.all = async function(req, res) {
  try {
    const projects = await Portfolio.find({})
                                .populate('language',['_id', 'name'])
                                .exec();
    
    if (!projects) {
      res.status(404).json({
        success: false,
        error: 'There is no projects in portfolio'
      });
    } else {
      res.status(200).json({
        // success: true,
        projects: projects
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

var call = async function(projects, id, res){
    await Language.find({parent: id}, async function (err, languages) {
    if(!err){
      for(let i = 0 ; i < languages.length; i++){
        await Portfolio.find({language: languages[i]._id}, function(err, project) {
          if(!err){
            for(let j = 0 ; j < project.length; j++){
              projects.push(project[j]);
            }
          }
        })
        if(languages[i].child)
          call(projects, languages[i]._id, res);
      }

      console.log(projects);
      res.status(200).json({
        projects: projects
      });
      
    } else {
      res.status(404).json({
        success: false,
        error: 'There is no projects in portfolio'
      });
    }
  });
}

exports.selected = async function(req, res) {
  try {
    console.log(req.params._id)
    let projects = []; 
          projects = await Portfolio.find({language: req.params._id})
                                .exec();
    Language.findById(req.params._id, function (err, language) {
      if(!err){
        if(!language.child){
          // if language hasn't child, 
            if (!projects) {
              res.status(404).json({
                success: false,
                error: 'There is no projects in portfolio'
              });
            } else {
              res.status(200).json({
                // success: true,
                projects: projects
              });
            }
        } else {
            // if language hasn't child, 
            call(projects, language._id, res);
            // Language.find({parent: language._id}, function (err, languages) {
            //   if(!err){
            //     for(let i = 0 ; i < languages.length; i++){
            //       Portfolio.find({language: languages[i]._id}, function(err, project) {
            //         if(!err){
            //           for(let j = 0 ; j < project.length; j++){
            //             // console.log(project[j]);
            //             projects.push(project[j]);
            //           }
            //         }
            //       })
            //     }
            //     console.log(projects);
            //     res.status(200).json({
            //       // success: true,
            //       projects: projects
            //     });
            //   } else {
            //     res.status(404).json({
            //       success: false,
            //       error: 'There is no projects in portfolio'
            //     });
            //   }
            // });
        }
      } else {
        console.log(error);
        res.status(400).json({
          success: false,
          error: error
        })
      }
    });
   
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      error: error
    })
  }
};


exports.create = async function(req, res) {

  upload(req, res,
    async function (err) {
        if (err) {
          console.log(err);
        }
        let portfolioFields = {};
        
        if (req.body.name) portfolioFields.name = req.body.name;
        if (req.body.price) portfolioFields.price = req.body.price;
        if (req.body.description) portfolioFields.description = req.body.description;
        if (req.body.detail) portfolioFields.detail = req.body.detail;
        if (req.body.parent) portfolioFields.language = req.body.parent;
        if (req.body.photos) portfolioFields.photos = req.body.photos;
    
        console.log(portfolioFields);
        // Validation
        const { errors, isValid } = validateCreate(portfolioFields);


        // Check Validation
        if (!isValid) {
          if(req.files.length > 0){
            for (let idx in req.files){
              let path = req.files[idx].path;
              fs.unlink(path, (err) => {
                if(err)
                  console.log(err);
                console.log('validation delete files');
              });
            } 
          } 
          return res.status(400).json(errors);
        }
        portfolioFields.photos = [];
        for (let idx in req.files){
          portfolioFields.photos[idx] = req.files[idx].filename;
        } 
        console.log(portfolioFields);
        
        try {
            // Create a new project
                await new Portfolio(portfolioFields).save();
                res.status(200).json({
                  msg: {type:"success", content: "Success creating new project"}
                });
        } catch (error) {
          console.log(error);
          res.status(400).json({
            msg: {type:"error", content: "Failed creating new project"},
            error: error
          })
        }
      
  });
  //Skills - Split into array
  
  
}

exports.delete = async function(req, res) {
  try {
    // const project = await Portfolio.findById(req.params._id)
    //                              .exec();
    Portfolio.findById(req.params._id, function (err, project) {
      if (!err) {
   
        if(project.photos.length > 0){
          for (let idx in project.photos){
            let path = __dirname + '..\\..\\..\\client\\src\\image\\'+ project.photos[idx];
            fs.unlink(path, (err) => {
                if(err){
                  console.log(err);
                  res.status(400).json({
                    msg: {type:"error", content: "Error deleting the project"},
                    error: err
                  });
                }else{
                  console.log('validation delete files');
                }
              });
          } 
        } 
        project.remove().then(
          res.status(200).json({
            msg: {type:"success", content: "Success deleting the project"}
          })
        );
        

      } else {
        console.log(err);
        res.status(400).json({
          msg: {type:"error", content: "Error deleting the project"},
          error: error
        })
      }
      
    });

    
  } catch (error) {
    console.log(error);
    res.status(400).json({
      msg: {type:"error", content: "Error deleting the project"},
      error: error
    })
  }
};

exports.view = async function(req, res) {
  try {
    const project = await Portfolio.findById(req.params._id)
                          .populate('language',['_id', 'name'])        
                          .exec();
    if (!project) {
      console.log("no project");
      res.status(404).json({
        msg: {type:"error", content: "There is no projects in portfolio"},
      });
    } else {
      res.status(200).json({
        project
      });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({
      msg: {type:"error", content: "Error finding the project"},
      error: error
    })
  }
};

exports.photoDelete = async function(req, res) {
  try {
    let id = req.body._id;
    let photo = req.body.photo;
    
    Portfolio.findById(id, function (err, project) {
      if (!err) {
   
            let path = __dirname + '..\\..\\..\\client\\src\\image\\'+ photo;
            fs.unlink(path, (err) => {
                if(err){
                  console.log(err);
                  // res.status(400).json({
                  //   msg: {type:"error", content: "Error no deleting the photo"},
                  //   error: err
                  // });
                }else{
                  console.log('photo delete');
                }
            });
            const updateData = [];
            for(let i = 0 ; i < project.photos.length; i++ ){
              if(project.photos[i] != photo){
                updateData.push(project.photos[i]);
              }
            }
            console.log(updateData);
            Portfolio.findById(id).updateOne({photos: updateData}, (err, result) => {
              if(!err)
                res.status(200).json({
                  msg: {type:"success", content: "Success deleted the photo"},
                });
            }); 
            

      } else {
        console.log(err);
        res.status(400).json({
          msg: {type:"error", content: "Error no deleting the photo"},
          error: error
        })
      }
      
    });

    
  } catch (error) {
    console.log(error);
    res.status(400).json({
      msg: {type:"error", content: "Error deleting the project"},
      error: error
    })
  }
};

exports.edit = async function(req, res) {

  upload(req, res,
    async function (err) {
        if (err) {
          console.log(err);
        }
        let portfolioFields = {};
        
        if (req.body.name) portfolioFields.name = req.body.name;
        if (req.body.price) portfolioFields.price = req.body.price;
        if (req.body.description) portfolioFields.description = req.body.description;
        if (req.body.detail) portfolioFields.detail = req.body.detail;
        if (req.body.parent) portfolioFields.language = req.body.parent;
        if (req.body.photos) portfolioFields.photos = req.body.photos;
        let deletePhotos = req.body.deletePhotos.split(',');
        let id = req.body._id;
    
        // console.log(portfolioFields);
        // Validation
        const { errors, isValid } = validateEdit(portfolioFields);

        
        // Check Validation
        if (!isValid) {
          if(req.files.length > 0){
            for (let idx in req.files){
              let path = req.files[idx].path;
              fs.unlink(path, (err) => {
                if(err)
                  console.log(err);
                console.log('validation delete files');
              });
            } 
          } 
          return res.status(400).json(errors);
        }

        if(deletePhotos.length > 0){
          for (let i = 0 ; i < deletePhotos.length; i++ ){
            let path = __dirname + '..\\..\\..\\client\\src\\image\\'+ deletePhotos[i];
            fs.unlink(path, (err) => {
              if(err)
                console.log(err);
              console.log('validation delete files');
            });
          } 
        }
        Portfolio.findById(id, function (err, project) {
          if (!err) {
                let updateData = [];
                let flag = false;
                for(let i = 0 ; i < project.photos.length; i++ ){
                  flag = true;
                  for (let j = 0 ; j < deletePhotos.length; j++ ){
                    if(project.photos[i] == deletePhotos[j]){
                      flag = false;
                    }
                    
                  }
                  if(flag) {
                    updateData.push(project.photos[i]);
                  }
                }

                for (let idx in req.files){
                  updateData.push(req.files[idx].filename);
                } 
                portfolioFields.photos = updateData;
                Portfolio.findById(id).updateOne(portfolioFields, (err, result) => {
                  if(!err)
                    res.status(200).json({
                      msg: {type:"success", content: "Success edited the photo"},
                    });
                }); 
                
    
          } else {
            console.log(err);
            res.status(400).json({
              msg: {type:"error", content: "Error no deleting the photo"},
              error: error
            })
          }
          
        });
  });
}