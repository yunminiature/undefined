import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../db/sequelize';
import { Theme } from './Theme';

export interface ThemePreferenceAttributes {
  id: number;
  userId?: string | null;
  sessionId?: string | null;
  themeId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

type ThemePreferenceCreationAttributes = Optional<ThemePreferenceAttributes, 'id' | 'userId' | 'sessionId'>;

export class ThemePreference
  extends Model<ThemePreferenceAttributes, ThemePreferenceCreationAttributes>
  implements ThemePreferenceAttributes
{
  public id!: number;
  public userId!: string | null;
  public sessionId!: string | null;
  public themeId!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ThemePreference.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.STRING(64),
      allowNull: true,
      field: 'user_id',
    },
    sessionId: {
      type: DataTypes.STRING(64),
      allowNull: true,
      field: 'session_id',
    },
    themeId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'theme_id',
      references: { model: 'themes', key: 'id' },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    },
  },
  {
    sequelize,
    tableName: 'theme_preferences',
    indexes: [
      { unique: true, fields: ['user_id'] },
      { unique: true, fields: ['session_id'] },
      { fields: ['theme_id'] },
    ],
  }
);

ThemePreference.belongsTo(Theme, { foreignKey: 'theme_id', as: 'theme' });
