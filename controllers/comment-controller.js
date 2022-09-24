const dbModels = require('../db.js');

const getOne = async (req, res) => {
    try {
        const comment_id = req.params.comment_id;

        const comment = await dbModels.comments.findOne({
            where: { 
                id : comment_id
            } 
        });
        
        return res.json ({
            comment
        });
    }
    catch (error) {
        console.log("Some error while deleting comment: ", error.message);   
        return res.json ({
            error : "Some error while deleting comment: " + error.message
        });  
    }
};

const getOneLikes = async (req, res) => {
    try {
        const comment_id = req.params.comment_id;

        const likes = await dbModels.likes.findAll({
            where: { 
                comment_id : comment_id,
                post_id : null
            } 
        });
        
        return res.json ({
            likes
        });
    }
    catch (error) {
        console.log("Some error while getting likes for comment: ", error.message);   
        return res.json ({
            error : "Some error while getting likes for comment: " + error.message
        });  
    }
};

const createLike = async(req, res) => {
    try {
        const comment_id = req.params.comment_id; 

        const comment = await dbModels.comments.findOne({
            where: { 
                id : comment_id
            } 
        });
    
        if (comment === null) {
            return res.json({
                error : "No such comment"
            });
        }
    
        const [ like, created ] = await dbModels.likes.findOrCreate({
            where : {
                post_id : null,
                comment_id : comment_id
            },
            defaults : {
                author : req.user.login,
                publish_date : new Date(),
                comment_id : comment_id,
                post_id : null,
                type : req.body.type
            }
        });
    
        const commentAuthor = await dbModels.users.findOne({
            where: { 
                login : comment.dataValues.author
            } 
        });
    
        if (!created) {
            if (req.body.type === like.dataValues.type){
                return res.json({
                    error : `Your ${req.body.type} already exists`,
                });
            }
    
            await dbModels.users.update({ 
                rating : (req.body.type === 'like') ? commentAuthor.dataValues.rating + 1 :  commentAuthor.dataValues.rating - 1,
            }, {
                where : {
                    login : comment.dataValues.author
                }
            });
    
            await dbModels.likes.update({ 
                type : req.body.type,
            }, {
                where : {
                    id : like.dataValues.id
                }
            });
    
            return res.json ({
                error : null,
                message : `Your ${like.dataValues.type} was changed to ${req.body.type}`
            });
        }
    
        await dbModels.users.update({ 
            rating : (req.body.type === 'like') ? commentAuthor.dataValues.rating + 1 :  commentAuthor.dataValues.rating - 1,
        }, {
            where : {
                login : comment.dataValues.author
            }
        });
    
        return res.json ({
            error : null,
            message : `Your ${req.body.type} was created`
        });
    }
    catch (error) {
        console.log("Some error while creating likes for comment: ", error.message);    
        return res.json ({
            error : "Some error while creating likes for comment: " + error.message
        }); 
    }
};

const deleteLike = async (req, res) => {
    try {
        const comment_id = req.params.comment_id; 

        const comment = await dbModels.comments.findOne({
            where: { 
                id : comment_id
            } 
        });
    
        if (comment === null) {
            return res.json({
                error : `No such comment`,
            });
        }
        
        const like = await dbModels.likes.findOne({
            where : {
                post_id : null,
                comment_id : comment_id
            }
        });
    
        if (like === null) {
            return res.json({
                error : "No likes for this comment"
            });
        }
    
        if (like.dataValues.author !== req.user.login) {
            return res.json({
                error : "No your likes"
            });
        }
        
        await dbModels.likes.destroy({
            where: {
                id : like.dataValues.id
            }
        });
    
        const commentAuthor = await dbModels.users.findOne({
            where: { 
                login : comment.dataValues.author
            } 
        });
    
        await dbModels.users.update({ 
            rating : (like.dataValues.type === 'like') ? commentAuthor.dataValues.rating - 1 :  commentAuthor.dataValues.rating + 1,
        }, {
            where : {
                login : comment.dataValues.author
            }
        });
    
        return res.json({
            error : null,
            message : `Your like / dislike was deleted for comment with id=${comment_id}`
        });
    }
    catch (error) {
        console.log("Some error while deleting likes for comment: ", error.message);    
        return res.json ({
            error : "Some error while deleting likes for comment: " + error.message
        }); 
    }
};

const update = async (req, res) => {
    try {
        const comment_id = req.params.comment_id; 

        const comment = await dbModels.comments.findOne({
            where: { 
                id : comment_id
            } 
        });
    
        if (comment === null) {
            return res.json ({
                error : "No such comment"
            });
        }
    
        if (comment.dataValues.author !== req.user.login) {
            return res.json ({
                error : "Change comment can only creator"
            });
        }
    
        await dbModels.comments.update({ 
            content : req.body.content ? req.body.content : comment.dataValues.content,
        }, {
            where : {
                id : comment.dataValues.id
            }
        });
    
        return res.json ({
            error : null,
            message : "Comment data was updated"
        });
    }
    catch (error) {
        console.log("Some error while updating comment: ", error.message);   
        return res.json ({
            error : "Some error while updating comment: " + error.message
        });  
    }
};

const deleteOne = async (req, res) => {
    try {
        const comment_id = req.params.comment_id;
 
        const comment = await dbModels.comments.findOne({
            where: { 
                id : comment_id
            } 
        });
    
        if ((comment === null) || (comment.dataValues.author !== req.user.login) && (req.user.status !== 'admin')) {
            return res.json({
                error : "Delete comment can only admin and exact user",
            })
        }
    
        await dbModels.comments.destroy({
            where: {
                id : comment.dataValues.id
            }
        });
    
        return res.json({
            error : null,
            message : `Comment with id=${comment_id} was deleted`
        });
    }
    catch (error) {
        console.log("Some error while deleting comment: ", error.message);   
        return res.json ({
            error : "Some error while deleting comment: " + error.message
        });  
    }
};


module.exports = {
    getOne,
    deleteOne,
    getOneLikes,
    createLike,
    deleteLike,
    update,
}