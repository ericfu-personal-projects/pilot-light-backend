import { DataTypes } from 'sequelize';

export default (sequelize) => {
  sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
      },
      firstName: {
        type: DataTypes.TEXT
      },
      lastName: {
        type: DataTypes.TEXT
      },
      summary: {
        type: DataTypes.TEXT
      },
      dateOfBirth: {
        type: DataTypes.DATE
      },
      address: {
        type: DataTypes.TEXT
      },
      city: {
        type: DataTypes.TEXT
      },
      country: {
        type: DataTypes.TEXT
      }
    },
    {
      timestamps: true,
      tableName: 'User'
    }
  );
};
