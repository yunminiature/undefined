import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../db/sequelize';

export interface ThemeAttributes {
  id: number;
  name: string;
  palette: Record<string, string>;
  createdAt?: Date;
  updatedAt?: Date;
}

type ThemeCreationAttributes = Optional<ThemeAttributes, 'id'>;

export class Theme extends Model<ThemeAttributes, ThemeCreationAttributes> implements ThemeAttributes {
  public id!: number;
  public name!: string;
  public palette!: Record<string, string>;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Theme.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(64),
      allowNull: false,
      unique: true,
    },
    palette: {
      type: DataTypes.JSONB as any,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'themes',
    indexes: [{ unique: true, fields: ['name'] }],
  }
);
