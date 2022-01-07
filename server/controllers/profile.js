//Load Profile Model
const Profile = require("../models/Profile");

exports.current = async function(req, res) {
  try {
    const profile = await Profile.findOne({ user: req.user._id })
                                 .populate('user', ['name', 'email'])
                                 .exec();
    if (!profile) {
      res.status(404).json({
        success: false,
        error: 'There is no profile for this user'
      });
    } else {
      res.status(200).json({
        success: true,
        profile: profile
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

exports.create = async function(req, res) {
  //Get fields
  const profileFields = {};
  profileFields.user = req.user._id;
  if (req.body.userId) profileFields.userId = req.body.userId;
  if (req.body.company) profileFields.company = req.body.company;
  if (req.body.website) profileFields.website = req.body.website;
  if (req.body.bio) profileFields.bio = req.body.bio;
  if (req.body.status) profileFields.status = req.body.status;

  //Skills - Split into array
  if (typeof req.body.skills !== "undefined") {
    profileFields.skills = req.body.skills.split(",");
  }

  try {
    const profile = await Profile.findOne({ user: req.user._id })
                                 .exec();
    if (profile) {
      // Update profile
      const updatedProfile = await Profile.findOneAndUpdate(
                                            { user: req.user._id },
                                            { $set: profileFields },
                                            { new: true }
                                          )
                                          .exec();
      res.status(200).json({
        success: true,
        profile: updatedProfile
      });
    } else {
      // Create a new profile

      // Check if userId exists
      const oldProfile = await Profile.findOne({ userId: profileFields.userId }).exec();
      if (oldProfile) {
        res.status(404).json({
          success: false,
          error: 'That handle already exists.'
        });
      } else {
        // Save profile
        await new Profile(profileFields).save();
        const newProfile = await Profile.findOne({ user: req.user._id })
                                     .populate('user', ['name', 'email'])
                                     .exec();
        res.status(200).json({
          success: true,
          profile: newProfile
        });
      }
    } 
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      error: error
    })
  }
}

exports.delete = async function(req, res) {
  try {
    await Profile.deleteOne({ user: req.user._id })
                                 .exec();
    res.status(200).json({
      success: true
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      error: error
    })
  }
};