const { Sequelize } = require('sequelize')

const sequelize = new Sequelize('pensamentos','root','root',{
    host:'localhost',
    dialect: 'mysql'
})
try{
    sequelize.authenticate()
}catch(err){
    console.log(err.message)
}

module.exports = sequelize
