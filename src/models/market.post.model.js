import { DataTypes } from 'sequelize';
import sequelize from './sequelize'

const MarketPost = sequelize.define('market_place_post', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    categories_id: {
      type: DataTypes.UUID
    },
    product_name: {
      type: DataTypes.STRING
    },
    product_desc: {
      type: DataTypes.STRING
    },
    price_from: {
      type: DataTypes.FLOAT
    },
    price_to: {
      type: DataTypes.FLOAT
    },
    created_at: {
      type: DataTypes.TIME
    },
    updated_at: {
      type: DataTypes.TIME
    }
},
{
  freezeTableName: true,
  timestamps: false,
});
export default MarketPost