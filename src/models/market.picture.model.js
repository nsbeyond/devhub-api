import { DataTypes } from 'sequelize';
import sequelize from './sequelize'

const MarketPicture = sequelize.define('market_place_picture', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    market_place_id: {
      type: DataTypes.UUID
    },
    pic_url: {
      type: DataTypes.STRING
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
export default MarketPicture