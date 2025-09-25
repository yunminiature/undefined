import { DataTypes, Model, Optional } from 'sequelize'
import { sequelize } from '../db/sequelize'
import { Topic } from './Topic'

export interface CommentAttributes {
  id: number
  topicId: number
  parentCommentId?: number | null
  body: string
  authorId: string
  createdAt?: Date
  updatedAt?: Date
}

type CommentCreationAttributes = Optional<CommentAttributes, 'id' | 'parentCommentId'>

export class Comment
  extends Model<CommentAttributes, CommentCreationAttributes>
  implements CommentAttributes
{
  public id!: number
  public topicId!: number
  public parentCommentId!: number | null
  public body!: string
  public authorId!: string
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

Comment.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    topicId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'topic_id',
      references: { model: 'topics', key: 'id' },
      onDelete: 'CASCADE',
    },
    parentCommentId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      field: 'parent_comment_id',
      references: { model: 'comments', key: 'id' },
      onDelete: 'CASCADE',
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
    tableName: 'comments',
    indexes: [
      { fields: ['topic_id'] },
      { fields: ['parent_comment_id'] },
      { fields: ['author_id'] },
    ],
  }
)

// Associations
Comment.belongsTo(Topic, { foreignKey: 'topic_id', as: 'topic' })
Comment.belongsTo(Comment, { foreignKey: 'parent_comment_id', as: 'parent' })
Comment.hasMany(Comment, { foreignKey: 'parent_comment_id', as: 'replies' })


