const { Sequelize } = require('sequelize')

const sequelize = new Sequelize('pensamentos','root','root',{
    host:'localhost',
    dialect: 'mysql'
})
async function testConnection() {
    try {
      await sequelize.authenticate();
      console.log('Conexão com o banco de dados estabelecida com sucesso!');
    } catch (err) {
      console.error('Erro ao conectar ao banco de dados:', err.message);
    }
  }
  
  testConnection();

module.exports = sequelize

// senha de produção = fS2tjHyHq9qo 
// usuário de produção = if0_38119464
// database_name = if0_38119464_XXX
// hostanme = sql205.infinityfree.com
// porta = 3306