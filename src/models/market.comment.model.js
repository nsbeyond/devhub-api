import { DataTypes } from 'sequelize';
import sequelize from './sequelize'

const MarketComment = sequelize.define('market_place_comment', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    market_place_id: {
      type: DataTypes.UUID
    },
    comment: {
      type: DataTypes.STRING
    },
    parent: {
      type: DataTypes.UUID
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
export default MarketComment