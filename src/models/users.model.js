const db = require('../config/db')

const selectAll = async () => {

    const [result] = await db.query('select * from users');
    return result;
    
    // Si la query es un select siempre obtengo un array con los registros

}


const selectById = async (userId) => {
    const [result] = await db.query(
        'select * from clientes where id = ?',
        [userId]
    );
    if(result.length === 0) return null
    return result[0];
    // result es siempre un array
}

const selectByEmail = async (email) =>{
    const [result] = await db.query(
        'select * from users where email = ?',
        [email]
    );
    console.log(result)
    if (result.length === 0) return null
    return result[0]
}



const insert = async({username, email, password}) => {
    const [result] = await db.query(
        'insert into users (username, email, password_hash , role) values (?,?,?,?)',
        [username, email,password, 'Usuario']
    );
    return result;
}


module.exports = {selectAll,selectById,insert,selectByEmail};