import { sequelize } from '../src/config/database';
import { Owner } from '../src/models/Owner';
import { Place } from '../src/models/Place';

async function testOwnerPlaces() {
  try {
    await sequelize.authenticate();
    console.log('Conexión con la BD establecida');

    const owner = await Owner.findByPk(1, {
      include: [Place],
    });

    if (owner) {
      console.log('Propietario encontrado:');
      console.log(JSON.stringify(owner, null, 2));
    } else {
      console.log('No se encontró el propietario con ID 1');
    }
  } catch (error) {
    console.error(' Error durante la prueba:', error);
  } finally {
    await sequelize.close();
    console.log('Conexión cerrada');
  }
}

testOwnerPlaces();
