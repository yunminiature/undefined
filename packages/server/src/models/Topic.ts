import { DataTypes, Model, Optional } from 'sequelize'
import { sequelize } from '../db/sequelize'

export interface TopicAttributes {
  id: number
  title: string
  body: string
  authorId: string
  createdAt?: Date
  updatedAt?: Date
}

type TopicCreationAttributes = Optional<TopicAttributes, 'id'>

export class Topic extends Model<TopicAttributes, TopicCreationAttributes> implements TopicAttributes {
  public id!: number
  public title!: string
  public body!: string
  public authorId!: string
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

Topic.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    authorId: {
      type: DataTypes.STRING(64),
      allowNull: false,
      field: 'author_id',
    },
  },
  {
    sequelize,
    tableName: 'topics',
    indexes: [{ fields: ['author_id'] }, { fields: ['title'] }],
  }
)


