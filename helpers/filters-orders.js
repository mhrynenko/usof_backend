const Sequelize = require('sequelize')

const byLikes = (model, order) => { //posts DESC ASC
    return {
        attributes : [
            'id', 'author', 'title',
            'publish_date', 'status',
            'content', 'categories',
            [Sequelize.literal(`(
                SELECT IFNULL(SUM(likes.type), 0) 
                FROM likes 
                WHERE ${model}.id = likes.post_id 
            )`), 'likes']
        ],
        order : [[Sequelize.literal('likes'), order]]
    }
};

const byDate = (order) => { //DESC ASC
    return {
        order : ['publish_date', order]
    } 
};

const filterDateBetween = (from, to) => { //EXAMPLE '2022-09-24' - '2022-09-25'
    if (Date.parse(to) > Date.parse(from)) {
        from = [to, to = from][0];
    }
    return {
        where : {
            publish_date :{
                [Sequelize.Op.between] : [from, to]
            }
        }
    }
};

const filterStatus = (status) => { //active inactive
    return {
        where : {
            status : status
        }
    }
};

function filterCategory (modelCategory, categoriesArr) {  //EXAMPLE categories [`javascript`, `js`]
    console.log(categoriesArr);
    return {
        attributes: [
            'id', 'author', 'title',
            'publish_date', 'status',
            'content', 'categories',
        ],
        include: [{
            model : modelCategory, 
            required: true,
            as : 'categoryID',
            attributes : [],
            where: { 
                title : categoriesArr,
            },
            through: {
                attributes: []
            },
        }],
        group : "posts.id",
        having : Sequelize.literal(`COUNT(*)=${categoriesArr.length}`),
    }
}

module.exports = {
    byLikes,
    byDate,
    filterCategory,
    filterDateBetween,
    filterStatus,
}