import Sequelize  from 'sequelize'

const sequelize = new Sequelize('jinxgames_db', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql',
})

export default sequelize