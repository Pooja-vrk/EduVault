const Material = require("../models/Material");
const Notification = require("../models/Notification");

const fs = require("fs");
const path = require("path");



/* =========================================
   UPLOAD MATERIAL + CREATE NOTIFICATION
========================================= */

const uploadMaterial = async (req, res) => {

  try {

    if (!req.file) {
      return res.status(400).json({
        message:"No file uploaded",
      });
    }


    const { category } = req.body;


    if(!category){
      return res.status(400).json({
        message:"Category is required",
      });
    }



    // Save material

    const material = await Material.create({

      fileName:req.file.originalname,

      fileType:req.file.mimetype,

      filePath:`uploads/${req.file.filename}`,

      category,

      uploadedBy:
      req.user?.name ||
      req.user?.email ||
      "Administrator",

    });



    /*
    ==================================
    CREATE NOTIFICATION FOR STUDENTS
    ==================================
    */


    const students = await require("../models/User")
      .find({
        role:"student"
      })
      .select("_id");



   const notifications = students.map(student => ({

    user: student._id,

    title: "📚 New Material Added",

    message: `${req.file.originalname} uploaded in ${category}`,

    type: "material",

    materialId: material._id,

    link: `/material-viewer/${material._id}`,

    read: false

}));



    if(notifications.length > 0){

      await Notification.insertMany(
        notifications
      );

    }



    return res.status(201).json({

      message:
      "Material uploaded and students notified",

      material,

    });



  }
  catch(error){

    console.log(
      "UPLOAD ERROR:",
      error
    );


    res.status(500).json({

      message:
      error.message ||
      "Upload failed",

    });

  }

};







/* =========================================
   GET ALL MATERIALS
========================================= */


const getMaterials = async(req,res)=>{

try{


const materials =
await Material.find()
.sort({
createdAt:-1
});


res.json(materials);


}
catch(error){

res.status(500).json({

message:error.message

});

}


};







/* =========================================
   DELETE MATERIAL
========================================= */


const deleteMaterial = async(req,res)=>{


try{


const material =
await Material.findById(
req.params.id
);



if(!material){

return res.status(404).json({

message:"Material not found"

});

}





// delete physical file

if(material.filePath){


const absolutePath =
path.resolve(
__dirname,
"..",
material.filePath
);



if(fs.existsSync(absolutePath)){

fs.unlinkSync(
absolutePath
);

}


}




await Material.findByIdAndDelete(
req.params.id
);



res.json({

message:
"Material deleted successfully"

});



}
catch(error){

res.status(500).json({

message:error.message

});


}



};









/* =========================================
   UPDATE MATERIAL
========================================= */


const updateMaterial = async(req,res)=>{


try{


const material =
await Material.findByIdAndUpdate(

req.params.id,

req.body,

{
new:true,
runValidators:true
}

);



if(!material){

return res.status(404).json({

message:"Material not found"

});

}



res.json({

message:
"Material updated successfully",

material

});



}
catch(error){

res.status(500).json({

message:error.message

});


}


};







module.exports={

uploadMaterial,

getMaterials,

deleteMaterial,

updateMaterial

};