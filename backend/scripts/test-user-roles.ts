import { sequelize } from '../src/config/database';
import { User } from '../src/models/User';
import { Role } from '../src/models/Role';

async function testUserRoles() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión con la BD establecida');
    const user = await User.findByPk(1, {
      include: [Role],
    });

    if (user) {
      console.log('📦 Usuario encontrado:');
      console.log(JSON.stringify(user, null, 2));
    } else {
      console.log('❌ Usuario con ID 1 no encontrado');
    }
  } catch (error) {
    console.error('💥 Error durante la prueba:', error);
  } finally {
    await sequelize.close();
    console.log('🔌 Conexión cerrada');
  }
}

testUserRoles();
