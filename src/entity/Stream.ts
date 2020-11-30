import { Field, ID, ObjectType } from "type-graphql"
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
} from "typeorm"
import { User } from "./User"

@ObjectType({ description: "Stream" })
@Entity()
export class Stream extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number

  @Field()
  @Column()
  title: string

  @Field()
  @Column()
  description: string

  @Field()
  @Column()
  url: string

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.streams)
  user: User
}
