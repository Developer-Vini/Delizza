const sequelize = require('./src/config/database');


export async function start(){
    try{
        await sequelize.authenticate();
        console.log("Posgress conectado com sucesso!!")
    }catch(err){
        console.error("erro", err)
    }
}
