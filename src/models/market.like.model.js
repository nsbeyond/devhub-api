import { DataTypes } from 'sequelize';
import sequelize from './sequelize'

const MarketLike = sequelize.define('market_place_like', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    market_place_id: {
      type: DataTypes.UUID
    }
},
{
  freezeTableName: true,
  timestamps: false,
});
export default MarketLike