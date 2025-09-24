import { DataTypes, Model, Optional } from 'sequelize'
import { sequelize } from '../db/sequelize'
import { Comment } from './Comment'

export type ReactionType = 'like' | 'dislike' | 'laugh' | 'angry' | 'sad'

export interface ReactionAttributes {
  id: number
  commentId: number
  userId: string
  type: ReactionType
  createdAt?: Date
  updatedAt?: Date
}

type ReactionCreationAttributes = Optional<ReactionAttributes, 'id'>

export class Reaction
  extends Model<ReactionAttributes, ReactionCreationAttributes>
  implements ReactionAttributes
{
  public id!: number
  public commentId!: number
  public userId!: string
  public type!: ReactionType
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

Reaction.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    commentId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'comment_id',
      references: { model: 'comments', key: 'id' },
      onDelete: 'CASCADE',
    },
    userId: {
      type: DataTypes.STRING(64),
      allowNull: false,
      field: 'user_id',
    },
    type: {
      type: DataTypes.ENUM('like', 'dislike', 'laugh', 'angry', 'sad'),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'reactions',
    indexes: [
      { unique: true, fields: ['comment_id', 'user_id'] },
      { fields: ['type'] },
    ],
  }
)

Reaction.belongsTo(Comment, { foreignKey: 'comment_id', as: 'comment' })


